import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Users, 
  TrendingUp, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock,
  Shield,
  Mail,
  QrCode,
  Eye,
  Download,
  MessageSquare,
  ExternalLink,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Phone,
  Building2,
  FileText,
  Send,
  MousePointerClick,
  ChevronDown,
  ChevronUp,
  Droplets,
  StickyNote,
  ArrowLeft,
  Cloud,
  CloudOff,
  Loader2,
  X,
  Settings
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  stage: 'new' | 'engaging' | 'qualifying' | 'quoting' | 'negotiating' | 'won' | 'lost';
  temperature: 'cold' | 'warm' | 'hot';
  source: 'Exhibition' | 'Email Capture' | 'Marketplace' | 'Website Chat' | 'Manual Import';
  owner: string;
  score: number;
  daysActive: number;
  lastActivity: string;
  totalDrops: number;
  verifiedOpens: number;
  intents: number;
  avatar?: string;
  interests?: { category: string; count: number; }[];
  crmSyncStatus?: 'unsynced' | 'syncing' | 'synced' | 'error';
  crmSyncDate?: string;
}

interface ActivityEvent {
  id: string;
  type: 'clicked_link' | 'session_group' | 'drop_sent' | 'form_submit' | 'download' | 'quote_request';
  title: string;
  timestamp: string;
  relativeTime: string;
  dropName?: string;
  channel?: string;
  details?: { label: string; value: string; }[];
  sessionCount?: number;
  expanded?: boolean;
}

interface Drop {
  id: string;
  name: string;
  scene: 'Viewer' | 'Table' | 'Gallery' | 'Data Room';
  auth: 'L1' | 'L2' | 'L3' | 'Public';
  ttl: string;
  lastSignal: string;
  signalType: 'open_verified' | 'cta_click' | 'download_blocked' | 'quote_requested';
}

interface TimelineEvent {
  id: string;
  type: 'open_verified' | 'cta_click' | 'download_blocked' | 'quote_requested' | 'drop_sent';
  dropName: string;
  timestamp: string;
  details: string;
}

// Growth Grid data following v1 spec JSON contract
interface GrowthGridCell {
  source: string;
  stage: string;
  new_7d: number;
  new_30d: number;
  adv_7d: number;
  adv_30d: number;
  val_7d: number;
  val_30d: number;
  val_unit: 'USD' | 'EUR' | 'JPY' | 'STAR';
  updated_at: string;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Chen',
    email: 'john.chen@techcorp.com',
    phone: '+1-555-0123',
    company: 'TechCorp Solutions',
    stage: 'engaging',
    temperature: 'hot',
    source: 'Exhibition',
    owner: 'Alex Kim',
    score: 124,
    daysActive: 4,
    lastActivity: '0m ago',
    totalDrops: 5,
    verifiedOpens: 12,
    intents: 8,
    interests: [
      { category: 'Outdoor', count: 3 },
      { category: 'Indoor', count: 2 },
      { category: 'Industrial', count: 1 }
    ]
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@acmecorp.com',
    phone: '+1-555-0456',
    company: 'ACME Corp',
    stage: 'quoting',
    temperature: 'warm',
    source: 'Exhibition',
    owner: 'Alex Kim',
    score: 85,
    daysActive: 7,
    lastActivity: '2 hours ago',
    totalDrops: 3,
    verifiedOpens: 8,
    intents: 2
  },
  {
    id: '3',
    name: 'Michael Torres',
    email: 'mtorres@techflow.io',
    phone: '+1-555-0789',
    company: 'TechFlow',
    stage: 'qualifying',
    temperature: 'warm',
    source: 'Email Capture',
    owner: 'Sam Rodriguez',
    score: 72,
    daysActive: 12,
    lastActivity: '1 day ago',
    totalDrops: 2,
    verifiedOpens: 5,
    intents: 1,
    interests: [
      { category: 'Tech', count: 2 },
      { category: 'Software', count: 1 }
    ]
  },
  {
    id: '4',
    name: 'Emma Johnson',
    email: 'emma.j@designstudio.com',
    phone: '+1-555-0321',
    company: 'Design Studio',
    stage: 'new',
    temperature: 'cold',
    source: 'Website Chat',
    owner: 'Alex Kim',
    score: 58,
    daysActive: 2,
    lastActivity: '3 days ago',
    totalDrops: 1,
    verifiedOpens: 2,
    intents: 0,
    interests: [
      { category: 'Design', count: 1 }
    ]
  },
  {
    id: '5',
    name: 'David Park',
    email: 'dpark@manufacturing.co',
    phone: '+1-555-0654',
    company: 'Manufacturing Co',
    stage: 'negotiating',
    temperature: 'hot',
    source: 'Exhibition',
    owner: 'Sam Rodriguez',
    score: 142,
    daysActive: 18,
    lastActivity: '1 hour ago',
    totalDrops: 8,
    verifiedOpens: 24,
    intents: 15,
    interests: [
      { category: 'Industrial', count: 5 },
      { category: 'Heavy Duty', count: 3 }
    ]
  },
  {
    id: '6',
    name: 'Lisa Martinez',
    email: 'lmartinez@retailgroup.com',
    phone: '+1-555-0987',
    company: 'Retail Group',
    stage: 'quoting',
    temperature: 'warm',
    source: 'Marketplace',
    owner: 'Alex Kim',
    score: 95,
    daysActive: 9,
    lastActivity: '5 hours ago',
    totalDrops: 4,
    verifiedOpens: 11,
    intents: 6,
    interests: [
      { category: 'Retail', count: 4 },
      { category: 'Consumer', count: 2 }
    ]
  }
];

