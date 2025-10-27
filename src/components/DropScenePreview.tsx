/**
 * Drop Scene Preview Component
 * 共享的预览组件，用于 DropSceneTemplatesOverview 和 FastCreateDrop
 * 根据选中的模板和启用的 addons 动态渲染预览内容
 */

import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Eye, Bookmark, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { TemplateId } from '../types/dropSceneTemplate';

type DeviceMode = 'desktop' | 'mobile';

// Preview Product Data Type
export interface PreviewProduct {
  id: string;
  name: string;
  sku: string;
  price: string;
  imageUrl?: string;
  description?: string;
  category?: string;
}

interface DropScenePreviewProps {
  templateId: TemplateId;
  enabledAddons: Set<string>;
  deviceMode: DeviceMode;
  products?: PreviewProduct[]; // Optional: real products from Material Pool
}

export function DropScenePreview({ templateId, enabledAddons, deviceMode, products }: DropScenePreviewProps) {
  if (templateId === 'simple-catalog') {
    return <SimpleCatalogPreview enabledAddons={enabledAddons} deviceMode={deviceMode} products={products} />;
  } else if (templateId === 'catalog-quote') {
    return <CatalogQuotePreview enabledAddons={enabledAddons} products={products} />;
  } else if (templateId === 'directory-nate-show') {
    return <DirectoryPreview enabledAddons={enabledAddons} products={products} />;
  } else {
    return <DiscoveryPreview enabledAddons={enabledAddons} products={products} />;
  }
}

// Simple Catalog Preview - Router Component
function SimpleCatalogPreview({ 
  enabledAddons, 
  deviceMode,
  products
}: { 
  enabledAddons: Set<string>;
  deviceMode: DeviceMode;
  products?: PreviewProduct[];
}) {
  if (deviceMode === 'mobile') {
    return <SimpleCatalogMobile enabledAddons={enabledAddons} products={products} />;
  }
  return <SimpleCatalogDesktop enabledAddons={enabledAddons} products={products} />;
}

// Shared Product Data
const simpleCatalogProducts: PreviewProduct[] = [
  { id: '1', name: 'Premium Widget Pro', sku: 'WDG-001', price: '$249.99' },
  { id: '2', name: 'Standard Widget', sku: 'WDG-002', price: '$149.99' },
  { id: '3', name: 'Compact Widget Mini', sku: 'WDG-003', price: '$99.99' },
  { id: '4', name: 'Enterprise Widget Suite', sku: 'WDG-004', price: '$499.99' },
  { id: '5', name: 'Widget Starter Kit', sku: 'WDG-005', price: '$79.99' },
  { id: '6', name: 'Widget Accessories Pack', sku: 'WDG-006', price: '$39.99' },
  { id: '7', name: 'Professional Widget Plus', sku: 'WDG-007', price: '$299.99' },
  { id: '8', name: 'Widget Deluxe Edition', sku: 'WDG-008', price: '$199.99' },
  { id: '9', name: 'Widget Essential Bundle', sku: 'WDG-009', price: '$129.99' },
  { id: '10', name: 'Widget Custom Config', sku: 'WDG-010', price: '$149.99' },
  { id: '11', name: 'Widget Limited Edition', sku: 'WDG-011', price: '$399.99' },
  { id: '12', name: 'Widget Basic Model', sku: 'WDG-012', price: '$59.99' }
];

const simpleCatalogBrandColor = '#6366f1'; // Indigo-500

