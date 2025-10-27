/**
 * 开发工具面板
 * 用于管理 localStorage 数据，方便调试和测试
 */

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import * as storage from '../lib/storage';

export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState({
    materialPools: 0,
    libraries: 0,
    attachments: 0,
    sceneTemplates: 0,
    authPolicies: 0,
    customPolicies: 0,
  });

  const updateStats = () => {
    setStats({
      materialPools: storage.loadMaterialPools().length,
      libraries: storage.loadProductLibraries().length,
      attachments: storage.loadGlobalAttachments().length,
      sceneTemplates: storage.loadSceneTemplates([]).length,
      authPolicies: storage.loadAuthPolicies([]).length,
      customPolicies: storage.loadCustomPolicies().length,
    });
  };

  const handleExport = () => {
    const data = storage.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `distribute-v3-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            storage.importAllData(data);
            toast.success('Data imported successfully. Please refresh the page.');
            updateStats();
          } catch (error) {
            toast.error('Failed to import data. Invalid file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearAll = () => {
    if (confirm('⚠️ Are you sure you want to clear ALL data? This cannot be undone!')) {
      storage.clearAllData();
      toast.success('All data cleared. Please refresh the page.');
      updateStats();
    }
  };

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      updateStats();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="fixed bottom-4 right-4 z-50 shadow-lg"
        >
          <Database className="w-4 h-4 mr-2" />
          Dev Tools
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Developer Tools</DialogTitle>
          <DialogDescription>
            Manage localStorage data for Distribute v3
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Data Statistics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Data Statistics</CardTitle>
              <CardDescription>Current items stored in localStorage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Material Pools</span>
                  <Badge variant="secondary">{stats.materialPools}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Product Libraries</span>
                  <Badge variant="secondary">{stats.libraries}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Global Attachments</span>
                  <Badge variant="secondary">{stats.attachments}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Scene Templates</span>
                  <Badge variant="secondary">{stats.sceneTemplates}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Auth Policies</span>
                  <Badge variant="secondary">{stats.authPolicies}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Custom Policies</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {stats.customPolicies}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Actions</CardTitle>
              <CardDescription>Manage your local data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={updateStats}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Statistics
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export All Data (Backup)
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleImport}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Data (Restore)
              </Button>
              
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={handleClearAll}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <p className="font-medium mb-1">Data Persistence Active</p>
              <p>All changes are automatically saved to localStorage and will persist across page refreshes.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-900">
              <p className="font-medium mb-1">Browser Storage Only</p>
              <p>Data is stored locally in your browser. Clearing browser data or using a different browser will reset all data.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
