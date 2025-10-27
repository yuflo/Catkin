import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ProductLibrary, LibraryItem } from './PayloadsTab';

interface LibraryWorkspaceProductTableProps {
  items: LibraryItem[];
  selectedItems: Set<string>;
  onToggleItem: (itemId: string) => void;
  onToggleAll: () => void;
  libraries: ProductLibrary[];
  onClearSelection: () => void;
}

export function LibraryWorkspaceProductTable({
  items,
  selectedItems,
  onToggleItem,
  onToggleAll,
  libraries,
  onClearSelection
}: LibraryWorkspaceProductTableProps) {
  
  const allSelected = items.length > 0 && selectedItems.size === items.length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Content Header Bar */}
      <div className="flex-shrink-0 h-14 border-b bg-background flex items-center justify-between px-6">
        <div className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? 'product' : 'products'}
        </div>
        {selectedItems.size > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
          >
            Clear Selection
          </Button>
        )}
      </div>

      {/* Product Table - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10 border-b">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={allSelected}
                  onCheckedChange={onToggleAll}
                />
              </TableHead>
              <TableHead className="w-[40%]">Product</TableHead>
              <TableHead className="w-[20%]">Category</TableHead>
              <TableHead className="w-[15%]">Price</TableHead>
              <TableHead className="w-[10%]">Stock</TableHead>
              <TableHead className="w-[15%]">Library</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Filter className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm font-medium">No products match your filters</p>
                    <p className="text-xs text-muted-foreground">Try adjusting your search criteria</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map(item => {
                const library = libraries.find(lib => lib.id === item.libraryId);
                const isSelected = selectedItems.has(item.id);
                return (
                  <TableRow 
                    key={item.id}
                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-muted/50'}`}
                    onClick={() => onToggleItem(item.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={() => onToggleItem(item.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.sku}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{item.category || '-'}</TableCell>
                    <TableCell className="text-sm font-medium">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.stock || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {library?.name || 'Unknown'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
