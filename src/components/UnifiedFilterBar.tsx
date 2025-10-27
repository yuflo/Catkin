import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { InstantFilterMenu } from './InstantFilterMenu';

interface FilterOptions {
  stages: string[];
  owners: string[];
  channels: string[];
}

interface UnifiedFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onApplySmartFilter: (filterConfig: any) => void;
}

export function UnifiedFilterBar({ 
  searchQuery, 
  onSearchChange,
  onApplySmartFilter 
}: UnifiedFilterBarProps) {
  const [showInstantMenu, setShowInstantMenu] = useState(false);
  const [smartSuggestion, setSmartSuggestion] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowInstantMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smart search pattern detection
  useEffect(() => {
    if (!searchQuery) {
      setSmartSuggestion(null);
      return;
    }

    const query = searchQuery.toLowerCase();

    // Pattern 1: "active drops by [name]"
    if (query.includes('active') && (query.includes('by') || query.includes('sam') || query.includes('emily'))) {
      const names = ['sam', 'emily', 'michael', 'sarah', 'david'];
      const matchedName = names.find(name => query.includes(name));
      if (matchedName) {
        setSmartSuggestion(`Filter: Status is Active, Owner contains "${matchedName}"`);
        return;
      }
    }

    // Pattern 2: Stage keywords
    if (query.includes('expired')) {
      setSmartSuggestion('Filter: Status is Expired');
      return;
    }
    if (query.includes('draft')) {
      setSmartSuggestion('Filter: Status is Draft');
      return;
    }

    // Pattern 3: High conversion
    if (query.includes('high conversion')) {
      setSmartSuggestion('Filter: High conversion rate Drops (>20%)');
      return;
    }

    // Pattern 4: Owner names
    const ownerPatterns: Record<string, string> = {
      'sam': 'Sam Rodriguez',
      'emily': 'Emily Chen',
      'michael': 'Michael Brown',
      'sarah': 'Sarah Johnson',
      'david': 'David Kim'
    };

    for (const [pattern, fullName] of Object.entries(ownerPatterns)) {
      if (query.includes(pattern)) {
        setSmartSuggestion(`Filter: Owner is ${fullName}`);
        return;
      }
    }

    setSmartSuggestion(null);
  }, [searchQuery]);

  const handleFocus = () => {
    if (!searchQuery) {
      setShowInstantMenu(true);
    }
  };

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    if (value) {
      setShowInstantMenu(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && smartSuggestion) {
      // Apply smart filter
      const query = searchQuery.toLowerCase();
      
      // Parse and apply filter
      if (query.includes('expired')) {
        onApplySmartFilter({ stages: ['Expired'] });
      } else if (query.includes('draft')) {
        onApplySmartFilter({ stages: ['Draft'] });
      } else if (query.includes('active')) {
        onApplySmartFilter({ stages: ['Active'] });
      }
      
      // Check for owner names
      const ownerPatterns: Record<string, string> = {
        'sam': 'Sam Rodriguez',
        'emily': 'Emily Chen',
        'michael': 'Michael Brown',
        'sarah': 'Sarah Johnson',
        'david': 'David Kim'
      };
      
      for (const [pattern, fullName] of Object.entries(ownerPatterns)) {
        if (query.includes(pattern)) {
          onApplySmartFilter({ owners: [fullName] });
          break;
        }
      }
      
      // Clear search
      onSearchChange('');
      setSmartSuggestion(null);
    }
  };

  const handleSelectFilter = (filterConfig: any) => {
    setShowInstantMenu(false);
    
    if (filterConfig.type === 'stage') {
      onApplySmartFilter({ stages: [filterConfig.value] });
    } else if (filterConfig.type === 'owner') {
      onApplySmartFilter({ owners: [filterConfig.value] });
    } else if (filterConfig.type === 'quick') {
      onApplySmartFilter(filterConfig.config);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search or filter... (click for quick filters)"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className="pl-10 w-full"
        />
      </div>

      {/* Instant Filter Menu */}
      {showInstantMenu && !searchQuery && (
        <InstantFilterMenu onSelectFilter={handleSelectFilter} />
      )}

      {/* Smart Search Suggestion */}
      {smartSuggestion && searchQuery && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border rounded-lg shadow-lg p-3 z-50">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm">{smartSuggestion}</p>
              <p className="text-xs text-muted-foreground mt-1">Press Enter to apply smart filter</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
