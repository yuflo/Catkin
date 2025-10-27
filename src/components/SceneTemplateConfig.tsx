import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { 
  ChevronLeft, 
  Layout, 
  Layers, 
  FileText, 
  MessageSquare,
  Mail,
  QrCode,
  Code2,
  Target,
  Activity,
  Save,
  Bookmark,
  Send,
  Monitor,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Grid3x3,
  Image as ImageIcon,
  Tag,
  Filter,
  Package,
  MessageCircle,
  Phone,
  FileDown,
  List,
  LayoutGrid,
  Info,
  Sparkles
} from 'lucide-react';

type TemplateType = 'simple-catalog' | 'catalog-quote' | 'spec-doc' | 'conversation-starter';
type ChannelType = 'email' | 'link' | 'qr' | 'embed';
type CTAction = 'contact-sales' | 'request-quote' | 'request-details' | 'book-call' | 'open-form' | 'download-guarded';
type PreviewDevice = 'desktop' | 'mobile';

interface SceneTemplateConfigProps {
  templateType: TemplateType;
  onNavigate?: (view: string) => void;
  context?: 'composer' | 'settings';
}

interface CommonSettings {
  primaryChannel: ChannelType;
  primaryCTA: { action: CTAction; label: string };
  secondaryCTAs: Array<{ action: CTAction; label: string }>;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

interface SimpleCatalogSettings {
  gridDensity: 'comfortable' | 'compact';
  columnsDesktop: number;
  columnsMobile: number;
  showImage: boolean;
  showName: boolean;
  showSKU: boolean;
  showPrice: boolean;
  showDescription: boolean;
  showTags: boolean;
  sortOrder: 'featured' | 'price-asc' | 'newest';
  enableFilters: boolean;
  microCTAs: string[];
  showTotalItems: boolean;
}

interface CatalogQuoteSettings {
  enableQuantity: boolean;
  showSummary: boolean;
  showSubtotals: boolean;
  enableNotes: boolean;
  notesPlaceholder: string;
  minSelections: number;
  quoteCTALabel: string;
  disclaimerText: string;
}

interface SpecDocSettings {
  enableKeySpecs: boolean;
  enableCompliance: boolean;
  enableMaterials: boolean;
  enableVariants: boolean;
  enableFAQ: boolean;
  enableAttachments: boolean;
  heroType: 'image' | 'gallery';
  attachmentPolicy: 'download-guarded' | 'view-only';
  showTOC: boolean;
  brandHeader: 'minimal' | 'detailed';
  inSectionCTAs: string[];
}

interface ConversationStarterSettings {
  welcomeText: string;
  suggestedPrompts: string[];
  quickActions: Array<{ id: string; label: string }>;
  maxMessageLength: number;
  enableLeadForm: boolean;
  showEscalation: boolean;
}

const TEMPLATE_CONFIG = {
  'simple-catalog': {
    name: 'Simple Catalog',
    icon: Layout,
    bgColor: 'bg-blue-500',
    description: 'Quick browse + soft intent capture',
    stage: 'Discovery / Trade Show'
  },
  'catalog-quote': {
    name: 'Catalog + Quote',
    icon: Layers,
    bgColor: 'bg-purple-500',
    description: 'Let buyers tick items and send a quote request',
    stage: 'Follow-up / Inbound'
  },
  'spec-doc': {
    name: 'Spec Doc',
    icon: FileText,
    bgColor: 'bg-emerald-500',
    description: 'Document-like explainer with attachments',
    stage: 'Technical buyers'
  },
  'conversation-starter': {
    name: 'Conversation Starter',
    icon: MessageSquare,
    bgColor: 'bg-orange-500',
    description: 'Collect requirements via trackable interaction',
    stage: 'Embed / Open inquiry'
  }
};

export function SceneTemplateConfig({ templateType, onNavigate, context = 'composer' }: SceneTemplateConfigProps) {
  const [advancedMode, setAdvancedMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [showValidation, setShowValidation] = useState(true);

  // Common settings state
  const [commonSettings, setCommonSettings] = useState<CommonSettings>({
    primaryChannel: 'email',
    primaryCTA: { action: 'contact-sales', label: 'Contact Sales' },
    secondaryCTAs: [],
    utmSource: '',
    utmMedium: '',
    utmCampaign: ''
  });

  // Template-specific settings
  const [catalogSettings, setCatalogSettings] = useState<SimpleCatalogSettings>({
    gridDensity: 'comfortable',
    columnsDesktop: 3,
    columnsMobile: 2,
    showImage: true,
    showName: true,
    showSKU: true,
    showPrice: true,
    showDescription: true,
    showTags: true,
    sortOrder: 'featured',
    enableFilters: false,
    microCTAs: ['view', 'save'],
    showTotalItems: true
  });

  const [quoteSettings, setQuoteSettings] = useState<CatalogQuoteSettings>({
    enableQuantity: false,
    showSummary: true,
    showSubtotals: false,
    enableNotes: true,
    notesPlaceholder: 'Add any special requirements or questions...',
    minSelections: 1,
    quoteCTALabel: 'Request Quote',
    disclaimerText: 'MOQ and lead times vary by product'
  });

  const [specSettings, setSpecSettings] = useState<SpecDocSettings>({
    enableKeySpecs: true,
    enableCompliance: true,
    enableMaterials: false,
    enableVariants: false,
    enableFAQ: false,
    enableAttachments: true,
    heroType: 'image',
    attachmentPolicy: 'download-guarded',
    showTOC: true,
    brandHeader: 'minimal',
    inSectionCTAs: ['request-sample', 'request-quote']
  });

  const [conversationSettings, setConversationSettings] = useState<ConversationStarterSettings>({
    welcomeText: 'Hi! How can we help with your requirements?',
    suggestedPrompts: ['I need a quote', 'Tell me about your products', 'Schedule a demo'],
    quickActions: [
      { id: 'book-call', label: 'Book Call' },
      { id: 'requirements-form', label: 'Requirements Form' }
    ],
    maxMessageLength: 500,
    enableLeadForm: false,
    showEscalation: true
  });

  const config = TEMPLATE_CONFIG[templateType];
  const IconComponent = config.icon;

  const getValidationIssues = () => {
    const issues: Array<{ type: 'error' | 'warning'; message: string }> = [];

    // Check primary CTA
    if (!commonSettings.primaryCTA.label) {
      issues.push({ type: 'error', message: 'Primary CTA label is required' });
    }

    // Template-specific validations
    if (templateType === 'simple-catalog') {
      if (!catalogSettings.showName && !catalogSettings.showImage) {
        issues.push({ type: 'error', message: 'At least Name or Image must be visible' });
      }
      if (catalogSettings.microCTAs.length === 0) {
        issues.push({ type: 'warning', message: 'No micro-CTAs enabled - consider adding View or Save' });
      }
    }

    if (templateType === 'catalog-quote') {
      if (quoteSettings.minSelections > 0 && !quoteSettings.quoteCTALabel) {
        issues.push({ type: 'error', message: 'Quote CTA label is required' });
      }
    }

    if (templateType === 'spec-doc') {
      const sectionsEnabled = [
        specSettings.enableKeySpecs,
        specSettings.enableCompliance,
        specSettings.enableMaterials,
        specSettings.enableVariants,
        specSettings.enableFAQ,
        specSettings.enableAttachments
      ].filter(Boolean).length;

      if (sectionsEnabled === 0) {
        issues.push({ type: 'error', message: 'At least one section must be enabled' });
      }

      if (specSettings.inSectionCTAs.length === 0) {
        issues.push({ type: 'error', message: 'At least one in-section CTA is required' });
      }
    }

    if (templateType === 'conversation-starter') {
      if (conversationSettings.quickActions.length === 0 && !commonSettings.primaryCTA.label) {
        issues.push({ type: 'error', message: 'At least one Quick Action or Primary CTA is required' });
      }
    }

    return issues;
  };

  const validationIssues = getValidationIssues();
  const hasErrors = validationIssues.some(issue => issue.type === 'error');

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => onNavigate?.('overview')} className="cursor-pointer">
              Distribute
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {context === 'settings' ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => onNavigate?.('settings')} className="cursor-pointer">
                  Settings
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => onNavigate?.('settings')} className="cursor-pointer">
                  Drop Scene Templates
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          ) : (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => onNavigate?.('drops')} className="cursor-pointer">
                  Drops
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => onNavigate?.('create-drop')} className="cursor-pointer">
                  Create
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{config.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onNavigate?.(context === 'settings' ? 'settings' : 'create-drop')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1>{config.name}</h1>
                <Badge variant="outline">{config.stage}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Draft</Badge>
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="outline" size="sm">
            <Bookmark className="w-4 h-4 mr-2" />
            Save as Preset
          </Button>
          <Button size="sm" disabled={hasErrors}>
            <Send className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <Switch 
            checked={advancedMode} 
            onCheckedChange={setAdvancedMode}
            id="advanced-mode"
          />
          <Label htmlFor="advanced-mode" className="cursor-pointer">
            Show Advanced Controls
          </Label>
        </div>
        <div className="text-sm text-muted-foreground">
          {advancedMode ? 'All options visible' : 'Quick mode - essential settings only'}
        </div>
      </div>

      {/* Two-pane Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Configuration Form */}
        <div className="col-span-7 space-y-6">
          {!advancedMode ? (
            /* Quick Mode */
            <Card>
              <CardHeader>
                <CardTitle>Quick Setup</CardTitle>
                <CardDescription>5 essential picks to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Auth Level */}
                <div className="space-y-2">
                  <Label>Access Level</Label>
                  <Select 
                    value={commonSettings.authLevel}
                    onValueChange={(value: AuthLevel) => 
                      setCommonSettings(prev => ({ ...prev, authLevel: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L1">L1 - Open (Pre-verify)</SelectItem>
                      <SelectItem value="L2">L2 - Standard (Email gate)</SelectItem>
                      <SelectItem value="L3">L3 - Protected (Email + code/SSO)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Primary Channel */}
                <div className="space-y-2">
                  <Label>Primary Channel</Label>
                  <Select 
                    value={commonSettings.primaryChannel}
                    onValueChange={(value: ChannelType) => 
                      setCommonSettings(prev => ({ ...prev, primaryChannel: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="link">Direct Link</SelectItem>
                      <SelectItem value="qr">QR Code</SelectItem>
                      <SelectItem value="embed">Embed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Primary CTA */}
                <div className="space-y-2">
                  <Label>Primary CTA</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select 
                      value={commonSettings.primaryCTA.action}
                      onValueChange={(value: CTAction) => 
                        setCommonSettings(prev => ({ 
                          ...prev, 
                          primaryCTA: { ...prev.primaryCTA, action: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contact-sales">Contact Sales</SelectItem>
                        <SelectItem value="request-quote">Request Quote</SelectItem>
                        <SelectItem value="request-details">Request Details</SelectItem>
                        <SelectItem value="book-call">Book Call</SelectItem>
                        <SelectItem value="open-form">Open Form</SelectItem>
                        <SelectItem value="download-guarded">Download</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      placeholder="Button label"
                      value={commonSettings.primaryCTA.label}
                      onChange={(e) => 
                        setCommonSettings(prev => ({ 
                          ...prev, 
                          primaryCTA: { ...prev.primaryCTA, label: e.target.value }
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Payload Summary */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Selected Payload</div>
                      <div>12 items selected</div>
                    </div>
                    <Button variant="outline" size="sm">Change Payload</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Advanced Mode - Accordion */
            <Accordion type="multiple" defaultValue={['channels', 'scene-specific']} className="space-y-4">
              {/* Channels */}
              <AccordionItem value="channels">
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div className="text-left">
                        <h3>Channels (Default Delivery)</h3>
                        <p className="text-sm text-muted-foreground">
                          Email, QR, embed settings and UTM
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-4">
                      <Tabs defaultValue={commonSettings.primaryChannel}>
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="email">
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </TabsTrigger>
                          <TabsTrigger value="link">
                            <Code2 className="w-4 h-4 mr-2" />
                            Link
                          </TabsTrigger>
                          <TabsTrigger value="qr">
                            <QrCode className="w-4 h-4 mr-2" />
                            QR
                          </TabsTrigger>
                          <TabsTrigger value="embed">
                            <Code2 className="w-4 h-4 mr-2" />
                            Embed
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="email" className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label>Subject Line</Label>
                            <Input placeholder="Your products from {company_name}" />
                          </div>
                          <div className="space-y-2">
                            <Label>Intro Body</Label>
                            <Textarea 
                              placeholder="Hi {recipient}, here's the catalog you requested..." 
                              rows={3}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Signature</Label>
                            <Input placeholder="Best regards, Sales Team" />
                          </div>
                        </TabsContent>
                        <TabsContent value="qr" className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label>Footer Label</Label>
                            <Input placeholder="Scan to view catalog" />
                          </div>
                          <div className="space-y-2">
                            <Label>QR Color</Label>
                            <Select defaultValue="black">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="black">Black</SelectItem>
                                <SelectItem value="blue">Blue</SelectItem>
                                <SelectItem value="brand">Brand Color</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TabsContent>
                        <TabsContent value="embed" className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label>Container Size</Label>
                            <Select defaultValue="M">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="S">Small (600px)</SelectItem>
                                <SelectItem value="M">Medium (900px)</SelectItem>
                                <SelectItem value="L">Large (1200px)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Show Header</Label>
                            <Switch defaultChecked />
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      <Separator className="my-6" />
                      
                      {/* UTM Parameters */}
                      <div className="space-y-4">
                        <h4>UTM Parameters</h4>
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label>utm_source</Label>
                            <Input 
                              placeholder="e.g., email, expo, website"
                              value={commonSettings.utmSource}
                              onChange={(e) => setCommonSettings(prev => ({ 
                                ...prev, 
                                utmSource: e.target.value 
                              }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>utm_medium</Label>
                            <Input 
                              placeholder="e.g., direct, qr, embed"
                              value={commonSettings.utmMedium}
                              onChange={(e) => setCommonSettings(prev => ({ 
                                ...prev, 
                                utmMedium: e.target.value 
                              }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>utm_campaign</Label>
                            <Input 
                              placeholder="e.g., spring-2025, tradeshow-q2"
                              value={commonSettings.utmCampaign}
                              onChange={(e) => setCommonSettings(prev => ({ 
                                ...prev, 
                                utmCampaign: e.target.value 
                              }))}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>

              {/* CTAs */}
              <AccordionItem value="ctas">
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-muted-foreground" />
                      <div className="text-left">
                        <h3>CTAs (Global)</h3>
                        <p className="text-sm text-muted-foreground">
                          Primary and secondary call-to-actions
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="space-y-6 pt-4">
                      {/* Primary CTA */}
                      <div className="space-y-3">
                        <Label>Primary CTA</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <Select 
                            value={commonSettings.primaryCTA.action}
                            onValueChange={(value: CTAction) => 
                              setCommonSettings(prev => ({ 
                                ...prev, 
                                primaryCTA: { ...prev.primaryCTA, action: value }
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="contact-sales">Contact Sales</SelectItem>
                              <SelectItem value="request-quote">Request Quote</SelectItem>
                              <SelectItem value="request-details">Request Details</SelectItem>
                              <SelectItem value="book-call">Book Call</SelectItem>
                              <SelectItem value="open-form">Open Form</SelectItem>
                              <SelectItem value="download-guarded">Download (Guarded)</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input 
                            placeholder="Button label"
                            value={commonSettings.primaryCTA.label}
                            onChange={(e) => 
                              setCommonSettings(prev => ({ 
                                ...prev, 
                                primaryCTA: { ...prev.primaryCTA, label: e.target.value }
                              }))
                            }
                          />
                        </div>
                      </div>

                      {/* Secondary CTAs */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Secondary CTAs (Optional)</Label>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={commonSettings.secondaryCTAs.length >= 2}
                          >
                            Add CTA
                          </Button>
                        </div>
                        {commonSettings.secondaryCTAs.map((cta, index) => (
                          <div key={index} className="grid grid-cols-2 gap-3">
                            <Select value={cta.action}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="contact-sales">Contact Sales</SelectItem>
                                <SelectItem value="request-quote">Request Quote</SelectItem>
                                <SelectItem value="request-details">Request Details</SelectItem>
                                <SelectItem value="book-call">Book Call</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input placeholder="Button label" value={cta.label} />
                          </div>
                        ))}
                      </div>

                      {/* Confirmation Copy */}
                      <div className="space-y-2">
                        <Label>Confirmation Copy (after submit)</Label>
                        <Textarea 
                          placeholder="Thank you! We'll get back to you within 24 hours."
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>

              {/* Tracking */}
              <AccordionItem value="tracking">
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-muted-foreground" />
                      <div className="text-left">
                        <h3>Tracking & Attribution</h3>
                        <p className="text-sm text-muted-foreground">
                          Event schema and session tagging
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="space-y-6 pt-4">
                      {/* Event Schema - Read Only */}
                      <div className="space-y-3">
                        <Label>Event Schema (Auto-tracked)</Label>
                        <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                          {templateType === 'simple-catalog' && (
                            <>
                              <Badge variant="secondary" className="mr-2">view_start</Badge>
                              <Badge variant="secondary" className="mr-2">item_view</Badge>
                              <Badge variant="secondary" className="mr-2">cta_contact</Badge>
                              <Badge variant="secondary">cta_save</Badge>
                            </>
                          )}
                          {templateType === 'catalog-quote' && (
                            <>
                              <Badge variant="secondary" className="mr-2">item_select</Badge>
                              <Badge variant="secondary" className="mr-2">cta_request_quote</Badge>
                              <Badge variant="secondary">dwell_10s</Badge>
                            </>
                          )}
                          {templateType === 'spec-doc' && (
                            <>
                              <Badge variant="secondary" className="mr-2">item_view</Badge>
                              <Badge variant="secondary" className="mr-2">download_attempt</Badge>
                              <Badge variant="secondary" className="mr-2">cta_sample_request</Badge>
                              <Badge variant="secondary">cta_request_quote_single</Badge>
                            </>
                          )}
                          {templateType === 'conversation-starter' && (
                            <>
                              <Badge variant="secondary" className="mr-2">chat_message</Badge>
                              <Badge variant="secondary" className="mr-2">quick_action_click</Badge>
                              <Badge variant="secondary">cta_book_call</Badge>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Context Attached */}
                      <div className="space-y-3">
                        <Label>Context Always Attached</Label>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            All events include: <code className="text-xs">drop_id</code>, <code className="text-xs">scene_id</code>, <code className="text-xs">channel_id</code>, <code className="text-xs">auth_level</code>, <code className="text-xs">lead_id/anon_id</code>, <code className="text-xs">session_id</code>, <code className="text-xs">utm_*</code>
                          </p>
                        </div>
                      </div>

                      {/* Session Tagging */}
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <div className="text-sm">Add UTM tags by channel</div>
                          <div className="text-xs text-muted-foreground">Automatically append utm_* parameters</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>

              {/* Scene-Specific Options */}
              <AccordionItem value="scene-specific">
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                      <div className="text-left">
                        <h3>Scene-Specific Options</h3>
                        <p className="text-sm text-muted-foreground">
                          Layout, fields, and template features
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="space-y-6 pt-4">
                      {templateType === 'simple-catalog' && (
                        <SimpleCatalogOptions 
                          settings={catalogSettings}
                          onChange={setCatalogSettings}
                        />
                      )}
                      {templateType === 'catalog-quote' && (
                        <CatalogQuoteOptions 
                          settings={quoteSettings}
                          onChange={setQuoteSettings}
                        />
                      )}
                      {templateType === 'spec-doc' && (
                        <SpecDocOptions 
                          settings={specSettings}
                          onChange={setSpecSettings}
                        />
                      )}
                      {templateType === 'conversation-starter' && (
                        <ConversationStarterOptions 
                          settings={conversationSettings}
                          onChange={setConversationSettings}
                        />
                      )}
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        {/* Right: Live Preview Panel */}
        <div className="col-span-5">
          <div className="sticky top-6 space-y-4">
            {/* Preview Controls */}
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

            {/* Validation Panel */}
            {showValidation && validationIssues.length > 0 && (
              <Alert variant={hasErrors ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    {validationIssues.map((issue, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className={`w-1 h-1 rounded-full mt-2 ${
                          issue.type === 'error' ? 'bg-destructive' : 'bg-yellow-500'
                        }`} />
                        <span className="text-sm">{issue.message}</span>
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Preview Window */}
            <Card className="border-2">
              <CardContent className="p-0">
                <div 
                  className={`bg-muted/30 transition-all ${
                    previewDevice === 'mobile' ? 'max-w-[375px] mx-auto' : 'w-full'
                  }`}
                  style={{ minHeight: '600px' }}
                >
                  <PreviewContent 
                    templateType={templateType}
                    commonSettings={commonSettings}
                    catalogSettings={catalogSettings}
                    quoteSettings={quoteSettings}
                    specSettings={specSettings}
                    conversationSettings={conversationSettings}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Simulated Signal Log */}
            <Card className="bg-muted/20">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Simulated Signal Log (QA only)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>view_start • scene_id: sc_abc123</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>item_view • sku: PRD-001</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Template-specific option components
function SimpleCatalogOptions({ 
  settings, 
  onChange 
}: { 
  settings: SimpleCatalogSettings; 
  onChange: (settings: SimpleCatalogSettings) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Grid & Layout */}
      <div className="space-y-3">
        <h4 className="flex items-center gap-2">
          <Grid3x3 className="w-4 h-4" />
          Grid & Layout
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Density</Label>
            <Select 
              value={settings.gridDensity}
              onValueChange={(value: 'comfortable' | 'compact') => 
                onChange({ ...settings, gridDensity: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Columns (Desktop / Mobile)</Label>
            <div className="flex gap-2">
              <Input 
                type="number" 
                value={settings.columnsDesktop}
                onChange={(e) => onChange({ 
                  ...settings, 
                  columnsDesktop: parseInt(e.target.value) || 3 
                })}
              />
              <Input 
                type="number" 
                value={settings.columnsMobile}
                onChange={(e) => onChange({ 
                  ...settings, 
                  columnsMobile: parseInt(e.target.value) || 2 
                })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Fields */}
      <div className="space-y-3">
        <Label>Card Fields</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'showImage', label: 'Image', icon: ImageIcon },
            { key: 'showName', label: 'Name', icon: Package },
            { key: 'showSKU', label: 'SKU', icon: Tag },
            { key: 'showPrice', label: 'Price', icon: Package },
            { key: 'showDescription', label: 'Description', icon: FileText },
            { key: 'showTags', label: 'Tags', icon: Tag }
          ].map((field) => (
            <div 
              key={field.key}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <field.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{field.label}</span>
              </div>
              <Switch 
                checked={settings[field.key as keyof SimpleCatalogSettings] as boolean}
                onCheckedChange={(checked) => onChange({ 
                  ...settings, 
                  [field.key]: checked 
                })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sort & Filter */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Select 
            value={settings.sortOrder}
            onValueChange={(value: 'featured' | 'price-asc' | 'newest') => 
              onChange({ ...settings, sortOrder: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <div className="flex items-center justify-between w-full p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Enable Filters</span>
            </div>
            <Switch 
              checked={settings.enableFilters}
              onCheckedChange={(checked) => onChange({ 
                ...settings, 
                enableFilters: checked 
              })}
            />
          </div>
        </div>
      </div>

      {/* Micro CTAs */}
      <div className="space-y-2">
        <Label>Per-card Micro-CTAs</Label>
        <div className="flex flex-wrap gap-2">
          {['view', 'save', 'add-to-list'].map((action) => (
            <Badge
              key={action}
              variant={settings.microCTAs.includes(action) ? 'default' : 'outline'}
              className="cursor-pointer capitalize"
              onClick={() => {
                const newMicroCTAs = settings.microCTAs.includes(action)
                  ? settings.microCTAs.filter(a => a !== action)
                  : [...settings.microCTAs, action];
                onChange({ ...settings, microCTAs: newMicroCTAs });
              }}
            >
              {action}
            </Badge>
          ))}
        </div>
      </div>

      {/* Show Total Items */}
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">Show Total Items</span>
        </div>
        <Switch 
          checked={settings.showTotalItems}
          onCheckedChange={(checked) => onChange({ 
            ...settings, 
            showTotalItems: checked 
          })}
        />
      </div>
    </div>
  );
}

function CatalogQuoteOptions({ 
  settings, 
  onChange 
}: { 
  settings: CatalogQuoteSettings; 
  onChange: (settings: CatalogQuoteSettings) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Selection & Summary */}
      <div className="space-y-3">
        <Label>Selection & Summary</Label>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <span className="text-sm">Quantity Input</span>
            <Switch 
              checked={settings.enableQuantity}
              onCheckedChange={(checked) => onChange({ 
                ...settings, 
                enableQuantity: checked 
              })}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <span className="text-sm">Show Summary Panel</span>
            <Switch 
              checked={settings.showSummary}
              onCheckedChange={(checked) => onChange({ 
                ...settings, 
                showSummary: checked 
              })}
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <span className="text-sm">Show Subtotals</span>
            <Switch 
              checked={settings.showSubtotals}
              onCheckedChange={(checked) => onChange({ 
                ...settings, 
                showSubtotals: checked 
              })}
            />
          </div>
        </div>
      </div>

      {/* Notes Field */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Notes Field</Label>
          <Switch 
            checked={settings.enableNotes}
            onCheckedChange={(checked) => onChange({ 
              ...settings, 
              enableNotes: checked 
            })}
          />
        </div>
        {settings.enableNotes && (
          <Input 
            placeholder="Placeholder text"
            value={settings.notesPlaceholder}
            onChange={(e) => onChange({ 
              ...settings, 
              notesPlaceholder: e.target.value 
            })}
          />
        )}
      </div>

      {/* Min Selections */}
      <div className="space-y-2">
        <Label>Minimum Selections Required</Label>
        <Select 
          value={settings.minSelections.toString()}
          onValueChange={(value) => onChange({ 
            ...settings, 
            minSelections: parseInt(value) 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">None</SelectItem>
            <SelectItem value="1">1 item</SelectItem>
            <SelectItem value="2">2 items</SelectItem>
            <SelectItem value="3">3+ items</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quote CTA */}
      <div className="space-y-2">
        <Label>Quote CTA Label</Label>
        <Input 
          value={settings.quoteCTALabel}
          onChange={(e) => onChange({ 
            ...settings, 
            quoteCTALabel: e.target.value 
          })}
        />
      </div>

      {/* Disclaimers */}
      <div className="space-y-2">
        <Label>Disclaimers (MOQ/Lead-time)</Label>
        <Textarea 
          rows={2}
          value={settings.disclaimerText}
          onChange={(e) => onChange({ 
            ...settings, 
            disclaimerText: e.target.value 
          })}
        />
      </div>

      {/* Auto-attach Note */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Buyer selections are automatically attached with quote requests
        </AlertDescription>
      </Alert>
    </div>
  );
}

function SpecDocOptions({ 
  settings, 
  onChange 
}: { 
  settings: SpecDocSettings; 
  onChange: (settings: SpecDocSettings) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Sections */}
      <div className="space-y-3">
        <Label>Sections</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'enableKeySpecs', label: 'Key Specs' },
            { key: 'enableCompliance', label: 'Compliance' },
            { key: 'enableMaterials', label: 'Materials' },
            { key: 'enableVariants', label: 'Variants' },
            { key: 'enableFAQ', label: 'FAQ' },
            { key: 'enableAttachments', label: 'Attachments' }
          ].map((section) => (
            <div 
              key={section.key}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <span className="text-sm">{section.label}</span>
              <Switch 
                checked={settings[section.key as keyof SpecDocSettings] as boolean}
                onCheckedChange={(checked) => onChange({ 
                  ...settings, 
                  [section.key]: checked 
                })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Hero Media */}
      <div className="space-y-2">
        <Label>Hero Media</Label>
        <Select 
          value={settings.heroType}
          onValueChange={(value: 'image' | 'gallery') => 
            onChange({ ...settings, heroType: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image">Single Image</SelectItem>
            <SelectItem value="gallery">Gallery (P1)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Attachment Policy */}
      <div className="space-y-2">
        <Label>Attachment Policy</Label>
        <Select 
          value={settings.attachmentPolicy}
          onValueChange={(value: 'download-guarded' | 'view-only') => 
            onChange({ ...settings, attachmentPolicy: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="download-guarded">Download Guarded</SelectItem>
            <SelectItem value="view-only">View Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* In-section CTAs */}
      <div className="space-y-2">
        <Label>In-section CTAs</Label>
        <div className="flex flex-wrap gap-2">
          {['request-sample', 'request-quote'].map((action) => (
            <Badge
              key={action}
              variant={settings.inSectionCTAs.includes(action) ? 'default' : 'outline'}
              className="cursor-pointer capitalize"
              onClick={() => {
                const newCTAs = settings.inSectionCTAs.includes(action)
                  ? settings.inSectionCTAs.filter(a => a !== action)
                  : [...settings.inSectionCTAs, action];
                onChange({ ...settings, inSectionCTAs: newCTAs });
              }}
            >
              {action.replace('-', ' ')}
            </Badge>
          ))}
        </div>
      </div>

      {/* Navigation & Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <span className="text-sm">Show Table of Contents</span>
          <Switch 
            checked={settings.showTOC}
            onCheckedChange={(checked) => onChange({ 
              ...settings, 
              showTOC: checked 
            })}
          />
        </div>
        <div className="space-y-2">
          <Label>Brand Header</Label>
          <Select 
            value={settings.brandHeader}
            onValueChange={(value: 'minimal' | 'detailed') => 
              onChange({ ...settings, brandHeader: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="detailed">Detailed (Logo + Subtitle)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function ConversationStarterOptions({ 
  settings, 
  onChange 
}: { 
  settings: ConversationStarterSettings; 
  onChange: (settings: ConversationStarterSettings) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Welcome Text */}
      <div className="space-y-2">
        <Label>Welcome Text</Label>
        <Input 
          value={settings.welcomeText}
          onChange={(e) => onChange({ 
            ...settings, 
            welcomeText: e.target.value 
          })}
        />
      </div>

      {/* Suggested Prompts */}
      <div className="space-y-3">
        <Label>Suggested Prompts (0-5)</Label>
        <div className="space-y-2">
          {settings.suggestedPrompts.map((prompt, index) => (
            <Input 
              key={index}
              value={prompt}
              onChange={(e) => {
                const newPrompts = [...settings.suggestedPrompts];
                newPrompts[index] = e.target.value;
                onChange({ ...settings, suggestedPrompts: newPrompts });
              }}
              placeholder={`Prompt ${index + 1}`}
            />
          ))}
          {settings.suggestedPrompts.length < 5 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onChange({ 
                ...settings, 
                suggestedPrompts: [...settings.suggestedPrompts, ''] 
              })}
            >
              Add Prompt
            </Button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <Label>Quick Actions</Label>
        <div className="space-y-2">
          {settings.quickActions.map((action, index) => (
            <div key={action.id} className="flex gap-2">
              <Input 
                value={action.label}
                onChange={(e) => {
                  const newActions = [...settings.quickActions];
                  newActions[index] = { ...action, label: e.target.value };
                  onChange({ ...settings, quickActions: newActions });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Message Limits */}
      <div className="space-y-2">
        <Label>Max Message Length</Label>
        <Input 
          type="number"
          value={settings.maxMessageLength}
          onChange={(e) => onChange({ 
            ...settings, 
            maxMessageLength: parseInt(e.target.value) || 500 
          })}
        />
      </div>

      {/* Lead Form & Escalation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div>
            <div className="text-sm">Lead Form After First Message</div>
            <div className="text-xs text-muted-foreground">P1 feature</div>
          </div>
          <Switch 
            checked={settings.enableLeadForm}
            onCheckedChange={(checked) => onChange({ 
              ...settings, 
              enableLeadForm: checked 
            })}
          />
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <span className="text-sm">Show "Talk to Sales" Escalation</span>
          <Switch 
            checked={settings.showEscalation}
            onCheckedChange={(checked) => onChange({ 
              ...settings, 
              showEscalation: checked 
            })}
          />
        </div>
      </div>
    </div>
  );
}

// Preview content component
function PreviewContent({ 
  templateType,
  commonSettings,
  catalogSettings,
  quoteSettings,
  specSettings,
  conversationSettings
}: {
  templateType: TemplateType;
  commonSettings: CommonSettings;
  catalogSettings: SimpleCatalogSettings;
  quoteSettings: CatalogQuoteSettings;
  specSettings: SpecDocSettings;
  conversationSettings: ConversationStarterSettings;
}) {
  return (
    <div className="p-6 bg-background min-h-full">
      {/* Auth Banner Simulation */}
      {commonSettings.authLevel !== 'L1' && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Lock className="w-4 h-4" />
            <span>Auth Level: {commonSettings.authLevel} - {
              commonSettings.authLevel === 'L2' ? 'Email required' : 'Email + code required'
            }</span>
          </div>
        </div>
      )}

      {/* Watermark Overlay */}
      {commonSettings.watermark && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
          <div className="text-6xl rotate-[-45deg]">PREVIEW</div>
        </div>
      )}

      {/* Template-specific preview */}
      {templateType === 'simple-catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b">
            <h2>Product Catalog</h2>
            {catalogSettings.showTotalItems && (
              <Badge variant="secondary">12 items</Badge>
            )}
          </div>
          <div className={`grid gap-4 ${
            catalogSettings.gridDensity === 'compact' ? 'gap-3' : 'gap-4'
          } grid-cols-${catalogSettings.columnsMobile}`}>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4 space-y-2">
                  {catalogSettings.showImage && (
                    <div className="aspect-square bg-muted rounded-lg" />
                  )}
                  {catalogSettings.showName && <div>Product {i}</div>}
                  {catalogSettings.showSKU && (
                    <div className="text-xs text-muted-foreground">SKU-00{i}</div>
                  )}
                  {catalogSettings.showPrice && (
                    <div className={commonSettings.priceBlur ? 'blur-sm' : ''}>$99.00</div>
                  )}
                  {catalogSettings.microCTAs.length > 0 && (
                    <div className="flex gap-2 pt-2">
                      {catalogSettings.microCTAs.map((cta) => (
                        <Button key={cta} variant="outline" size="sm" className="text-xs">
                          {cta}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="pt-4 border-t">
            <Button className="w-full">
              {commonSettings.primaryCTA.label || 'Contact Sales'}
            </Button>
          </div>
        </div>
      )}

      {templateType === 'catalog-quote' && (
        <div className="space-y-4">
          <h2>Select Items for Quote</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-4">
                  <input type="checkbox" />
                  <div className="flex-1">
                    <div>Product {i}</div>
                    <div className="text-sm text-muted-foreground">
                      {commonSettings.priceBlur ? 'Price on request' : '$99.00'}
                    </div>
                  </div>
                  {quoteSettings.enableQuantity && (
                    <Input type="number" className="w-20" placeholder="Qty" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {quoteSettings.showSummary && (
            <Card className="bg-primary/5">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Selected Items</span>
                    <span>0</span>
                  </div>
                  {quoteSettings.showSubtotals && (
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>$0.00</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          {quoteSettings.enableNotes && (
            <Textarea placeholder={quoteSettings.notesPlaceholder} rows={2} />
          )}
          <Button 
            className="w-full" 
            disabled={quoteSettings.minSelections > 0}
          >
            {quoteSettings.quoteCTALabel}
          </Button>
          {quoteSettings.disclaimerText && (
            <p className="text-xs text-muted-foreground text-center">
              {quoteSettings.disclaimerText}
            </p>
          )}
        </div>
      )}

      {templateType === 'spec-doc' && (
        <div className="space-y-6">
          <div className={`pb-4 border-b ${
            specSettings.brandHeader === 'detailed' ? 'space-y-2' : ''
          }`}>
            <h1>Technical Specification</h1>
            {specSettings.brandHeader === 'detailed' && (
              <p className="text-sm text-muted-foreground">Product Model XYZ-2000</p>
            )}
          </div>
          {specSettings.showTOC && (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <h4 className="mb-2">Contents</h4>
                <div className="space-y-1 text-sm">
                  {specSettings.enableKeySpecs && <div>• Key Specifications</div>}
                  {specSettings.enableCompliance && <div>• Compliance</div>}
                  {specSettings.enableAttachments && <div>• Downloads</div>}
                </div>
              </CardContent>
            </Card>
          )}
          {specSettings.enableKeySpecs && (
            <div>
              <h3 className="mb-3">Key Specifications</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-muted-foreground">Dimensions</div>
                  <div>100 x 50 x 30 mm</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-muted-foreground">Weight</div>
                  <div>2.5 kg</div>
                </div>
              </div>
            </div>
          )}
          {specSettings.inSectionCTAs.length > 0 && (
            <div className="flex gap-2">
              {specSettings.inSectionCTAs.map((cta) => (
                <Button key={cta} variant="outline" className="capitalize">
                  {cta.replace('-', ' ')}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {templateType === 'conversation-starter' && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-sm">{conversationSettings.welcomeText}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          {conversationSettings.suggestedPrompts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {conversationSettings.suggestedPrompts.filter(p => p).map((prompt, i) => (
                <Badge key={i} variant="outline" className="cursor-pointer">
                  {prompt}
                </Badge>
              ))}
            </div>
          )}
          <div className="space-y-2">
            {conversationSettings.quickActions.map((action) => (
              <Button key={action.id} variant="outline" className="w-full justify-start">
                {action.label}
              </Button>
            ))}
          </div>
          {conversationSettings.showEscalation && (
            <Button className="w-full">
              {commonSettings.primaryCTA.label || 'Talk to Sales'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