const mockLeadDrops: Drop[] = [
  {
    id: '1',
    name: 'Winter Collection 2024',
    scene: 'Gallery',
    auth: 'L2',
    ttl: '12 days left',
    lastSignal: '2 hours ago',
    signalType: 'quote_requested'
  },
  {
    id: '2',
    name: 'Premium Wool Sweater',
    scene: 'Viewer',
    auth: 'L3',
    ttl: '5 days left',
    lastSignal: '1 day ago',
    signalType: 'open_verified'
  },
  {
    id: '3',
    name: 'Q1 Catalog',
    scene: 'Table',
    auth: 'L1',
    ttl: '25 days left',
    lastSignal: '3 days ago',
    signalType: 'cta_click'
  }
];

const mockActivityEvents: ActivityEvent[] = [
  {
    id: '1',
    type: 'clicked_link',
    title: 'Clicked link',
    timestamp: '2025/10/9 17:13:11',
    relativeTime: '0m ago',
    dropName: 'Winter Collection 2024',
    details: [
      { label: 'Drop', value: 'Winter Collection 2024' },
      { label: 'Channel', value: 'Email' },
      { label: 'Duration', value: '2m 34s' }
    ]
  },
  {
    id: '2',
    type: 'session_group',
    title: 'Session Group',
    timestamp: '2025/10/9 17:13:11',
    relativeTime: '0m ago',
    sessionCount: 8
  },
  {
    id: '3',
    type: 'clicked_link',
    title: 'Clicked link',
    timestamp: '2025/10/9 16:54:23',
    relativeTime: '19m ago',
    dropName: 'Premium Wool Sweater',
    details: [
      { label: 'Drop', value: 'Premium Wool Sweater' },
      { label: 'Channel', value: 'QR Code' },
      { label: 'Duration', value: '1m 12s' }
    ]
  },
  {
    id: '4',
    type: 'clicked_link',
    title: 'Clicked link',
    timestamp: '2025/10/9 16:54:23',
    relativeTime: '19m ago',
    dropName: 'Q1 Catalog',
    details: [
      { label: 'Drop', value: 'Q1 Catalog' },
      { label: 'Channel', value: 'Email' },
      { label: 'Duration', value: '45s' }
    ]
  },
  {
    id: '5',
    type: 'clicked_link',
    title: 'Clicked link',
    timestamp: '2025/10/9 16:54:23',
    relativeTime: '19m ago',
    dropName: 'Industrial Catalog',
    details: [
      { label: 'Drop', value: 'Industrial Catalog' },
      { label: 'Channel', value: 'Website' },
      { label: 'Duration', value: '3m 21s' }
    ]
  }
];

