import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  File, 
  FileText, 
  FileSpreadsheet, 
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Plus,
  Paperclip,
  ExternalLink
} from 'lucide-react';
import { Attachment } from './PayloadsTab';
import { toast } from 'sonner@2.0.3';
import { AttachmentSelectorModal } from './AttachmentSelectorModal';

interface ContextualAttachmentsProps {
  attachmentIds: string[];
  globalAttachments: Attachment[];
  onAttachmentIdsChange: (attachmentIds: string[]) => void;
  onNavigateToManage: () => void;
}

export function ContextualAttachments({ 
  attachmentIds, 
  globalAttachments,
  onAttachmentIdsChange,
  onNavigateToManage
}: ContextualAttachmentsProps) {
  const [showSelectorModal, setShowSelectorModal] = useState(false);

  // Get attachment details from IDs
  const attachments = attachmentIds
    .map(id => globalAttachments.find(att => att.id === id))
    .filter(Boolean) as Attachment[];

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

  // Handle selector confirm
  const handleConfirmSelection = (selectedIds: string[]) => {
    onAttachmentIdsChange(selectedIds);
    const added = selectedIds.length - attachmentIds.length;
    if (added > 0) {
      toast.success(`Added ${added} attachment${added > 1 ? 's' : ''} from library`);
    } else if (added < 0) {
      toast.success(`Removed ${Math.abs(added)} attachment${Math.abs(added) > 1 ? 's' : ''}`);
    }
  };

  // Handle unlink
  const handleUnlink = (attachmentId: string) => {
    onAttachmentIdsChange(attachmentIds.filter(id => id !== attachmentId));
    toast.success('Attachment unlinked from pool');
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium">Contextual Attachments</h3>
          <p className="text-sm text-muted-foreground">
            Link spec sheets, price lists, or other supplementary files to this Material Pool
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowSelectorModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add from Library
        </Button>
      </div>

      {/* Attachments List or Empty State */}
      {attachments.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
            <Paperclip className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium mb-1">No attachments linked yet</p>
          <p className="text-xs text-muted-foreground">
            {globalAttachments.length === 0 
              ? 'Upload files to the global library first, then add them here'
              : 'Click the button below to link attachments from your library'
            }
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {attachments.length} {attachments.length === 1 ? 'attachment' : 'attachments'} linked
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSelectorModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add More
            </Button>
          </div>
          <div className="divide-y">
            {attachments.map(attachment => (
              <div
                key={attachment.id}
                className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors group"
              >
                {/* File Icon */}
                <div className="flex-shrink-0">
                  {getFileIcon(attachment)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {attachment.name}
                    </p>
                    {attachment.type === 'link' ? (
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        <LinkIcon className="w-3 h-3 mr-1" />
                        Link
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {attachment.fileType?.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {attachment.size && (
                      <p className="text-xs text-muted-foreground">
                        {attachment.size}
                      </p>
                    )}
                    {attachment.type === 'link' && (
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline truncate"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {attachment.url}
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnlink(attachment.id)}
                    className="h-8 w-8 p-0"
                    title="Unlink from pool"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attachment Selector Modal */}
      <AttachmentSelectorModal
        open={showSelectorModal}
        onClose={() => setShowSelectorModal(false)}
        attachments={globalAttachments}
        selectedIds={attachmentIds}
        onConfirm={handleConfirmSelection}
      />
    </div>
  );
}