// Simple Catalog Desktop View
function SimpleCatalogDesktop({ enabledAddons, products }: { enabledAddons: Set<string>; products?: PreviewProduct[] }) {
  const [savedItems, setSavedItems] = useState<string[]>([]);
  
  // Use provided products or fallback to mock data
  const displayProducts = products || simpleCatalogProducts;
  
  const toggleSaved = (productId: string) => {
    setSavedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2>Product Catalog</h2>
        <Badge variant="secondary">
          {displayProducts.length} items
        </Badge>
      </div>

      {/* Product Grid - 4 columns */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {displayProducts.map((product) => {
          const isSaved = savedItems.includes(product.id);
          return (
            <div
              key={product.id}
              className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm"
            >
              {/* Product Image */}
              <div className="aspect-square w-full bg-muted/50"></div>
              
              {/* Product Info */}
              <div className="p-4">
                <div className="mb-3">
                  <h4 className="mb-1 text-sm">
                    {product.name}
                  </h4>
                  <div className="text-xs text-muted-foreground mb-1">
                    {product.sku}
                  </div>
                  <div className="text-sm font-medium" style={{ color: simpleCatalogBrandColor }}>
                    {product.price}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    View
                  </Button>
                  <Button
                    variant={isSaved ? "default" : "outline"}
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => toggleSaved(product.id)}
                    style={isSaved ? { backgroundColor: simpleCatalogBrandColor, color: 'white' } : {}}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lead Form Enhancement Add-on */}
      {enabledAddons.has('lead-form-enhancements') && (
        <div className="mb-6 rounded-lg border bg-blue-50/50 p-4 border-blue-200">
          <div className="mb-3 text-sm font-medium text-blue-900">Additional Information</div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Company name"
              className="h-9 w-full rounded border bg-white px-3 text-sm"
            />
            <input
              type="text"
              placeholder="Industry"
              className="h-9 w-full rounded border bg-white px-3 text-sm"
            />
          </div>
        </div>
      )}

      {/* Primary CTA Footer */}
      <div className="border-t pt-6">
        <Button 
          className="h-12 w-full rounded-lg"
          style={{ backgroundColor: simpleCatalogBrandColor, color: 'white' }}
        >
          Contact Sales
        </Button>
      </div>
    </div>
  );
}

// Simple Catalog Mobile View
function SimpleCatalogMobile({ enabledAddons, products }: { enabledAddons: Set<string>; products?: PreviewProduct[] }) {
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Use provided products or fallback to mock data
  const displayProducts = products || simpleCatalogProducts;
  const totalPages = Math.ceil(displayProducts.length / itemsPerPage);
  
  const toggleSaved = (productId: string) => {
    setSavedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Paginated products for mobile
  const mobileProducts = displayProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white flex flex-col p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between flex-shrink-0">
        <h2 className="font-medium">Product Catalog</h2>
        <Badge variant="secondary" className="text-xs">
          {displayProducts.length} items
        </Badge>
      </div>

      {/* Content List - Scrollable */}
      <div className="space-y-3 mb-3">
        {mobileProducts.map((product) => {
          const isSaved = savedItems.includes(product.id);
          return (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-lg border bg-white p-3"
            >
              {/* Left Section: Image Placeholder */}
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
              </div>
              
              {/* Middle Section: Core Info Block */}
              <div className="flex-1 min-w-0">
                {/* Product Name */}
                <div className="font-medium text-sm text-gray-900 mb-0.5">
                  {product.name}
                </div>
                {/* SKU */}
                <div className="text-xs text-gray-500">
                  {product.sku}
                </div>
                {/* Price */}
                <div className="text-sm font-medium mt-0.5" style={{ color: simpleCatalogBrandColor }}>
                  {product.price}
                </div>
              </div>
              
              {/* Right Section: Action Icon Group */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-50 transition-colors">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSaved(product.id)}
                >
                  <Bookmark 
                    className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`}
                    style={{ color: isSaved ? simpleCatalogBrandColor : '#6b7280' }}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Prev
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Lead Form Enhancement Add-on */}
      {enabledAddons.has('lead-form-enhancements') && (
        <div className="mb-4 rounded-lg border bg-blue-50/50 p-3 border-blue-200 flex-shrink-0">
          <div className="mb-2 text-xs font-medium text-blue-900">Additional Information</div>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Company name"
              className="h-8 w-full rounded border bg-white px-2 text-xs"
            />
            <input
              type="text"
              placeholder="Industry"
              className="h-8 w-full rounded border bg-white px-2 text-xs"
            />
          </div>
        </div>
      )}
      
      {/* Primary CTA - Full Width at Bottom */}
      <div className="flex-shrink-0">
        <Button 
          className="h-11 w-full rounded-lg text-sm"
          style={{ backgroundColor: simpleCatalogBrandColor, color: 'white' }}
        >
          Contact Sales
        </Button>
      </div>
    </div>
  );
}

// Catalog + Quote Preview
function CatalogQuotePreview({ enabledAddons, products }: { enabledAddons: Set<string>; products?: PreviewProduct[] }) {
  // Mock products for fallback
  const mockProducts: PreviewProduct[] = [
    { id: '1', name: 'Premium Widget Pro', sku: 'WDG-001', price: '$249.99' },
    { id: '2', name: 'Standard Widget', sku: 'WDG-002', price: '$149.99' },
    { id: '3', name: 'Compact Widget Mini', sku: 'WDG-003', price: '$99.99' },
    { id: '4', name: 'Enterprise Widget Suite', sku: 'WDG-004', price: '$499.99' },
    { id: '5', name: 'Widget Starter Kit', sku: 'WDG-005', price: '$79.99' },
    { id: '6', name: 'Widget Accessories Pack', sku: 'WDG-006', price: '$39.99' }
  ];

  // Use provided products or fallback to mock data
  const displayProducts = products || mockProducts;

  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const selectedCount = selectedItems.size;
  const subtotal = Array.from(selectedItems).reduce((sum, index) => {
    const priceStr = displayProducts[index].price.replace('$', '');
    return sum + parseFloat(priceStr);
  }, 0);

  return (
    <div className="relative">
      <div className={`space-y-5 bg-white p-6 ${enabledAddons.has('quote-summary') ? 'pb-24' : 'pb-6'}`}>
        <h3 className="text-base font-medium pb-1">Select Items for Quote</h3>
        
        <div className="space-y-2">
          {displayProducts.map((product, i) => (
            <div 
              key={product.id} 
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => toggleItem(i)}
            >
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded pointer-events-none" 
                checked={selectedItems.has(i)}
                onChange={() => {}}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-tight">{product.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{product.sku}</p>
              </div>
              <p className="text-sm text-purple-600 font-medium">{product.price}</p>
            </div>
          ))}
        </div>

        {enabledAddons.has('moq-disclosure') && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3.5">
            <p className="text-xs font-medium text-orange-900 mb-1.5">Ordering Information</p>
            <div className="space-y-1">
              <p className="text-xs text-orange-800">
                <span className="font-medium">Minimum Order Quantity:</span> 100 units
              </p>
              <p className="text-xs text-orange-800">
                <span className="font-medium">Lead Time:</span> 2-3 weeks
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between py-2.5 border-t border-b">
          <p className="text-sm text-muted-foreground">Selected Items</p>
          <p className="text-sm">{selectedCount}</p>
        </div>

        {/* Lead Form Enhancements - shown when add-on is enabled */}
        {enabledAddons.has('lead-form-enhancements-quote') && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm font-medium mb-3">Additional Details</p>
            <div className="space-y-2.5">
              <div>
                <label className="text-xs text-muted-foreground">Expected Volume</label>
                <select className="w-full h-9 rounded-lg border bg-white px-3 text-sm mt-1">
                  <option>Select volume</option>
                  <option>1-100 units</option>
                  <option>100-500 units</option>
                  <option>500-1000 units</option>
                  <option>1000+ units</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Delivery Timeline</label>
                <select className="w-full h-9 rounded-lg border bg-white px-3 text-sm mt-1">
                  <option>Select timeline</option>
                  <option>Immediate</option>
                  <option>1-2 weeks</option>
                  <option>2-4 weeks</option>
                  <option>4+ weeks</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div>
          <textarea 
            className="w-full h-16 rounded-lg border bg-white p-3 text-sm resize-none placeholder:text-muted-foreground"
            placeholder="Add any special requirements💬"
          />
        </div>

        <Button className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-sm">
          Request Quote
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          MOQ and lead times vary by product
        </p>
      </div>

      {/* Quote Summary Panel - sticky footer when enabled */}
      {enabledAddons.has('quote-summary') && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="px-6 py-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Selected Items</p>
                <p className="text-sm font-medium">{selectedCount} {selectedCount === 1 ? 'item' : 'items'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Subtotal</p>
                <p className="text-base font-medium text-purple-600">${subtotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Directory / Nate Show Preview
// Note: This template shows single product details, not a product list
function DirectoryPreview({ enabledAddons, products }: { enabledAddons: Set<string>; products?: PreviewProduct[] }) {
  // This template is designed for single product details
  // If products are provided, we could show the first product's name in the header
  const productName = products && products.length > 0 ? products[0].name : 'Technical Specification';
  
  return (
    <div className="space-y-5 bg-white p-6">
      <h3 className="text-base font-medium pb-1">{productName}</h3>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs text-muted-foreground mb-2">CONTENTS</p>
        <ul className="text-sm space-y-1">
          <li>• Key Specifications</li>
          <li>• Compliance & Certifications</li>
          {enabledAddons.has('download-center') && <li>• Downloads</li>}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">DIMENSIONS</p>
          <p className="text-base">24" × 18" × 12"</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">WEIGHT</p>
          <p className="text-base">45 lbs</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">POWER</p>
          <p className="text-base">120V AC</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">WARRANTY</p>
          <p className="text-base">2 years</p>
        </div>
      </div>

      {enabledAddons.has('download-center') && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Downloads</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm leading-tight">Technical Datasheet</p>
                  <p className="text-xs text-muted-foreground mt-0.5">PDF • 2.4 MB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs h-8 px-3">Download</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm leading-tight">CAD Files (STEP)</p>
                  <p className="text-xs text-muted-foreground mt-0.5">ZIP • 8.1 MB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs h-8 px-3">Download</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm leading-tight">Compliance Certificates</p>
                  <p className="text-xs text-muted-foreground mt-0.5">PDF • 1.2 MB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs h-8 px-3">Download</Button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Form Enhancements - shown when add-on is enabled */}
      {enabledAddons.has('lead-form-enhancements-directory') && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <p className="text-sm font-medium mb-3">Additional Information</p>
          <div className="space-y-2.5">
            <div>
              <label className="text-xs text-muted-foreground">Application Type</label>
              <select className="w-full h-9 rounded-lg border bg-white px-3 text-sm mt-1">
                <option>Select type</option>
                <option>Industrial</option>
                <option>Commercial</option>
                <option>Residential</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Project Timeline</label>
              <select className="w-full h-9 rounded-lg border bg-white px-3 text-sm mt-1">
                <option>Select timeline</option>
                <option>Immediate</option>
                <option>1-3 months</option>
                <option>3-6 months</option>
                <option>6+ months</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1 h-11 text-sm">
          Request Sample
        </Button>
        <Button className="flex-1 h-11 bg-cyan-600 hover:bg-cyan-700 text-sm">
          Request Quote
        </Button>
      </div>
    </div>
  );
}

// Discovery / Nate Show Preview
// Note: This is a conversational interface, products are not directly displayed
function DiscoveryPreview({ enabledAddons, products }: { enabledAddons: Set<string>; products?: PreviewProduct[] }) {
  const productCount = products ? products.length : 0;
  const assistantMessage = productCount > 0 
    ? `Hi! I see you have ${productCount} ${productCount === 1 ? 'product' : 'products'} available. How can I help you today?`
    : "Hi! I'm here to help you find the right products. How can I assist you today?";
  
  return (
    <div className="space-y-5 bg-white p-6 relative">
      {/* Greeting Card */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Sales Assistant</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {assistantMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Chips */}
      <div className="flex flex-wrap gap-2">
        {['I need a quote', 'Tell me about your products', 'Schedule a demo'].map((text, i) => (
          <Button 
            key={i} 
            variant="outline" 
            size="sm" 
            className="rounded-full h-8 text-xs font-normal px-4 hover:bg-gray-50"
          >
            {text}
          </Button>
        ))}
      </div>

      {/* Action Rows */}
      <div className="space-y-2.5">
        <div className="border rounded-lg p-3.5 hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium leading-tight">Book a Call</p>
              <p className="text-xs text-muted-foreground mt-0.5">Schedule time with our team</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-3.5 hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium leading-tight">Requirements Form</p>
              <p className="text-xs text-muted-foreground mt-0.5">Tell us what you need</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Form Enhancements - shown when add-on is enabled */}
      {enabledAddons.has('lead-form-enhancements-discovery') && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm font-medium mb-3">Quick Qualification</p>
          <div className="space-y-2.5">
            <div>
              <label className="text-xs text-muted-foreground">Budget Range</label>
              <select className="w-full h-9 rounded-lg border bg-white px-3 text-sm mt-1">
                <option>Select range</option>
                <option>Under $10k</option>
                <option>$10k - $50k</option>
                <option>$50k - $100k</option>
                <option>$100k+</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Timeline</label>
              <select className="w-full h-9 rounded-lg border bg-white px-3 text-sm mt-1">
                <option>Select timeline</option>
                <option>Immediate</option>
                <option>1-3 months</option>
                <option>3-6 months</option>
                <option>6+ months</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Primary CTA */}
      <div className="pt-1">
        <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-sm">
          Contact Sales
        </Button>
      </div>

      {/* Live Chat Widget - floating bubble when enabled */}
      {enabledAddons.has('live-chat-widget') && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-emerald-700 transition-colors">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          </div>
        </div>
      )}
    </div>
  );
}
