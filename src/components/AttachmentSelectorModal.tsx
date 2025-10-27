import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  File,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Link as LinkIcon,
  Search,
  Check
} from 'lucide-react';
import { Attachment } from './PayloadsTab';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface AttachmentSelectorModalProps {
  open: boolean;
  onClose: () => void;
  attachments: Attachment[];
  selectedIds: string[];
  onConfirm: (attachmentIds: string[]) => void;
}

export function AttachmentSelectorModal({
  open,
  onClose,
  attachments,
  selectedIds,
  onConfirm
}: AttachmentSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [localSelectedIds, setLocalSelectedIds] = useState<Set<string>>(new Set(selectedIds));

  // Reset local selection when modal opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalSelectedIds(new Set(selectedIds));
      setSearchQuery('');
    } else {
      onClose();
    }
  };

  // Get file type icon
  const getFileIcon = (attachment: Attachment) => {
    if (attachment.type === 'link') {
      return <LinkIcon className="w-4 h-4 text-blue-600" />;
    }

    const fileType = attachment.fileType?.toLowerCase();
    
    if (fileType === 'pdf') {
      return <FileText className="w-4 h-4 text-red-600" />;
    } else if (fileType === 'xlsx' || fileType === 'xls' || fileType === 'csv') {
      return <FileSpreadsheet className="w-4 h-4 text-green-600" />;
    } else if (fileType === 'docx' || fileType === 'doc') {
      return <FileText className="w-4 h-4 text-blue-600" />;
    } else if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'gif') {
      return <ImageIcon className="w-4 h-4 text-purple-600" />;
    }
    
    return <File className="w-4 h-4 text-gray-600" />;
  };

  // Toggle selection
  const handleToggle = (attachmentId: string) => {
    setLocalSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(attachmentId)) {
        next.delete(attachmentId);
      } else {
        next.add(attachmentId);
      }
      return next;
    });
  };

  // Toggle all
  const handleToggleAll = () => {
    if (localSelectedIds.size === filteredAttachments.length) {
      setLocalSelectedIds(new Set());
    } else {
      setLocalSelectedIds(new Set(filteredAttachments.map(att => att.id)));
    }
  };

  // Confirm selection
  const handleConfirm = () => {
    onConfirm(Array.from(localSelectedIds));
    onClose();
  };

  // Filter attachments
  const filteredAttachments = attachments.filter(att =>
    att.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count newly selected
  const newlySelected = Array.from(localSelectedIds).filter(id => !selectedIds.includes(id)).length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add from Library</DialogTitle>
          <DialogDescription>
            Select attachments from the global library to link to this Material Pool
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search attachments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Badge variant="outline">
            {localSelectedIds.size} selected
          </Badge>
        </div>

        {/* Attachments List - Scrollable Area */}
        {filteredAttachments.length === 0 ? (
          <div className="border-2 border-dashed rounded-lg p-8 text-center flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              {searchQuery 
                ? 'No attachments found matching your search'
                : 'No attachments in library. Upload files from the Manage Attachments page first.'
              }
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden flex-1 min-h-0">
            <div className="overflow-y-auto max-h-full">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10 border-b">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={localSelectedIds.size === filteredAttachments.length && filteredAttachments.length > 0}
                        onCheckedChange={handleToggleAll}
                      />
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="min-w-[200px]">Name</TableHead>
                    <TableHead className="w-32">Type</TableHead>
                    <TableHead className="w-24">Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttachments.map(attachment => (
                    <TableRow 
                      key={attachment.id}
                      className={`cursor-pointer ${localSelectedIds.has(attachment.id) ? 'bg-blue-50' : ''}`}
                      onClick={() => handleToggle(attachment.id)}
                    >
                      <TableCell className="align-top py-3">
                        <Checkbox
                          checked={localSelectedIds.has(attachment.id)}
                          onCheckedChange={() => handleToggle(attachment.id)}
                        />
                      </TableCell>
                      <TableCell className="align-top py-3">
                        {getFileIcon(attachment)}
                      </TableCell>
                      <TableCell className="align-top py-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium break-words">{attachment.name}</p>
                          {attachment.type === 'link' && (
                            <p className="text-xs text-muted-foreground break-all mt-1">
                              {attachment.url}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="align-top py-3">
                        {attachment.type === 'link' ? (
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            <LinkIcon className="w-3 h-3 mr-1" />
                            Link
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {attachment.fileType?.toUpperCase()}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground align-top py-3 whitespace-nowrap">
                        {attachment.size || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {newlySelected > 0 && (
              <span className="text-green-600 font-medium">
                +{newlySelected} new attachment{newlySelected > 1 ? 's' : ''} will be added
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={localSelectedIds.size === 0}>
              <Check className="w-4 h-4 mr-2" />
              Confirm ({localSelectedIds.size})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
