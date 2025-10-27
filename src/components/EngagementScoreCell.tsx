import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface EngagementScoreCellProps {
  score: {
    level: "high" | "medium" | "low";
    value: number;
    contributors: string;
  };
}

// Simple trend sparkline (mock trend data)
function TrendSparkline({ level }: { level: "high" | "medium" | "low" }) {
  const getTrendColor = () => {
    switch (level) {
      case "high": return "text-green-500";
      case "medium": return "text-blue-500";
      case "low": return "text-gray-400";
    }
  };

  // Simple SVG sparkline
  return (
    <svg width="40" height="16" className={getTrendColor()}>
      <polyline
        points="0,12 10,8 20,10 30,6 40,4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function EngagementScoreCell({ score }: EngagementScoreCellProps) {
  const getScoreColor = () => {
    switch (score.level) {
      case "high": return "text-green-600";
      case "medium": return "text-blue-600";
      case "low": return "text-gray-600";
    }
  };

  const getLevelLabel = () => {
    switch (score.level) {
      case "high": return "High";
      case "medium": return "Medium";
      case "low": return "Low";
    }
  };

  const getLevelVariant = (): "default" | "secondary" | "outline" => {
    switch (score.level) {
      case "high": return "default";
      case "medium": return "secondary";
      case "low": return "outline";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-3 cursor-help">
            <div className={`text-2xl ${getScoreColor()}`}>
              {score.value}
            </div>
            <div className="flex flex-col gap-1">
              <Badge variant={getLevelVariant()} className="text-xs">
                {getLevelLabel()}
              </Badge>
              <TrendSparkline level={score.level} />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="text-sm">{score.contributors}</p>
            <div className="border-t pt-2">
              <p className="text-xs text-gray-500">7-day trend: Steady growth</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
