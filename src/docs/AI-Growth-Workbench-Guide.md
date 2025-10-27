# AI Growth Workbench - Implementation Guide

## Overview

The AI Growth Workbench is a new entity-centric, stage-aware workspace for managing leads, opportunities, and customers. It features AI-powered recommendations, smart views, and seamless Drop framework integration.

## Access

Navigate to **AI Growth Workbench** from the sidebar menu (Briefcase icon).

## Key Features

### 1. Three-Stage System

**Leads** → **Opportunities** → **Customers**

Each stage has unique:
- Intelligence tags
- Smart views
- AI recommendations
- Priority scoring

### 2. Priority Matrix

Two-dimensional scoring system:
- **Value**: High/Medium/Low (business value)
- **Intent**: High/Medium/Low (purchase intent)
- **Score**: 0-100 (composite AI score)

### 3. Smart Views (80/20 Principle)

AI-curated views replace manual filtering:

#### Lead Smart Views
- **AI Recommended**: Top priority leads (score ≥ 75)
- **Recent Activity**: Hot leads with activity in last 48h
- **New Leads**: Leads created in last 24-48h
- **Key Signals**: Leads with high-intent actions
- **Pending Triage**: Leads not yet actioned
- **All Leads**: Complete list

#### Opportunity Smart Views
- **AI Recommended**: Top priority deals (score ≥ 70)
- **Ready to Close**: Negotiation stage, no stall risk
- **Stalled**: No activity, needs re-engagement
- **High Value**: Deals ≥ $50K
- **All Opportunities**: Complete list

#### Customer Smart Views
- **AI Recommended**: Customers needing attention
- **At Risk**: Churn warning or health declining
- **Expansion**: Upsell opportunities
- **Renewal Due**: Contract renewal approaching
- **All Customers**: Complete list

### 4. Stage-Specific Intelligence Tags

**Lead Tags:**
- Precise Match (ICP match)
- Key Signal (high-intent action)
- Quality Source (high-converting channel)
- Data Incomplete (missing data)

**Opportunity Tags:**
- Advancing (positive momentum)
- Stall Risk (no recent activity)
- Decision Maker (senior stakeholder)
- Competitor (competitor mentioned)
- Budget Confirmed (budget approved)

**Customer Tags:**
- Upsell Opportunity
- Churn Warning
- Health Declining
- Power User
- Renewal Soon

### 5. Drop Framework Integration

AI automatically:
1. Analyzes lead context
2. Selects optimal Material Pool
3. Pre-configures Drop settings
4. Provides one-click execution

**Material Pool Selection Logic:**
- Lead + Key Signal → "Technical Q&A Session"
- Lead + Precise Match → "Product Introduction & Demo"
- Opportunity + Stall Risk → "Re-engagement Campaign"
- Opportunity + Negotiation → "Proposal Follow-up"
- Customer + Churn Warning → "Customer Retention"
- Customer + Upsell Tag → "Upsell & Expansion"

## User Interface

### Layout

```
┌────────────────────────────────────────────────────────┐
│                    Command Bar                          │
├──────────────┬────────────────────────┬────────────────┤
│              │                        │                 │
│  Focus       │   Work Area           │  Insights       │
│  Queue       │                        │  Panel          │
│              │  - WorkHero           │                 │
│  - Stages    │  - QuickActions       │  - Timeline     │
│  - Views     │                        │  - Context      │
│  - Cards     │                        │                 │
│              │                        │                 │
│  (384px)     │    (flex)             │  (320px)        │
└──────────────┴────────────────────────┴────────────────┘
```

### Components

**Command Bar**
- View mode toggle (Work/Table)
- Search trigger (⌘K)

**Focus Queue** (Left Sidebar)
- Stage tabs (Leads/Opportunities/Customers)
- Smart view selector
- Lead cards with priority scores

**Work Area** (Center)
- **WorkHero**: Main action launcher with AI recommendations
- **QuickActions**: Secondary actions (log activity, schedule call, etc.)

**Insights Panel** (Right Sidebar, Collapsible)
- Timeline: Activity history
- Context: Lead metadata and AI insights

## Workflows

### Primary Action Flow

1. **Lead appears in queue** → AI analyzes context
2. **WorkHero shows recommendation** → "Schedule Technical Q&A"
3. **Material Pool highlighted** → "Technical Q&A Session"
4. **Click "Prepare Drop"** → Dialog opens with pre-configuration
5. **Review and confirm** → Drop created
6. **Auto-advance** → Next lead appears

### Quick Actions

- **Send General Drop**: Create Drop without AI recommendation
- **Log Activity**: Record offline communication
- **Schedule Call**: Book a meeting
- **Set Reminder** (S): Snooze for later
- **Archive**: Remove from queue

### Keyboard Shortcuts

- **J**: Navigate to next lead
- **K**: Navigate to previous lead
- **S**: Open snooze picker
- **⌘K**: Open command palette (coming soon)

## Mock Data

### Sample Leads (14 total)

**High-Priority Leads:**
- Sarah Chen (TechVision Inc) - Score 92
- Michael Torres (DataFlow Systems) - Score 88
- Amanda Foster (RetailCorp) - Score 82

**Opportunities:**
- David Martinez (GlobalTech) - $125K, Negotiation stage
- Lisa Anderson (MedHealth) - $89K, Stalled
- Jessica Taylor (EduTech) - $156K, Ready to close

**Customers:**
- Patricia White (Enterprise Solutions) - Upsell opportunity
- James Wilson (Manufacturing Pro) - Churn warning
- Maria Garcia (LogiChain) - Renewal due in 15 days

