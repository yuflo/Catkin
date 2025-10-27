import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Package } from 'lucide-react';

interface CreatePoolNameDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (poolName: string) => void;
  selectedCount: number;
  sourceName: string;
}

export function CreatePoolNameDialog({
  open,
  onClose,
  onConfirm,
  selectedCount,
  sourceName
}: CreatePoolNameDialogProps) {
  const [poolName, setPoolName] = useState('');

  // Reset pool name when dialog opens
  useEffect(() => {
    if (open) {
      setPoolName('');
    }
  }, [open]);

  const handleConfirm = () => {
    if (!poolName.trim()) {
      return;
    }
    onConfirm(poolName.trim());
    setPoolName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && poolName.trim()) {
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Name Your Material Pool</DialogTitle>
          <DialogDescription>
            Give your new Material Pool a descriptive name
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pool-name">
              Pool Name
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="pool-name"
              value={poolName}
              onChange={(e) => setPoolName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Q4 Sales Follow-up Pool"
              autoFocus
            />
          </div>

          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="text-muted-foreground">
              This pool will contain{' '}
              <span className="font-medium text-foreground">{selectedCount} {selectedCount === 1 ? 'item' : 'items'}</span>
              {' '}from {sourceName}.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!poolName.trim()}>
            <Package className="w-4 h-4 mr-2" />
            Create Pool
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