const mockTimeline: TimelineEvent[] = [
  {
    id: '1',
    type: 'quote_requested',
    dropName: 'Winter Collection 2024',
    timestamp: '2 hours ago',
    details: 'Requested quote for 12 items'
  },
  {
    id: '2',
    type: 'open_verified',
    dropName: 'Premium Wool Sweater',
    timestamp: '1 day ago',
    details: 'Opened email link and viewed for 2m 34s'
  },
  {
    id: '3',
    type: 'drop_sent',
    dropName: 'Winter Collection 2024',
    timestamp: '2 days ago',
    details: 'Email sent via exhibition preset'
  }
];

const mockGrowthGridData: GrowthGridCell[] = [
  {
    source: 'Expo',
    stage: 'New',
    new_7d: 12,
    new_30d: 46,
    adv_7d: 0,
    adv_30d: 0,
    val_7d: 0,
    val_30d: 0,
    val_unit: 'USD',
    updated_at: '2025-10-08T09:05:00Z'
  },
  {
    source: 'Expo',
    stage: 'Engaged',
    new_7d: 5,
    new_30d: 18,
    adv_7d: 8,
    adv_30d: 24,
    val_7d: 2400,
    val_30d: 8900,
    val_unit: 'USD',
    updated_at: '2025-10-08T09:05:00Z'
  },
  {
    source: 'Expo',
    stage: 'Quoted',
    new_7d: 2,
    new_30d: 7,
    adv_7d: 4,
    adv_30d: 15,
    val_7d: 8200,
    val_30d: 24600,
    val_unit: 'USD',
    updated_at: '2025-10-08T09:05:00Z'
  },
  {
    source: 'Expo',
    stage: 'Won',
    new_7d: 1,
    new_30d: 3,
    adv_7d: 2,
    adv_30d: 6,
    val_7d: 15400,
    val_30d: 42100,
    val_unit: 'USD',
    updated_at: '2025-10-08T09:05:00Z'
  },
  {
    source: 'Email',
    stage: 'New',
    new_7d: 18,
    new_30d: 62,
    adv_7d: 0,
    adv_30d: 0,
    val_7d: 0,
    val_30d: 0,
    val_unit: 'USD',
    updated_at: '2025-10-08T09:05:00Z'
  },
  {
    source: 'Email',
    stage: 'Engaged',
    new_7d: 3,
    new_30d: 14,
    adv_7d: 12,
    adv_30d: 38,
    val_7d: 1800,
    val_30d: 6200,
    val_unit: 'USD',
    updated_at: '2025-10-08T09:05:00Z'
  },
  {
    source: 'Email',
    stage: 'Quoted',
    new_7d: 3,
    new_30d: 9,
    adv_7d: 4,
    adv_30d: 17,
    val_7d: 3200,
    val_30d: 12400,
    val_unit: 'USD',
    updated_at: '2025-10-08T09:05:00Z'
  },
  {
    source: 'Email',
    stage: 'Won',
    new_7d: 0,
    new_30d: 2,
    adv_7d: 1,
    adv_30d: 4,
    val_7d: 5200,
    val_30d: 18700,
    val_unit: 'USD',
    updated_at: '2025-10-08T09:05:00Z'
  },
  {
    source: 'Site-Embed',
    stage: 'New',
    new_7d: 8,
    new_30d: 28,
    adv_7d: 0,
    adv_30d: 0,
    val_7d: 0,
    val_30d: 0,
    val_unit: 'STAR',
    updated_at: '2025-10-08T09:05:00Z'
  },
  {
    source: 'Site-Embed',
    stage: 'Engaged',
    new_7d: 2,
    new_30d: 11,
    adv_7d: 6,
    adv_30d: 19,
    val_7d: 4,
    val_30d: 15,
    val_unit: 'STAR',
    updated_at: '2025-10-08T09:05:00Z'
  },
  {
    source: 'WhatsApp',
    stage: 'New',
    new_7d: 15,
    new_30d: 44,
    adv_7d: 0,
    adv_30d: 0,
    val_7d: 0,
    val_30d: 0,
    val_unit: 'USD',
    updated_at: '2025-10-08T09:05:00Z'
  },
  {
    source: 'WhatsApp',
    stage: 'Engaged',
    new_7d: 4,
    new_30d: 16,
    adv_7d: 9,
    adv_30d: 28,
    val_7d: 2100,
    val_30d: 7400,
    val_unit: 'USD',
    updated_at: '2025-10-08T09:05:00Z'
  },
  {
    source: 'LinkedIn',
    stage: 'New',
    new_7d: 6,
    new_30d: 22,
    adv_7d: 0,
    adv_30d: 0,
    val_7d: 0,
    val_30d: 0,
    val_unit: 'USD',
    updated_at: '2025-10-08T09:05:00Z'
  },
  {
    source: 'LinkedIn',
    stage: 'Engaged',
    new_7d: 1,
    new_30d: 7,
    adv_7d: 3,
    adv_30d: 12,
    val_7d: 800,
    val_30d: 3200,
    val_unit: 'USD',
    updated_at: '2025-10-08T09:05:00Z'
  }
];

