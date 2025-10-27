import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Plus, 
  Search, 
  Database,
  Layers,
  Upload,
  Calendar,
  Edit,
  MoreHorizontal,
  Package,
  Paperclip
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { ImportLibraryModal } from './ImportLibraryModal';
import { UpdateLibraryModal } from './UpdateLibraryModal';
import { MaterialPoolConfig } from './MaterialPoolConfig';

// Data Models
export interface ProductLibrary {
  id: string;
  name: string; // Source Tag
  itemCount: number;
  lastUpdated: string;
  items: LibraryItem[];
}

export interface LibraryItem {
  id: string;
  libraryId: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock?: number;
  moq?: number;
  description?: string;
  imageUrl?: string;
  attachmentUrl?: string; // V4.8: CSV-imported attachment URL
  // Additional fields can be added
}

export interface Attachment {
  id: string;
  type: 'upload' | 'link';
  name: string;
  url: string;
  size?: string; // For uploaded files
  fileType?: string; // e.g., 'pdf', 'xlsx', 'docx', 'image'
  uploadedBy?: string; // User who uploaded
  uploadedAt: string; // Upload timestamp
}

export interface MaterialPool {
  id: string;
  name: string;
  itemCount: number;
  items: PoolItem[];
  attachmentIds?: string[]; // V4.9: References to global attachments
  createdAt: string;
}

export interface PoolItem {
  masterId: string; // Reference to LibraryItem ID
  overrides?: {
    price?: number;
    name?: string;
    description?: string;
    [key: string]: any;
  };
}

interface PayloadsTabProps {
  onNavigate: (view: string, data?: any) => void;
  onCreateDrop: () => void;
  libraries: ProductLibrary[];
  pools: MaterialPool[];
  onLibrariesChange: (libraries: ProductLibrary[]) => void;
  onPoolsChange: (pools: MaterialPool[]) => void;
  globalAttachments: Attachment[]; // V4.9: Global attachments
}

export function PayloadsTab({ 
  onNavigate, 
  onCreateDrop, 
  libraries, 
  pools,
  onLibrariesChange,
  onPoolsChange,
  globalAttachments 
}: PayloadsTabProps) {
  // Local UI State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedLibraryForUpdate, setSelectedLibraryForUpdate] = useState<ProductLibrary | null>(null);
  
  // View State
  const [currentView, setCurrentView] = useState<'hub' | 'pool-config'>('hub');
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);

  // MVP Restriction: Only one library allowed in vanilla version
  const canImportLibrary = libraries.length === 0;

  // Handlers
  const handleImportLibrary = (library: ProductLibrary) => {
    onLibrariesChange([...libraries, library]);
    setIsImportModalOpen(false);
  };

  const handleCreatePoolGlobal = () => {
    onNavigate('create-material-pool', {
      context: { mode: 'create-global' }
    });
  };

  const handleEnterLibrary = (libraryId: string) => {
    onNavigate('create-material-pool', {
      context: { mode: 'enter-library', libraryId }
    });
  };

  const handleUpdateLibrary = (library: ProductLibrary) => {
    setSelectedLibraryForUpdate(library);
    setIsUpdateModalOpen(true);
  };

  const handleLibraryUpdated = (updatedLibrary: ProductLibrary) => {
    onLibrariesChange(libraries.map(lib => 
      lib.id === updatedLibrary.id ? updatedLibrary : lib
    ));
    setIsUpdateModalOpen(false);
    setSelectedLibraryForUpdate(null);
  };

  const handleOpenPoolConfig = (poolId: string) => {
    setSelectedPoolId(poolId);
    setCurrentView('pool-config');
  };

  const handleBackToHub = () => {
    setCurrentView('hub');
    setSelectedPoolId(null);
  };

  // Filter pools by search
  const filteredPools = pools.filter(pool => 
    pool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render Pool Config View
  if (currentView === 'pool-config' && selectedPoolId) {
    const selectedPool = pools.find(p => p.id === selectedPoolId);
    if (!selectedPool) {
      setCurrentView('hub');
      return null;
    }
    
    return (
      <MaterialPoolConfig 
        pool={selectedPool}
        libraries={libraries}
        globalAttachments={globalAttachments}
        onBack={handleBackToHub}
        onUpdate={(updatedPool) => {
          onPoolsChange(pools.map(p => p.id === updatedPool.id ? updatedPool : p));
        }}
        onOpenWorkspace={() => handleCreatePoolGlobal()}
        onNavigateToAttachments={() => onNavigate('manage-attachments')}
      />
    );
  }

  // Render Main Hub View
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2>Payloads</h2>
          <p className="text-muted-foreground">
            Unified hub for Material Pools and Product Libraries
          </p>
        </div>
        <Button variant="outline" onClick={() => onNavigate('manage-attachments')}>
          <Paperclip className="w-4 h-4 mr-2" />
          Manage Attachments ({globalAttachments.length})
        </Button>
      </div>

      {/* Area A: Material Pools */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Layers className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Material Pools</h3>
              <p className="text-sm text-muted-foreground">
                Curated product selections for your Drops
              </p>
            </div>
          </div>
          <Button onClick={handleCreatePoolGlobal}>
            <Plus className="w-4 h-4 mr-2" />
            Create Material Pool
          </Button>
        </div>

        {/* Search for Pools */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search pools by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Material Pools List */}
        {filteredPools.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
                <Layers className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-base font-medium mb-2">No Material Pools Yet</h3>
              <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
                Material Pools are curated product selections. Create your first pool to get started.
              </p>
              <Button onClick={handleCreatePoolGlobal}>
                <Plus className="w-4 h-4 mr-2" />
                Create Material Pool
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPools.map(pool => (
              <Card 
                key={pool.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleOpenPoolConfig(pool.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{pool.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Created {new Date(pool.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPoolConfig(pool.id);
                        }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Configure
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement duplicate
                        }}>
                          <Package className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPools(prev => prev.filter(p => p.id !== pool.id));
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {pool.itemCount} {pool.itemCount === 1 ? 'item' : 'items'}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Pool
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t" />

      {/* Area B: Product Libraries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Database className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Product Libraries</h3>
              <p className="text-sm text-muted-foreground">
                Import and manage your product catalogs
              </p>
            </div>
          </div>
          {canImportLibrary ? (
            <Button onClick={() => setIsImportModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Import New Library
            </Button>
          ) : (
            <Button variant="outline" disabled>
              <Upload className="w-4 h-4 mr-2" />
              Upgrade to Import More
            </Button>
          )}
        </div>

        {/* Product Libraries List */}
        {libraries.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Database className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-base font-medium mb-2">No Product Libraries</h3>
              <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
                Import your first product catalog to start creating Material Pools and Drops.
              </p>
              <Button onClick={() => setIsImportModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Import New Library
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {libraries.map(library => (
              <Card key={library.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{library.name}</CardTitle>
                      <CardDescription className="text-xs mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Updated {new Date(library.lastUpdated).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    {library.itemCount} {library.itemCount === 1 ? 'item' : 'items'}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEnterLibrary(library.id)}
                    >
                      Enter
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleUpdateLibrary(library)}
                    >
                      Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ImportLibraryModal 
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportLibrary}
      />

      {selectedLibraryForUpdate && (
        <UpdateLibraryModal 
          open={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedLibraryForUpdate(null);
          }}
          library={selectedLibraryForUpdate}
          onUpdate={handleLibraryUpdated}
        />
      )}
    </div>
  );
}
