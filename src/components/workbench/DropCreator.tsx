import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Rocket, CheckCircle, Sparkles } from 'lucide-react';
import type { DropConfig, MaterialPool } from '../../types/workbench';
import { MATERIAL_POOLS } from '../../lib/dropIntegration';

interface DropCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  dropConfig: DropConfig;
  onCreateDrop: (config: DropConfig) => void;
}

export function DropCreator({ isOpen, onClose, dropConfig, onCreateDrop }: DropCreatorProps) {
  const [selectedPool, setSelectedPool] = useState<MaterialPool | undefined>(dropConfig.materialPool);
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  const filteredPools = MATERIAL_POOLS.filter(pool => pool.intent === dropConfig.intent);
  const isRecommended = (pool: MaterialPool) => pool.id === dropConfig.materialPool?.id;
  
  const handleCreate = () => {
    onCreateDrop({
      ...dropConfig,
      materialPool: selectedPool
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Drop</DialogTitle>
          <DialogDescription>
            Review AI recommendations and customize your Drop configuration
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Recipient */}
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-3">Recipient</div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  {getInitials(dropConfig.recipient.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-sm">{dropConfig.recipient.name}</div>
                {dropConfig.recipient.email && (
                  <div className="text-xs text-gray-500">{dropConfig.recipient.email}</div>
                )}
              </div>
              <Badge variant="secondary">Auto-selected</Badge>
            </div>
          </div>
          
          {/* Business Intent */}
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-3">Business Intent</div>
            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-gray-900 mb-1 capitalize">
                    {dropConfig.intent.replace('_', ' ')}
                  </div>
                  <div className="text-xs text-gray-600">AI-selected based on lead context</div>
                </div>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-selected
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Material Pool Selection */}
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-3">
              Material Pool
              {dropConfig.materialPool && (
                <span className="ml-2 text-xs font-normal text-gray-500">
                  (AI recommendation highlighted)
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {filteredPools.map((pool) => {
                const recommended = isRecommended(pool);
                const selected = selectedPool?.id === pool.id;
                
                return (
                  <button
                    key={pool.id}
                    onClick={() => setSelectedPool(pool)}
                    className={`
                      p-4 rounded-lg border-2 text-left transition-all
                      ${selected 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : recommended
                        ? 'border-amber-300 bg-amber-50/50 hover:border-amber-400 ring-2 ring-amber-200'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold text-sm text-gray-900">{pool.name}</div>
                      {recommended && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] ml-2">
                          <Sparkles className="w-2.5 h-2.5 mr-1" />
                          AI
                        </Badge>
                      )}
                      {selected && !recommended && (
                        <CheckCircle className="w-5 h-5 text-blue-600 ml-2 flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{pool.description}</div>
                    <div className="text-xs text-gray-500">{pool.templateCount} templates</div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Preview */}
          {dropConfig.prefilledSubject && (
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-3">Preview</div>
              <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Subject</div>
                  <div className="text-sm font-medium text-gray-900">{dropConfig.prefilledSubject}</div>
                </div>
                {dropConfig.prefilledContent && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Preview</div>
                    <div className="text-sm text-gray-700 whitespace-pre-line">{dropConfig.prefilledContent}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!selectedPool}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Create Drop
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
