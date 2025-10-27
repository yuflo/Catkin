import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { MaterialPool, ProductLibrary, LibraryItem } from './PayloadsTab';
import { DropSceneTemplate, TemplateId, IntentTag } from '../types/dropSceneTemplate';
import { Policy, formatContentLevels } from '../types/policy';
import { DropScenePreview, PreviewProduct } from './DropScenePreview';
import { RecipientSelector } from './RecipientSelector';
import { Lead } from '../data/mockLeads';
import { loadDropSceneWorkState } from '../lib/storage';
import { 
  getRecommendationForIntent, 
  isPolicyRecommended, 
  isTemplateRecommended 
} from '../lib/intentRecommendations';
import { toast } from 'sonner@2.0.3';
import { 
  Monitor,
  Smartphone,
  Package,
  ArrowRight,
  Sparkles,
  Eye,
  ChevronDown,
  ChevronUp,
  Layers,
  Target,
  Users,
  Heart
} from 'lucide-react';

interface FastCreateDropProps {
  onNavigate: (view: any) => void;
  materialPools: MaterialPool[];
  libraries: ProductLibrary[];
  allPolicies?: Policy[];
  dropSceneTemplates?: DropSceneTemplate[];
}

type DeviceMode = 'desktop' | 'mobile';
type BusinessIntent = 'lead_gen' | 'sales' | 'nurturing';

