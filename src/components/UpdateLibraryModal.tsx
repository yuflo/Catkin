import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Upload, FileText, AlertCircle, CheckCircle, TrendingUp, Plus, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ProductLibrary, LibraryItem } from './PayloadsTab';
import { toast } from 'sonner@2.0.3';

interface UpdateLibraryModalProps {
  open: boolean;
  onClose: () => void;
  library: ProductLibrary;
  onUpdate: (library: ProductLibrary) => void;
}

interface FieldMapping {
  csvColumn: string;
  targetField: string;
}

const TARGET_FIELDS = [
  { value: 'sku', label: 'SKU', required: true },
  { value: 'name', label: 'Product Name', required: true },
  { value: 'category', label: 'Category', required: false },
  { value: 'price', label: 'Price', required: true },
  { value: 'stock', label: 'Stock', required: false },
  { value: 'moq', label: 'MOQ', required: false },
  { value: 'description', label: 'Description', required: false },
  { value: 'imageUrl', label: 'Image URL', required: false },
  { value: 'attachmentUrl', label: 'Attachment URL', required: false },
  { value: 'ignore', label: '(Ignore)', required: false }
];

interface UpdatePreview {
  matchedItems: number;
  newItems: number;
  unchangedItems: number;
}

export function UpdateLibraryModal({ open, onClose, library, onUpdate }: UpdateLibraryModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [updatePreview, setUpdatePreview] = useState<UpdatePreview | null>(null);
  const [parsedItems, setParsedItems] = useState<LibraryItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setFile(selectedFile);

    // Parse CSV
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(selectedFile);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return;

    // Extract headers
    const headers = lines[0].split(',').map(h => h.trim());
    setCsvColumns(headers);

    // Parse preview data (first 3 rows)
    const data = lines.slice(1, 4).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    });
    setPreviewData(data);

    // Try to reuse previous mappings or auto-map
    const mappings = performAutoMapping(headers);
    setFieldMappings(mappings);

    // Parse all items for preview
    const items = parseAllItems(text, mappings);
    setParsedItems(items);
    
    // Generate update preview
    generateUpdatePreview(items);
  };

  const performAutoMapping = (columns: string[]): FieldMapping[] => {
    return columns.map(col => {
      const lowerCol = col.toLowerCase();
      
      if (lowerCol.includes('sku') || lowerCol === 'id') {
        return { csvColumn: col, targetField: 'sku' };
      }
      if (lowerCol.includes('name') || lowerCol.includes('product') || lowerCol.includes('title')) {
        return { csvColumn: col, targetField: 'name' };
      }
      if (lowerCol.includes('price') || lowerCol.includes('cost')) {
        return { csvColumn: col, targetField: 'price' };
      }
      if (lowerCol.includes('category') || lowerCol.includes('type')) {
        return { csvColumn: col, targetField: 'category' };
      }
      if (lowerCol.includes('stock') || lowerCol.includes('quantity') || lowerCol.includes('qty')) {
        return { csvColumn: col, targetField: 'stock' };
      }
      if (lowerCol.includes('moq') || lowerCol.includes('minimum')) {
        return { csvColumn: col, targetField: 'moq' };
      }
      if (lowerCol.includes('description') || lowerCol.includes('desc')) {
        return { csvColumn: col, targetField: 'description' };
      }
      if (lowerCol.includes('image') || lowerCol.includes('photo') || lowerCol.includes('url')) {
        return { csvColumn: col, targetField: 'imageUrl' };
      }
      
      return { csvColumn: col, targetField: 'ignore' };
    });
  };

  const parseAllItems = (text: string, mappings: FieldMapping[]): LibraryItem[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const rowData: any = {};
      headers.forEach((header, idx) => {
        rowData[header] = values[idx] || '';
      });
      
      const item: any = {
        id: `item_${Date.now()}_${index}`,
        libraryId: library.id,
      };
      
      mappings.forEach(mapping => {
        if (mapping.targetField !== 'ignore') {
          const value = rowData[mapping.csvColumn];
          if (mapping.targetField === 'price') {
            item[mapping.targetField] = parseFloat(value) || 0;
          } else if (mapping.targetField === 'stock' || mapping.targetField === 'moq') {
            item[mapping.targetField] = parseInt(value) || 0;
          } else {
            item[mapping.targetField] = value;
          }
        }
      });
      
      return item;
    });
  };

  const generateUpdatePreview = (newItems: LibraryItem[]) => {
    const existingSKUs = new Set(library.items.map(item => item.sku));
    const newSKUs = new Set(newItems.map(item => item.sku));
    
    const matched = newItems.filter(item => existingSKUs.has(item.sku)).length;
    const added = newItems.filter(item => !existingSKUs.has(item.sku)).length;
    const unchanged = library.items.filter(item => !newSKUs.has(item.sku)).length;

    setUpdatePreview({
      matchedItems: matched,
      newItems: added,
      unchangedItems: unchanged
    });
  };

  const handleMappingChange = (csvColumn: string, newTargetField: string) => {
    const newMappings = fieldMappings.map(mapping => 
      mapping.csvColumn === csvColumn 
        ? { ...mapping, targetField: newTargetField }
        : mapping
    );
    setFieldMappings(newMappings);
    
    // Re-parse items with new mappings
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const items = parseAllItems(text, newMappings);
        setParsedItems(items);
        generateUpdatePreview(items);
      };
      reader.readAsText(file);
    }
  };

  const validateMappings = (): boolean => {
    const requiredFields = TARGET_FIELDS.filter(f => f.required).map(f => f.value);
    const mappedFields = fieldMappings
      .filter(m => m.targetField !== 'ignore')
      .map(m => m.targetField);
    
    for (const required of requiredFields) {
      if (!mappedFields.includes(required)) {
        toast.error(`Required field "${required}" is not mapped`);
        return false;
      }
    }
    return true;
  };

  const handleNextToPreview = () => {
    if (!validateMappings()) return;
    setStep(2);
  };

  const handleConfirmUpdate = () => {
    setStep(3);
  };

  const handleExecuteUpdate = () => {
    // Merge existing items with new items
    const existingItemsMap = new Map(library.items.map(item => [item.sku, item]));
    const updatedItems = [...parsedItems];
    
    // Add unchanged items that weren't in the new CSV
    library.items.forEach(item => {
      const isInNewData = parsedItems.some(newItem => newItem.sku === item.sku);
      if (!isInNewData) {
        updatedItems.push(item);
      }
    });

    const updatedLibrary: ProductLibrary = {
      ...library,
      itemCount: updatedItems.length,
      lastUpdated: new Date().toISOString(),
      items: updatedItems
    };

    onUpdate(updatedLibrary);
    toast.success(`Updated "${library.name}" successfully`);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setFile(null);
    setCsvColumns([]);
    setFieldMappings([]);
    setPreviewData([]);
    setUpdatePreview(null);
    setParsedItems([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Library: {library.name}</DialogTitle>
          <DialogDescription>
            {step === 1 && 'Map CSV columns to update existing products'}
            {step === 2 && 'Review the update preview before confirming'}
            {step === 3 && 'Executing update...'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            {/* File Upload */}
            <div className="space-y-3">
              <Label>CSV File</Label>
              {!file ? (
                <div 
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Click to upload updated CSV file</p>
                  <p className="text-xs text-muted-foreground">
                    Supported format: .csv
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setCsvColumns([]);
                      setFieldMappings([]);
                      setUpdatePreview(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Source Tag - Read Only */}
            {file && (
              <>
                <div className="space-y-2">
                  <Label>Source Tag (Library Name)</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Badge variant="secondary">Locked</Badge>
                    <span className="font-medium">{library.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The library name cannot be changed during an update.
                  </p>
                </div>

                {/* Field Mapping */}
                <div className="space-y-3">
                  <Label>Field Mapping</Label>
                  <p className="text-xs text-muted-foreground">
                    Reusing previous field mappings where possible. You can adjust them if needed.
                  </p>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">CSV Column</TableHead>
                          <TableHead className="w-[200px]">Target Field</TableHead>
                          <TableHead>Preview Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fieldMappings.map((mapping, index) => (
                          <TableRow key={`mapping-${index}-${mapping.csvColumn}`}>
                            <TableCell className="font-mono text-sm">
                              {mapping.csvColumn}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={mapping.targetField}
                                onValueChange={(value) => handleMappingChange(mapping.csvColumn, value)}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {TARGET_FIELDS.map(field => (
                                    <SelectItem key={field.value} value={field.value}>
                                      {field.label}
                                      {field.required && <span className="text-destructive ml-1">*</span>}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {previewData[0]?.[mapping.csvColumn] || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {step === 2 && updatePreview && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    Confirm Update '{library.name}'
                  </h4>
                  <p className="text-sm text-blue-800">
                    Review the changes below before executing the update.
                  </p>
                </div>
              </div>
            </div>

            {/* Update Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium uppercase text-muted-foreground">
                    Will Update
                  </span>
                </div>
                <div className="text-2xl font-semibold">{updatePreview.matchedItems}</div>
                <p className="text-xs text-muted-foreground mt-1">Matching SKUs</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Plus className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium uppercase text-muted-foreground">
                    Will Add
                  </span>
                </div>
                <div className="text-2xl font-semibold text-green-600">
                  +{updatePreview.newItems}
                </div>
                <p className="text-xs text-muted-foreground mt-1">New SKUs</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium uppercase text-muted-foreground">
                    Unchanged
                  </span>
                </div>
                <div className="text-2xl font-semibold text-gray-600">
                  {updatePreview.unchangedItems}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Old SKUs</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-amber-900">
                <p className="font-medium mb-1">This action will:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Update {updatePreview.matchedItems} existing products with new data</li>
                  <li>• Add {updatePreview.newItems} new products to the library</li>
                  <li>• Keep {updatePreview.unchangedItems} existing products unchanged</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Update Complete</h3>
            <p className="text-sm text-muted-foreground">
              Library "{library.name}" has been updated successfully.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            {step === 3 ? 'Close' : 'Cancel'}
          </Button>
          <div className="flex items-center gap-2">
            {step === 2 && (
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
            )}
            {step === 1 && (
              <Button onClick={handleNextToPreview} disabled={!file}>
                Next: Preview Update
              </Button>
            )}
            {step === 2 && (
              <Button onClick={handleConfirmUpdate}>
                Confirm & Execute Update
              </Button>
            )}
            {step === 3 && (
              <Button onClick={handleExecuteUpdate}>
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
