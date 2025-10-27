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
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { 
  Layout, 
  Eye, 
  Package, 
  MessageCircle, 
  Grid3x3,
  FileText,
  Download,
  HelpCircle,
  Plus,
  Save,
  Send,
  AlertTriangle,
  CheckCircle,
  Monitor,
  Smartphone,
  ChevronRight,
  Edit,
  Copy,
  Archive,
  Clock,
  User,
  TrendingUp,
  Info,
  DollarSign,
  Tag,
  Palette,
  Shield,
  Share2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type TemplateStatus = 'draft' | 'published' | 'deprecated';
type PriceMode = 'hidden' | 'range' | 'exact';
type SpecLevel = 'basic' | 'full';
type ThemeMode = 'auto' | 'light' | 'dark';
type Density = 'cozy' | 'compact';
type PreviewDevice = 'desktop' | 'mobile';

interface BlockPreset {
  type: string;
  enabled: boolean;
  order: number;
  params?: Record<string, any>;
}

interface DropSceneTemplate {
  id: string;
  name: string;
  version: string;
  status: TemplateStatus;
  layout: {
    blocks: BlockPreset[];
  };
  data: {
    price_mode: PriceMode;
    spec_level: SpecLevel;
    show_fields: {
      moq: boolean;
      lead_time: boolean;
      origin: boolean;
    };
    faq_kb_id?: string;
    resources_enabled: boolean;
  };
  style: {
    theme: ThemeMode;
    density: Density;
  };
  auth_preset_id?: string;
  ab_variants?: {
    enabled: boolean;
    ratio?: number;
  };
  i18n: {
    locales: string[];
    default_locale: string;
  };
  publish_note?: string;
  created_by: string;
  created_at: string;
  last_edited: string;
  usage_count: number;
}

const BLOCK_TYPES = {
  hero: { label: 'Hero', icon: Layout },
  product_grid: { label: 'Product Grid', icon: Grid3x3 },
  case_list: { label: 'Case List', icon: FileText },
  credentials: { label: 'Credentials', icon: CheckCircle },
  mini_form: { label: 'Mini Form', icon: MessageCircle },
  contact_bar: { label: 'Contact Bar', icon: MessageCircle },
  resource_list: { label: 'Resource List', icon: Download },
  faq: { label: 'FAQ', icon: HelpCircle },
  disclaimer: { label: 'Disclaimer', icon: AlertTriangle },
  changelog: { label: 'Changelog', icon: Clock }
};

// Theme configurations for visual differentiation
const TEMPLATE_THEMES = {
  'simple-catalog': {
    name: '展会型产品目录 (Simple Catalog)',
    stage: 'Discovery / Events',
    intent: 'Broad, scannable browsing at booths or cold outreach; easy lead capture',
    accent: 'blue',
    accentColor: 'text-blue-600',
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-200',
    cardBg: 'bg-blue-50 dark:bg-blue-950/20',
    radius: 'rounded-2xl',
    shadow: 'shadow-lg',
    density: 'comfortable'
  },
  'catalog-quote': {
    name: '简单报价 (Light Quote)',
    stage: 'Follow-up / Quote Intent',
    intent: 'Quick shortlisting + quote intent; no heavy pricing engine',
    accent: 'indigo',
    accentColor: 'text-indigo-600',
    bgColor: 'bg-indigo-500',
    borderColor: 'border-indigo-200',
    cardBg: 'bg-indigo-50 dark:bg-indigo-950/20',
    radius: 'rounded-xl',
    shadow: 'shadow-sm',
    density: 'compact'
  },
  'spec-doc': {
    name: '产品信息更新 (Updates)',
    stage: 'Post-sale / Re-engagement',
    intent: 'Send periodic, purchase-relevant updates that drive re-orders, samples, or spec changes',
    accent: 'emerald',
    accentColor: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-200',
    cardBg: 'bg-emerald-50 dark:bg-emerald-950/20',
    radius: 'rounded-lg',
    shadow: 'shadow-md',
    density: 'reading'
  },
  'conversation-starter': {
    name: '独立站嵌入式 (Embed Page)',
    stage: 'Site Conversion',
    intent: 'Drop-in page section for independent sites; light interaction, quick lead capture + FAQ',
    accent: 'amber',
    accentColor: 'text-amber-600',
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-200',
    cardBg: 'bg-amber-50 dark:bg-amber-950/20',
    radius: 'rounded-3xl',
    shadow: 'shadow-xl',
    density: 'airy'
  }
};

const mockTemplates: DropSceneTemplate[] = [
  {
    id: '1',
    name: '展会型产品目录 (Simple Catalog)',
    version: '1.2.0',
    status: 'published',
    layout: {
      blocks: [
        { type: 'hero', enabled: true, order: 1 },
        { type: 'product_grid', enabled: true, order: 2, params: { mode: 'light', columns: '3/2' } },
        { type: 'case_list', enabled: true, order: 3 },
        { type: 'credentials', enabled: true, order: 4, params: { collapsible: true } },
        { type: 'mini_form', enabled: true, order: 5, params: { fields: 3 } },
        { type: 'contact_bar', enabled: true, order: 6 },
        { type: 'resource_list', enabled: false, order: 7, params: { preview_only: true } }
      ]
    },
    data: {
      price_mode: 'range',
      spec_level: 'basic',
      show_fields: {
        moq: true,
        lead_time: true,
        origin: false
      },
      faq_kb_id: undefined,
      resources_enabled: false
    },
    style: {
      theme: 'auto',
      density: 'cozy'
    },
    auth_preset_id: 'auth_gated_lead_capture',
    ab_variants: {
      enabled: false
    },
    i18n: {
      locales: ['en-US', 'zh-CN'],
      default_locale: 'en-US'
    },
    created_by: 'System',
    created_at: '2 weeks ago',
    last_edited: '3 days ago',
    usage_count: 127
  },
  {
    id: '2',
    name: '简单报价 (Light Quote)',
    version: '2.1.0',
    status: 'published',
    layout: {
      blocks: [
        { type: 'hero', enabled: true, order: 1, params: { with_validity: true } },
        { type: 'product_grid', enabled: true, order: 2, params: { mode: 'quote', selectable: true } },
        { type: 'mini_form', enabled: false, order: 3 },
        { type: 'faq', enabled: true, order: 4 },
        { type: 'disclaimer', enabled: true, order: 5 }
      ]
    },
    data: {
      price_mode: 'range',
      spec_level: 'basic',
      show_fields: {
        moq: true,
        lead_time: true,
        origin: false
      },
      faq_kb_id: 'kb_faq_quote',
      resources_enabled: false
    },
    style: {
      theme: 'auto',
      density: 'compact'
    },
    auth_preset_id: 'auth_private_quote',
    ab_variants: {
      enabled: false
    },
    i18n: {
      locales: ['en-US', 'zh-CN'],
      default_locale: 'en-US'
    },
    publish_note: 'Refine quote grid and tighten density',
    created_by: 'Admin',
    created_at: '4 weeks ago',
    last_edited: '1 day ago',
    usage_count: 89
  },
  {
    id: '3',
    name: '产品信息更新 (Updates)',
    version: '1.0.0',
    status: 'published',
    layout: {
      blocks: [
        { type: 'hero', enabled: true, order: 1, params: { show_customer: true } },
        { type: 'changelog', enabled: true, order: 1, params: { last: 5, highlight_changes: true } },
        { type: 'resource_list', enabled: true, order: 2 },
        { type: 'faq', enabled: true, order: 3, params: { searchable: true } },
        { type: 'mini_form', enabled: true, order: 4, params: { questions: 2 } },
        { type: 'contact_bar', enabled: true, order: 5 }
      ]
    },
    data: {
      price_mode: 'hidden',
      spec_level: 'basic',
      show_fields: {
        moq: false,
        lead_time: false,
        origin: false
      },
      faq_kb_id: 'kb_faq_public',
      resources_enabled: true
    },
    style: {
      theme: 'auto',
      density: 'cozy'
    },
    auth_preset_id: 'auth_public_promo',
    ab_variants: {
      enabled: false
    },
    i18n: {
      locales: ['en-US'],
      default_locale: 'en-US'
    },
    created_by: 'System',
    created_at: '1 week ago',
    last_edited: '2 days ago',
    usage_count: 34
  },
  {
    id: '4',
    name: '独立站嵌入式 (Embed Page)',
    version: '1.1.0',
    status: 'published',
    layout: {
      blocks: [
        { type: 'hero', enabled: true, order: 1, params: { minimal: true } },
        { type: 'product_grid', enabled: true, order: 2, params: { mode: 'mini', count: 3 } },
        { type: 'mini_form', enabled: true, order: 3, params: { fields: 2 } },
        { type: 'faq', enabled: true, order: 4, params: { count: 5, accordion: true } },
        { type: 'contact_bar', enabled: true, order: 5 }
      ]
    },
    data: {
      price_mode: 'range',
      spec_level: 'basic',
      show_fields: {
        moq: false,
        lead_time: false,
        origin: false
      },
      faq_kb_id: 'kb_faq_embed',
      resources_enabled: true
    },
    style: {
      theme: 'light',
      density: 'cozy'
    },
    auth_preset_id: 'auth_public_embed',
    ab_variants: {
      enabled: false
    },
    i18n: {
      locales: ['en-US', 'zh-CN'],
      default_locale: 'en-US'
    },
    created_by: 'System',
    created_at: '5 days ago',
    last_edited: '1 day ago',
    usage_count: 56
  }
];

export function DropSceneTemplates() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>('1');
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [isEditing, setIsEditing] = useState(false);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  
  const getTemplateTheme = (templateName: string) => {
    if (templateName.includes('Simple Catalog')) return TEMPLATE_THEMES['simple-catalog'];
    if (templateName.includes('Light Quote')) return TEMPLATE_THEMES['catalog-quote'];
    if (templateName.includes('Updates')) return TEMPLATE_THEMES['spec-doc'];
    if (templateName.includes('Embed')) return TEMPLATE_THEMES['conversation-starter'];
    return TEMPLATE_THEMES['simple-catalog'];
  };

  const getStatusColor = (status: TemplateStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'deprecated':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  const getValidationIssues = (template: DropSceneTemplate) => {
    const issues: Array<{ type: 'error' | 'warning'; message: string }> = [];

    // Check if FAQ is enabled but no KB ID
    const faqBlock = template.layout.blocks.find(b => b.type === 'faq' && b.enabled);
    if (faqBlock && !template.data.faq_kb_id) {
      issues.push({
        type: 'error',
        message: 'FAQ enabled but no knowledge base ID specified'
      });
    }

    // Check if exact price mode with non-private auth
    if (template.data.price_mode === 'exact' && template.auth_preset_id !== 'auth_private_quote') {
      issues.push({
        type: 'error',
        message: 'Exact price mode requires private/whitelist auth preset'
      });
    }

    // Check resources enabled without download verification
    if (template.data.resources_enabled && template.auth_preset_id === 'auth_public_promo') {
      issues.push({
        type: 'warning',
        message: 'Resources enabled but auth preset does not enforce "verify before download"'
      });
    }

    // Price mode warning for expo
    if (template.data.price_mode === 'exact' && template.name.toLowerCase().includes('expo')) {
      issues.push({
        type: 'warning',
        message: 'Consider using "range" for expo traffic instead of exact pricing'
      });
    }

    return issues;
  };

  const handlePublish = (templateId: string, publishNote: string) => {
    setTemplates(prev => 
      prev.map(t => 
        t.id === templateId 
          ? { ...t, status: 'published' as TemplateStatus, publish_note: publishNote }
          : t
      )
    );
    toast.success('Template published successfully');
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved');
  };

  if (!selectedTemplate) {
    return <div>Select a template</div>;
  }

  const validationIssues = getValidationIssues(selectedTemplate);
  const hasErrors = validationIssues.some(i => i.type === 'error');
  const currentTheme = getTemplateTheme(selectedTemplate.name);

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
      {/* Left: Template List */}
      <div className="col-span-3 space-y-4">
        <div className="flex items-center justify-between">
          <h3>Templates</h3>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="space-y-2">
            {templates.map((template) => {
              const theme = getTemplateTheme(template.name);
              return (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplateId === template.id
                      ? `border-${theme.accent}-500 ring-2 ring-${theme.accent}-500/20`
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedTemplateId(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${theme.bgColor}`} />
                            <h4 className="text-sm">{template.name}</h4>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                              v{template.version}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(template.status)}`}>
                              {template.status}
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {template.usage_count} drops • {template.last_edited}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Middle: Template Editor */}
      <div className="col-span-5">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            {/* Info Banner */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Changes affect <strong>newly created Drops only</strong>. Historical Drops keep their original template version.
              </AlertDescription>
            </Alert>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2>{selectedTemplate.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">v{selectedTemplate.version}</Badge>
                  <Badge className={getStatusColor(selectedTemplate.status)}>
                    {selectedTemplate.status}
                  </Badge>
                  <Badge variant="outline" className={currentTheme.accentColor}>
                    {currentTheme.stage}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button 
                  size="sm" 
                  disabled={hasErrors}
                  onClick={() => {
                    const note = prompt('Publish note (required):');
                    if (note) handlePublish(selectedTemplate.id, note);
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Publish
                </Button>
              </div>
            </div>

            {/* Template Intent */}
            <Card className={`${currentTheme.cardBg} border-2 ${currentTheme.borderColor}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className={`w-5 h-5 ${currentTheme.accentColor} flex-shrink-0 mt-0.5`} />
                  <div>
                    <h4 className="mb-1">Template Intent</h4>
                    <p className="text-sm text-muted-foreground">{currentTheme.intent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Validation Issues */}
            {validationIssues.length > 0 && (
              <Alert variant={hasErrors ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    {validationIssues.map((issue, i) => (
                      <div key={i} className="text-sm">
                        {issue.type === 'error' ? '❌' : '⚠️'} {issue.message}
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Layout & Blocks */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  <CardTitle>Layout & Blocks</CardTitle>
                </div>
                <CardDescription>
                  Configure default block composition and order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedTemplate.layout.blocks
                  .sort((a, b) => a.order - b.order)
                  .map((block) => {
                    const blockInfo = BLOCK_TYPES[block.type as keyof typeof BLOCK_TYPES];
                    const BlockIcon = blockInfo?.icon || Package;
                    
                    return (
                      <div
                        key={block.type}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-muted-foreground text-sm">{block.order}</div>
                          <BlockIcon className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm">{blockInfo?.label || block.type}</div>
                            {block.params && (
                              <div className="text-xs text-muted-foreground">
                                {Object.entries(block.params).map(([k, v]) => `${k}: ${v}`).join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                        <Switch checked={block.enabled} disabled />
                      </div>
                    );
                  })}
              </CardContent>
            </Card>

            {/* Data Mapping */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <CardTitle>Data Mapping</CardTitle>
                </div>
                <CardDescription>
                  Field exposure and data presentation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price Mode */}
                <div className="space-y-2">
                  <Label>Price Mode</Label>
                  <Select value={selectedTemplate.data.price_mode} disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hidden">Hidden</SelectItem>
                      <SelectItem value="range">Range</SelectItem>
                      <SelectItem value="exact">Exact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Spec Level */}
                <div className="space-y-2">
                  <Label>Spec Level</Label>
                  <Select value={selectedTemplate.data.spec_level} disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Show Fields */}
                <div className="space-y-3">
                  <Label>Visible Fields</Label>
                  {Object.entries(selectedTemplate.data.show_fields).map(([field, visible]) => (
                    <div key={field} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{field.replace('_', ' ')}</span>
                      <Switch checked={visible} disabled />
                    </div>
                  ))}
                </div>

                {/* FAQ KB ID */}
                <div className="space-y-2">
                  <Label>FAQ Knowledge Base ID</Label>
                  <Input
                    value={selectedTemplate.data.faq_kb_id || ''}
                    placeholder="e.g., kb_faq_quote"
                    disabled
                  />
                </div>

                {/* Resources Enabled */}
                <div className="flex items-center justify-between">
                  <Label>Resources Enabled</Label>
                  <Switch checked={selectedTemplate.data.resources_enabled} disabled />
                </div>
              </CardContent>
            </Card>

            {/* Style & Branding */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  <CardTitle>Style & Branding</CardTitle>
                </div>
                <CardDescription>
                  Theme, density, and visual styling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={selectedTemplate.style.theme} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Density</Label>
                    <Select value={selectedTemplate.style.density} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cozy">Cozy</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Visual Tokens */}
                <div className="pt-4 border-t space-y-3">
                  <h4 className="text-sm">Visual Tokens</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-2">Accent Color</div>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${currentTheme.bgColor}`} />
                        <span className="text-sm capitalize">{currentTheme.accent}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-2">Border Radius</div>
                      <div className="text-sm">{currentTheme.radius}</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-2">Shadow</div>
                      <div className="text-sm">{currentTheme.shadow}</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-2">Density</div>
                      <div className="text-sm capitalize">{currentTheme.density}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTAs Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  <CardTitle>Call-to-Actions</CardTitle>
                </div>
                <CardDescription>
                  Primary and secondary CTAs for this template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(() => {
                  const ctas = selectedTemplate.name.includes('Simple Catalog')
                    ? { primary: 'Contact Sales', secondary: 'Save for Later' }
                    : selectedTemplate.name.includes('Light Quote')
                    ? { primary: 'Request Quote', secondary: 'Talk to Sales' }
                    : selectedTemplate.name.includes('Updates')
                    ? { primary: 'Acknowledge', secondary: 'Request Sample' }
                    : { primary: 'Book a Call', secondary: 'Download Brochure' };
                  
                  return (
                    <>
                      <div className={`p-3 ${currentTheme.cardBg} border ${currentTheme.borderColor} ${currentTheme.radius}`}>
                        <div className="text-xs text-muted-foreground mb-1">Primary CTA</div>
                        <div className={`text-sm ${currentTheme.accentColor}`}>{ctas.primary}</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Secondary CTA</div>
                        <div className="text-sm">{ctas.secondary}</div>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Default Channels */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  <CardTitle>Recommended Channels</CardTitle>
                </div>
                <CardDescription>
                  Best distribution channels for this template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const channels = selectedTemplate.name.includes('Simple Catalog')
                      ? ['QR Code', 'Email Link', 'WhatsApp']
                      : selectedTemplate.name.includes('Light Quote')
                      ? ['Email Follow-up', 'Account Manager Links']
                      : selectedTemplate.name.includes('Updates')
                      ? ['Email (Scheduled)', 'In-app Link', 'QR for Service']
                      : ['Embed Script', 'Email', 'QR Onsite'];
                    
                    return channels.map((channel) => (
                      <Badge key={channel} variant="outline" className="text-xs">
                        {channel}
                      </Badge>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Auth Binding */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <CardTitle>Auth Binding (Reference)</CardTitle>
                </div>
                <CardDescription>
                  Default Auth preset for this template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm">{selectedTemplate.auth_preset_id || 'None'}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Referenced from Settings → Auth Presets
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracked Signals */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <CardTitle>Tracked Signals</CardTitle>
                </div>
                <CardDescription>
                  Standardized events tracked across all instances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    // Define signals based on template type
                    const signals = selectedTemplate.name.includes('Simple Catalog')
                      ? ['view_start', 'dwell_10s', 'item_view', 'cta_contact', 'cta_save', 'share_click', 'identify_success']
                      : selectedTemplate.name.includes('Light Quote')
                      ? ['item_select', 'cta_request_quote', 'quote_sum_view', 'cta_contact', 'identify_success']
                      : selectedTemplate.name.includes('Updates')
                      ? ['update_ack', 'update_interest', 'download_attempt', 'cta_sample_request', 'identify_success']
                      : ['quick_action_click', 'faq_expand', 'form_submit', 'download_attempt', 'identify_success'];
                    
                    return signals.map((signal) => (
                      <Badge 
                        key={signal} 
                        variant="secondary" 
                        className={`font-mono text-xs ${currentTheme.accentColor}`}
                      >
                        {signal}
                      </Badge>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Audit Info */}
            <Card className="bg-muted/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created by</span>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span className="text-sm">{selectedTemplate.created_by}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">{selectedTemplate.created_at}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last edited</span>
                  <span className="text-sm">{selectedTemplate.last_edited}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Usage</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-sm">{selectedTemplate.usage_count} drops</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedTemplate.publish_note && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <div className="text-sm font-medium mb-1">Last Publish Note</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedTemplate.publish_note}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right: Live Preview */}
      <div className="col-span-4">
        <div className="sticky top-6 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Live Preview</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPreviewDevice('desktop')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPreviewDevice('mobile')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className={`overflow-hidden ${currentTheme.borderColor} border-2`}>
            <CardContent className="p-0">
              <div
                className={`${currentTheme.cardBg} transition-all ${
                  previewDevice === 'mobile' ? 'max-w-[375px] mx-auto' : 'w-full'
                }`}
                style={{ minHeight: '600px' }}
              >
                <div className={`p-6 space-y-${currentTheme.density === 'compact' ? '3' : currentTheme.density === 'airy' ? '6' : '4'}`}>
                  {/* Preview Header */}
                  <div className={`text-center pb-4 border-b ${currentTheme.borderColor}`}>
                    <h3>Sample Product Catalog</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Template: {selectedTemplate.name}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Badge variant="outline" className={currentTheme.accentColor}>
                        {currentTheme.accent} theme
                      </Badge>
                      <Badge variant="outline">
                        {currentTheme.density}
                      </Badge>
                    </div>
                  </div>

                  {/* Simulated Blocks */}
                  {selectedTemplate.layout.blocks
                    .filter(b => b.enabled)
                    .sort((a, b) => a.order - b.order)
                    .map((block) => (
                      <div
                        key={block.type}
                        className={`p-4 bg-background/50 border ${currentTheme.borderColor} ${currentTheme.radius} ${currentTheme.shadow}`}
                      >
                        <div className={`text-xs ${currentTheme.accentColor} mb-2 uppercase tracking-wide`}>
                          {BLOCK_TYPES[block.type as keyof typeof BLOCK_TYPES]?.label || block.type}
                        </div>
                        {block.type === 'product_grid' && (
                          <div className={`grid gap-${selectedTemplate.style.density === 'compact' ? '2' : '3'} grid-cols-${previewDevice === 'mobile' ? '2' : block.params?.columns === '3/2' ? '3' : '2'}`}>
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="space-y-2">
                                <div className={`aspect-square bg-muted ${currentTheme.radius}`} />
                                <div className="text-xs">Product {i}</div>
                                {selectedTemplate.data.price_mode !== 'hidden' && (
                                  <div className={`text-xs ${currentTheme.accentColor}`}>
                                    {selectedTemplate.data.price_mode === 'range' ? '$50-$100' : '$75'}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {block.type === 'mini_form' && (
                          <div className="space-y-2">
                            <Input placeholder="Name" className="text-sm" />
                            <Input placeholder="Email" className="text-sm" />
                            {block.params?.fields === 3 && (
                              <Input placeholder="Company" className="text-sm" />
                            )}
                          </div>
                        )}
                        {block.type === 'faq' && (
                          <div className="space-y-2">
                            <div className={`p-2 bg-muted/50 ${currentTheme.radius} text-xs`}>
                              Q: What is the MOQ?
                            </div>
                            <div className={`p-2 bg-muted/50 ${currentTheme.radius} text-xs`}>
                              Q: What is the lead time?
                            </div>
                          </div>
                        )}
                        {block.type === 'changelog' && (
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className={`p-3 bg-muted/50 ${currentTheme.radius} text-xs`}>
                                <div className={`${currentTheme.accentColor} mb-1`}>Update #{i}</div>
                                <div className="text-muted-foreground">Product specifications updated</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Metrics */}
          <Card className="bg-muted/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Template Metrics (KPIs)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Open Rate</span>
                  <span>78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Form Complete Rate</span>
                  <span>45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Intent Commit Rate</span>
                  <span>32%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resource Downloads</span>
                  <span>156</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
