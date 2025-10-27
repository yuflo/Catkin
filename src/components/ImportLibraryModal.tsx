import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ProductLibrary, LibraryItem } from './PayloadsTab';
import { toast } from 'sonner@2.0.3';

interface ImportLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (library: ProductLibrary) => void;
}

interface FieldMapping {
  csvColumn: string;
  targetField: string;
  confidence: 'high' | 'medium' | 'low';
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

export function ImportLibraryModal({ open, onClose, onImport }: ImportLibraryModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [file, setFile] = useState<File | null>(null);
  const [sourceTag, setSourceTag] = useState('');
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setFile(selectedFile);
    
    // Auto-fill source tag from filename (remove extension)
    const fileName = selectedFile.name.replace('.csv', '');
    setSourceTag(fileName);

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

    // Perform weak AI matching
    const mappings = performAutoMapping(headers);
    setFieldMappings(mappings);
  };

  const performAutoMapping = (columns: string[]): FieldMapping[] => {
    return columns.map(col => {
      const lowerCol = col.toLowerCase();
      
      // High confidence matches
      if (lowerCol.includes('sku') || lowerCol === 'id') {
        return { csvColumn: col, targetField: 'sku', confidence: 'high' };
      }
      if (lowerCol.includes('name') || lowerCol.includes('product') || lowerCol.includes('title')) {
        return { csvColumn: col, targetField: 'name', confidence: 'high' };
      }
      if (lowerCol.includes('price') || lowerCol.includes('cost')) {
        return { csvColumn: col, targetField: 'price', confidence: 'high' };
      }
      
      // Medium confidence matches
      if (lowerCol.includes('category') || lowerCol.includes('type')) {
        return { csvColumn: col, targetField: 'category', confidence: 'medium' };
      }
      if (lowerCol.includes('stock') || lowerCol.includes('quantity') || lowerCol.includes('qty')) {
        return { csvColumn: col, targetField: 'stock', confidence: 'medium' };
      }
      if (lowerCol.includes('moq') || lowerCol.includes('minimum')) {
        return { csvColumn: col, targetField: 'moq', confidence: 'medium' };
      }
      if (lowerCol.includes('description') || lowerCol.includes('desc')) {
        return { csvColumn: col, targetField: 'description', confidence: 'medium' };
      }
      if (lowerCol.includes('attachment') && (lowerCol.includes('url') || lowerCol.includes('link'))) {
        return { csvColumn: col, targetField: 'attachmentUrl', confidence: 'high' };
      }
      if (lowerCol.includes('image') || lowerCol.includes('photo')) {
        return { csvColumn: col, targetField: 'imageUrl', confidence: 'medium' };
      }
      
      // Low confidence - ignore by default
      return { csvColumn: col, targetField: 'ignore', confidence: 'low' };
    });
  };

  const handleMappingChange = (csvColumn: string, newTargetField: string) => {
    setFieldMappings(prev => prev.map(mapping => 
      mapping.csvColumn === csvColumn 
        ? { ...mapping, targetField: newTargetField }
        : mapping
    ));
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
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

  const handleConfirmMapping = () => {
    if (!validateMappings()) return;
    if (!sourceTag.trim()) {
      toast.error('Please enter a Source Tag');
      return;
    }
    
    setStep(2);
  };

  const handleFinalImport = () => {
    if (!file) return;

    // Read and parse the full CSV
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Parse all items
      const items: LibraryItem[] = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim());
        const rowData: any = {};
        headers.forEach((header, idx) => {
          rowData[header] = values[idx] || '';
        });
        
        // Map to LibraryItem
        const item: any = {
          id: `item_${Date.now()}_${index}`,
          libraryId: '', // Will be set below
        };
        
        fieldMappings.forEach(mapping => {
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

      // Create library
      const libraryId = `lib_${Date.now()}`;
      items.forEach(item => item.libraryId = libraryId);

      const library: ProductLibrary = {
        id: libraryId,
        name: sourceTag,
        itemCount: items.length,
        lastUpdated: new Date().toISOString(),
        items
      };

      onImport(library);
      toast.success(`Imported ${items.length} items into "${sourceTag}"`);
      handleClose();
    };
    reader.readAsText(file);
  };

  const handleClose = () => {
    setStep(1);
    setFile(null);
    setSourceTag('');
    setCsvColumns([]);
    setFieldMappings([]);
    setPreviewData([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import New Library</DialogTitle>
          <DialogDescription>
            {step === 1 ? 'Map your CSV columns to product fields' : 'Review and confirm import'}
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
                  <p className="text-sm font-medium mb-1">Click to upload CSV file</p>
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
                      setSourceTag('');
                      setCsvColumns([]);
                      setFieldMappings([]);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Source Tag */}
            {file && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="source-tag">
                    Source Tag (Library Name)
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Input
                    id="source-tag"
                    value={sourceTag}
                    onChange={(e) => setSourceTag(e.target.value)}
                    placeholder="e.g., Q4 New Products"
                  />
                  <p className="text-xs text-muted-foreground">
                    This name will identify this product library.
                  </p>
                </div>

                {/* Field Mapping */}
                <div className="space-y-3">
                  <Label>Field Mapping</Label>
                  <p className="text-xs text-muted-foreground">
                    Map CSV columns to product fields. The system has pre-filled suggestions based on column names.
                  </p>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">CSV Column</TableHead>
                          <TableHead className="w-[200px]">Target Field</TableHead>
                          <TableHead className="w-[120px]">Confidence</TableHead>
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
                            <TableCell>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getConfidenceColor(mapping.confidence)}`}
                              >
                                {mapping.confidence === 'high' && <Check className="w-3 h-3 mr-1" />}
                                {mapping.confidence === 'medium' && <AlertCircle className="w-3 h-3 mr-1" />}
                                {mapping.confidence}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {previewData[0]?.[mapping.csvColumn] || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-blue-900">
                      <span className="font-medium">Required fields:</span> SKU, Product Name, Price
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-900 mb-1">
                    Ready to Import
                  </h4>
                  <p className="text-sm text-green-800">
                    Your CSV has been validated and is ready for import.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Library Name:</span>
                <span className="text-sm font-medium">{sourceTag}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">File:</span>
                <span className="text-sm font-medium">{file?.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Estimated Items:</span>
                <span className="text-sm font-medium">~{previewData.length > 0 ? previewData.length * 10 : 0}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            {step === 2 && (
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
            )}
            {step === 1 ? (
              <Button onClick={handleConfirmMapping} disabled={!file || !sourceTag}>
                Next: Review
              </Button>
            ) : (
              <Button onClick={handleFinalImport}>
                <Upload className="w-4 h-4 mr-2" />
                Confirm Import
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
