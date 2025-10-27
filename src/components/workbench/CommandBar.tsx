import { Button } from '../ui/button';
import { Search, Briefcase, Table } from 'lucide-react';
import type { ViewMode } from '../../types/workbench';

interface CommandBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenCommandPalette: () => void;
}

export function CommandBar({ viewMode, onViewModeChange, onOpenCommandPalette }: CommandBarProps) {
  return (
    <div className="border-b bg-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Briefcase className="w-5 h-5 text-blue-600" />
        <h1 className="text-lg">AI Growth Workbench</h1>
      </div>
      
      <div className="flex items-center gap-3">
        {/* View Mode Toggle */}
        <div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => onViewModeChange('work')}
            className={`
              px-3 py-1.5 rounded-md text-sm transition-all
              ${viewMode === 'work' 
                ? 'bg-white shadow-sm font-semibold text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <Briefcase className="w-4 h-4 inline mr-1.5" />
            Work
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`
              px-3 py-1.5 rounded-md text-sm transition-all
              ${viewMode === 'table' 
                ? 'bg-white shadow-sm font-semibold text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <Table className="w-4 h-4 inline mr-1.5" />
            Table
          </button>
        </div>
        
        {/* Command Palette Trigger */}
        <Button
          variant="outline"
          onClick={onOpenCommandPalette}
          className="gap-2"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm">Search</span>
          <kbd className="hidden md:inline-block px-2 py-0.5 text-xs bg-gray-100 rounded border">⌘K</kbd>
        </Button>
      </div>
    </div>
  );
}
