import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  ArrowLeft,
  Upload,
  Search,
  File,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Plus,
  MoreVertical,
  Edit2,
  Paperclip
} from 'lucide-react';
import { Attachment } from './PayloadsTab';
import { toast } from 'sonner@2.0.3';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';

interface GlobalAttachmentsPageProps {
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
  onBack: () => void;
}

export function GlobalAttachmentsPage({
  attachments,
  onAttachmentsChange,
  onBack
}: GlobalAttachmentsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkName, setLinkName] = useState('');
  const [editingAttachment, setEditingAttachment] = useState<Attachment | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editName, setEditName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get file type icon
  const getFileIcon = (attachment: Attachment) => {
    if (attachment.type === 'link') {
      return <LinkIcon className="w-5 h-5 text-blue-600" />;
    }

    const fileType = attachment.fileType?.toLowerCase();
    
    if (fileType === 'pdf') {
      return <FileText className="w-5 h-5 text-red-600" />;
    } else if (fileType === 'xlsx' || fileType === 'xls' || fileType === 'csv') {
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
    } else if (fileType === 'docx' || fileType === 'doc') {
      return <FileText className="w-5 h-5 text-blue-600" />;
    } else if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'gif') {
      return <ImageIcon className="w-5 h-5 text-purple-600" />;
    }
    
    return <File className="w-5 h-5 text-gray-600" />;
  };

  // Get file type from filename
  const getFileType = (filename: string): string => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : 'file';
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Handle file upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = [];

    Array.from(files).forEach(file => {
      const attachment: Attachment = {
        id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'upload',
        name: file.name,
        url: URL.createObjectURL(file),
        size: formatFileSize(file.size),
        fileType: getFileType(file.name),
        uploadedBy: 'Current User',
        uploadedAt: new Date().toISOString()
      };
      newAttachments.push(attachment);
    });

    onAttachmentsChange([...attachments, ...newAttachments]);
    toast.success(`Uploaded ${newAttachments.length} file${newAttachments.length > 1 ? 's' : ''} to library`);
  };

  // Handle link addition
  const handleAddLink = () => {
    if (!linkUrl) {
      toast.error('Please enter a URL');
      return;
    }

    const attachment: Attachment = {
      id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'link',
      name: linkName || linkUrl,
      url: linkUrl,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString()
    };

    onAttachmentsChange([...attachments, attachment]);
    toast.success('Link added to library');
    setShowLinkDialog(false);
    setLinkUrl('');
    setLinkName('');
  };

  // Handle rename
  const handleStartEdit = (attachment: Attachment) => {
    setEditingAttachment(attachment);
    setEditName(attachment.name);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editingAttachment || !editName.trim()) return;

    onAttachmentsChange(
      attachments.map(att =>
        att.id === editingAttachment.id
          ? { ...att, name: editName }
          : att
      )
    );

    toast.success('Attachment renamed');
    setShowEditDialog(false);
    setEditingAttachment(null);
    setEditName('');
  };

  // Handle delete
  const handleDelete = (attachmentId: string) => {
    onAttachmentsChange(attachments.filter(att => att.id !== attachmentId));
    toast.success('Attachment deleted from library');
  };

  // Filter attachments
  const filteredAttachments = attachments.filter(att =>
    att.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payloads
          </Button>
          <div className="w-px h-6 bg-border" />
          <div>
            <h2>Global Attachment Library</h2>
            <p className="text-sm text-muted-foreground">
              Centralized management for all attachment files, reusable across multiple Material Pools
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowLinkDialog(true)}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Add Link
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search attachments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Badge variant="outline" className="text-sm">
          {attachments.length} {attachments.length === 1 ? 'file' : 'files'}
        </Badge>
      </div>

      {/* Attachments Table */}
      {filteredAttachments.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Paperclip className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium mb-2">
            {searchQuery ? 'No attachments found' : 'No attachments yet'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery 
              ? 'Try a different search query'
              : 'Upload files or add links to start building your attachment library'
            }
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttachments.map(attachment => (
                <TableRow key={attachment.id} className="group">
                  <TableCell>
                    {getFileIcon(attachment)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{attachment.name}</p>
                      {attachment.type === 'link' && (
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {attachment.url}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {attachment.type === 'link' ? (
                      <Badge variant="outline" className="text-xs">
                        <LinkIcon className="w-3 h-3 mr-1" />
                        Link
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        {attachment.fileType?.toUpperCase()}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {attachment.size || '-'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {attachment.uploadedBy || '-'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(attachment.uploadedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStartEdit(attachment)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(attachment.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.gif"
      />

      {/* Add Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link to Library</DialogTitle>
            <DialogDescription>
              Add a link to an external resource to your global attachment library
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="link-url">URL *</Label>
              <Input
                id="link-url"
                placeholder="https://docs.google.com/..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-name">Display Name (Optional)</Label>
              <Input
                id="link-name"
                placeholder="Q4 Partner Price List"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowLinkDialog(false);
                  setLinkUrl('');
                  setLinkName('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddLink}>
                <Plus className="w-4 h-4 mr-2" />
                Add to Library
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Attachment</DialogTitle>
            <DialogDescription>
              Change the display name of this attachment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingAttachment(null);
                  setEditName('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
