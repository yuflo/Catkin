import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Package, CheckCircle, X } from 'lucide-react';
import { ProductLibrary, LibraryItem, MaterialPool, PoolItem } from './PayloadsTab';
import { LibraryWorkspaceFilterPanel } from './LibraryWorkspaceFilterPanel';
import { LibraryWorkspaceProductTable } from './LibraryWorkspaceProductTable';
import { CreatePoolNameDialog } from './CreatePoolNameDialog';
import { toast } from 'sonner@2.0.3';

interface LibraryWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
  libraries: ProductLibrary[];
  context: {
    mode: 'create-global' | 'enter-library';
    libraryId?: string;
  };
  onCreatePool: (pool: MaterialPool) => void;
}

export function LibraryWorkspaceModal({ 
  open, 
  onClose, 
  libraries, 
  context,
  onCreatePool 
}: LibraryWorkspaceModalProps) {
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
  const getAllItems = (): LibraryItem[] => {
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

    const newPool: MaterialPool = {
      id: `pool_${Date.now()}`,
      name: poolName,
      itemCount: poolItems.length,
      items: poolItems,
      createdAt: new Date().toISOString()
    };

    onCreatePool(newPool);
    toast.success(`Created pool "${poolName}" with ${poolItems.length} items`);
    handleCloseAll();
  };

  const handleCloseAll = () => {
    setSelectedItems(new Set());
    setSearchQuery('');
    setCategoryFilter('all');
    setMinPrice('');
    setMaxPrice('');
    setShowCreatePoolDialog(false);
    onClose();
  };

  const getSourceName = (sourceId: string) => {
    if (sourceId === 'all') return 'All Libraries';
    const library = libraries.find(lib => lib.id === sourceId);
    return library?.name || 'Unknown';
  };

  return (
    <>
      {/* Full-Screen Workspace Modal */}
      <Dialog open={open && !showCreatePoolDialog} onOpenChange={(open) => !open && handleCloseAll()}>
        <DialogContent className="max-w-none w-screen h-screen m-0 p-0 gap-0 rounded-none">
          {/* Hidden but accessible title and description for screen readers */}
          <DialogHeader className="sr-only">
            <DialogTitle>
              {context.mode === 'create-global' ? 'Create Material Pool' : `Viewing Library: ${getSourceName(selectedSource)}`}
            </DialogTitle>
            <DialogDescription>
              Select products from your libraries to create a Material Pool
            </DialogDescription>
          </DialogHeader>

          <div className="h-full flex flex-col bg-background">
            {/* Global Header Bar */}
            <div className="flex-shrink-0 h-16 border-b bg-background flex items-center justify-between px-6">
              {/* Left: Title */}
              <div>
                <h2 className="text-lg font-medium">
                  {context.mode === 'create-global' ? 'Create Material Pool' : `Viewing Library: ${getSourceName(selectedSource)}`}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Select products from your libraries to create a Material Pool
                </p>
              </div>

              {/* Center: Dynamic Selection Status */}
              <div className="flex items-center gap-3">
                {selectedItems.size > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {selectedItems.size} {selectedItems.size === 1 ? 'item' : 'items'} selected
                    </span>
                  </div>
                )}
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                {selectedItems.size > 0 && (
                  <Button onClick={handleCreatePoolClick} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Package className="w-4 h-4 mr-2" />
                    Create Pool with {selectedItems.size} items
                  </Button>
                )}
                <Button variant="ghost" size="lg" onClick={handleCloseAll}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>

            {/* Two-Column Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Column: Filter Panel (Decoupled Component) */}
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

              {/* Right Column: Product Table (Decoupled Component) */}
              <LibraryWorkspaceProductTable
                items={filteredItems}
                selectedItems={selectedItems}
                onToggleItem={handleToggleItem}
                onToggleAll={handleToggleAll}
                libraries={libraries}
                onClearSelection={() => setSelectedItems(new Set())}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Pool Name Dialog (Decoupled Component) */}
      <CreatePoolNameDialog
        open={showCreatePoolDialog}
        onClose={() => setShowCreatePoolDialog(false)}
        onConfirm={handleConfirmCreatePool}
        selectedCount={selectedItems.size}
        sourceName={selectedSource === 'all' ? 'all libraries' : getSourceName(selectedSource)}
      />
    </>
  );
}
