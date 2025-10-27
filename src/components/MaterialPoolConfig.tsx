import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  RefreshCw,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { ProductLibrary, MaterialPool, LibraryItem, Attachment } from './PayloadsTab';
import { toast } from 'sonner@2.0.3';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './ui/hover-card';
import { ContextualAttachments } from './ContextualAttachments';

interface MaterialPoolConfigProps {
  pool: MaterialPool;
  libraries: ProductLibrary[];
  globalAttachments: Attachment[]; // V4.9: Global attachments
  onBack: () => void;
  onUpdate: (pool: MaterialPool) => void;
  onOpenWorkspace: () => void;
  onNavigateToAttachments: () => void; // V4.9: Navigate to attachment library
}

export function MaterialPoolConfig({ 
  pool, 
  libraries,
  globalAttachments,
  onBack, 
  onUpdate,
  onOpenWorkspace,
  onNavigateToAttachments
}: MaterialPoolConfigProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [editingCell, setEditingCell] = useState<{
    itemId: string;
    field: string;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Get full item details by joining with library data
  const getItemDetails = (masterId: string) => {
    for (const library of libraries) {
      const item = library.items.find(i => i.id === masterId);
      if (item) return { item, library };
    }
    return null;
  };

  const poolItemsWithDetails = pool.items.map(poolItem => {
    const details = getItemDetails(poolItem.masterId);
    return {
      poolItem,
      libraryItem: details?.item,
      library: details?.library,
    };
  }).filter(item => item.libraryItem); // Filter out any broken references

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
    if (selectedItems.size === poolItemsWithDetails.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(poolItemsWithDetails.map(item => item.poolItem.masterId)));
    }
  };

  const handleRemoveSelected = () => {
    if (selectedItems.size === 0) {
      toast.error('No items selected');
      return;
    }

    const updatedPool = {
      ...pool,
      items: pool.items.filter(item => !selectedItems.has(item.masterId)),
      itemCount: pool.items.length - selectedItems.size
    };

    onUpdate(updatedPool);
    setSelectedItems(new Set());
    toast.success(`Removed ${selectedItems.size} items from pool`);
  };

  const handleStartEdit = (itemId: string, field: string, currentValue: any) => {
    setEditingCell({ itemId, field });
    setEditValue(String(currentValue || ''));
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;

    const { itemId, field } = editingCell;
    
    const updatedItems = pool.items.map(item => {
      if (item.masterId === itemId) {
        return {
          ...item,
          overrides: {
            ...item.overrides,
            [field]: field === 'price' ? parseFloat(editValue) : editValue
          }
        };
      }
      return item;
    });

    onUpdate({
      ...pool,
      items: updatedItems
    });

    toast.success('Override applied');
    setEditingCell(null);
    setEditValue('');
  };

  const handleResetOverride = (itemId: string, field: string) => {
    const updatedItems = pool.items.map(item => {
      if (item.masterId === itemId) {
        const newOverrides = { ...item.overrides };
        delete newOverrides[field];
        return {
          ...item,
          overrides: newOverrides
        };
      }
      return item;
    });

    onUpdate({
      ...pool,
      items: updatedItems
    });

    toast.success('Override removed');
  };

  const getDisplayValue = (itemId: string, field: string, originalValue: any) => {
    const poolItem = pool.items.find(item => item.masterId === itemId);
    if (poolItem?.overrides && field in poolItem.overrides) {
      return poolItem.overrides[field];
    }
    return originalValue;
  };

  const hasOverride = (itemId: string, field: string) => {
    const poolItem = pool.items.find(item => item.masterId === itemId);
    return poolItem?.overrides && field in poolItem.overrides;
  };

  const handleAttachmentIdsChange = (attachmentIds: string[]) => {
    onUpdate({
      ...pool,
      attachmentIds
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payloads
          </Button>
          <div className="w-px h-6 bg-border" />
          <div>
            <h2>{pool.name}</h2>
            <p className="text-sm text-muted-foreground">
              {pool.itemCount} {pool.itemCount === 1 ? 'item' : 'items'} • Created {new Date(pool.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedItems.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleRemoveSelected}>
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Selected ({selectedItems.size})
            </Button>
          )}
          <Button onClick={onOpenWorkspace}>
            <Plus className="w-4 h-4 mr-2" />
            Add Items
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
        <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-blue-900">
          <p className="font-medium mb-1">Context Override Feature</p>
          <p className="text-xs">
            Click any cell to override values. Overridden cells are marked with a yellow triangle. 
            Hover to see original values and reset.
          </p>
        </div>
      </div>

      {/* Items Table */}
      {poolItemsWithDetails.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium mb-2">No Items in Pool</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add products from your libraries to start building this Material Pool.
          </p>
          <Button onClick={onOpenWorkspace}>
            <Plus className="w-4 h-4 mr-2" />
            Add Items
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedItems.size === poolItemsWithDetails.length}
                    onCheckedChange={handleToggleAll}
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>MOQ</TableHead>
                <TableHead>Library</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {poolItemsWithDetails.map(({ poolItem, libraryItem, library }) => {
                if (!libraryItem) return null;
                
                const isSelected = selectedItems.has(poolItem.masterId);
                
                return (
                  <TableRow 
                    key={poolItem.masterId}
                    className={isSelected ? 'bg-blue-50' : ''}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={() => handleToggleItem(poolItem.masterId)}
                      />
                    </TableCell>
                    
                    {/* Product Name - Editable */}
                    <TableCell>
                      {editingCell?.itemId === poolItem.masterId && editingCell?.field === 'name' ? (
                        <div className="flex items-center gap-1">
                          <Input 
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-8"
                            autoFocus
                          />
                          <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                            <Check className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group">
                          <div className="flex-1">
                            <div className="text-sm font-medium">{getDisplayValue(poolItem.masterId, 'name', libraryItem.name)}</div>
                            <div className="text-xs text-muted-foreground">{libraryItem.sku}</div>
                          </div>
                          {hasOverride(poolItem.masterId, 'name') ? (
                            <HoverCard>
                              <HoverCardTrigger>
                                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-yellow-400 border-r-[8px] border-r-transparent cursor-pointer" />
                              </HoverCardTrigger>
                              <HoverCardContent className="w-64">
                                <div className="space-y-2">
                                  <p className="text-xs font-medium">Original Value:</p>
                                  <p className="text-sm text-muted-foreground">{libraryItem.name}</p>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => handleResetOverride(poolItem.masterId, 'name')}
                                  >
                                    <RefreshCw className="w-3 h-3 mr-2" />
                                    Reset to Original
                                  </Button>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="opacity-0 group-hover:opacity-100"
                              onClick={() => handleStartEdit(poolItem.masterId, 'name', getDisplayValue(poolItem.masterId, 'name', libraryItem.name))}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>

                    {/* Category */}
                    <TableCell className="text-sm">{libraryItem.category || '-'}</TableCell>

                    {/* Price - Editable */}
                    <TableCell>
                      {editingCell?.itemId === poolItem.masterId && editingCell?.field === 'price' ? (
                        <div className="flex items-center gap-1">
                          <Input 
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-8 w-24"
                            autoFocus
                          />
                          <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                            <Check className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group">
                          <span className="text-sm font-medium">
                            ${getDisplayValue(poolItem.masterId, 'price', libraryItem.price).toFixed(2)}
                          </span>
                          {hasOverride(poolItem.masterId, 'price') ? (
                            <HoverCard>
                              <HoverCardTrigger>
                                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-yellow-400 border-r-[8px] border-r-transparent cursor-pointer" />
                              </HoverCardTrigger>
                              <HoverCardContent className="w-64">
                                <div className="space-y-2">
                                  <p className="text-xs font-medium">Original Value:</p>
                                  <p className="text-sm text-muted-foreground">${libraryItem.price.toFixed(2)}</p>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => handleResetOverride(poolItem.masterId, 'price')}
                                  >
                                    <RefreshCw className="w-3 h-3 mr-2" />
                                    Reset to Original
                                  </Button>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="opacity-0 group-hover:opacity-100"
                              onClick={() => handleStartEdit(poolItem.masterId, 'price', getDisplayValue(poolItem.masterId, 'price', libraryItem.price))}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>

                    {/* Stock */}
                    <TableCell className="text-sm">{libraryItem.stock || '-'}</TableCell>

                    {/* MOQ */}
                    <TableCell className="text-sm">{libraryItem.moq || '-'}</TableCell>

                    {/* Library */}
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {library?.name || 'Unknown'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Contextual Attachments Section - V4.9 */}
      <div className="border-t pt-6">
        <ContextualAttachments
          attachmentIds={pool.attachmentIds || []}
          globalAttachments={globalAttachments}
          onAttachmentIdsChange={handleAttachmentIdsChange}
          onNavigateToManage={onNavigateToAttachments}
        />
      </div>
    </div>
  );
}
