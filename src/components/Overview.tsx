import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Plus, 
  Inbox, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Package,
  Mail,
  QrCode,
  MessageSquare,
  ExternalLink,
  ArrowRight,
  Zap,
  Target,
  Users,
  Eye,
  MousePointer
} from 'lucide-react';

interface OverviewProps {
  onNavigate: (view: string) => void;
  onCreateDrop: () => void;
}

interface KPICard {
  label: string;
  value: string;
  delta: number;
  link: string;
  icon: React.ReactNode;
}

interface AttentionItem {
  id: string;
  type: 'expiring' | 'blocked' | 'quote' | 'spike' | 'hot';
  title: string;
  subtitle: string;
  urgency: 'high' | 'medium' | 'low';
  actions: Array<{ label: string; variant?: 'default' | 'outline' }>;
}

interface PipelineStage {
  stage: string;
  count: number;
  trend: number[];
}

const mockKPIs: KPICard[] = [
  {
    label: 'Active Drops',
    value: '12',
    delta: +3,
    link: 'drops',
    icon: <Package className="w-4 h-4" />
  },
  {
    label: 'Total Leads',
    value: '48',
    delta: +12,
    link: 'growth-leads',
    icon: <Users className="w-4 h-4" />
  },
  {
    label: 'Verified Open Rate',
    value: '68%',
    delta: +5,
    link: 'growth-grid',
    icon: <Eye className="w-4 h-4" />
  },
  {
    label: 'Avg. Engagement',
    value: '142s',
    delta: +24,
    link: 'growth-grid',
    icon: <MousePointer className="w-4 h-4" />
  }
];

const mockAttentionItems: AttentionItem[] = [
  {
    id: '1',
    type: 'expiring',
    title: 'ACME Spec Pack',
    subtitle: 'TTL 2 days',
    urgency: 'high',
    actions: [
      { label: 'Extend +7d', variant: 'outline' },
      { label: 'Open' }
    ]
  },
  {
    id: '2',
    type: 'quote',
    title: 'Quote requested on Holo Jackets',
    subtitle: '1hr ago',
    urgency: 'high',
    actions: [
      { label: 'Reply' }
    ]
  },
  {
    id: '3',
    type: 'blocked',
    title: 'Download blocked (L3)',
    subtitle: '3 attempts - ACME Corp',
    urgency: 'medium',
    actions: [
      { label: 'Send Reply' }
    ]
  }
];

const mockPipeline: PipelineStage[] = [
  { stage: 'New', count: 5, trend: [8, 10, 12, 15, 5] },
  { stage: 'Qualifying', count: 8, trend: [5, 7, 8, 6, 8] },
  { stage: 'Quoting', count: 3, trend: [3, 4, 6, 5, 3] },
  { stage: 'Won', count: 2, trend: [1, 1, 2, 1, 2] }
];

const mockRecentDrops = [
  { id: '1', name: 'Q1 Catalog', scene: 'Gallery', lastActive: '2m ago' },
  { id: '2', name: 'ACME Spec Pack', scene: 'Viewer', lastActive: '1hr ago' },
  { id: '3', name: 'Holo Jackets', scene: 'Table', lastActive: '1h ago' },
  { id: '4', name: 'Winter Collection', scene: 'Gallery', lastActive: '3h ago' }
];

const mockPinnedViews = [
  { id: '1', name: 'Premium Products', type: 'Collection', count: '24 items' },
  { id: '2', name: 'Winter Essentials', type: 'Collection', count: '18 items' },
  { id: '3', name: 'New Arrivals', type: 'Collection', count: '36 items' },
  { id: '4', name: 'Bestsellers', type: 'Collection', count: '12 items' },
  { id: '5', name: 'Clearance', type: 'Collection', count: '8 items' }
];

export function Overview({ onNavigate, onCreateDrop }: OverviewProps) {
  const [expandedAttention, setExpandedAttention] = useState<string | null>(null);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'expiring': return <Clock className="w-4 h-4 text-red-600" />;
      case 'quote': return <Mail className="w-4 h-4 text-blue-600" />;
      case 'blocked': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'hot': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'spike': return <Zap className="w-4 h-4 text-purple-600" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const renderSparkline = (trend: number[]) => (
    <div className="flex items-end gap-0.5 h-6">
      {trend.map((value, index) => (
        <div 
          key={index}
          className="bg-primary/30 rounded-sm"
          style={{ 
            height: `${(value / Math.max(...trend)) * 100}%`,
            width: '6px'
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Welcome to Distribute v3</h1>
          <p className="text-muted-foreground">Fast create & distribute product information with trackable Drops.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => onNavigate('growth-leads')} className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Leads</span>
          </Button>
          <Button onClick={onCreateDrop} className="flex items-center gap-2">
            <span>Create Drop</span>
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockKPIs.map((kpi, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate(kpi.link)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {kpi.icon}
                  <span className="text-sm text-muted-foreground">{kpi.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {kpi.delta > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span className={`text-xs ${kpi.delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.delta > 0 ? '+' : ''}{kpi.delta === 12 ? '12 new' : kpi.delta === 5 ? '5%' : kpi.delta === 24 ? '2.4m dwell' : `${kpi.delta}`}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-semibold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h3 className="mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onCreateDrop}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4>Create Drop</h4>
                    <p className="text-sm text-muted-foreground">From payload to link in 45 seconds</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-blue-600">Go</span>
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('drops')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4>Manage Drops</h4>
                    <p className="text-sm text-muted-foreground">View and manage all drop records</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-blue-600">Go</span>
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('settings')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4>Manage Presets</h4>
                    <p className="text-sm text-muted-foreground">Auth, Scene, Channel templates</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-blue-600">Go</span>
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What Needs Attention */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3>What Needs Attention</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('growth-leads')}>
              View All
            </Button>
          </div>
          
          {mockAttentionItems.length > 0 ? (
            <div className="space-y-3">
              {mockAttentionItems.slice(0, 5).map((item) => (
                <Card key={item.id} className={`border-l-4 ${getUrgencyColor(item.urgency)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{item.subtitle}</p>
                        <div className="flex items-center gap-2">
                          {item.actions.map((action, index) => (
                            <Button 
                              key={index} 
                              variant={action.variant || 'default'} 
                              size="sm"
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4>All clear 🎉</h4>
                <p className="text-muted-foreground">Check Signals Inbox or create a new Drop.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Pipeline Glance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Pipeline Glance
          </CardTitle>
          <CardDescription>Lead progression across all active drops</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {mockPipeline.map((stage, index) => {
              const colors = ['border-t-blue-500', 'border-t-yellow-500', 'border-t-orange-500', 'border-t-green-500'];
              return (
                <div 
                  key={stage.stage}
                  className={`cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors border-t-4 ${colors[index]}`}
                  onClick={() => onNavigate('drops-records')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    {renderSparkline(stage.trend)}
                  </div>
                  <div className="text-2xl font-semibold">{stage.count}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Drops */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Drops</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('drops-records')}>
              <span className="text-blue-600">View All</span>
              <ArrowRight className="w-4 h-4 text-blue-600 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRecentDrops.map((drop) => (
              <div 
                key={drop.id}
                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                onClick={() => onNavigate('drops-all')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{drop.name}</div>
                    <div className="text-xs text-muted-foreground">{drop.scene}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{drop.lastActive}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Setup Tips (shown conditionally) */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Use per-recipient links in email drops to automatically verify opens and boost your conversion tracking accuracy.
              </p>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}