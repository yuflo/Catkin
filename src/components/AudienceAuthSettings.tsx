/**
 * Audience & Auth Policies (V2)
 * 
 * Core Design Principles:
 * - Intelligent Defaults: 3 standard policies covering 80% of use cases
 * - Controlled Flexibility: "Duplicate & Edit" for special needs with limited editable parameters
 * - Risk Awareness: Warnings when deviating from defaults
 * - Less is More: Strictly limited customization options
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  CheckCircle2,
  Target,
  AlertTriangle,
  Edit,
  Trash2,
  Copy,
  Info,
  ChevronDown,
  ChevronUp,
  Eye
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Alert, AlertDescription } from './ui/alert';
import { Policy, createCustomPolicy, formatContentLevels } from '../types/policy';
import { STANDARD_POLICIES } from '../data/standardPolicies';

type ContentLevel = 'public' | 'authenticated' | 'internal';

// Standard policies imported from centralized data source

const CONTENT_LEVEL_DESCRIPTIONS = {
  public: 'Basic information, always visible to authenticated users',
  authenticated: 'Protected information, such as technical whitepapers',
  internal: 'Highly sensitive information, such as channel pricing'
};

const RISK_WARNINGS = {
  publicRequiredFields: {
    title: 'Recommendation',
    description: 'Adding lead fields fundamentally changes this policy\'s purpose. To capture leads, use the "Lead Capture" policy as a base instead.'
  },
  publicDownloadDisabled: {
    title: 'Risk Warning',
    description: 'Disabling downloads may frustrate users who expect to save public materials.'
  },
  publicWatermark: {
    title: 'Risk Warning',
    description: 'A watermark can be visually distracting on promotional content.'
  },
  publicLinkExpiry: {
    title: 'Risk Warning',
    description: 'An expiring link will break any long-term shares or embeds of your content.'
  },
  leadRequiredFields: {
    title: 'Risk Warning',
    description: 'Requesting additional fields increases form friction and may lower lead conversion rates. Only enable fields that are essential for your qualification process.'
  },
  leadDownloadDisabled: {
    title: 'Risk Warning',
    description: 'Disabling downloads may lower perceived value and reduce conversion rates.'
  },
  leadWatermark: {
    title: 'Risk Warning',
    description: 'A watermark adds friction and is generally not recommended for lead generation assets.'
  },
  leadLinkValidity: {
    title: 'Risk Warning',
    description: 'A shorter period may cause links in old campaigns to expire, losing potential leads.'
  },
  privateAccessMode: {
    title: 'Recommendation',
    description: 'Use "Email Gated" when you need to know *who* accessed the content, not just that they had the password.'
  },
  privateWatermarkDisabled: {
    title: 'Risk Warning',
    description: 'Disabling the watermark removes a significant deterrent against unauthorized sharing.'
  },
  privateDownloadEnabled: {
    title: 'Risk Warning',
    description: 'Enabling downloads allows recipients to create uncontrolled, local copies of your content.'
  },
  privateLinkValidity: {
    title: 'Risk Warning',
    description: 'Extending the validity period increases the time window for potential information exposure.'
  },
  visibleContentLevels: {
    title: 'Risk Warning',
    description: 'Enabling higher visibility levels (such as Private) may expose sensitive data that should not be shown in this scenario. Only enable levels that are appropriate for your audience.'
  }
};

interface AudienceAuthSettingsProps {
  allPolicies?: Policy[];
  onPoliciesChange?: (policies: Policy[]) => void;
}

export function AudienceAuthSettings({ 
  allPolicies: externalAllPolicies,
  onPoliciesChange
}: AudienceAuthSettingsProps = {}) {
  const [localAllPolicies, setLocalAllPolicies] = useState<Policy[]>([]);
  const allPolicies = externalAllPolicies || localAllPolicies;
  const setPolicies = onPoliciesChange || setLocalAllPolicies;
  
  // Separate standard and custom policies
  const standardPolicies = allPolicies.filter(p => p.isStandard);
  const customPolicies = allPolicies.filter(p => !p.isStandard);
  
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [sourcePolicy, setSourcePolicy] = useState<Policy | null>(null);
  const [hoveredStandardPolicy, setHoveredStandardPolicy] = useState<string | null>(null);
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formAccessMode, setFormAccessMode] = useState<'public' | 'email-gated' | 'password-protected'>('password-protected');
  const [formRequiredFields, setFormRequiredFields] = useState<string[]>([]);
  const [formVisibleContentLevels, setFormVisibleContentLevels] = useState<ContentLevel[]>(['public']);
  const [formDownloadPolicy, setFormDownloadPolicy] = useState<'unguarded' | 'guarded' | 'disabled'>('guarded');
  const [formWatermark, setFormWatermark] = useState<'enabled' | 'disabled'>('disabled');
  const [formLinkValidity, setFormLinkValidity] = useState<number>(90);

  const handleDuplicateAndEdit = (policy: Policy) => {
    setSourcePolicy(policy);
    setEditingPolicy(null);
    setFormName(`Copy of ${policy.name}`);
    setFormAccessMode(policy.config.accessMode || 'public');
    setFormRequiredFields([...policy.config.requiredFields]);
    setFormVisibleContentLevels([...policy.config.visibleContentLevels]);
    setFormDownloadPolicy(policy.config.downloadPolicy);
    setFormWatermark(policy.config.watermark);
    setFormLinkValidity(policy.config.linkValidityDays || 90);
    setIsConfigModalOpen(true);
  };

  const handleEditCustomPolicy = (policy: Policy) => {
    const source = STANDARD_POLICIES.find(p => p.id === policy.basedOn);
    setSourcePolicy(source || null);
    setEditingPolicy(policy);
    setFormName(policy.name);
    setFormAccessMode(policy.config.accessMode || 'public');
    setFormRequiredFields(policy.config.requiredFields);
    setFormVisibleContentLevels(policy.config.visibleContentLevels);
    setFormDownloadPolicy(policy.config.downloadPolicy);
    setFormWatermark(policy.config.watermark);
    setFormLinkValidity(policy.config.linkValidityDays || 90);
    setIsConfigModalOpen(true);
  };

  const handleDeleteCustomPolicy = (policyId: string) => {
    if (confirm('Are you sure you want to delete this custom policy?')) {
      setPolicies(allPolicies.filter(p => p.id !== policyId));
      toast.success('Custom policy deleted');
    }
  };

  const handleSaveCustomPolicy = () => {
    if (!formName.trim()) {
      toast.error('Policy name is required');
      return;
    }

    if (formVisibleContentLevels.length === 0) {
      toast.error('At least one content level must be selected');
      return;
    }

    if (editingPolicy) {
      setPolicies(allPolicies.map(p => 
        p.id === editingPolicy.id 
          ? {
              ...p,
              name: formName,
              config: {
                ...p.config,
                accessMode: formAccessMode,
                requiredFields: formRequiredFields,
                visibleContentLevels: formVisibleContentLevels,
                downloadPolicy: formDownloadPolicy,
                watermark: formWatermark,
                linkValidityDays: formLinkValidity
              },
              updatedAt: new Date().toISOString()
            }
          : p
      ));
      toast.success('Custom policy updated');
    } else if (sourcePolicy) {
      const newPolicy = createCustomPolicy(
        sourcePolicy,
        formName,
        {
          accessMode: formAccessMode,
          requiredFields: formRequiredFields,
          visibleContentLevels: formVisibleContentLevels,
          downloadPolicy: formDownloadPolicy,
          watermark: formWatermark,
          linkValidityDays: formLinkValidity
        }
      );
      setPolicies([...allPolicies, newPolicy]);
      toast.success('Custom policy created');
    }

    setIsConfigModalOpen(false);
  };

  const toggleRequiredField = (field: string) => {
    setFormRequiredFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const toggleContentLevel = (level: ContentLevel) => {
    setFormVisibleContentLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const formatContentLevels = (levels: ContentLevel[]) => {
    return levels.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ');
  };

  const activePolicy = expandedPolicy ? STANDARD_POLICIES.find(p => p.id === expandedPolicy) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Audience & Auth</h2>
        <p className="text-muted-foreground">
          Choose an access policy that matches your strategic intent
        </p>
      </div>

      {/* Standard Policies Section */}
      <div className="space-y-4">
        <div>
          <h3>Standard Policies</h3>
          <p className="text-sm text-muted-foreground">
            Pre-configured best practices for common scenarios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STANDARD_POLICIES.map((policy) => {
            const PolicyIcon = policy.icon;
            const isHovered = hoveredStandardPolicy === policy.id;
            
            return (
              <Card 
                key={policy.id}
                className={`relative transition-all ${
                  isHovered ? 'border-gray-400 shadow-md' : ''
                }`}
                onMouseEnter={() => setHoveredStandardPolicy(policy.id)}
                onMouseLeave={() => setHoveredStandardPolicy(null)}
              >
                {/* Fixed-position hover actions */}
                <div className={`absolute top-3 right-3 flex gap-1 transition-opacity z-10 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateAndEdit(policy);
                    }}
                    className="bg-white dark:bg-gray-900 text-xs h-7"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Duplicate & Edit
                  </Button>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${policy.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <PolicyIcon className={`w-5 h-5 ${policy.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0 pr-32">
                      <CardTitle className="text-base">{policy.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {policy.tagline}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3 pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {policy.description}
                  </p>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedPolicy(expandedPolicy === policy.id ? null : policy.id);
                    }}
                  >
                    <span>View Configuration</span>
                    {expandedPolicy === policy.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Expanded Configuration Panel */}
      {activePolicy && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${activePolicy.iconBg} rounded-lg flex items-center justify-center`}>
                {(() => {
                  const Icon = activePolicy.icon;
                  return <Icon className={`w-5 h-5 ${activePolicy.iconColor}`} />;
                })()}
              </div>
              <div>
                <CardTitle className="text-base">Encapsulated Configuration</CardTitle>
                <CardDescription className="text-xs">
                  The following settings are automatically applied when this policy is selected
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Access Mode</span>
                <code className="text-sm bg-muted px-2 py-0.5 rounded">{activePolicy.config.accessMode || 'Public'}</code>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Required Fields</span>
                <code className="text-sm bg-muted px-2 py-0.5 rounded">
                  {activePolicy.config.requiredFields.length > 0 
                    ? activePolicy.config.requiredFields.join(', ') 
                    : 'None'}
                </code>
              </div>
              <div className="col-span-2 flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Visible Content Levels</span>
                <code className="text-sm bg-muted px-2 py-0.5 rounded">{formatContentLevels(activePolicy.config.visibleContentLevels)}</code>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Downloads</span>
                <code className="text-sm bg-muted px-2 py-0.5 rounded">{activePolicy.config.downloadPolicy}</code>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Watermark</span>
                <code className="text-sm bg-muted px-2 py-0.5 rounded">{activePolicy.config.watermark}</code>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Link Validity</span>
                <code className="text-sm bg-muted px-2 py-0.5 rounded">
                  {activePolicy.config.linkValidityDays === null 
                    ? 'Never Expires' 
                    : `${activePolicy.config.linkValidityDays} days`}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Your Custom Policies Section */}
      {customPolicies.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3>Your Custom Policies</h3>
            <p className="text-sm text-muted-foreground">
              Policies you've created based on standard templates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {customPolicies.map((policy) => {
              const PolicyIcon = policy.icon;
              
              return (
                <Card 
                  key={policy.id}
                  className="relative transition-all"
                >
                  {/* Fixed-position actions */}
                  <div className="absolute top-3 right-3 flex gap-1 z-10">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCustomPolicy(policy);
                      }}
                      className="h-7 w-7 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomPolicy(policy.id);
                      }}
                      className="h-7 w-7 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 ${policy.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {PolicyIcon && <PolicyIcon className={`w-5 h-5 ${policy.iconColor}`} />}
                      </div>
                      <div className="flex-1 min-w-0 pr-24">
                        <CardTitle className="text-base">{policy.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Based on "{policy.basedOnName}"
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-2 pt-0">
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {policy.config.accessMode && (
                        <p>• Access: {policy.config.accessMode}</p>
                      )}
                      {policy.config.requiredFields.length > 0 && (
                        <p>• Required: {policy.config.requiredFields.join(', ')}</p>
                      )}
                      <p>• Visible levels: {formatContentLevels(policy.config.visibleContentLevels)}</p>
                      <p>• Downloads: {policy.config.downloadPolicy}</p>
                      {policy.config.watermark === 'enabled' && (
                        <p>• Watermark enabled</p>
                      )}
                      <p>• Expires: {policy.config.linkValidityDays} days</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state hint */}
      {customPolicies.length === 0 && (
        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-900 dark:text-blue-100">
            To create a custom policy, hover over a standard policy and click "Duplicate & Edit"
          </AlertDescription>
        </Alert>
      )}

      {/* Configuration Modal */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPolicy 
                ? `Edit "${editingPolicy.name}"` 
                : `Create policy based on "${sourcePolicy?.name}"`}
            </DialogTitle>
            <DialogDescription>
              Only specific parameters can be customized. Fixed settings ensure policy integrity.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Policy Name */}
            <div className="space-y-2">
              <Label htmlFor="policy-name">
                Policy Name <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="policy-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Watermarked Lead Capture"
              />
            </div>

            {/* Access Mode - ONLY for Private Share */}
            {sourcePolicy?.id === 'private-share' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="access-mode">Access Mode</Label>
                  <Badge variant="outline" className="text-xs">Editable</Badge>
                </div>
                <Select value={formAccessMode} onValueChange={setFormAccessMode}>
                  <SelectTrigger id="access-mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="password-protected">Password Protected</SelectItem>
                    <SelectItem value="email-gated">Email Gated</SelectItem>
                  </SelectContent>
                </Select>
                
                {formAccessMode !== sourcePolicy?.config.accessMode && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span>
                      Default for "{sourcePolicy?.name}" is {sourcePolicy?.config.accessMode}.
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-blue-500 cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-medium">{RISK_WARNINGS.privateAccessMode.title}</p>
                          <p className="text-xs mt-1">{RISK_WARNINGS.privateAccessMode.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
            )}

            {/* Required Lead Fields */}
            {(sourcePolicy?.id === 'public-promo' || sourcePolicy?.id === 'lead-capture') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Required Lead Fields</Label>
                  <Badge variant="outline" className="text-xs">Editable</Badge>
                </div>
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  {sourcePolicy?.id === 'lead-capture' && (
                    <div className="flex items-center gap-2 opacity-50">
                      <Checkbox checked disabled />
                      <Label className="cursor-not-allowed text-sm">Email (Required)</Label>
                    </div>
                  )}
                  
                  {sourcePolicy?.id === 'public-promo' && (
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        checked={formRequiredFields.includes('email')}
                        onCheckedChange={() => toggleRequiredField('email')}
                      />
                      <Label className="cursor-pointer text-sm" onClick={() => toggleRequiredField('email')}>
                        Email
                      </Label>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={formRequiredFields.includes('name')}
                      onCheckedChange={() => toggleRequiredField('name')}
                    />
                    <Label className="cursor-pointer text-sm" onClick={() => toggleRequiredField('name')}>
                      Name
                    </Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={formRequiredFields.includes('company')}
                      onCheckedChange={() => toggleRequiredField('company')}
                    />
                    <Label className="cursor-pointer text-sm" onClick={() => toggleRequiredField('company')}>
                      Company
                    </Label>
                  </div>
                </div>
                
                {((sourcePolicy?.id === 'public-promo' && formRequiredFields.length > 0) || 
                  (sourcePolicy?.id === 'lead-capture' && (formRequiredFields.includes('name') || formRequiredFields.includes('company')))) && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span>
                      Default for "{sourcePolicy?.name}" {sourcePolicy?.config.requiredFields.length > 0 ? `only requires ${sourcePolicy?.config.requiredFields.join(', ')}` : 'requires no fields'}.
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertTriangle className="w-4 h-4 text-red-500 cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-medium">
                            {sourcePolicy?.id === 'public-promo' 
                              ? RISK_WARNINGS.publicRequiredFields.title 
                              : RISK_WARNINGS.leadRequiredFields.title}
                          </p>
                          <p className="text-xs mt-1">
                            {sourcePolicy?.id === 'public-promo' 
                              ? RISK_WARNINGS.publicRequiredFields.description 
                              : RISK_WARNINGS.leadRequiredFields.description}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
            )}

            {/* Visible Content Levels - NEW COMPONENT */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Visible Content Levels
                </Label>
                <Badge variant="outline" className="text-xs">Editable</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                After successful authentication
              </p>
              
              <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-start gap-2">
                  <Checkbox 
                    checked={formVisibleContentLevels.includes('public')}
                    onCheckedChange={() => toggleContentLevel('public')}
                  />
                  <div className="flex-1">
                    <Label className="cursor-pointer text-sm" onClick={() => toggleContentLevel('public')}>
                      Public
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {CONTENT_LEVEL_DESCRIPTIONS.public}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Checkbox 
                    checked={formVisibleContentLevels.includes('authenticated')}
                    onCheckedChange={() => toggleContentLevel('authenticated')}
                  />
                  <div className="flex-1">
                    <Label className="cursor-pointer text-sm" onClick={() => toggleContentLevel('authenticated')}>
                      Authenticated
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {CONTENT_LEVEL_DESCRIPTIONS.authenticated}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Checkbox 
                    checked={formVisibleContentLevels.includes('internal')}
                    onCheckedChange={() => toggleContentLevel('internal')}
                  />
                  <div className="flex-1">
                    <Label className="cursor-pointer text-sm" onClick={() => toggleContentLevel('internal')}>
                      Internal
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {CONTENT_LEVEL_DESCRIPTIONS.internal}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Show warning if deviating from defaults or if Internal is selected */}
              {(formVisibleContentLevels.includes('internal') || 
                JSON.stringify([...formVisibleContentLevels].sort()) !== JSON.stringify([...sourcePolicy?.config.visibleContentLevels || []].sort())) && (
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span>
                    Default for "{sourcePolicy?.name}" is [{formatContentLevels(sourcePolicy?.config.visibleContentLevels || [])}].
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertTriangle className="w-4 h-4 text-red-500 cursor-help flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="font-medium">{RISK_WARNINGS.visibleContentLevels.title}</p>
                        <p className="text-xs mt-1">{RISK_WARNINGS.visibleContentLevels.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>

            {/* Download Policy */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="download-policy">Download Policy</Label>
                <Badge variant="outline" className="text-xs">Editable</Badge>
              </div>
              <Select value={formDownloadPolicy} onValueChange={(value: 'unguarded' | 'guarded' | 'disabled') => setFormDownloadPolicy(value)}>
                <SelectTrigger id="download-policy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unguarded">Unguarded</SelectItem>
                  <SelectItem value="guarded">Guarded (Verify First)</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
              
              {formDownloadPolicy !== sourcePolicy?.config.downloadPolicy && (
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span>
                    Default for "{sourcePolicy?.name}" is {sourcePolicy?.config.downloadPolicy}.
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertTriangle className="w-4 h-4 text-red-500 cursor-help flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="font-medium">Risk Warning</p>
                        <p className="text-xs mt-1">
                          {sourcePolicy?.id === 'public-promo' && formDownloadPolicy === 'disabled' 
                            ? RISK_WARNINGS.publicDownloadDisabled.description
                            : sourcePolicy?.id === 'lead-capture' && formDownloadPolicy === 'disabled'
                              ? RISK_WARNINGS.leadDownloadDisabled.description
                              : sourcePolicy?.id === 'private-share' && formDownloadPolicy !== 'disabled'
                                ? RISK_WARNINGS.privateDownloadEnabled.description
                                : 'Changing download policy may affect user experience.'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>

            {/* Watermark */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="watermark">Watermark</Label>
                <Badge variant="outline" className="text-xs">Editable</Badge>
              </div>
              <Select value={formWatermark} onValueChange={(value: 'enabled' | 'disabled') => setFormWatermark(value)}>
                <SelectTrigger id="watermark">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
              
              {formWatermark !== sourcePolicy?.config.watermark && (
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span>
                    Default for "{sourcePolicy?.name}" is {sourcePolicy?.config.watermark}.
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertTriangle className="w-4 h-4 text-red-500 cursor-help flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="font-medium">Risk Warning</p>
                        <p className="text-xs mt-1">
                          {sourcePolicy?.id === 'public-promo' && formWatermark === 'enabled'
                            ? RISK_WARNINGS.publicWatermark.description
                            : sourcePolicy?.id === 'lead-capture' && formWatermark === 'enabled'
                              ? RISK_WARNINGS.leadWatermark.description
                              : sourcePolicy?.id === 'private-share' && formWatermark === 'disabled'
                                ? RISK_WARNINGS.privateWatermarkDisabled.description
                                : 'Changing watermark settings may affect content security.'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>

            {/* Link Validity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="link-validity">Link Validity (Days)</Label>
                <Badge variant="outline" className="text-xs">Editable</Badge>
              </div>
              <Input 
                id="link-validity"
                type="number"
                value={formLinkValidity}
                onChange={(e) => setFormLinkValidity(parseInt(e.target.value) || 0)}
                min="1"
              />
              
              {((sourcePolicy?.config.linkValidityDays !== null && formLinkValidity !== sourcePolicy?.config.linkValidityDays) ||
                (sourcePolicy?.config.linkValidityDays === null && formLinkValidity < 365)) && (
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span>
                    Default for "{sourcePolicy?.name}" is {sourcePolicy?.config.linkValidityDays === null ? 'Never expires' : `${sourcePolicy?.config.linkValidityDays} days`}.
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertTriangle className="w-4 h-4 text-red-500 cursor-help flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="font-medium">Risk Warning</p>
                        <p className="text-xs mt-1">
                          {sourcePolicy?.id === 'public-promo'
                            ? RISK_WARNINGS.publicLinkExpiry.description
                            : sourcePolicy?.id === 'lead-capture'
                              ? RISK_WARNINGS.leadLinkValidity.description
                              : RISK_WARNINGS.privateLinkValidity.description}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>

            {/* Fixed Parameters Notice */}
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription className="text-xs">
                <p className="font-medium mb-1">Fixed Parameters (Not Editable)</p>
                <p className="text-muted-foreground">
                  {sourcePolicy?.id === 'private-share' 
                    ? 'Required Lead Fields (N/A), Rate Limiting'
                    : sourcePolicy?.id === 'public-promo'
                      ? 'Access Mode'
                      : 'Access Mode'}
                </p>
              </AlertDescription>
            </Alert>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setIsConfigModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustomPolicy}>
              Save Custom Policy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
