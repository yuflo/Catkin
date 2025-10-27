import { useState } from 'react';
import { X, Lightbulb, Target, TrendingUp } from 'lucide-react';
import type { DropRecord } from '../data/mockDrops';

interface SmartInsightBarProps {
  activeIntent: "all" | "lead_gen" | "sales_follow_up" | "customer_nurturing";
  filteredDrops: DropRecord[];
  hasFilters: boolean;
}

type InsightType = "insight" | "suggestion" | "observation";

interface InsightContent {
  type: InsightType;
  message: string;
}

export function SmartInsightBar({ activeIntent, filteredDrops, hasFilters }: SmartInsightBarProps) {
  const [dismissed, setDismissed] = useState(false);

  const getInsightContent = (): InsightContent | null => {
    // When filters are active, show filter result insights
    if (hasFilters && filteredDrops.length > 0) {
      const avgScore = Math.round(
        filteredDrops.reduce((sum, drop) => sum + drop.engagementScore.value, 0) / filteredDrops.length
      );
      return {
        type: "observation",
        message: `Filter results: ${filteredDrops.length} Drop${filteredDrops.length === 1 ? '' : 's'}, average engagement score ${avgScore}. ${
          avgScore > 70 ? "Overall performance is excellent!" : avgScore > 50 ? "Performance is normal with room for optimization." : "Recommend focusing on low-scoring Drops."
        }`
      };
    }

    // Show different insights based on Intent
    switch (activeIntent) {
      case "all":
        return {
          type: "insight",
          message: "Sales follow-up Drops have significantly higher average engagement (75) vs lead gen (42) — consider applying successful patterns to new customer acquisition scenarios"
        };
      
      case "sales_follow_up":
        return {
          type: "suggestion",
          message: "Drops with quotes attached have 35% higher conversion rates — recommend including downloadable quote templates in all sales follow-up Drops"
        };
      
      case "lead_gen":
        return {
          type: "suggestion",
          message: "Engagement rates are highest (+22%) on weekdays 2-4pm — recommend sending lead gen Drops during this timeframe for better results"
        };
      
      case "customer_nurturing":
        return {
          type: "observation",
          message: "Customer nurturing Drops have the longest average lifecycle at 25 days — sustained long-term engagement is a key success factor"
        };
      
      default:
        return null;
    }
  };

  const insight = getInsightContent();

  if (!insight || dismissed) {
    return null;
  }

  const getInsightStyles = (type: InsightType) => {
    switch (type) {
      case "insight":
        return {
          container: "bg-amber-50 border-amber-200",
          icon: "text-amber-600",
          text: "text-amber-900",
          IconComponent: Lightbulb
        };
      case "suggestion":
        return {
          container: "bg-purple-50 border-purple-200",
          icon: "text-purple-600",
          text: "text-purple-900",
          IconComponent: Target
        };
      case "observation":
        return {
          container: "bg-blue-50 border-blue-200",
          icon: "text-blue-600",
          text: "text-blue-900",
          IconComponent: TrendingUp
        };
    }
  };

  const styles = getInsightStyles(insight.type);
  const { IconComponent } = styles;

  return (
    <div className={`border rounded-lg p-4 flex items-start gap-3 ${styles.container}`}>
      <IconComponent className={`h-5 w-5 ${styles.icon} flex-shrink-0 mt-0.5`} />
      <p className={`flex-1 text-sm ${styles.text}`}>
        {insight.message}
      </p>
      <button
        onClick={() => setDismissed(true)}
        className={`flex-shrink-0 ${styles.icon} hover:opacity-70 transition-opacity`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
