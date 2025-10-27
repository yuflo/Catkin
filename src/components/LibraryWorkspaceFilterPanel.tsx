import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Search, Lock, CheckCircle } from 'lucide-react';
import { ProductLibrary } from './PayloadsTab';

interface LibraryWorkspaceFilterPanelProps {
  // Source Filter
  selectedSource: string;
  onSourceChange: (sourceId: string) => void;
  isSourceLocked: boolean;
  libraries: ProductLibrary[];
  
  // Standard Filters
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  minPrice: string;
  onMinPriceChange: (price: string) => void;
  maxPrice: string;
  onMaxPriceChange: (price: string) => void;
  
  // Results
  filteredCount: number;
  totalCount: number;
  
  // Available categories
  categories: string[];
}

export function LibraryWorkspaceFilterPanel({
  selectedSource,
  onSourceChange,
  isSourceLocked,
  libraries,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  filteredCount,
  totalCount,
  categories
}: LibraryWorkspaceFilterPanelProps) {
  
  const getSourceName = (sourceId: string) => {
    if (sourceId === 'all') return 'All Libraries';
    const library = libraries.find(lib => lib.id === sourceId);
    return library?.name || 'Unknown';
  };

  const hasActiveFilters = searchQuery || categoryFilter !== 'all' || minPrice || maxPrice;

  const handleClearFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
    onMinPriceChange('');
    onMaxPriceChange('');
  };

  return (
    <div className="flex-shrink-0 border rounded-lg bg-background overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Source Filter - Prominent */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            来源筛选 (Source Filter)
          </Label>
          {isSourceLocked ? (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <Lock className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="font-medium text-blue-900 text-sm">{getSourceName(selectedSource)}</span>
              <Badge variant="secondary" className="ml-auto text-xs bg-blue-100 text-blue-700 border-0">
                Locked
              </Badge>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => onSourceChange('all')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedSource === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-background hover:bg-muted border'
                }`}
              >
                All Libraries
                {selectedSource === 'all' && (
                  <CheckCircle className="w-4 h-4" />
                )}
              </button>
              {libraries.map(library => (
                <button
                  key={library.id}
                  onClick={() => onSourceChange(library.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedSource === library.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-background hover:bg-muted border'
                  }`}
                >
                  {library.name}
                  {selectedSource === library.id && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-4" />

        {/* Standard Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            标准筛选
          </Label>

          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm">搜索</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="按名称或SKU搜索..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm">分类</Label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">所有分类</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label className="text-sm">价格区间</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => onMinPriceChange(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(e.target.value)}
              />
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleClearFilters}
            >
              重置筛选
            </Button>
          )}
        </div>

        {/* Results Summary */}
        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredCount}</span> of{' '}
            <span className="font-medium text-foreground">{totalCount}</span> products
          </div>
        </div>
      </div>
    </div>
  );
}
