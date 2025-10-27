import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { 
  Layout, 
  FileText, 
  Zap, 
  Share2, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Info,
  Monitor,
  Smartphone,
  RotateCcw,
  Save,
  CheckCircle,
  ShoppingCart,
  MessageSquare,
  Sparkles,
  Eye,
  Bookmark,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DropSceneTemplate, TemplateId } from '../types/dropSceneTemplate';
import { saveDropSceneWorkState, loadDropSceneWorkState, clearDropSceneWorkState } from '../lib/storage';
import { toast } from 'sonner@2.0.3';
import { getDefaultEnabledAddons } from '../data/standardDropSceneTemplates';
import { DropScenePreview } from './DropScenePreview';

interface DropSceneTemplatesOverviewProps {
  templates: DropSceneTemplate[];
  onNavigate: (view: any) => void;
  onTemplatesChange?: (templates: DropSceneTemplate[]) => void;
}

type DeviceMode = 'desktop' | 'mobile';

export function DropSceneTemplatesOverview({ templates = [], onNavigate, onTemplatesChange }: DropSceneTemplatesOverviewProps) {
  // Initialize selected template from localStorage or defaults
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(() => {
    const savedState = loadDropSceneWorkState();
    if (savedState && templates.some(t => t.id === savedState.selectedTemplateId)) {
      return savedState.selectedTemplateId as TemplateId;
    }
    return templates.length > 0 ? templates[0].id : 'simple-catalog';
  });

  const [deviceMode, setDeviceMode] = useState<DeviceMode>(() => {
    const savedState = loadDropSceneWorkState();
    return savedState?.deviceMode || 'desktop';
  });

  const [expandedSections, setExpandedSections] = useState({
    picker: true,
    summary: true,
    addons: true
  });

  // Store configurations for all templates
  const [templateConfigs, setTemplateConfigs] = useState<Record<string, Set<string>>>(() => {
    const savedState = loadDropSceneWorkState();
    const configs: Record<string, Set<string>> = {};
    
    // Load saved configurations or use defaults for each template
    templates.forEach(template => {
      const savedConfig = savedState?.templateConfigs?.[template.id];
      if (savedConfig && savedConfig.enabledAddons) {
        configs[template.id] = new Set(savedConfig.enabledAddons);
      } else {
        // Use default addons for this template
        const defaultAddons = getDefaultEnabledAddons(template.id as TemplateId);
        configs[template.id] = new Set(defaultAddons);
      }
    });
    
    return configs;
  });

  // Get current template's enabled addons
  const enabledAddons = templateConfigs[selectedTemplate] || new Set<string>();

  const currentTemplate = templates.find(t => t.id === selectedTemplate);
  
  // If no templates or template not found, show error state
  if (templates.length === 0 || !currentTemplate) {
    return (
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No Drop Scene Templates available. Please check your configuration.</p>
        </div>
      </div>
    );
  }

  // Auto-save work state whenever it changes
  useEffect(() => {
    // Convert template configs to serializable format
    const serializableConfigs: Record<string, { enabledAddons: string[] }> = {};
    Object.keys(templateConfigs).forEach(templateId => {
      serializableConfigs[templateId] = {
        enabledAddons: Array.from(templateConfigs[templateId])
      };
    });

    const workState = {
      selectedTemplateId: selectedTemplate,
      templateConfigs: serializableConfigs,
      deviceMode,
      lastModified: new Date().toISOString()
    };
    saveDropSceneWorkState(workState);
  }, [selectedTemplate, templateConfigs, deviceMode]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleAddon = (addonId: string) => {
    setTemplateConfigs(prev => {
      const currentSet = prev[selectedTemplate] || new Set<string>();
      const next = new Set(currentSet);
      if (next.has(addonId)) {
        next.delete(addonId);
      } else {
        next.add(addonId);
      }
      return {
        ...prev,
        [selectedTemplate]: next
      };
    });
  };

  const handleTemplateChange = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    // Configuration for the new template is already stored in templateConfigs
    // If not present, initialize with defaults
    if (!templateConfigs[templateId]) {
      const defaultAddons = getDefaultEnabledAddons(templateId);
      setTemplateConfigs(prev => ({
        ...prev,
        [templateId]: new Set(defaultAddons)
      }));
    }
  };

  // Reset current template to default state
  const handleReset = () => {
    const defaultAddons = getDefaultEnabledAddons(selectedTemplate);
    setTemplateConfigs(prev => ({
      ...prev,
      [selectedTemplate]: new Set(defaultAddons)
    }));
    setDeviceMode('desktop');
    toast.success('Configuration reset to defaults');
  };

  // Increment usage count when template is used (optional feature)
  const handleSaveAsPreset = () => {
    if (onTemplatesChange) {
      const updatedTemplates = templates.map(t => 
        t.id === selectedTemplate 
          ? { ...t, usageCount: (t.usageCount || 0) + 1 }
          : t
      );
      onTemplatesChange(updatedTemplates);
      toast.success('Preset saved successfully');
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* App Bar */}
      <div className="sticky top-0 z-10 -mx-6 -mt-6 px-6 py-3.5 mb-6 bg-background border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base">Catalog + Quote</h2>
            <p className="text-xs text-muted-foreground">{currentTemplate.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleReset}>
              <RotateCcw className="w-3 h-3 mr-1.5" />
              Reset
            </Button>
            <Button 
              size="sm" 
              className="h-8 text-xs bg-gray-900 hover:bg-gray-800"
              onClick={handleSaveAsPreset}
            >
              <Save className="w-3 h-3 mr-1.5" />
              Save as Preset
            </Button>
          </div>
        </div>
      </div>

      {/* Two-pane Grid */}
      <div className="grid grid-cols-[280px_minmax(0,1fr)] gap-6">
        {/* Left Panel - Config */}
        <div className="space-y-6">
          {/* Template Picker */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">TEMPLATE (SCENE) PICKER</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Pick a scene. We'll pre-configure the essentials.</p>
            </div>
            <div className="space-y-1.5">
              {templates.map((template) => {
                const isSelected = selectedTemplate === template.id;
                return (
                  <div
                    key={template.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-gray-900 text-white' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleTemplateChange(template.id)}
                  >
                    <div className="flex items-center mt-0.5">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-white bg-white' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-gray-900"></div>}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{template.name}</p>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-gray-300' : 'text-muted-foreground'}`}>
                        {template.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Template Summary (DNA) */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">TEMPLATE DNA</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Pre-configured essentials (locked in Quick mode)</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentTemplate.dna.map((capability, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs font-normal bg-gray-100 text-gray-700 hover:bg-gray-100">
                  {capability}
                </Badge>
              ))}
            </div>
            <Button variant="link" className="text-xs h-auto p-0 -ml-4 text-muted-foreground hover:text-foreground">
              <Info className="w-3 h-3 mr-1.5" />
              View details
            </Button>
          </div>

          {/* Optional Add-ons */}
          {currentTemplate.availableAddons.length > 0 && (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">OPTIONAL ADD-ONS</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Optionally enable 1–2 enhancements. You can change this later.</p>
              </div>
              <div className="space-y-3.5">
                {currentTemplate.availableAddons.map((addon) => (
                  <div key={addon.id} className="space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <Label htmlFor={addon.id} className="text-sm cursor-pointer">
                          {addon.label}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{addon.description}</p>
                        <p className="text-xs text-muted-foreground/80 mt-1.5 leading-relaxed">
                          <span className="font-medium">Impact:</span> {addon.impact}
                        </p>
                      </div>
                      <Switch 
                        id={addon.id}
                        checked={enabledAddons.has(addon.id)}
                        onCheckedChange={() => toggleAddon(addon.id)}
                        className="mt-0.5"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Live Preview */}
        <div className="sticky top-[120px] h-[calc(100vh-180px)]">
          <div className="h-full flex flex-col border rounded-lg bg-white">
            {/* Preview Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Live Preview</p>
              </div>
              <div className="flex items-center gap-1 border rounded-md p-0.5 bg-gray-50">
                <Button
                  variant={deviceMode === 'desktop' ? 'secondary' : 'ghost'}
                  size="sm"
                  className={`h-7 px-3 text-xs font-normal ${deviceMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setDeviceMode('desktop')}
                >
                  <Monitor className="w-3.5 h-3.5 mr-1.5" />
                  Desktop
                </Button>
                <Button
                  variant={deviceMode === 'mobile' ? 'secondary' : 'ghost'}
                  size="sm"
                  className={`h-7 px-3 text-xs font-normal ${deviceMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setDeviceMode('mobile')}
                >
                  <Smartphone className="w-3.5 h-3.5 mr-1.5" />
                  Mobile
                </Button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto bg-gray-50">
              <div 
                className={
                  deviceMode === 'mobile' ? 'max-w-[390px] mx-auto' : 'w-full'
                }
              >
                <DropScenePreview 
                  templateId={selectedTemplate} 
                  enabledAddons={enabledAddons}
                  deviceMode={deviceMode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}