export function FastCreateDropV31({ 
  onNavigate, 
  materialPools, 
  libraries, 
  allPolicies = [], 
  dropSceneTemplates = [] 
}: FastCreateDropProps) {
  // ===== V3.1 Core State: Business Intent =====
  const [currentIntent, setCurrentIntent] = useState<BusinessIntent>('lead_gen');
  
  // ===== V3.1: Recipient (for sales & nurturing) =====
  const [selectedRecipient, setSelectedRecipient] = useState<Lead | null>(null);
  
  // Separate standard and custom policies
  const standardPolicies = allPolicies.filter(p => p.isStandard);
  const customPolicies = allPolicies.filter(p => !p.isStandard);
  
  // ===== V3.1: Get Smart Recommendations =====
  const currentRecommendation = useMemo(() => {
    return getRecommendationForIntent(currentIntent);
  }, [currentIntent]);
  
  // ===== V3.1: Dynamic Template Filtering =====
  const filteredTemplates = useMemo(() => {
    return dropSceneTemplates.filter(template => {
      if (!template.tags || template.tags.length === 0) return true;
      return template.tags.includes(currentIntent);
    });
  }, [dropSceneTemplates, currentIntent]);
  
  // Initialize state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(
    materialPools.length > 0 ? materialPools[0].id : null
  );
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('lead-capture');
  
  // ===== V3.1: Smart Auto-Selection on Intent Change =====
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    // Auto-select recommended template
    const recommendedTemplate = filteredTemplates.find(
      t => t.id === currentRecommendation.recommendedTemplateId
    );
    if (recommendedTemplate) {
      setSelectedTemplateId(recommendedTemplate.id);
    } else if (filteredTemplates.length > 0) {
      setSelectedTemplateId(filteredTemplates[0].id);
    }
    
    // Auto-select recommended policy
    setSelectedPolicyId(currentRecommendation.recommendedPolicyId);
    
    // Clear recipient if not shown in this intent
    if (!currentRecommendation.showRecipient) {
      setSelectedRecipient(null);
    }
    
    // Show toast notification on intent change (but not on initial mount)
    if (!isInitialMount.current) {
      const templateName = recommendedTemplate?.name || 'default template';
      const policyName = allPolicies.find(p => p.id === currentRecommendation.recommendedPolicyId)?.name || 'default policy';
      
      toast.success('Smart recommendations applied', {
        description: `${templateName} + ${policyName}`,
        duration: 2000
      });
    }
    
    isInitialMount.current = false;
  }, [currentIntent, currentRecommendation, filteredTemplates, allPolicies]);
  
  const [expandedPolicyId, setExpandedPolicyId] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

  // Find selected items
  const selectedTemplate = filteredTemplates.find(t => t.id === selectedTemplateId);
  const selectedPool = materialPools.find(p => p.id === selectedPoolId);
  const selectedPolicy = allPolicies.find(p => p.id === selectedPolicyId);

  // Load enabled addons from storage for the selected template
  const enabledAddons = useMemo(() => {
    if (!selectedTemplate) return new Set<string>();
    const savedState = loadDropSceneWorkState();
    const templateConfig = savedState?.templateConfigs?.[selectedTemplate.id];
    if (templateConfig && templateConfig.enabledAddons) {
      return new Set(templateConfig.enabledAddons);
    }
    return new Set<string>();
  }, [selectedTemplate]);

  // Resolve Material Pool products to Preview format
  const resolvedProducts = useMemo<PreviewProduct[] | undefined>(() => {
    if (!selectedPool || !selectedPoolId) return undefined;
    
    const products: PreviewProduct[] = [];
    
    for (const poolItem of selectedPool.items) {
      let libraryItem: LibraryItem | undefined;
      for (const library of libraries) {
        libraryItem = library.items.find(item => item.id === poolItem.masterId);
        if (libraryItem) break;
      }
      
      if (!libraryItem) {
        console.warn(`Library item not found for masterId: ${poolItem.masterId}`);
        continue;
      }
      
      products.push({
        id: libraryItem.id,
        name: poolItem.overrides?.name || libraryItem.name,
        sku: libraryItem.sku,
        price: `${(poolItem.overrides?.price ?? libraryItem.price).toFixed(2)}`,
        imageUrl: libraryItem.imageUrl,
        description: poolItem.overrides?.description || libraryItem.description,
        category: libraryItem.category
      });
    }
    
    return products.length > 0 ? products : undefined;
  }, [selectedPool, selectedPoolId, libraries]);

  const handleCreateDrop = () => {
    console.log('Creating drop with:', { 
      intent: currentIntent,
      templateId: selectedTemplateId,
      templateName: selectedTemplate?.name,
      poolId: selectedPoolId,
      poolName: selectedPool?.name,
      policyId: selectedPolicyId,
      policyName: selectedPolicy?.name,
      recipient: selectedRecipient,
      deviceMode
    });
  };

  const handleSelectPolicy = (policyId: string) => {
    setSelectedPolicyId(policyId);
  };

  // Helper function to get intent display info
  const getIntentInfo = (intent: BusinessIntent) => {
    switch (intent) {
      case 'lead_gen':
        return {
          label: 'Lead Generation',
          icon: Target,
          description: 'Capture new prospects'
        };
      case 'sales':
        return {
          label: 'Sales Follow-up',
          icon: Users,
          description: 'Close deals with prospects'
        };
      case 'nurturing':
        return {
          label: 'Customer Nurturing',
          icon: Heart,
          description: 'Maintain relationships'
        };
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1>Fast Create Drop</h1>
            <p className="text-muted-foreground">
              Select your business scenario to get smart recommendations
            </p>
          </div>
        </div>
      </div>

      {/* ===== V3.1: Business Scenario Switcher ===== */}
      <div className="mb-6">
        <Tabs value={currentIntent} onValueChange={(value) => setCurrentIntent(value as BusinessIntent)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lead_gen" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Lead Generation
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Sales Follow-up
            </TabsTrigger>
            <TabsTrigger value="nurturing" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Customer Nurturing
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Intent Description */}
        <div className="mt-3 px-4 py-2.5 bg-blue-50/50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            {currentRecommendation.description}
          </p>
        </div>
      </div>

      {/* Two-column Layout */}
      <div className="grid grid-cols-[320px_minmax(0,1fr)] gap-6">
        {/* Left Panel - Configuration */}
        <div className="space-y-6">
          {/* Material Pool Selector */}
          <div className="space-y-3">
            <div>
              <p className="text-sm mb-1">Material Pool</p>
              <p className="text-xs text-muted-foreground">
                Select the content source for this Drop
              </p>
            </div>
            
            {materialPools.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Package className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm mb-3">No material pools available</p>
                  <Button size="sm" variant="outline" onClick={() => onNavigate('payloads')}>
                    Create Material Pool
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Select Material Pool</Label>
                  <Select value={selectedPoolId || ''} onValueChange={setSelectedPoolId}>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {selectedPool ? (
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span>{selectedPool.name}</span>
                            <span className="text-muted-foreground">({selectedPool.items.length} items)</span>
                          </div>
                        ) : (
                          'Select a pool...'
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {materialPools.map((pool) => (
                        <SelectItem key={pool.id} value={pool.id}>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span>{pool.name}</span>
                            <span className="text-muted-foreground">({pool.items.length} items)</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pool Details */}
                {selectedPool && (
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Products</p>
                        <p className="text-sm">{selectedPool.items.length} items</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Attachments</p>
                        <p className="text-sm">
                          {selectedPool.attachmentIds?.length || 0} files
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <Separator />

          {/* ===== V3.1: Dynamic Template Picker ===== */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm">Drop Scene Template</p>
                {filteredTemplates.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {filteredTemplates.length} available
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Optimized templates for {getIntentInfo(currentIntent).label.toLowerCase()}
              </p>
            </div>
            
            {filteredTemplates.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Layers className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm mb-3">No templates available for this scenario</p>
                  <Button size="sm" variant="outline" onClick={() => onNavigate('settings-drop-templates')}>
                    Manage Templates
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Select Drop Scene Template</Label>
                  <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {selectedTemplate ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                              {selectedTemplate.icon && <selectedTemplate.icon className="w-4 h-4 text-gray-600" />}
                            </div>
                            <span>{selectedTemplate.name}</span>
                            {isTemplateRecommended(selectedTemplate.id, currentIntent) && (
                              <Badge className="text-xs px-1.5 py-0 ml-1 bg-black hover:bg-black/90">
                                Recommended
                              </Badge>
                            )}
                          </div>
                        ) : (
                          'Select a template...'
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTemplates.map((template) => {
                        const isRecommended = isTemplateRecommended(template.id, currentIntent);
                        return (
                          <SelectItem key={template.id} value={template.id}>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                {template.icon && <template.icon className="w-4 h-4 text-gray-600" />}
                              </div>
                              <span>{template.name}</span>
                              {isRecommended && (
                                <Badge className="text-xs px-1.5 py-0 ml-1 bg-black hover:bg-black/90">
                                  Recommended
                                </Badge>
                              )}
                              {template.isDefault && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0 ml-1">
                                  Standard
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Template Details */}
                {selectedTemplate && (
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Template DNA</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {selectedTemplate.dna.map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {selectedTemplate.subtitle && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Description</p>
                          <p className="text-sm">{selectedTemplate.subtitle}</p>
                        </div>
                      )}
                      {selectedTemplate.availableAddons && selectedTemplate.availableAddons.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Available Enhancements</p>
                          <p className="text-xs">{selectedTemplate.availableAddons.length} addons available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <Separator />

          {/* ===== V3.1: Conditional Audience & Auth ===== */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">AUDIENCE & AUTH</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentRecommendation.showRecipient
                  ? 'Select recipient and configure access'
                  : 'Public access for maximum reach'}
              </p>
            </div>

            {/* ===== V3.1: Conditional Recipient Selector ===== */}
            {currentRecommendation.showRecipient && (
              <>
                <RecipientSelector
                  selectedLead={selectedRecipient}
                  onSelectLead={setSelectedRecipient}
                />
                <Separator className="my-3" />
              </>
            )}

            {/* Unified Policy Dropdown */}
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-muted-foreground">Access Policy</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  {currentRecommendation.showRecipient && selectedRecipient
                    ? `Recommended for ${selectedRecipient.name} (${selectedRecipient.email})`
                    : 'Smart recommendation based on your scenario'}
                </p>
              </div>
              
              <Select
                value={selectedPolicyId || ''}
                onValueChange={handleSelectPolicy}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an access policy...">
                    {(() => {
                      const allPoliciesList = [...standardPolicies, ...customPolicies];
                      const selected = allPoliciesList.find(p => p.id === selectedPolicyId);
                      if (selected) {
                        const Icon = selected.icon;
                        const isCustom = customPolicies.some(p => p.id === selected.id);
                        const isRecommended = isPolicyRecommended(selected.id, currentIntent);
                        return (
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selected.iconBg}`}>
                              {Icon && <Icon className={`w-3.5 h-3.5 ${selected.iconColor}`} />}
                            </div>
                            <span>{selected.name}</span>
                            {isRecommended && (
                              <Badge className="text-xs px-1.5 py-0 ml-1 bg-black hover:bg-black/90">
                                Recommended
                              </Badge>
                            )}
                            {isCustom && (
                              <Badge variant="secondary" className="text-xs px-1.5 py-0 ml-1">
                                Custom
                              </Badge>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {/* Standard Policies Group */}
                  <div className="px-2 py-1.5">
                    <p className="text-xs text-muted-foreground">Standard Policies</p>
                  </div>
                  {standardPolicies.map((policy) => {
                    const Icon = policy.icon;
                    const isRecommended = isPolicyRecommended(policy.id, currentIntent);
                    return (
                      <SelectItem key={policy.id} value={policy.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${policy.iconBg}`}>
                            {Icon && <Icon className={`w-3.5 h-3.5 ${policy.iconColor}`} />}
                          </div>
                          <span>{policy.name}</span>
                          {isRecommended && (
                            <Badge className="text-xs px-1.5 py-0 ml-1 bg-black hover:bg-black/90">
                              Recommended
                            </Badge>
                          )}
                          {policy.isDefault && !isRecommended && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0 ml-1">
                              Default
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                  
                  {/* Custom Policies Group */}
                  {customPolicies.length > 0 && (
                    <>
                      <Separator className="my-1" />
                      <div className="px-2 py-1.5">
                        <p className="text-xs text-muted-foreground">Custom Policies</p>
                      </div>
                      {customPolicies.map((policy) => {
                        const Icon = policy.icon;
                        return (
                          <SelectItem key={policy.id} value={policy.id}>
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${policy.iconBg}`}>
                                {Icon && <Icon className={`w-3.5 h-3.5 ${policy.iconColor}`} />}
                              </div>
                              <span>{policy.name}</span>
                              <Badge variant="secondary" className="text-xs px-1.5 py-0 ml-1">
                                Custom
                              </Badge>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </>
                  )}
                </SelectContent>
              </Select>

              {/* Selected Policy Preview */}
              {(() => {
                const allPoliciesList = [...standardPolicies, ...customPolicies];
                const selectedPolicyObj = allPoliciesList.find(p => p.id === selectedPolicyId);
                if (!selectedPolicyObj) return null;
                
                const PolicyIcon = selectedPolicyObj.icon;
                const isExpanded = expandedPolicyId === selectedPolicyId;
                const isCustom = customPolicies.some(p => p.id === selectedPolicyObj.id);
                
                return (
                  <Collapsible 
                    open={isExpanded} 
                    onOpenChange={(open) => setExpandedPolicyId(open ? selectedPolicyId : null)}
                  >
                    <div className={`border border-primary rounded-lg ${isCustom ? 'bg-emerald-50/50' : 'bg-blue-50/50'}`}>
                      <div className="p-3">
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${selectedPolicyObj.iconBg}`}>
                            {PolicyIcon && <PolicyIcon className={`w-5 h-5 ${selectedPolicyObj.iconColor}`} />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm">{selectedPolicyObj.name}</h3>
                              {selectedPolicyObj.isDefault && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                  Default
                                </Badge>
                              )}
                              {isCustom && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                  Custom
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {isCustom ? `Based on "${selectedPolicyObj.basedOnName}"` : selectedPolicyObj.tagline}
                            </p>
                            {!isCustom && (
                              <p className="text-xs text-muted-foreground mt-1.5">
                                {selectedPolicyObj.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* View Configuration Button */}
                        <CollapsibleTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 ml-13 text-xs h-7 text-muted-foreground"
                          >
                            View Configuration
                            {isExpanded ? (
                              <ChevronUp className="ml-1 w-3 h-3" />
                            ) : (
                              <ChevronDown className="ml-1 w-3 h-3" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>

                      {/* Expandable Configuration Details */}
                      <CollapsibleContent>
                        <div className="px-3 pb-3 pt-0 border-t">
                          <div className="ml-13 mt-3 space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Access Mode:</span>
                              <span>{selectedPolicyObj.config.accessMode || 'Public'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Required Fields:</span>
                              <span>{selectedPolicyObj.config.requiredFields.length > 0 ? selectedPolicyObj.config.requiredFields.join(', ') : 'None'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Content Levels:</span>
                              <span>{formatContentLevels(selectedPolicyObj.config.visibleContentLevels)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Download Policy:</span>
                              <span>{selectedPolicyObj.config.downloadPolicy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Watermark:</span>
                              <span>{selectedPolicyObj.config.watermark}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Link Validity:</span>
                              <span>{selectedPolicyObj.config.linkValidityDays ? `${selectedPolicyObj.config.linkValidityDays} days` : 'Never expires'}</span>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })()}


            </div>

            {/* Info Banner with Link to Settings */}
            <Button
              variant="link"
              size="sm"
              className="w-full justify-center h-auto p-0 text-xs text-muted-foreground hover:text-primary"
              onClick={() => onNavigate('settings-auth')}
            >
              Manage custom policies in Settings
            </Button>
          </div>

          {/* Configuration Summary */}
          {selectedTemplate && selectedPolicy && (
            <div className="border rounded-lg p-3 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-900 mb-1">
                    Smart Configuration Active
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-blue-600"></span>
                      <span>{selectedTemplate.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-blue-600"></span>
                      <span>{selectedPolicy.name}</span>
                    </div>
                    {selectedRecipient && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-blue-600"></span>
                        <span>{selectedRecipient.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              className="w-full" 
              size="sm"
              disabled={!selectedPoolId || (currentRecommendation.showRecipient && !selectedRecipient)}
              onClick={handleCreateDrop}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Create Drop
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              size="sm"
              onClick={() => onNavigate('overview')}
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="space-y-4">
          {/* Preview Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm">Live Preview</h3>
              {selectedPool && (
                <Badge variant="secondary" className="text-xs">
                  {selectedPool.name}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 bg-muted rounded-md p-1">
              <Button
                variant={deviceMode === 'desktop' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 px-2"
                onClick={() => setDeviceMode('desktop')}
              >
                <Monitor className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant={deviceMode === 'mobile' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 px-2"
                onClick={() => setDeviceMode('mobile')}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Preview Canvas */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border overflow-hidden min-h-[600px]">
            {selectedTemplate ? (
              <div 
                className={`h-full ${
                  deviceMode === 'desktop' ? 'w-full' : 'max-w-[390px] mx-auto'
                }`}
              >
                <DropScenePreview 
                  templateId={selectedTemplate.id as TemplateId}
                  enabledAddons={enabledAddons}
                  deviceMode={deviceMode}
                  products={resolvedProducts}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[600px]">
                <div className="text-center">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm text-gray-400">
                    Select a template to preview
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Preview Info */}
          <div className="space-y-2">
            {/* Data Source Indicator */}
            {selectedTemplate && selectedPool && (
              resolvedProducts && resolvedProducts.length > 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <div className="flex gap-2">
                    <Package className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-emerald-900">
                      <p className="font-medium mb-1">
                        ✓ Live Data: {selectedPool.name}
                      </p>
                      <p className="text-emerald-700">
                        Displaying {resolvedProducts.length} products from your material pool
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex gap-2">
                    <Package className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-900">
                      <p className="font-medium mb-1">
                        Using fallback demo data
                      </p>
                      <p className="text-amber-700">
                        Material pool is empty. Add products to see live data.
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
