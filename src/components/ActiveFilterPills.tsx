import { X } from 'lucide-react';
import { Badge } from './ui/badge';
import { CURRENT_USER } from '../data/mockDrops';

interface FilterOptions {
  stages: string[];
  owners: string[];
  channels: string[];
}

interface ActiveFilterPillsProps {
  filters: FilterOptions;
  selectedIntent: "all" | "lead_gen" | "sales_follow_up" | "customer_nurturing";
  onRemoveFilter: (filterType: 'stage' | 'owner' | 'channel' | 'intent', value?: string) => void;
}

export function ActiveFilterPills({ filters, selectedIntent, onRemoveFilter }: ActiveFilterPillsProps) {
  const hasAnyFilters = 
    filters.stages.length > 0 || 
    filters.owners.length > 0 || 
    filters.channels.length > 0 ||
    selectedIntent !== "all";

  if (!hasAnyFilters) {
    return null;
  }

  const getStageLabel = (stage: string) => {
    return stage; // Keep original stage names
  };

  const getOwnerLabel = (owner: string) => {
    return owner === CURRENT_USER ? "Me" : owner;
  };

  const getIntentLabel = (intent: string) => {
    const labels: Record<string, string> = {
      "all": "All",
      "lead_gen": "Lead Gen",
      "sales_follow_up": "Sales Follow-Up",
      "customer_nurturing": "Customer Nurturing"
    };
    return labels[intent] || intent;
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Owner Pills */}
      {filters.owners.map((owner) => (
        <Badge key={owner} variant="secondary" className="gap-2 pr-1">
          <span className="text-xs">Owner: {getOwnerLabel(owner)}</span>
          <button
            onClick={() => onRemoveFilter('owner', owner)}
            className="hover:bg-gray-300 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {/* Stage Pills */}
      {filters.stages.map((stage) => (
        <Badge key={stage} variant="secondary" className="gap-2 pr-1">
          <span className="text-xs">Stage: {getStageLabel(stage)}</span>
          <button
            onClick={() => onRemoveFilter('stage', stage)}
            className="hover:bg-gray-300 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {/* Channel Pills */}
      {filters.channels.map((channel) => (
        <Badge key={channel} variant="secondary" className="gap-2 pr-1">
          <span className="text-xs">Channel: {channel}</span>
          <button
            onClick={() => onRemoveFilter('channel', channel)}
            className="hover:bg-gray-300 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {/* Intent Pill */}
      {selectedIntent !== "all" && (
        <Badge variant="secondary" className="gap-2 pr-1">
          <span className="text-xs">Intent: {getIntentLabel(selectedIntent)}</span>
          <button
            onClick={() => onRemoveFilter('intent')}
            className="hover:bg-gray-300 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
    </div>
  );
}
