import type { PriorityMatrix as PriorityMatrixType } from '../types/workbench';

interface PriorityMatrixProps {
  priority: PriorityMatrixType;
  showDetails?: boolean;
}

export function PriorityMatrix({ priority, showDetails = false }: PriorityMatrixProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };
  
  const getLevelColor = (level: string) => {
    if (level === 'high') return 'bg-green-500';
    if (level === 'medium') return 'bg-amber-500';
    return 'bg-gray-400';
  };
  
  return (
    <div className="flex items-center gap-3">
      {/* Score Badge */}
      <div className={`
        flex items-center justify-center px-2.5 py-1 rounded-full border
        ${getScoreColor(priority.score)}
      `}>
        <span className="text-sm font-bold">{priority.score}</span>
      </div>
      
      {showDetails && (
        <div className="flex flex-col gap-1">
          {/* Value Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 uppercase tracking-wide w-12">Value</span>
            <div className="flex gap-0.5">
              {['high', 'medium', 'low'].map((level) => (
                <div
                  key={`value-${level}`}
                  className={`w-2 h-2 rounded-full ${
                    level === priority.value ? getLevelColor(level) : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Intent Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 uppercase tracking-wide w-12">Intent</span>
            <div className="flex gap-0.5">
              {['high', 'medium', 'low'].map((level) => (
                <div
                  key={`intent-${level}`}
                  className={`w-2 h-2 rounded-full ${
                    level === priority.intent ? getLevelColor(level) : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
