import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { SmartInsightBar } from './SmartInsightBar';
import { ActiveFilterPills } from './ActiveFilterPills';
import { UnifiedFilterBar } from './UnifiedFilterBar';
import { DropRecordsTable } from './DropRecordsTable';
import { FeedbackPanel } from './FeedbackPanel';
import { DeepLinkDemo } from './DeepLinkDemo';
import { mockDrops, CURRENT_USER, type DropRecord } from '../data/mockDrops';

interface FilterOptions {
  stages: string[];
  owners: string[];
  channels: string[];
}

type Intent = "all" | "lead_gen" | "sales_follow_up" | "customer_nurturing";

export function DropsTab() {
  // State management
  const [selectedIntent, setSelectedIntent] = useState<Intent>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    stages: ["Active"],
    owners: [CURRENT_USER],
    channels: [],
  });
  const [highlightedDropId, setHighlightedDropId] = useState<string>();
  const [selectedDropId, setSelectedDropId] = useState<string | null>(null);
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);

  // Check for deep link on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dropId = params.get("highlight");
    if (dropId) {
      setHighlightedDropId(dropId);
      // Scroll to highlighted drop after DOM renders
      setTimeout(() => {
        const element = document.querySelector(`[data-drop-id="${dropId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      
      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedDropId(undefined);
      }, 3000);
    }
  }, []);

  // Filter drops
  const filteredDrops = useMemo(() => {
    let drops = mockDrops;

    // 1. Intent filter
    if (selectedIntent !== "all") {
      drops = drops.filter(drop => drop.intent === selectedIntent);
    }

    // 2. Search filter (match name or material pool)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      drops = drops.filter(drop => 
        drop.name.toLowerCase().includes(query) ||
        drop.materialPoolName.toLowerCase().includes(query)
      );
    }

    // 3. Stage filter
    if (filters.stages.length > 0) {
      drops = drops.filter(drop => filters.stages.includes(drop.stage));
    }

    // 4. Owner filter
    if (filters.owners.length > 0) {
      drops = drops.filter(drop => filters.owners.includes(drop.owner.name));
    }

    // 5. Channel filter (future extension)
    if (filters.channels.length > 0) {
      // Channels not in current data model
    }

    return drops;
  }, [selectedIntent, searchQuery, filters]);

  // Check if any filters are active
  const hasActiveFilters = 
    filters.stages.length > 0 || 
    filters.owners.length > 0 || 
    filters.channels.length > 0 ||
    selectedIntent !== "all";

  // Handle filter removal
  const handleRemoveFilter = (filterType: 'stage' | 'owner' | 'channel' | 'intent', value?: string) => {
    if (filterType === 'intent') {
      setSelectedIntent("all");
    } else if (filterType === 'stage' && value) {
      setFilters(prev => ({
        ...prev,
        stages: prev.stages.filter(s => s !== value)
      }));
    } else if (filterType === 'owner' && value) {
      setFilters(prev => ({
        ...prev,
        owners: prev.owners.filter(o => o !== value)
      }));
    } else if (filterType === 'channel' && value) {
      setFilters(prev => ({
        ...prev,
        channels: prev.channels.filter(c => c !== value)
      }));
    }
  };

  // Handle smart filter application
  const handleApplySmartFilter = (filterConfig: any) => {
    if (filterConfig.stages) {
      setFilters(prev => ({
        ...prev,
        stages: filterConfig.stages
      }));
    }
    if (filterConfig.owners) {
      setFilters(prev => ({
        ...prev,
        owners: filterConfig.owners
      }));
    }
    if (filterConfig.health === 'attention') {
      // Filter drops with attention health level
      // This would require additional filtering logic
    }
    if (filterConfig.urgentTTL) {
      // Filter drops with urgent TTL
      // This would require additional filtering logic
    }
  };

  // Handle row click
  const handleRowClick = (dropId: string) => {
    setSelectedDropId(dropId);
    setShowFeedbackPanel(true);
  };

  // Handle create drop
  const handleCreateDrop = () => {
    // Navigate to create drop page (would be implemented in real app)
    console.log('Navigate to create drop');
  };

  // Intent switcher buttons
  const intentOptions = [
    { value: "all" as Intent, label: "All" },
    { value: "lead_gen" as Intent, label: "Lead Gen" },
    { value: "sales_follow_up" as Intent, label: "Sales Follow-Up" },
    { value: "customer_nurturing" as Intent, label: "Customer Nurturing" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Drop Records</h1>
          <p className="text-muted-foreground">Assess & Investigate - Quickly locate high-value Drops and gain deep engagement insights</p>
        </div>
        <Button onClick={handleCreateDrop}>
          <Plus className="h-4 w-4 mr-2" />
          Create Drop
        </Button>
      </div>

      {/* Smart Insight Bar */}
      <SmartInsightBar 
        activeIntent={selectedIntent}
        filteredDrops={filteredDrops}
        hasFilters={hasActiveFilters}
      />

      {/* Intent Switcher */}
      <div className="flex gap-2">
        {intentOptions.map(option => (
          <Button
            key={option.value}
            variant={selectedIntent === option.value ? "default" : "outline"}
            onClick={() => setSelectedIntent(option.value)}
            size="sm"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Active Filter Pills */}
      <ActiveFilterPills
        filters={filters}
        selectedIntent={selectedIntent}
        onRemoveFilter={handleRemoveFilter}
      />

      {/* Unified Filter Bar */}
      <UnifiedFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onApplySmartFilter={handleApplySmartFilter}
      />

      {/* Data Table */}
      <DropRecordsTable
        drops={filteredDrops}
        highlightedDropId={highlightedDropId}
        onRowClick={handleRowClick}
      />

      {/* Feedback Panel */}
      <FeedbackPanel
        dropId={selectedDropId}
        isOpen={showFeedbackPanel}
        onClose={() => {
          setShowFeedbackPanel(false);
          setSelectedDropId(null);
        }}
      />

      {/* Deep Link Demo */}
      {!highlightedDropId && <DeepLinkDemo />}
    </div>
  );
}