## Technical Details

### File Structure

```
/types/workbench.ts              # Type definitions
/lib/dropIntegration.ts          # Material pool selection logic
/lib/workbenchMockData.ts        # Mock leads & activities
/components/
  ├── AIGrowthWorkbench.tsx      # Main orchestration
  ├── StageTagBadge.tsx          # Tag renderer
  ├── PriorityMatrix.tsx         # Score visualization
  └── workbench/
      ├── CommandBar.tsx         # Top navigation
      ├── FocusQueue.tsx         # Left sidebar
      ├── WorkHero.tsx           # Main action area
      ├── QuickActions.tsx       # Secondary actions
      ├── DropCreator.tsx        # Drop configuration dialog
      ├── SnoozePicker.tsx       # Reminder scheduler
      ├── Timeline.tsx           # Activity timeline
      └── InsightsPanel.tsx      # Right sidebar
```

### State Management

All state managed in `AIGrowthWorkbench.tsx`:
- `items`: Lead data
- `activeId`: Currently selected lead
- `activeStage`: Lead/Opportunity/Customer
- `activeSmartView`: Current smart view
- `viewMode`: Work/Table view
- Dialog states (DropCreator, SnoozePicker)

### Filtering Logic

Smart views apply different filters based on stage:

**Lead - AI Recommended:**
```typescript
filtered
  .filter(l => l.priority.score >= 75)
  .sort((a, b) => b.priority.score - a.priority.score)
```

**Opportunity - Ready to Close:**
```typescript
filtered
  .filter(o => 
    o.pipelineStage === 'Negotiation' && 
    !o.tags.includes('stall_risk')
  )
  .sort((a, b) => (b.dealValue || 0) - (a.dealValue || 0))
```

## Testing Guide

### Test 1: Stage Navigation
1. Click "Leads" tab → See 5 leads
2. Click "Opportunities" tab → See 4 opportunities
3. Click "Customers" tab → See 4 customers
4. Verify auto-selection of first item

### Test 2: Smart Views
1. In Leads stage, click "AI Recommended" → See high-priority leads only
2. Click "Recent Activity" → See leads with activity in 48h
3. Click "Key Signals" → See leads with key_signal tag
4. Verify counts update correctly

### Test 3: Drop Creation Flow
1. Select Sarah Chen (lead-001)
2. Verify WorkHero shows "Schedule Technical Q&A"
3. Verify "Technical Q&A Session" pool is recommended
4. Click "Prepare Drop" button
5. Dialog opens with:
   - Recipient: Sarah Chen (auto-selected)
   - Intent: Sales Follow-up (AI-selected)
   - Material Pool: Technical Q&A (highlighted with star)
6. Click "Create Drop"
7. Toast appears: "Drop created for Sarah Chen"
8. Auto-advances to next lead

### Test 4: Quick Actions
1. Press "S" or click "Set Reminder"
2. Select "Tomorrow Morning"
3. Toast appears with scheduled time
4. Lead auto-advances

### Test 5: Insights Panel
1. Toggle panel closed → Compact trigger appears
2. Toggle panel open → Full panel visible
3. Click "Timeline" tab → See activity history
4. Click "Context" tab → See lead metadata
5. Verify AI Insight displays

### Test 6: Keyboard Navigation
1. Press "J" → Next lead selected
2. Press "K" → Previous lead selected
3. Press "S" → Snooze picker opens
4. Verify shortcuts work across all stages

### Test 7: Priority Matrix
1. Find lead with score 92 → Green badge
2. Find lead with score 65 → Amber badge
3. Verify value/intent indicators display correctly

## Design System

### Colors

**Stage Colors:**
- Lead: blue-500 to indigo-600
- Opportunity: green-500 to emerald-600
- Customer: purple-500 to violet-600

**UI Elements:**
- Primary Action: gradient blue-600 to indigo-600
- Secondary Action: outline with hover
- AI Badge: gradient amber-500 to orange-500
- Success: green-600
- Warning: amber-600
- Danger: red-600

### Typography

Following Tailwind v4.0 guidelines - no custom font size/weight classes.

## Future Enhancements

- [ ] Command Palette (⌘K) search
- [ ] Table view implementation
- [ ] Similar leads matching
- [ ] Risk detection insights
- [ ] Export/import lead data
- [ ] Integration with real CRM systems
- [ ] Advanced filtering UI
- [ ] Bulk actions
- [ ] Analytics dashboard
- [ ] Email composer integration

## Troubleshooting

### Lead not advancing after action
**Solution**: Check that toast notification appears. Auto-advance has 500ms delay.

### Smart view shows no results
**Solution**: Try "All" view to see complete list. Some smart views have strict filters.

### Material Pool not recommended
**Solution**: AI may not have enough context. Use "Use Different" button to manually select pool.

### Keyboard shortcuts not working
**Solution**: Ensure you're not focused in an input field. Click elsewhere first.

## Summary

The AI Growth Workbench provides a modern, AI-powered interface for managing the full customer lifecycle from lead to customer. With intelligent recommendations, stage-aware workflows, and seamless Drop integration, it accelerates sales and growth activities while maintaining context and tracking engagement.

**Key Benefits:**
- ✅ AI-driven prioritization
- ✅ Stage-specific intelligence
- ✅ One-click Drop creation
- ✅ Smart view filtering
- ✅ Keyboard-first navigation
- ✅ Activity tracking
- ✅ Context preservation
