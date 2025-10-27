import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ChevronRight, ChevronLeft, Package, Layout, Shield, Share2, Check, Copy } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CreateDropComposerProps {
  onClose: () => void;
}

type Step = 'payloads' | 'scene' | 'auth' | 'channel';

const steps: { id: Step; title: string; icon: React.ReactNode }[] = [
  { id: 'payloads', title: 'Payloads', icon: <Package className="w-4 h-4" /> },
  { id: 'scene', title: 'Scene', icon: <Layout className="w-4 h-4" /> },
  { id: 'auth', title: 'Auth', icon: <Shield className="w-4 h-4" /> },
  { id: 'channel', title: 'Channel', icon: <Share2 className="w-4 h-4" /> }
];

export function CreateDropComposer({ onClose }: CreateDropComposerProps) {
  const [currentStep, setCurrentStep] = useState<Step>('payloads');
  const [formData, setFormData] = useState({
    payloadType: 'single',
    selectedProducts: [],
    scene: 'viewer',
    authLevel: 'L2',
    showPrice: true,
    showStock: false,
    showMOQ: true,
    showDocs: true,
    channel: 'email',
    ttl: 14,
    watermark: true
  });

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleCreateDrop = () => {
    const dropUrl = 'https://distribute.app/d/new-drop-' + Math.random().toString(36).substr(2, 9);
    navigator.clipboard.writeText(dropUrl);
    toast.success('Drop created and link copied to clipboard!');
    onClose();
  };

  const renderPayloadsStep = () => (
    <div className="space-y-6">
      <div>
        <h3>Select Products</h3>
        <p className="text-muted-foreground">Choose products or collections for this drop</p>
      </div>

      <RadioGroup 
        value={formData.payloadType} 
        onValueChange={(value) => setFormData({...formData, payloadType: value})}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="single" id="single" />
          <Label htmlFor="single">Single Product</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="collection" id="collection" />
          <Label htmlFor="collection">Collection</Label>
        </div>
      </RadioGroup>

      {formData.payloadType === 'single' ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-search">Search Products</Label>
                <Input 
                  id="product-search" 
                  placeholder="Type SKU or product name..."
                  className="mt-1"
                />
              </div>
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div>
                    <div className="font-medium">Premium Wool Sweater</div>
                    <div className="text-sm text-muted-foreground">SKU-7841 • $89.99</div>
                  </div>
                  <Badge className="ml-auto">Selected</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label>Collection Filters</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sweaters">Sweaters</SelectItem>
                      <SelectItem value="jackets">Jackets</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-50">$0 - $50</SelectItem>
                      <SelectItem value="50-100">$50 - $100</SelectItem>
                      <SelectItem value="100+">$100+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <Badge variant="outline">24 products</Badge> match your filters
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <Label>Optional Attachments</Label>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">Drag & drop spec PDFs, images, or spreadsheets</p>
          <Button variant="outline" size="sm" className="mt-2">
            Browse Files
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSceneStep = () => (
    <div className="space-y-6">
      <div>
        <h3>Choose Scene Layout</h3>
        <p className="text-muted-foreground">Select how your products will be displayed</p>
      </div>

      <RadioGroup 
        value={formData.scene} 
        onValueChange={(value) => setFormData({...formData, scene: value})}
      >
        <div className="grid grid-cols-2 gap-4">
          <Card className={`cursor-pointer ${formData.scene === 'viewer' ? 'ring-2 ring-primary' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="viewer" id="viewer" />
                <Label htmlFor="viewer" className="cursor-pointer">Viewer</Label>
              </div>
              <div className="text-sm text-muted-foreground">
                Single product hero with tabs: Overview, Specs, Docs
              </div>
              <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                📱 Single Product Preview
              </div>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer ${formData.scene === 'table' ? 'ring-2 ring-primary' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="table" id="table" />
                <Label htmlFor="table" className="cursor-pointer">Table</Label>
              </div>
              <div className="text-sm text-muted-foreground">
                Collection table with customizable columns
              </div>
              <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                📊 Data Table Preview
              </div>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer ${formData.scene === 'gallery' ? 'ring-2 ring-primary' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="gallery" id="gallery" />
                <Label htmlFor="gallery" className="cursor-pointer">Gallery</Label>
              </div>
              <div className="text-sm text-muted-foreground">
                Image-first grid layout for visual browsing
              </div>
              <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                🖼️ Gallery Preview
              </div>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer ${formData.scene === 'dataroom' ? 'ring-2 ring-primary' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="dataroom" id="dataroom" />
                <Label htmlFor="dataroom" className="cursor-pointer">Data Room</Label>
              </div>
              <div className="text-sm text-muted-foreground">
                Auto-selected when multiple attachments
              </div>
              <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                📁 Document Preview
              </div>
            </CardContent>
          </Card>
        </div>
      </RadioGroup>

      <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
        💡 <strong>Auto-suggestion:</strong> Based on your single product selection, Viewer is recommended.
      </div>
    </div>
  );

  const renderAuthStep = () => (
    <div className="space-y-6">
      <div>
        <h3>Information & Protection</h3>
        <p className="text-muted-foreground">Control what information is visible and how content is protected</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visibility Settings</CardTitle>
          <CardDescription>Choose what product information to show</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-price">Price</Label>
            <Switch 
              id="show-price" 
              checked={formData.showPrice}
              onCheckedChange={(checked) => setFormData({...formData, showPrice: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-stock">Stock Levels</Label>
            <Switch 
              id="show-stock" 
              checked={formData.showStock}
              onCheckedChange={(checked) => setFormData({...formData, showStock: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-moq">MOQ (Minimum Order)</Label>
            <Switch 
              id="show-moq" 
              checked={formData.showMOQ}
              onCheckedChange={(checked) => setFormData({...formData, showMOQ: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-docs">Documentation</Label>
            <Switch 
              id="show-docs" 
              checked={formData.showDocs}
              onCheckedChange={(checked) => setFormData({...formData, showDocs: checked})}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Protection Level</CardTitle>
          <CardDescription>Set access control and content protection</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={formData.authLevel} 
            onValueChange={(value) => setFormData({...formData, authLevel: value})}
            className="space-y-4"
          >
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value="L1" id="L1" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="L1" className="cursor-pointer">L1 Public</Label>
                <div className="text-sm text-muted-foreground mt-1">
                  No verification • TTL 30d • Watermark off • Downloads allowed
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 border rounded-lg bg-blue-50">
              <RadioGroupItem value="L2" id="L2" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="L2" className="cursor-pointer">L2 Verified</Label>
                <div className="text-sm text-muted-foreground mt-1">
                  Email verification • TTL 14d • Watermark on • Downloads guarded
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <RadioGroupItem value="L3" id="L3" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="L3" className="cursor-pointer">L3 Governed</Label>
                <div className="text-sm text-muted-foreground mt-1">
                  Verified only • TTL 7d • Watermark on • No raw downloads
                </div>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );

  const renderChannelStep = () => (
    <div className="space-y-6">
      <div>
        <h3>Share Channel</h3>
        <p className="text-muted-foreground">Choose how you'll distribute this drop</p>
      </div>

      <RadioGroup 
        value={formData.channel} 
        onValueChange={(value) => setFormData({...formData, channel: value})}
        className="space-y-4"
      >
        <Card className={`cursor-pointer ${formData.channel === 'email' ? 'ring-2 ring-primary' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email" className="cursor-pointer">Email</Label>
              <Badge variant="secondary">Recommended</Badge>
            </div>
            {formData.channel === 'email' && (
              <div className="space-y-4 mt-4 border-t pt-4">
                <div>
                  <Label>Email Subject</Label>
                  <Input 
                    placeholder="Check out our Winter Collection 2024" 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Email Body Template</Label>
                  <Textarea 
                    placeholder="Hi {{buyer_first_name}}, I wanted to share our latest products with you..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="per-recipient" defaultChecked />
                  <Label htmlFor="per-recipient" className="text-sm">Generate per-recipient links</Label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={`cursor-pointer ${formData.channel === 'whatsapp' ? 'ring-2 ring-primary' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="whatsapp" id="whatsapp" />
              <Label htmlFor="whatsapp" className="cursor-pointer">WhatsApp / WeChat</Label>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Copy link with channel tracking for messaging apps
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer ${formData.channel === 'expo' ? 'ring-2 ring-primary' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expo" id="expo" />
              <Label htmlFor="expo" className="cursor-pointer">Expo QR Code</Label>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Generate QR code for trade shows and events
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer ${formData.channel === 'embed' ? 'ring-2 ring-primary' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="embed" id="embed" />
              <Label htmlFor="embed" className="cursor-pointer">Website Embed</Label>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Embed script for your website or landing page
            </div>
          </CardContent>
        </Card>
      </RadioGroup>
    </div>
  );

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Drop</DialogTitle>
        <DialogDescription>
          Configure your product distribution with custom payloads, scenes, authentication, and sharing channels.
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center justify-between py-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              currentStep === step.id 
                ? 'bg-primary text-primary-foreground' 
                : index < currentStepIndex 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-muted text-muted-foreground'
            }`}>
              {index < currentStepIndex ? (
                <Check className="w-4 h-4" />
              ) : (
                step.icon
              )}
              <span className="text-sm font-medium">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      <Separator />

      <div className="py-6">
        {currentStep === 'payloads' && renderPayloadsStep()}
        {currentStep === 'scene' && renderSceneStep()}
        {currentStep === 'auth' && renderAuthStep()}
        {currentStep === 'channel' && renderChannelStep()}
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-3">
          {currentStepIndex === steps.length - 1 ? (
            <>
              <Button variant="outline" onClick={handleCreateDrop}>
                <Copy className="w-4 h-4 mr-2" />
                Create & Copy Link
              </Button>
              <Button onClick={handleCreateDrop}>
                Create & Open Drop
              </Button>
            </>
          ) : (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  );
}