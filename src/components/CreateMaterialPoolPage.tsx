import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Package, ArrowLeft } from 'lucide-react';
import { ProductLibrary, MaterialPool, PoolItem } from './PayloadsTab';
import { LibraryWorkspaceFilterPanel } from './LibraryWorkspaceFilterPanel';
import { CreatePoolNameDialog } from './CreatePoolNameDialog';
import { toast } from 'sonner@2.0.3';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface CreateMaterialPoolPageProps {
  libraries: ProductLibrary[];
  context: {
    mode: 'create-global' | 'enter-library';
    libraryId?: string;
  };
  onBack: () => void;
  onCreatePool: (pool: MaterialPool) => void;
}

export function CreateMaterialPoolPage({ 
  libraries, 
  context, 
  onBack,
  onCreatePool 
}: CreateMaterialPoolPageProps) {
  // Filter State
  const [selectedSource, setSelectedSource] = useState<string>(
    context.mode === 'enter-library' && context.libraryId 
      ? context.libraryId 
      : 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  
  // Selection State
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  // Dialog State
  const [showCreatePoolDialog, setShowCreatePoolDialog] = useState(false);

  // Source filter is locked when entering from a specific library
  const isSourceLocked = context.mode === 'enter-library';

  // Get all items from selected library or all libraries
  const getAllItems = () => {
    if (selectedSource === 'all') {
      return libraries.flatMap(lib => lib.items);
    }
    const library = libraries.find(lib => lib.id === selectedSource);
    return library?.items || [];
  };

  // Apply filters
  const filteredItems = getAllItems().filter(item => {
    // Search filter
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.sku.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }

    // Price range filter
    if (minPrice && item.price < parseFloat(minPrice)) {
      return false;
    }
    if (maxPrice && item.price > parseFloat(maxPrice)) {
      return false;
    }

    return true;
  });

  // Get unique categories
  const allCategories = Array.from(new Set(getAllItems().map(item => item.category).filter(Boolean)));

  // Handlers
  const handleToggleItem = (itemId: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleToggleAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const handleCreatePoolClick = () => {
    if (selectedItems.size === 0) {
      toast.error('Please select at least one item');
      return;
    }
    setShowCreatePoolDialog(true);
  };

  const handleConfirmCreatePool = (poolName: string) => {
    const poolItems: PoolItem[] = Array.from(selectedItems).map(itemId => ({
      masterId: itemId,
      overrides: {}
    }));

    // Note: In V4.9, attachment URLs from CSV are not auto-linked to pools
    // Users must manually add attachments from the global library in the pool config page
    // This separation maintains the clean "upload first, link later" workflow

    const newPool: MaterialPool = {
      id: `pool_${Date.now()}`,
      name: poolName,
      itemCount: poolItems.length,
      items: poolItems,
      attachmentIds: [], // V4.9: Start with no attachments
      createdAt: new Date().toISOString()
    };

    onCreatePool(newPool);
    toast.success(`Created pool "${poolName}" with ${poolItems.length} items`);
    onBack();
  };

  const getSourceName = (sourceId: string) => {
    if (sourceId === 'all') return 'All Libraries';
    const library = libraries.find(lib => lib.id === sourceId);
    return library?.name || 'Unknown';
  };

  const allSelected = filteredItems.length > 0 && selectedItems.size === filteredItems.length;

  return (
    <div className="h-[calc(100vh-7.5rem)] flex flex-col">
      {/* Page Header */}
      <div className="flex-shrink-0 flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="w-px h-6 bg-border" />
          <div>
            <h2 className="text-xl">Create Material Pool</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleCreatePoolClick}
            disabled={selectedItems.size === 0}
            size="lg"
          >
            <Package className="w-4 h-4 mr-2" />
            Create Pool with {selectedItems.size} items
          </Button>
          <Button variant="ghost" size="icon" onClick={onBack}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left Column: Filter Panel */}
        <div className="w-72 flex-shrink-0">
          <LibraryWorkspaceFilterPanel
            selectedSource={selectedSource}
            onSourceChange={setSelectedSource}
            isSourceLocked={isSourceLocked}
            libraries={libraries}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            minPrice={minPrice}
            onMinPriceChange={setMinPrice}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            filteredCount={filteredItems.length}
            totalCount={getAllItems().length}
            categories={allCategories}
          />
        </div>

        {/* Right Column: Product Table */}
        <div className="flex-1 flex flex-col overflow-hidden border rounded-lg">
          {/* Table Header Section */}
          <div className="flex-shrink-0 p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">产品列表</h3>
              <p className="text-sm text-muted-foreground">
                从下方表格中选择产品以创建物料池
              </p>
            </div>
          </div>

          {/* Product Table */}
          <div className="flex-1 overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10 border-b">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={allSelected}
                      onCheckedChange={handleToggleAll}
                    />
                  </TableHead>
                  <TableHead className="w-[200px]">SKU</TableHead>
                  <TableHead className="flex-1">Name</TableHead>
                  <TableHead className="w-[150px]">Category</TableHead>
                  <TableHead className="w-[100px]">Price</TableHead>
                  <TableHead className="w-[80px]">MOQ</TableHead>
                  <TableHead className="w-[120px]">Customizable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="w-8 h-8 text-muted-foreground" />
                        <p className="text-sm font-medium">No products found</p>
                        <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map(item => {
                    const library = libraries.find(lib => lib.id === item.libraryId);
                    const isSelected = selectedItems.has(item.id);
                    
                    return (
                      <TableRow 
                        key={item.id}
                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-muted/50'}`}
                        onClick={() => handleToggleItem(item.id)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox 
                            checked={isSelected}
                            onCheckedChange={() => handleToggleItem(item.id)}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                        </TableCell>
                        <TableCell className="text-sm">{item.category || '-'}</TableCell>
                        <TableCell className="text-sm font-medium">{item.price}</TableCell>
                        <TableCell className="text-sm">{item.moq || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            No
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer Summary */}
          <div className="flex-shrink-0 p-3 border-t bg-muted/30">
            <p className="text-sm text-muted-foreground">
              显示 5 个产品
            </p>
          </div>
        </div>
      </div>

      {/* Create Pool Name Dialog */}
      <CreatePoolNameDialog
        open={showCreatePoolDialog}
        onClose={() => setShowCreatePoolDialog(false)}
        onConfirm={handleConfirmCreatePool}
        selectedCount={selectedItems.size}
        sourceName={selectedSource === 'all' ? 'all libraries' : getSourceName(selectedSource)}
      />
    </div>
  );
}