interface GrowthPanelProps {
  activeTab: string;
  onNavigate: (view: string) => void;
  connectedCRM?: 'salesforce' | 'hubspot' | null;
}

export function GrowthPanel({ activeTab, onNavigate, connectedCRM = null }: GrowthPanelProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(mockActivityEvents);
  const [channelFilter, setChannelFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('7');
  
  // CRM Sync state
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const isCrmConnected = connectedCRM !== null;
  const [leadSyncStatuses, setLeadSyncStatuses] = useState<Record<string, { status: 'unsynced' | 'syncing' | 'synced' | 'error', date?: string }>>({});
  const [hoveredLeadId, setHoveredLeadId] = useState<string | null>(null);

  const getTabFromActiveView = (view: string) => {
    if (view.startsWith('growth-')) {
      return view.replace('growth-', '');
    }
    return 'leads';
  };

  const currentTab = getTabFromActiveView(activeTab);

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'engaging': return 'bg-indigo-100 text-indigo-800';
      case 'qualifying': return 'bg-yellow-100 text-yellow-800';
      case 'quoting': return 'bg-orange-100 text-orange-800';
      case 'negotiating': return 'bg-purple-100 text-purple-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'Exhibition': return 'bg-green-100 text-green-800';
      case 'Email Capture': return 'bg-blue-100 text-blue-800';
      case 'Marketplace': return 'bg-purple-100 text-purple-800';
      case 'Website Chat': return 'bg-orange-100 text-orange-800';
      case 'Manual Import': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAuthColor = (auth: string) => {
    switch (auth) {
      case 'L1': return 'bg-green-100 text-green-800';
      case 'L2': return 'bg-yellow-100 text-yellow-800';
      case 'L3': return 'bg-red-100 text-red-800';
      case 'Public': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'open_verified': return <Eye className="w-4 h-4 text-blue-600" />;
      case 'cta_click': return <Target className="w-4 h-4 text-purple-600" />;
      case 'download_blocked': return <Shield className="w-4 h-4 text-red-600" />;
      case 'quote_requested': return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'drop_sent': return <Mail className="w-4 h-4 text-gray-600" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleExtendTTL = (dropId: string, days: number) => {
    toast.success(`TTL extended by ${days} days`);
  };

  const handleChangeAuth = (dropId: string, authLevel: string) => {
    toast.success(`Auth level changed to ${authLevel}`);
  };

  const handleReshare = (dropId: string) => {
    toast.success('Drop reshared via email preset');
  };

  // CRM Sync handlers
  const handleSelectLead = (leadId: string, checked: boolean) => {
    setSelectedLeadIds(prev => 
      checked ? [...prev, leadId] : prev.filter(id => id !== leadId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedLeadIds(checked ? filteredLeads.map(lead => lead.id) : []);
  };

  const handleSyncToCRM = (leadIds: string[]) => {
    if (!isCrmConnected) {
      toast.error('Please connect a CRM first');
      onNavigate('settings-integrations');
      return;
    }

    // Start syncing
    leadIds.forEach(leadId => {
      setLeadSyncStatuses(prev => ({
        ...prev,
        [leadId]: { status: 'syncing' }
      }));
    });

    // Simulate sync process
    setTimeout(() => {
      leadIds.forEach(leadId => {
        // 90% success rate for demo
        const isSuccess = Math.random() > 0.1;
        setLeadSyncStatuses(prev => ({
          ...prev,
          [leadId]: {
            status: isSuccess ? 'synced' : 'error',
            date: isSuccess ? new Date().toLocaleDateString() : undefined
          }
        }));
      });

      toast.success(`${leadIds.length} lead${leadIds.length > 1 ? 's' : ''} synced to CRM`);
      setSelectedLeadIds([]);
    }, 2000);
  };

  const getSyncIcon = (leadId: string) => {
    const status = leadSyncStatuses[leadId]?.status || 'unsynced';
    
    switch (status) {
      case 'syncing':
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Cloud className="w-4 h-4 text-muted-foreground" />;
    }
  };

  // Format value for display
  const formatValue = (value: number, unit: string) => {
    if (unit === 'STAR') {
      return value > 0 ? `★${value}` : '—';
    }
    if (value === 0) return '—';
    
    const symbol = unit === 'USD' ? '$' : unit === 'EUR' ? '€' : unit === 'JPY' ? '¥' : '$';
    return `${symbol}${value.toLocaleString()}`;
  };

  // Get unique sources and stages for grid layout
  const sources = Array.from(new Set(mockGrowthGridData.map(cell => cell.source)));
  const stages = ['New', 'Engaged', 'Quoted', 'Won'];

  // Get cell data for a specific source/stage combination
  const getCellData = (source: string, stage: string) => {
    return mockGrowthGridData.find(cell => cell.source === source && cell.stage === stage);
  };

  // Get latest update timestamp
  const getLatestUpdate = () => {
    const latest = mockGrowthGridData[0]?.updated_at;
    if (!latest) return '';
    return new Date(latest).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const toggleEventDetails = (eventId: string) => {
    setActivityEvents(events => 
      events.map(event => 
        event.id === eventId ? { ...event, expanded: !event.expanded } : event
      )
    );
  };

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStage = stageFilter === 'all' || lead.stage.toLowerCase() === stageFilter.toLowerCase();
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    return matchesSearch && matchesStage && matchesSource;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Growth Panel</h2>
          <p className="text-muted-foreground">Lead-centric progress and growth diagnostics</p>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={(value) => onNavigate(`growth-${value}`)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Growth Grid
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          {!selectedLead ? (
            /* Lead List View */
            <div className="space-y-4">
              {/* Selection Action Bar */}
              {selectedLeadIds.length > 0 && (
                <Card className="border-primary/50 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{selectedLeadIds.length} selected</span>
                        
                        {/* Split Button for CRM Sync */}
                        <div className="flex items-center">
                          <Button
                            onClick={() => handleSyncToCRM(selectedLeadIds)}
                            disabled={selectedLeadIds.some(id => leadSyncStatuses[id]?.status === 'syncing')}
                            className="rounded-r-none"
                          >
                            <Cloud className="w-4 h-4 mr-2" />
                            {isCrmConnected ? `Sync to ${connectedCRM === 'salesforce' ? 'Salesforce' : 'HubSpot'}` : 'Sync to CRM'}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="default"
                                className="rounded-l-none border-l border-primary-foreground/20 px-2"
                                disabled={selectedLeadIds.some(id => leadSyncStatuses[id]?.status === 'syncing')}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              {isCrmConnected && connectedCRM && (
                                <>
                                  <div className="px-2 py-2 text-sm">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span className="font-medium">{connectedCRM === 'salesforce' ? 'Salesforce' : 'HubSpot'}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">Connected</p>
                                  </div>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => onNavigate('settings-integrations')}>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Change Sync Settings...
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              <DropdownMenuItem onClick={() => onNavigate('settings-integrations')}>
                                <Settings className="w-4 h-4 mr-2" />
                                Manage Integrations...
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLeadIds([])}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Search and Filter */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedLeadIds.length === filteredLeads.length && filteredLeads.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </div>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leads by name, email, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Stages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="engaging">Engaging</SelectItem>
                    <SelectItem value="qualifying">Qualifying</SelectItem>
                    <SelectItem value="quoting">Quoting</SelectItem>
                    <SelectItem value="negotiating">Negotiating</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="Exhibition">Exhibition</SelectItem>
                    <SelectItem value="Email Capture">Email Capture</SelectItem>
                    <SelectItem value="Marketplace">Marketplace</SelectItem>
                    <SelectItem value="Website Chat">Website Chat</SelectItem>
                    <SelectItem value="Manual Import">Manual Import</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Leads List */}
              <div className="grid grid-cols-1 gap-3">
                {filteredLeads.map((lead) => (
                  <Card 
                    key={lead.id} 
                    className="cursor-pointer hover:shadow-md transition-all relative group"
                    onMouseEnter={() => setHoveredLeadId(lead.id)}
                    onMouseLeave={() => setHoveredLeadId(null)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div 
                          className="flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={selectedLeadIds.includes(lead.id)}
                            onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
                          />
                        </div>
                        <div onClick={() => setSelectedLead(lead)}>
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={lead.avatar} />
                            <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0" onClick={() => setSelectedLead(lead)}>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="truncate">{lead.name}</h4>
                            {(leadSyncStatuses[lead.id]?.status === 'synced') && (
                              <div 
                                className="flex items-center gap-1 cursor-help" 
                                title={`Synced on ${leadSyncStatuses[lead.id]?.date}`}
                              >
                                {getSyncIcon(lead.id)}
                              </div>
                            )}
                            {lead.temperature === 'hot' && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-red-600">hot</span>
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">{lead.email} • {lead.company}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className={getStageColor(lead.stage)}>
                              {lead.stage}
                            </Badge>
                            <Badge variant="outline" className={getSourceColor(lead.source)}>
                              {lead.source}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right space-y-1" onClick={() => setSelectedLead(lead)}>
                          <div className="text-2xl">{lead.score}</div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                        <div className="text-right space-y-1" onClick={() => setSelectedLead(lead)}>
                          <div className="text-2xl">{lead.daysActive}</div>
                          <div className="text-xs text-muted-foreground">Days Active</div>
                        </div>
                        <div className="text-sm text-muted-foreground" onClick={() => setSelectedLead(lead)}>
                          {lead.lastActivity}
                        </div>
                        
                        {/* Hover Sync Icon */}
                        {hoveredLeadId === lead.id && leadSyncStatuses[lead.id]?.status !== 'synced' && (
                          <div 
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSyncToCRM([lead.id]);
                            }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              disabled={leadSyncStatuses[lead.id]?.status === 'syncing'}
                            >
                              {getSyncIcon(lead.id)}
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredLeads.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3>No Leads Found</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            /* Lead Detail View */
            <div className="space-y-4">
              {/* Back Button */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedLead(null)}
                className="mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Leads
              </Button>

              <div className="flex gap-0 -mx-6 -my-6">
                {/* Left Sidebar - Lead Profile */}
                <div className="w-64 border-r bg-muted/30 p-6 space-y-6">
                {/* Avatar and Name */}
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">{selectedLead.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h3 className="text-lg">{selectedLead.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedLead.company}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className={getStageColor(selectedLead.stage)}>
                      {selectedLead.stage}
                    </Badge>
                    {selectedLead.temperature === 'hot' && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-red-600">hot</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Score and Days Active */}
                <div className="grid grid-cols-2 gap-4 text-center py-4 border-y">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Score</div>
                    <div className="text-2xl">{selectedLead.score}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Days Active</div>
                    <div className="text-2xl">{selectedLead.daysActive}</div>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-3">
                  <h4 className="text-xs text-muted-foreground uppercase">Contact</h4>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{selectedLead.email}</span>
                    </div>
                    {selectedLead.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span>{selectedLead.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span>{selectedLead.company}</span>
                    </div>
                  </div>
                </div>

                {/* Top Interests */}
                {selectedLead.interests && selectedLead.interests.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs text-muted-foreground uppercase">Top Interests</h4>
                    <div className="space-y-2">
                      {selectedLead.interests.map((interest, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span>{interest.category}</span>
                          <Badge variant="secondary">{interest.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h4 className="text-xs text-muted-foreground uppercase">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      New Drop
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Zap className="w-4 h-4 mr-2" />
                      Start Cadence
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <StickyNote className="w-4 h-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right: Activity Timeline */}
              <div className="flex-1 p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h2>Activity Timeline</h2>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  {/* Filters */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-xs">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search events..."
                        className="pl-10"
                      />
                    </div>
                    <Select value={channelFilter} onValueChange={setChannelFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Channels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Channels</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="qr">QR Code</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={eventFilter} onValueChange={setEventFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Events" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="clicked">Clicked Link</SelectItem>
                        <SelectItem value="session">Sessions</SelectItem>
                        <SelectItem value="form">Form Submits</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Last 7 days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Last 24 hours</SelectItem>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="all">All time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Timeline Events */}
                  <div className="space-y-3">
                    {activityEvents.map((event) => (
                      <Card key={event.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Event Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                  {event.type === 'clicked_link' && <MousePointerClick className="w-5 h-5 text-primary" />}
                                  {event.type === 'session_group' && <Users className="w-5 h-5 text-primary" />}
                                  {event.type === 'drop_sent' && <Send className="w-5 h-5 text-primary" />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm">{event.title}</h4>
                                    {event.type === 'session_group' && event.sessionCount && (
                                      <Badge variant="secondary">
                                        {event.sessionCount} events
                                      </Badge>
                                    )}
                                  </div>
                                  {event.dropName && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        <Droplets className="w-3 h-3 mr-1" />
                                        Follow-up Drop
                                      </Badge>
                                    </div>
                                  )}
                                  {event.details && !event.expanded && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-auto p-0 mt-2 text-muted-foreground hover:text-foreground"
                                      onClick={() => toggleEventDetails(event.id)}
                                    >
                                      <ChevronDown className="w-4 h-4 mr-1" />
                                      Show details
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{event.relativeTime}</span>
                              </div>
                            </div>

                            {/* Expanded Details */}
                            {event.expanded && event.details && (
                              <div className="ml-13 pl-3 border-l-2 space-y-2">
                                {event.details.map((detail, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{detail.label}</span>
                                    <span>{detail.value}</span>
                                  </div>
                                ))}
                                {event.dropName && (
                                  <div className="flex items-center gap-2 pt-2">
                                    <Badge variant="outline" className="text-xs">
                                      <Droplets className="w-3 h-3 mr-1" />
                                      Follow-up Drop
                                    </Badge>
                                  </div>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 mt-2 text-muted-foreground hover:text-foreground"
                                  onClick={() => toggleEventDetails(event.id)}
                                >
                                  <ChevronUp className="w-4 h-4 mr-1" />
                                  Hide details
                                </Button>
                              </div>
                            )}

                            {/* Session Group Timestamp */}
                            {event.type === 'session_group' && (
                              <div className="text-xs text-muted-foreground ml-13">
                                {event.timestamp}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3>Growth Attribution Grid</h3>
              <p className="text-sm text-muted-foreground">Drop-attributable outcomes by source and stage</p>
            </div>
            <div className="text-xs text-muted-foreground">
              Updated at {getLatestUpdate()}
            </div>
          </div>

          {/* Proxy value notice */}
          {mockGrowthGridData.some(cell => cell.val_unit === 'STAR') && (
            <div className="text-xs text-muted-foreground mb-4">
              Using proxy value where pricing is unavailable.
            </div>
          )}

          {/* Growth Attribution Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* Header */}
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 w-32 bg-gray-50 font-medium text-sm">Stage / Source</th>
                      {sources.map(source => (
                        <th key={source} className="text-center p-4 bg-gray-50 font-medium text-sm min-w-[140px]">
                          {source}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  
                  <tbody>
                    {stages.map((stage, stageIndex) => (
                      <tr key={stage} className={stageIndex % 2 === 0 ? 'bg-gray-25' : 'bg-white'}>
                        {/* Stage header */}
                        <td className="p-4 font-medium text-sm bg-gray-50 border-r">
                          {stage}
                        </td>
                        
                        {/* Source cells */}
                        {sources.map(source => {
                          const cellData = getCellData(source, stage);
                          if (!cellData) {
                            return (
                              <td key={`${source}-${stage}`} className="p-4 text-center text-gray-400">
                                —
                              </td>
                            );
                          }

                          return (
                            <td key={`${source}-${stage}`} className="p-4">
                              <div className="space-y-2">
                                {/* New leads row */}
                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-gray-500">New</div>
                                  <div className="text-sm font-medium text-green-700">
                                    {cellData.new_7d > 0 ? `+${cellData.new_7d}` : '—'}
                                  </div>
                                </div>
                                {cellData.new_7d > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <span>7d:</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                      <div 
                                        className="bg-green-500 h-1.5 rounded-full" 
                                        style={{ width: `${Math.min((cellData.new_7d / cellData.new_30d) * 100, 100)}%` }}
                                      ></div>
                                    </div>
                                    <span>30d</span>
                                  </div>
                                )}

                                {/* Advanced leads row */}
                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-gray-500">Advanced</div>
                                  <div className="text-sm font-medium text-blue-700">
                                    {cellData.adv_7d > 0 ? `+${cellData.adv_7d}` : '—'}
                                  </div>
                                </div>
                                {cellData.adv_7d > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <span>7d:</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                      <div 
                                        className="bg-blue-500 h-1.5 rounded-full" 
                                        style={{ width: `${Math.min((cellData.adv_7d / Math.max(cellData.adv_30d, 1)) * 100, 100)}%` }}
                                      ></div>
                                    </div>
                                    <span>30d</span>
                                  </div>
                                )}

                                {/* Value row */}
                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-gray-500">Value</div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {formatValue(cellData.val_7d, cellData.val_unit)}
                                  </div>
                                </div>
                                {cellData.val_7d > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <span>7d:</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                      <div 
                                        className="bg-gray-800 h-1.5 rounded-full" 
                                        style={{ width: `${Math.min((cellData.val_7d / Math.max(cellData.val_30d, 1)) * 100, 100)}%` }}
                                      ></div>
                                    </div>
                                    <span>30d</span>
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>New leads (7d / 30d)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Stage advancement</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
              <span>Attributed value</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}