import { User, Clock, AlertTriangle } from 'lucide-react';
import { CURRENT_USER } from '../data/mockDrops';

interface InstantFilterMenuProps {
  onSelectFilter: (filterConfig: {
    type: 'quick' | 'stage' | 'owner';
    value?: string;
    config?: any;
  }) => void;
}

export function InstantFilterMenu({ onSelectFilter }: InstantFilterMenuProps) {
  const quickFilters = [
    {
      label: "My Active Drops",
      icon: User,
      onClick: () => onSelectFilter({
        type: 'quick',
        config: { stages: ['Active'], owners: [CURRENT_USER] }
      })
    },
    {
      label: "Drops Needing Attention",
      icon: AlertTriangle,
      onClick: () => onSelectFilter({
        type: 'quick',
        config: { health: 'attention' }
      })
    },
    {
      label: "Expiring Soon (7 days)",
      icon: Clock,
      onClick: () => onSelectFilter({
        type: 'quick',
        config: { urgentTTL: true }
      })
    }
  ];

  const stages = [
    { label: "Active", value: "Active" },
    { label: "Draft", value: "Draft" },
    { label: "Expired", value: "Expired" }
  ];

  const owners = [
    { label: "Sam Rodriguez (Me)", value: "Sam Rodriguez", isMe: true },
    { label: "Emily Chen", value: "Emily Chen" },
    { label: "Michael Brown", value: "Michael Brown" },
    { label: "Sarah Johnson", value: "Sarah Johnson" },
    { label: "David Kim", value: "David Kim" }
  ];

  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white border rounded-lg shadow-lg p-3 z-50">
      <div className="space-y-4">
        {/* Quick Filters */}
        <div>
          <div className="text-xs text-muted-foreground mb-2 px-2">Quick Filters</div>
          <div className="space-y-1">
            {quickFilters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.label}
                  onClick={filter.onClick}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stages */}
        <div>
          <div className="text-xs text-muted-foreground mb-2 px-2">By Stage</div>
          <div className="space-y-1">
            {stages.map((stage) => (
              <button
                key={stage.value}
                onClick={() => onSelectFilter({ type: 'stage', value: stage.value })}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
              >
                {stage.label}
              </button>
            ))}
          </div>
        </div>

        {/* Owners */}
        <div>
          <div className="text-xs text-muted-foreground mb-2 px-2">By Owner</div>
          <div className="space-y-1">
            {owners.map((owner) => (
              <button
                key={owner.value}
                onClick={() => onSelectFilter({ type: 'owner', value: owner.value })}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
              >
                {owner.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
