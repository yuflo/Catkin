import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AudienceAuthSettings } from './AudienceAuthSettings';
import { Policy } from '../types/policy';
import { 
  Plus, 
  Shield, 
  Layout, 
  Layers,
  Share2, 
  Edit, 
  Copy, 
  MoreHorizontal, 
  Eye,
  Archive,
  History,
  AlertTriangle,
  CheckCircle,
  Info,
  Lock,
  Unlock,
  Mail,
  MessageSquare,
  QrCode,
  Code,
  Star,
  Users,
  Clock,
  Download,
  Droplets,
  Settings,
  Zap,
  TrendingUp,
  Sparkles,
  Cloud,
  Package,
  Loader2,
  X,
  ChevronDown,
  ArrowLeftRight,
  Search,
  Link as LinkIcon,
  Tag,
  Target
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { DropSceneTemplatesOverview } from './DropSceneTemplatesOverview';
import { DropSceneTemplate } from '../types/dropSceneTemplate';

export interface AuthPreset {
  id: string;
  name: string;
  level: 'L1' | 'L2' | 'L3';
  version: number;
  verification: 'none' | 'email' | 'sso';
  ttlDays: number;
  watermark: boolean;
  watermarkText?: string;
  watermarkOpacity: number;
  downloadPolicy: 'allow' | 'guarded' | 'block';
  deviceCap?: number;
  consentBanner: boolean;
  consentText?: string;
  linkExpiryHours?: number;
  createdBy: string;
  createdAt: string;
  usageCount: number;
  isDefault: boolean;
}

export interface ScenePreset {
  id: string;
  name: string;
  version: number;
  template: 'simple-catalog' | 'catalog-quote' | 'product-updates' | 'page-embed';
  stage: string;
  intent: string;
  fieldVisibility: {
    price: boolean;
    stock: boolean;
    moq: boolean;
    category: boolean;
    shortDescription: boolean;
    docsTab: boolean;
  };
  pricePresentation: 'visible' | 'reference' | 'blurred' | 'hidden';
  gridConfig: {
    density: 'compact' | 'comfortable';
    columns: number;
    showPriceBadge: boolean;
  };
  primaryCTA: {
    label: string;
    action: string;
  };
  secondaryCTA?: {
    label: string;
    action: string;
  };
  features: {
    itemSelection: boolean;
    notesField: boolean;
    wishList: boolean;
    followUpdates: boolean;
    quickActions: boolean;
    faq: boolean;
  };
  signals: string[];
  disclaimerText?: string;
  createdBy: string;
  createdAt: string;
  usageCount: number;
  isDefault: boolean;
}

interface SharingPreset {
  id: string;
  name: string;
  description?: string;
  version: number;
  deliveryFormat: 'trackable-url' | 'short-url' | 'qr-code';
  defaultSource: string;
  tracking: {
    utmCampaign?: string;
    utmMedium?: string;
    utmContent?: string;
  };
  createdBy: string;
  createdAt: string;
  usageCount: number;
  lastUsed?: string;
  isDefault: boolean;
}

// Legacy interface for backward compatibility
interface ChannelPreset {
  id: string;
  name: string;
  version: number;
  channel: 'email' | 'chat' | 'qr' | 'embed';
  template: {
    subject?: string;
    body?: string;
    greeting?: string;
  };
  utm: {
    source: string;
    medium: string;
    campaign: string;
  };
  perRecipientLinks: boolean;
  shortlinkDomain: string;
  qrConfig?: {
    size: 'small' | 'medium' | 'large';
    label: string;
  };
  embedConfig?: {
    theme: 'light' | 'dark';
    width: 'responsive' | 'fixed';
    privacyPolicy?: string;
  };
  createdBy: string;
  createdAt: string;
  usageCount: number;
  isDefault: boolean;
}

type PresetType = 'auth' | 'channel' | 'drop-templates' | 'integrations';

const mockAuthPresets: AuthPreset[] = [
  {
    id: '1',
    name: 'L1 Public',
    level: 'L1',
    version: 1,
    verification: 'none',
    ttlDays: 30,
    watermark: false,
    watermarkOpacity: 0.3,
    downloadPolicy: 'allow',
    consentBanner: false,
    createdBy: 'System',
    createdAt: '2 weeks ago',
    usageCount: 24,
    isDefault: true
  },
  {
    id: '2',
    name: 'L2 Quote Secure',
    level: 'L2',
    version: 2,
    verification: 'email',
    ttlDays: 14,
    watermark: true,
    watermarkText: '{{org}} • {{timestamp}}',
    watermarkOpacity: 0.4,
    downloadPolicy: 'guarded',
    consentBanner: true,
    consentText: 'By viewing this content, you accept our terms and conditions.',
    createdBy: 'Admin',
    createdAt: '1 week ago',
    usageCount: 18,
    isDefault: true
  },
  {
    id: '3',
    name: 'L3 NDA Room',
    level: 'L3',
    version: 1,
    verification: 'email',
    ttlDays: 7,
    watermark: true,
    watermarkText: '{{org}} • {{drop_id}} • {{timestamp}}',
    watermarkOpacity: 0.5,
    downloadPolicy: 'block',
    deviceCap: 3,
    consentBanner: true,
    consentText: 'This content is confidential. Unauthorized sharing is prohibited.',
    linkExpiryHours: 24,
    createdBy: 'Admin',
    createdAt: '3 days ago',
    usageCount: 12,
    isDefault: true
  }
];

const mockScenePresets: ScenePreset[] = [
  {
    id: '1',
    name: 'Simple Catalog',
    version: 1,
    template: 'simple-catalog',
    stage: 'Acquisition / Discovery',
    intent: 'Expo-ready & general discovery',
    defaultAuthLevel: 'L1',
    fieldVisibility: {
      price: true,
      priceBlurInL1: true,
      stock: true,
      moq: true,
      category: true,
      shortDescription: true,
      docsTab: false
    },
    pricePresentation: 'blurred',
    gridConfig: {
      density: 'comfortable',
      columns: 3,
      showPriceBadge: true
    },
    primaryCTA: {
      label: 'Contact Sales',
      action: 'cta_contact'
    },
    features: {
      itemSelection: false,
      notesField: false,
      wishList: true,
      followUpdates: false,
      quickActions: false,
      faq: false
    },
    signals: ['view_start', 'dwell_10s', 'item_view', 'cta_contact', 'identify_success'],
    createdBy: 'System',
    createdAt: '2 weeks ago',
    usageCount: 42,
    isDefault: true
  },
  {
    id: '2',
    name: 'Catalog + Quote',
    version: 1,
    template: 'catalog-quote',
    stage: 'Follow-up / Quote Intent',
    intent: 'Qualified quote request with minimal friction',
    defaultAuthLevel: 'L2',
    fieldVisibility: {
      price: true,
      priceBlurInL1: false,
      stock: true,
      moq: true,
      category: true,
      shortDescription: true,
      docsTab: true
    },
    pricePresentation: 'reference',
    gridConfig: {
      density: 'compact',
      columns: 2,
      showPriceBadge: true
    },
    primaryCTA: {
      label: 'Request Quote',
      action: 'cta_request_quote'
    },
    features: {
      itemSelection: true,
      notesField: true,
      wishList: false,
      followUpdates: false,
      quickActions: false,
      faq: false
    },
    signals: ['item_select', 'cta_request_quote', 'note_length', 'identify_success'],
    disclaimerText: 'Prices shown are reference estimates; final quote may vary.',
    createdBy: 'System',
    createdAt: '2 weeks ago',
    usageCount: 38,
    isDefault: true
  },
  {
    id: '3',
    name: 'Product Updates',
    version: 1,
    template: 'product-updates',
    stage: 'Nurture / Activation',
    intent: 'Customer maintenance & re-engagement',
    defaultAuthLevel: 'L1',
    fieldVisibility: {
      price: true,
      priceBlurInL1: true,
      stock: true,
      moq: false,
      category: true,
      shortDescription: true,
      docsTab: false
    },
    pricePresentation: 'blurred',
    gridConfig: {
      density: 'comfortable',
      columns: 3,
      showPriceBadge: true
    },
    primaryCTA: {
      label: 'Request Details',
      action: 'cta_request_details'
    },
    secondaryCTA: {
      label: 'Add to List',
      action: 'add_to_list'
    },
    features: {
      itemSelection: false,
      notesField: false,
      wishList: true,
      followUpdates: true,
      quickActions: false,
      faq: false
    },
    signals: ['click_through', 'cta_request_details', 'follow_updates', 'identify_success'],
    createdBy: 'System',
    createdAt: '1 week ago',
    usageCount: 28,
    isDefault: true
  },
  {
    id: '4',
    name: 'Page Embed',
    version: 1,
    template: 'page-embed',
    stage: 'Acquisition / Early Qualification',
    intent: 'Info + quick actions + short form',
    defaultAuthLevel: 'L2',
    fieldVisibility: {
      price: false,
      priceBlurInL1: false,
      stock: false,
      moq: false,
      category: false,
      shortDescription: true,
      docsTab: true
    },
    pricePresentation: 'hidden',
    gridConfig: {
      density: 'comfortable',
      columns: 2,
      showPriceBadge: false
    },
    primaryCTA: {
      label: 'Book a Call',
      action: 'quick_action_book_call'
    },
    secondaryCTA: {
      label: 'Share Requirements',
      action: 'quick_action_form'
    },
    features: {
      itemSelection: false,
      notesField: false,
      wishList: false,
      followUpdates: false,
      quickActions: true,
      faq: true
    },
    signals: ['quick_action_click', 'faq_expand', 'form_submit', 'identify_success'],
    createdBy: 'System',
    createdAt: '3 days ago',
    usageCount: 15,
    isDefault: true
  }
];

const mockChannelPresets: ChannelPreset[] = [
  {
    id: '1',
    name: 'Email — Lead follow-up',
    version: 1,
    channel: 'email',
    template: {
      subject: 'Specs for {{drop_title}}',
      body: 'Hi {{buyer_first_name}},\n\nHere are the product specifications you requested for {{drop_title}}.\n\nClick the link below to view:\n{{link}}\n\nBest regards,\n{{seller_name}}'
    },
    utm: {
      source: 'email',
      medium: 'preset',
      campaign: 'lead_followup'
    },
    perRecipientLinks: true,
    shortlinkDomain: 'go.distribute.com',
    createdBy: 'System',
    createdAt: '2 weeks ago',
    usageCount: 31,
    isDefault: true
  },
  {
    id: '2',
    name: 'Chat — Quick share',
    version: 1,
    channel: 'chat',
    template: {
      greeting: 'Here\'s the spec pack for {{drop_title}} → {{shortlink}}'
    },
    utm: {
      source: 'chat',
      medium: 'preset',
      campaign: 'quick_share'
    },
    perRecipientLinks: false,
    shortlinkDomain: 'go.distribute.com',
    createdBy: 'System',
    createdAt: '2 weeks ago',
    usageCount: 14,
    isDefault: true
  },
  {
    id: '3',
    name: 'Expo QR — Booth',
    version: 1,
    channel: 'qr',
    template: {},
    utm: {
      source: 'expo',
      medium: 'qr',
      campaign: 'booth'
    },
    perRecipientLinks: false,
    shortlinkDomain: 'go.distribute.com',
    qrConfig: {
      size: 'medium',
      label: 'Scan for specs'
    },
    createdBy: 'System',
    createdAt: '1 week ago',
    usageCount: 8,
    isDefault: true
  }
];

const mockSharingPresets: SharingPreset[] = [
  {
    id: '1',
    name: 'LinkedIn Post - Q4 Campaign',
    description: 'Standard sharing preset for LinkedIn posts during Q4 product launch',
    version: 1,
    deliveryFormat: 'trackable-url',
    defaultSource: 'linkedin',
    tracking: {
      utmCampaign: 'q4_product_launch',
      utmMedium: 'social',
      utmContent: 'organic_post'
    },
    createdBy: 'Sarah Chen',
    createdAt: '2 weeks ago',
    usageCount: 24,
    lastUsed: '2 hours ago',
    isDefault: true
  },
  {
    id: '2',
    name: 'Expo QR — Booth',
    description: 'QR code preset for trade show booth interactions',
    version: 1,
    deliveryFormat: 'qr-code',
    defaultSource: 'expo_booth',
    tracking: {
      utmCampaign: 'LeadCapture',
      utmMedium: 'qr',
      utmContent: 'booth_scan'
    },
    createdBy: 'System',
    createdAt: '1 week ago',
    usageCount: 8,
    lastUsed: '3 days ago',
    isDefault: true
  },
  {
    id: '3',
    name: 'Email Newsletter',
    description: 'Short URLs for email newsletter links',
    version: 1,
    deliveryFormat: 'short-url',
    defaultSource: 'newsletter',
    tracking: {
      utmCampaign: 'monthly_newsletter',
      utmMedium: 'email'
    },
    createdBy: 'Marketing Team',
    createdAt: '3 days ago',
    usageCount: 12,
    lastUsed: '1 day ago',
    isDefault: false
  }
];

type PresetType = 'auth' | 'drop-templates' | 'integrations';

interface SettingsTabProps {
  onNavigate?: (view: any) => void;
  initialTab?: PresetType;
  connectedCRM?: 'salesforce' | 'hubspot' | null;
  onCRMConnect?: (crm: 'salesforce' | 'hubspot') => void;
  onCRMDisconnect?: () => void;
  authPolicies?: AuthPreset[];
  onAuthPoliciesChange?: (policies: AuthPreset[]) => void;
  dropSceneTemplates?: DropSceneTemplate[];
  onDropSceneTemplatesChange?: (templates: DropSceneTemplate[]) => void;
  allPolicies?: Policy[];
  onPoliciesChange?: (policies: Policy[]) => void;
}

export function SettingsTab({ 
  onNavigate, 
  initialTab = 'auth', 
  connectedCRM = null, 
  onCRMConnect, 
  onCRMDisconnect,
  authPolicies: externalAuthPolicies,
  onAuthPoliciesChange,
  dropSceneTemplates: externalDropSceneTemplates,
  onDropSceneTemplatesChange,
  allPolicies: externalAllPolicies,
  onPoliciesChange
}: SettingsTabProps = {}) {
  const [activeTab, setActiveTab] = useState<PresetType>(initialTab);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Use external state if provided, otherwise use local state
  const [localAuthPresets, setLocalAuthPresets] = useState(mockAuthPresets);
  const [localDropSceneTemplates, setLocalDropSceneTemplates] = useState<DropSceneTemplate[]>([]);
  const [localAllPolicies, setLocalAllPolicies] = useState<Policy[]>([]);
  const authPresets = externalAuthPolicies || localAuthPresets;
  const dropSceneTemplates = externalDropSceneTemplates || localDropSceneTemplates;
  const allPolicies = externalAllPolicies || localAllPolicies;
  const setAuthPresets = onAuthPoliciesChange || setLocalAuthPresets;
  const setPolicies = onPoliciesChange || setLocalAllPolicies;
  const setDropSceneTemplates = onDropSceneTemplatesChange || setLocalDropSceneTemplates;
  
  const [sharingPresets, setSharingPresets] = useState(mockSharingPresets);
  const [showCrmConnectModal, setShowCrmConnectModal] = useState(false);
  const [selectedCRMToConnect, setSelectedCRMToConnect] = useState<'salesforce' | 'hubspot' | null>(null);
  const [isManageMode, setIsManageMode] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [notifiedIntegrations, setNotifiedIntegrations] = useState<Set<string>>(new Set());
  const [showCRMSelectionModal, setShowCRMSelectionModal] = useState(false);
  const [crmSearchQuery, setCrmSearchQuery] = useState('');
  const [newPresetType, setNewPresetType] = useState<PresetType>('auth');

  const getPresetIcon = (type: PresetType) => {
    switch (type) {
      case 'auth': return Shield;
      case 'drop-templates': return Layers;
      case 'integrations': return Zap;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'L1': return 'bg-green-100 text-green-800';
      case 'L2': return 'bg-yellow-100 text-yellow-800';
      case 'L3': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return Mail;
      case 'chat': return MessageSquare;
      case 'qr': return QrCode;
      case 'embed': return Code;
      default: return Share2;
    }
  };

  const getRiskLevel = (preset: AuthPreset) => {
    let risk = 0;
    if (preset.verification === 'none') risk += 2;
    if (!preset.watermark) risk += 2;
    if (preset.downloadPolicy === 'allow') risk += 1;
    if (preset.ttlDays > 30) risk += 1;
    
    if (risk >= 4) return { level: 'high', color: 'text-red-600', icon: AlertTriangle };
    if (risk >= 2) return { level: 'medium', color: 'text-yellow-600', icon: Info };
    return { level: 'low', color: 'text-green-600', icon: CheckCircle };
  };

  const handleDuplicatePreset = (presetId: string, type: PresetType) => {
    toast.success('Preset duplicated successfully');
  };

  const handleArchivePreset = (presetId: string, type: PresetType) => {
    toast.success('Preset archived');
  };

  const PresetCard = ({ preset, type, onSelect }: { preset: any, type: PresetType, onSelect: () => void }) => {
    const Icon = getPresetIcon(type);
    
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onSelect}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{preset.name}</CardTitle>
                  {preset.isDefault && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {type === 'auth' && (
                    <Badge variant="outline" className={getLevelColor(preset.level)}>
                      {preset.level}
                    </Badge>
                  )}
                  {type === 'scene' && (
                    <Badge variant="outline" className={getLevelColor(preset.defaultAuthLevel)}>
                      {preset.defaultAuthLevel}
                    </Badge>
                  )}
                  {type === 'channel' && (
                    <Badge variant="outline">
                      {preset.channel}
                    </Badge>
                  )}
                  <Badge variant="secondary">v{preset.version}</Badge>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Preset
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDuplicatePreset(preset.id, type)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <History className="w-4 h-4 mr-2" />
                  Version History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleArchivePreset(preset.id, type)}>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {type === 'scene' && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{preset.stage}</p>
              <p className="text-sm">{preset.intent}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="w-3 h-3" />
                <span>Primary: {preset.primaryCTA.label}</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{preset.usageCount} drops</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{preset.createdAt}</span>
              </div>
            </div>
            {type === 'auth' && (
              <div className="flex items-center gap-1">
                {(() => {
                  const risk = getRiskLevel(preset);
                  const RiskIcon = risk.icon;
                  return (
                    <>
                      <RiskIcon className={`w-3 h-3 ${risk.color}`} />
                      <span className={`text-xs ${risk.color}`}>{risk.level}</span>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const CreatePresetDialog = () => {
    const [formData, setFormData] = useState<any>({});

    return (
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {newPresetType === 'channel' ? 'Create a New Sharing Preset' : 'Create New Preset'}
            </DialogTitle>
            <DialogDescription>
              {newPresetType === 'channel' 
                ? 'Define how Drops are shared and tracked across channels' 
                : 'Set up a reusable configuration for your team'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Preset Type Selection */}
            <div className="space-y-3">
              <Label>Preset Type</Label>
              <div className="grid grid-cols-3 gap-3">
                {(['auth', 'scene', 'channel'] as PresetType[]).map((type) => {
                  const Icon = getPresetIcon(type);
                  return (
                    <Button
                      key={type}
                      variant={newPresetType === type ? 'default' : 'outline'}
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => setNewPresetType(type)}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="capitalize">{type}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Auth Preset Form */}
            {newPresetType === 'auth' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Preset Name</Label>
                    <Input id="name" placeholder="e.g., L2 Customer Secure" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="level">Security Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L1">L1 - Public</SelectItem>
                        <SelectItem value="L2">L2 - Verified</SelectItem>
                        <SelectItem value="L3">L3 - Governed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verification">Verification Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select verification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="email">Email Magic Link</SelectItem>
                        <SelectItem value="sso">SSO (Future)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ttl">Link Validity (Days)</Label>
                    <Input type="number" id="ttl" defaultValue="14" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="watermark">Watermark</Label>
                      <Switch id="watermark" />
                    </div>
                    <Input placeholder="{{org}} • {{timestamp}}" />
                    <div className="space-y-2">
                      <Label>Opacity</Label>
                      <Slider defaultValue={[40]} max={100} step={10} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="download">Download Policy</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allow">Allow All</SelectItem>
                        <SelectItem value="guarded">Guarded (Verify First)</SelectItem>
                        <SelectItem value="block">Block Raw Downloads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Live Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm font-medium">L2 Customer Secure</span>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            <span>Email verification required</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span>Expires in 14 days</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Droplets className="w-3 h-3" />
                            <span>Watermarked</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Download className="w-3 h-3" />
                            <span>Downloads after verification</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-600">Medium Risk</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Balanced security with moderate friction. Good for qualified leads.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Scene Preset Form */}
            {newPresetType === 'scene' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scene-name">Preset Name</Label>
                    <Input id="scene-name" placeholder="e.g., Product Showcase" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scene-template">Scene Template</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple-catalog">Simple Catalog</SelectItem>
                        <SelectItem value="catalog-quote">Catalog + Quote</SelectItem>
                        <SelectItem value="product-updates">Product Updates</SelectItem>
                        <SelectItem value="page-embed">Page Embed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage</Label>
                    <Input id="stage" placeholder="e.g., Acquisition / Discovery" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="auth-level">Default Auth Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L1">L1 Public</SelectItem>
                        <SelectItem value="L2">L2 Verified</SelectItem>
                        <SelectItem value="L3">L3 Governed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intent">Intent</Label>
                  <Input id="intent" placeholder="e.g., Fast discovery with contact capture" />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Grid Configuration</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="grid-density">Density</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select density" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="comfortable">Comfortable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grid-columns">Columns</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select columns" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 columns</SelectItem>
                          <SelectItem value="3">3 columns</SelectItem>
                          <SelectItem value="4">4 columns</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Field Visibility</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'price', label: 'Price' },
                      { id: 'priceBlurInL1', label: 'Blur Price in L1' },
                      { id: 'stock', label: 'Stock' },
                      { id: 'moq', label: 'MOQ' },
                      { id: 'category', label: 'Category' },
                      { id: 'shortDescription', label: 'Short Description' },
                      { id: 'docsTab', label: 'Docs Tab' }
                    ].map((field) => (
                      <div key={field.id} className="flex items-center justify-between">
                        <Label htmlFor={field.id} className="text-sm">
                          {field.label}
                        </Label>
                        <Switch id={field.id} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Price Presentation</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select presentation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visible">Visible</SelectItem>
                      <SelectItem value="reference">Reference (Quote-Lite)</SelectItem>
                      <SelectItem value="blurred">Blurred (L1)</SelectItem>
                      <SelectItem value="hidden">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Primary CTA</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-cta-label">Label</Label>
                      <Input id="primary-cta-label" placeholder="e.g., Contact Sales" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primary-cta-action">Action Signal</Label>
                      <Input id="primary-cta-action" placeholder="e.g., cta_contact" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Secondary CTA (Optional)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="secondary-cta-label">Label</Label>
                      <Input id="secondary-cta-label" placeholder="e.g., Add to List" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary-cta-action">Action Signal</Label>
                      <Input id="secondary-cta-action" placeholder="e.g., add_to_list" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Features</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'itemSelection', label: 'Item Selection (Quote)' },
                      { id: 'notesField', label: 'Notes Field' },
                      { id: 'wishList', label: 'Wish List / Save' },
                      { id: 'followUpdates', label: 'Follow Updates' },
                      { id: 'quickActions', label: 'Quick Actions (Embed)' },
                      { id: 'faq', label: 'FAQ Section' }
                    ].map((feature) => (
                      <div key={feature.id} className="flex items-center justify-between">
                        <Label htmlFor={feature.id} className="text-sm">
                          {feature.label}
                        </Label>
                        <Switch id={feature.id} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disclaimer">Disclaimer Text (Optional)</Label>
                  <Textarea 
                    id="disclaimer" 
                    placeholder="e.g., Prices shown are reference estimates; final quote may vary."
                    rows={2}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast.success('Preset created successfully');
                setIsCreateDialogOpen(false);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Save Preset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Settings</h2>
        <p className="text-muted-foreground">Manage presets to accelerate drop creation and maintain governance</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PresetType)}>
        <div className="sticky top-0 z-10 bg-background pb-4 -mt-6 pt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="auth" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Access Policies
            </TabsTrigger>
            <TabsTrigger value="drop-templates" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Drop Scene Templates
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Integrations
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="auth" className="space-y-6">
          <AudienceAuthSettings 
            allPolicies={allPolicies}
            onPoliciesChange={setPolicies}
          />
        </TabsContent>

        <TabsContent value="drop-templates">
          <DropSceneTemplatesOverview 
            templates={dropSceneTemplates} 
            onNavigate={onNavigate || (() => {})} 
            onTemplatesChange={setDropSceneTemplates}
          />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-8">
          {/* Header */}
          <div>
            <h2>Integrations Hub</h2>
            <p className="text-muted-foreground">
              Connect your growth stack to accelerate lead creation, distribution, and conversion
            </p>
          </div>

          {/* Available Integrations */}
          <div className="space-y-6">
            <div>
              <h3>Available Integrations</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ready to connect and configure
              </p>
            </div>

            {/* CRM Category - Single Slot Model */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm text-muted-foreground">Customer Relationship Management (CRM)</h4>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              {/* CRM Integration Slot */}
              {!connectedCRM ? (
                /* Unconnected State */
                <Card 
                  className="border-2 border-dashed bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/30 transition-all cursor-pointer"
                  onClick={() => setShowCRMSelectionModal(true)}
                >
                  <CardContent className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Plus className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="mb-1">Connect your CRM</h4>
                        <p className="text-sm text-muted-foreground">
                          Sync leads to your sales pipeline
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Connected State */
                <div>
                  {connectedCRM === 'salesforce' && (
                    <Card className="transition-all hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Cloud className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle>Salesforce</CardTitle>
                              <CardDescription>Convert engaged leads into sales pipeline</CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-600 font-medium">Active</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Connected by user@company.com
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => {
                              setSelectedCRMToConnect('salesforce');
                              setIsManageMode(true);
                              setShowCrmConnectModal(true);
                            }}
                          >
                            Manage
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => {
                              if (onCRMDisconnect) {
                                onCRMDisconnect();
                                toast.success('Salesforce disconnected');
                              }
                            }}
                          >
                            Disconnect
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setShowCRMSelectionModal(true)}
                            className="shrink-0"
                          >
                            <ArrowLeftRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {connectedCRM === 'hubspot' && (
                    <Card className="transition-all hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                              <CardTitle>HubSpot</CardTitle>
                              <CardDescription>Sync leads and track the full buyer journey</CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-600 font-medium">Active</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Connected by user@company.com
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => {
                              setSelectedCRMToConnect('hubspot');
                              setIsManageMode(true);
                              setShowCrmConnectModal(true);
                            }}
                          >
                            Manage
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => {
                              if (onCRMDisconnect) {
                                onCRMDisconnect();
                                toast.success('HubSpot disconnected');
                              }
                            }}
                          >
                            Disconnect
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setShowCRMSelectionModal(true)}
                            className="shrink-0"
                          >
                            <ArrowLeftRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content Integrations Banner */}
          <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Looking for content integrations?</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    To connect data sources like PIM systems, please visit the <button className="font-medium underline hover:no-underline" onClick={() => onNavigate && onNavigate('payloads' as any)}>Payloads</button> section.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <h3>Coming Soon</h3>
                <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-purple-200">Roadmap</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Help us prioritize what to build next
              </p>
            </div>

            {/* Marketing Automation Category */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm text-muted-foreground">Marketing Automation</h4>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Marketo Card */}
                <Card className="relative overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>Marketo</CardTitle>
                        <CardDescription>Sync engagement data to the leading enterprise marketing automation platform</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setNotifiedIntegrations(new Set(notifiedIntegrations).add('marketo'));
                        toast.success('We\'ll notify you when Marketo integration is ready');
                      }}
                      disabled={notifiedIntegrations.has('marketo')}
                    >
                      {notifiedIntegrations.has('marketo') ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          We'll keep you posted
                        </>
                      ) : (
                        'Notify Me'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sales Engagement Category */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm text-muted-foreground">Sales Engagement</h4>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Outreach Card */}
                <Card className="relative overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>Outreach</CardTitle>
                        <CardDescription>Embed trackable Drops directly into your sales cadences</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setNotifiedIntegrations(new Set(notifiedIntegrations).add('outreach'));
                        toast.success('We\'ll notify you when Outreach integration is ready');
                      }}
                      disabled={notifiedIntegrations.has('outreach')}
                    >
                      {notifiedIntegrations.has('outreach') ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          We'll keep you posted
                        </>
                      ) : (
                        'Notify Me'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Team Communication Category */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm text-muted-foreground">Team Communication</h4>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Slack Card */}
                <Card className="relative overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>Slack</CardTitle>
                        <CardDescription>Accelerate your speed-to-lead with real-time notifications</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setNotifiedIntegrations(new Set(notifiedIntegrations).add('slack'));
                        toast.success('We\'ll notify you when Slack integration is ready');
                      }}
                      disabled={notifiedIntegrations.has('slack')}
                    >
                      {notifiedIntegrations.has('slack') ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          We'll keep you posted
                        </>
                      ) : (
                        'Notify Me'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Suggest an Integration CTA */}
          <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-dashed">
            <CardContent className="p-8 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h4>Don't see the tool you need?</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    We're constantly expanding our integration ecosystem. Let us know what tools would accelerate your growth workflow.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const subject = encodeURIComponent('Integration Suggestion for Distribute v3');
                    const body = encodeURIComponent(`Hi Distribute Team,

I'd like to suggest a new integration for Distribute v3:

Integration Name: [Enter the tool name]
Category: [CRM / Marketing Automation / Sales Engagement / Team Communication / Other]

Why this integration would be valuable:
[Explain how this integration would accelerate your growth workflow]

Use Case:
[Describe your specific use case]

Additional Notes:
[Any other relevant details]

Thanks,
[Your Name]`);
                    window.location.href = `mailto:integrations@distribute.com?subject=${subject}&body=${body}`;
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Suggest an Integration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CRM Selection Modal */}
      <Dialog open={showCRMSelectionModal} onOpenChange={setShowCRMSelectionModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose a CRM to connect</DialogTitle>
            <DialogDescription>
              Select your preferred CRM platform to sync leads and manage your sales pipeline
            </DialogDescription>
          </DialogHeader>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search CRM platforms..." 
              className="pl-9"
              value={crmSearchQuery}
              onChange={(e) => setCrmSearchQuery(e.target.value)}
            />
          </div>

          {/* CRM List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {[
              {
                id: 'salesforce',
                name: 'Salesforce',
                description: 'Convert engaged leads into sales pipeline',
                icon: Cloud,
                bgColor: 'bg-blue-100',
                iconColor: 'text-blue-600',
                available: true
              },
              {
                id: 'hubspot',
                name: 'HubSpot',
                description: 'Sync leads and track the full buyer journey',
                icon: Package,
                bgColor: 'bg-orange-100',
                iconColor: 'text-orange-600',
                available: true
              },
              {
                id: 'zoho',
                name: 'Zoho CRM',
                description: 'Unified customer management platform',
                icon: Package,
                bgColor: 'bg-red-100',
                iconColor: 'text-red-600',
                available: false
              },
              {
                id: 'pipedrive',
                name: 'Pipedrive',
                description: 'Sales pipeline management tool',
                icon: TrendingUp,
                bgColor: 'bg-purple-100',
                iconColor: 'text-purple-600',
                available: false
              },
              {
                id: 'dynamics365',
                name: 'Microsoft Dynamics 365',
                description: 'Enterprise CRM and ERP solution',
                icon: Cloud,
                bgColor: 'bg-blue-100',
                iconColor: 'text-blue-600',
                available: false
              }
            ]
              .filter((crm) => 
                crmSearchQuery === '' || 
                crm.name.toLowerCase().includes(crmSearchQuery.toLowerCase()) ||
                crm.description.toLowerCase().includes(crmSearchQuery.toLowerCase())
              )
              .map((crm) => {
                const IconComponent = crm.icon;
                return (
                  <button
                    key={crm.id}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                      crm.available
                        ? 'hover:border-primary hover:bg-accent cursor-pointer'
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (crm.available) {
                        setShowCRMSelectionModal(false);
                        setSelectedCRMToConnect(crm.id as 'salesforce' | 'hubspot');
                        setIsManageMode(false);
                        setIsAuthenticating(true);
                        
                        // Simulate OAuth authentication
                        setTimeout(() => {
                          setIsAuthenticating(false);
                          setShowCrmConnectModal(true);
                          toast.success(`${crm.name} authenticated successfully`);
                        }, 1500);
                      } else {
                        toast.info(`${crm.name} connection coming soon`);
                      }
                    }}
                    disabled={!crm.available}
                  >
                    <div className={`w-12 h-12 ${crm.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-6 h-6 ${crm.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm truncate">{crm.name}</h4>
                        {!crm.available && (
                          <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{crm.description}</p>
                    </div>
                    {crm.available && (
                      <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>

      {/* CRM Configuration Modal */}
      <Dialog open={showCrmConnectModal} onOpenChange={setShowCrmConnectModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure CRM Integration</DialogTitle>
            <DialogDescription>
              {isManageMode ? 'Update your CRM sync settings' : 'Connect your CRM and set up sync rules to streamline your sales workflow'}
            </DialogDescription>
          </DialogHeader>

          <CRMConfigModal 
            selectedCRM={selectedCRMToConnect} 
            isManageMode={isManageMode}
            onConnect={(crmType) => {
              if (onCRMConnect) {
                onCRMConnect(crmType);
              }
              setShowCrmConnectModal(false);
            }} 
            onCancel={() => setShowCrmConnectModal(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// CRM Configuration Modal Component
interface CRMConfigModalProps {
  selectedCRM: 'salesforce' | 'hubspot' | null;
  isManageMode: boolean;
  onConnect: (crmType: 'salesforce' | 'hubspot') => void;
  onCancel: () => void;
}

function CRMConfigModal({ selectedCRM: initialCRM, isManageMode, onConnect, onCancel }: CRMConfigModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const selectedCRM = initialCRM; // CRM is already selected from the outer interface
  const [config, setConfig] = useState({
    objectMapping: 'lead' as 'lead' | 'contact',
    recordOwnership: 'current-user' as 'current-user' | 'default-owner',
    defaultOwner: '',
    duplicateHandling: 'skip' as 'skip' | 'update'
  });

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    if (selectedCRM) {
      onConnect(selectedCRM);
      toast.success(`${selectedCRM === 'salesforce' ? 'Salesforce' : 'HubSpot'} ${isManageMode ? 'settings updated' : 'connected successfully'}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      {!isManageMode && (
        <div className="flex items-center justify-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            1
          </div>
          <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            2
          </div>
        </div>
      )}

      {/* Step 1: Set Sync Rules */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <h3>{isManageMode ? 'Sync Rules' : 'Step 1 of 2: Set Sync Rules'}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure how leads are synced to your CRM
            </p>
          </div>

          <div className="space-y-6">
            {/* Object Mapping */}
            <div className="space-y-3">
              <Label>When a Lead is synced from Distribute, create a new:</Label>
              <div className="space-y-2">
                <div 
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${config.objectMapping === 'lead' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                  onClick={() => setConfig({ ...config, objectMapping: 'lead' })}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${config.objectMapping === 'lead' ? 'border-primary' : 'border-muted-foreground'}`}>
                    {config.objectMapping === 'lead' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Lead (Recommended)</div>
                    <p className="text-sm text-muted-foreground">Best for new prospects entering your sales funnel</p>
                  </div>
                </div>
                <div 
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${config.objectMapping === 'contact' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                  onClick={() => setConfig({ ...config, objectMapping: 'contact' })}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${config.objectMapping === 'contact' ? 'border-primary' : 'border-muted-foreground'}`}>
                    {config.objectMapping === 'contact' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Contact</div>
                    <p className="text-sm text-muted-foreground">Use if your sales process doesn't use a Lead object</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Record Ownership */}
            <div className="space-y-3">
              <Label>Assign ownership of the new CRM record to:</Label>
              <Select 
                value={config.recordOwnership} 
                onValueChange={(value: any) => setConfig({ ...config, recordOwnership: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-user">The user who initiated the sync</SelectItem>
                  <SelectItem value="default-owner">A default owner</SelectItem>
                </SelectContent>
              </Select>
              {config.recordOwnership === 'default-owner' && (
                <Input 
                  placeholder="Search for a CRM user..." 
                  value={config.defaultOwner}
                  onChange={(e) => setConfig({ ...config, defaultOwner: e.target.value })}
                />
              )}
              <p className="text-sm text-muted-foreground">The owner will be responsible for follow-up in the CRM</p>
            </div>

            {/* Duplicate Handling */}
            <div className="space-y-3">
              <Label>If a record with the same email already exists in the CRM:</Label>
              <div className="space-y-2">
                <div 
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${config.duplicateHandling === 'skip' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                  onClick={() => setConfig({ ...config, duplicateHandling: 'skip' })}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${config.duplicateHandling === 'skip' ? 'border-primary' : 'border-muted-foreground'}`}>
                    {config.duplicateHandling === 'skip' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Do not sync and mark as an error (Recommended)</div>
                    <p className="text-sm text-muted-foreground">Prevents creating duplicate contacts</p>
                  </div>
                </div>
                <div 
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all opacity-50 ${config.duplicateHandling === 'update' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${config.duplicateHandling === 'update' ? 'border-primary' : 'border-muted-foreground'}`}>
                    {config.duplicateHandling === 'update' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Update the existing record (Coming soon)</div>
                    <p className="text-sm text-muted-foreground">Advanced option for V2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Map Data Fields */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <h3>Step 2 of 2: Map Data Fields</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Review and customize field mappings
            </p>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">Distribute v3 Field</th>
                  <th className="w-12"></th>
                  <th className="text-left p-3 font-medium">CRM Field</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3">
                    <div className="font-medium">Name</div>
                    <div className="text-sm text-muted-foreground">e.g., John Chen</div>
                  </td>
                  <td className="text-center text-muted-foreground">→</td>
                  <td className="p-3">
                    <Select defaultValue="name">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="full-name">Full Name</SelectItem>
                        <SelectItem value="display-name">Display Name</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
                <tr className="border-t bg-muted/30">
                  <td className="p-3">
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">e.g., john.chen@techcorp.com</div>
                  </td>
                  <td className="text-center text-muted-foreground">→</td>
                  <td className="p-3">
                    <Select defaultValue="email">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="primary-email">Primary Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">
                    <div className="font-medium">Company</div>
                    <div className="text-sm text-muted-foreground">e.g., TechCorp Solutions</div>
                  </td>
                  <td className="text-center text-muted-foreground">→</td>
                  <td className="p-3">
                    <Select defaultValue="company">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company">Company Name</SelectItem>
                        <SelectItem value="organization">Organization</SelectItem>
                        <SelectItem value="account">Account Name</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
                <tr className="border-t bg-muted/30">
                  <td className="p-3">
                    <div className="font-medium">Lead Score</div>
                    <div className="text-sm text-muted-foreground">e.g., 124</div>
                  </td>
                  <td className="text-center text-muted-foreground">→</td>
                  <td className="p-3">
                    <Select defaultValue="lead-score">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead-score">Lead Score (custom field)</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">
                    <div className="font-medium">Source</div>
                    <div className="text-sm text-muted-foreground">e.g., Exhibition</div>
                  </td>
                  <td className="text-center text-muted-foreground">→</td>
                  <td className="p-3">
                    <Select defaultValue="lead-source">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead-source">Lead Source</SelectItem>
                        <SelectItem value="origin">Origin</SelectItem>
                        <SelectItem value="channel">Channel</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
                <tr className="border-t bg-muted/30">
                  <td className="p-3">
                    <div className="font-medium">Link to Drop</div>
                    <div className="text-sm text-muted-foreground">Auto-generated context link</div>
                  </td>
                  <td className="text-center text-muted-foreground">→</td>
                  <td className="p-3">
                    <Select defaultValue="description">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="description">Description</SelectItem>
                        <SelectItem value="notes">Notes</SelectItem>
                        <SelectItem value="comments">Comments</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground">
            We've mapped the standard fields for you. The 'Link to Drop' will be added to the description so your sales team has full context.
          </p>
        </div>
      )}

      {/* Modal Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          {currentStep > 1 && (
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {currentStep < 2 ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button onClick={handleFinish}>
              {isManageMode ? 'Save Changes' : 'Save Configuration'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}