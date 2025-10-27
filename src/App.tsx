import { useState, useEffect } from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { Button } from './components/ui/button';
import { Overview } from './components/Overview';
import { DropsTab } from './components/DropsTab';
import { PayloadsTab } from './components/PayloadsTab';
import { GrowthPanel } from './components/GrowthPanel';
import { SettingsTab, AuthPreset } from './components/SettingsTab';
import { SceneTemplateConfig } from './components/SceneTemplateConfig';
import { Policy } from './types/policy';
import { DropSceneTemplate } from './types/dropSceneTemplate';

import { FastCreateDropV31 as FastCreateDrop } from './components/FastCreateDropV31';
import { CreateMaterialPoolPage } from './components/CreateMaterialPoolPage';
import { GlobalAttachmentsPage } from './components/GlobalAttachmentsPage';
import { DevTools } from './components/DevTools';
import { ProductLibrary, MaterialPool, Attachment } from './components/PayloadsTab';
import { Home, Package, Layers, TrendingUp, Settings, Plus, Database, Bookmark, Paperclip, Link, Users, Archive, Zap, Briefcase } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { AIGrowthWorkbench } from './components/AIGrowthWorkbench';

// 引入持久化存储模块
import * as storage from './lib/storage';
import { STANDARD_DROP_SCENE_TEMPLATES } from './data/standardDropSceneTemplates';

type ActiveView = 'overview' | 'payloads' | 'drops' | 'create-drop' | 'fast-create-drop' | 'create-material-pool' | 'manage-attachments' | 'growth' | 'growth-leads' | 'growth-grid' | 'ai-workbench' | 'settings' | 'scene-template-simple-catalog' | 'scene-template-catalog-quote' | 'scene-template-spec-doc' | 'scene-template-conversation-starter';

interface NavigationSection {
  type: 'section';
  id: string;
  label: string;
  icon: any;
}

interface NavigationItem {
  type: 'item';
  id: string;
  label: string;
  icon: any;
  parent?: string;
}

type NavigationElement = NavigationSection | NavigationItem;

const navigationItems: NavigationElement[] = [
  { type: 'item', id: 'overview', label: 'Overview', icon: Home },
  { type: 'item', id: 'drops', label: 'Drops', icon: Package },
  { type: 'item', id: 'fast-create-drop', label: 'Fast Create Drop', icon: Zap },
  { type: 'item', id: 'ai-workbench', label: 'AI Growth Workbench', icon: Briefcase },
  { type: 'item', id: 'growth', label: 'Growth Panel', icon: TrendingUp },
  { type: 'item', id: 'payloads', label: 'Payloads', icon: Layers },
  { type: 'item', id: 'settings', label: 'Settings', icon: Settings }
];

// Initial mock data for Auth Policies
const initialAuthPresets: AuthPreset[] = [
  {
    id: '1',
    name: 'Public Access',
    level: 'L1',
    version: 1,
    verification: 'none',
    ttlDays: 30,
    watermark: false,
    watermarkOpacity: 0.3,
    downloadPolicy: 'allow',
    consentBanner: false,
    createdBy: 'System',
    createdAt: '2 weeks ago',
    usageCount: 24,
    isDefault: true
  },
  {
    id: '2',
    name: 'Email Verification',
    level: 'L2',
    version: 2,
    verification: 'email',
    ttlDays: 14,
    watermark: true,
    watermarkText: '{{org}} • {{timestamp}}',
    watermarkOpacity: 0.4,
    downloadPolicy: 'guarded',
    consentBanner: true,
    consentText: 'By viewing this content, you accept our terms and conditions.',
    createdBy: 'Admin',
    createdAt: '1 week ago',
    usageCount: 18,
    isDefault: true
  },
  {
    id: '3',
    name: 'Managed Access',
    level: 'L3',
    version: 1,
    verification: 'email',
    ttlDays: 7,
    watermark: true,
    watermarkText: '{{org}} • {{drop_id}} • {{timestamp}}',
    watermarkOpacity: 0.5,
    downloadPolicy: 'block',
    deviceCap: 3,
    consentBanner: true,
    consentText: 'This content is confidential. Unauthorized sharing is prohibited.',
    linkExpiryHours: 24,
    createdBy: 'Admin',
    createdAt: '3 days ago',
    usageCount: 12,
    isDefault: true
  }
];

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [lastSettingsTab, setLastSettingsTab] = useState<'auth' | 'channel' | 'drop-templates' | 'integrations'>('drop-templates');
  const [createMaterialPoolData, setCreateMaterialPoolData] = useState<any>(null);
  
  // ===== 持久化数据状态 - 从 localStorage 初始化 =====
  
  // CRM Connection
  const [connectedCRM, setConnectedCRM] = useState<'salesforce' | 'hubspot' | null>(() => storage.loadConnectedCRM());
  
  // Payloads Data
  const [libraries, setLibraries] = useState<ProductLibrary[]>(() => storage.loadProductLibraries());
  const [pools, setPools] = useState<MaterialPool[]>(() => storage.loadMaterialPools());
  
  // Global Attachments Bank
  const [globalAttachments, setGlobalAttachments] = useState<Attachment[]>(() => storage.loadGlobalAttachments());
  
  // Settings Data - Auth Policies
  const [authPolicies, setAuthPolicies] = useState<AuthPreset[]>(() => storage.loadAuthPolicies(initialAuthPresets));
  
  // Drop Scene Templates (for DropSceneTemplatesOverview)
  const [dropSceneTemplates, setDropSceneTemplates] = useState<DropSceneTemplate[]>(() => storage.loadDropSceneTemplates(STANDARD_DROP_SCENE_TEMPLATES));
  
  // Policies (统一管理：标准策略 + 自定义策略)
  const [allPolicies, setAllPolicies] = useState<Policy[]>(() => storage.loadAllPolicies());

  // ===== 数据变更时自动保存到 localStorage =====
  
  useEffect(() => {
    storage.saveConnectedCRM(connectedCRM);
  }, [connectedCRM]);

  useEffect(() => {
    storage.saveProductLibraries(libraries);
  }, [libraries]);

  useEffect(() => {
    storage.saveMaterialPools(pools);
  }, [pools]);

  useEffect(() => {
    storage.saveGlobalAttachments(globalAttachments);
  }, [globalAttachments]);

  useEffect(() => {
    storage.saveAuthPolicies(authPolicies);
  }, [authPolicies]);

  useEffect(() => {
    storage.saveDropSceneTemplates(dropSceneTemplates);
  }, [dropSceneTemplates]);

  useEffect(() => {
    // 只保存自定义策略（标准策略不需要保存）
    storage.saveCustomPolicies(allPolicies);
  }, [allPolicies]);

  // Track when navigating from settings to a template detail
  const handleNavigate = (view: ActiveView | 'settings-integrations' | 'settings-auth' | 'settings-drop-templates', data?: any) => {
    // If navigating from settings to a template, remember we were on drop-templates tab
    if (activeView === 'settings' && view.startsWith('scene-template-')) {
      setLastSettingsTab('drop-templates');
    }
    
    // Handle navigation to settings with specific tab
    if (view === 'settings-integrations') {
      setLastSettingsTab('integrations');
      setActiveView('settings');
    } else if (view === 'settings-auth') {
      setLastSettingsTab('auth');
      setActiveView('settings');
    } else if (view === 'settings-drop-templates') {
      setLastSettingsTab('drop-templates');
      setActiveView('settings');
    } else {
      // Store data for create-material-pool view
      if (view === 'create-material-pool' && data) {
        setCreateMaterialPoolData(data);
      }
      setActiveView(view as ActiveView);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <Overview onNavigate={handleNavigate} onCreateDrop={() => setActiveView('create-drop')} />;
      case 'drops':
        return <DropsTab />;
      case 'create-drop':
      case 'fast-create-drop':
        return <FastCreateDrop onNavigate={handleNavigate} materialPools={pools} libraries={libraries} allPolicies={allPolicies} dropSceneTemplates={dropSceneTemplates} />;
      case 'payloads':
        return (
          <PayloadsTab 
            onNavigate={handleNavigate} 
            onCreateDrop={() => setActiveView('create-drop')}
            libraries={libraries}
            pools={pools}
            onLibrariesChange={setLibraries}
            onPoolsChange={setPools}
            globalAttachments={globalAttachments}
          />
        );
      case 'manage-attachments':
        return (
          <GlobalAttachmentsPage
            attachments={globalAttachments}
            onAttachmentsChange={setGlobalAttachments}
            onBack={() => setActiveView('payloads')}
          />
        );
      case 'create-material-pool':
        return createMaterialPoolData ? (
          <CreateMaterialPoolPage 
            libraries={libraries}
            context={createMaterialPoolData.context}
            onBack={() => setActiveView('payloads')}
            onCreatePool={(pool) => {
              setPools([...pools, pool]);
              setActiveView('payloads');
            }}
          />
        ) : null;
      case 'ai-workbench':
        return <AIGrowthWorkbench />;
      case 'growth':
      case 'growth-leads':
      case 'growth-grid':
        return <GrowthPanel activeTab={activeView} onNavigate={handleNavigate} connectedCRM={connectedCRM} />;
      case 'settings':
        return <SettingsTab 
          onNavigate={handleNavigate} 
          initialTab={lastSettingsTab} 
          connectedCRM={connectedCRM}
          onCRMConnect={setConnectedCRM}
          onCRMDisconnect={() => setConnectedCRM(null)}
          authPolicies={authPolicies}
          onAuthPoliciesChange={setAuthPolicies}
          dropSceneTemplates={dropSceneTemplates}
          onDropSceneTemplatesChange={setDropSceneTemplates}
          allPolicies={allPolicies}
          onPoliciesChange={setAllPolicies}
        />;
      case 'scene-template-simple-catalog':
        return <SceneTemplateConfig templateType="simple-catalog" onNavigate={handleNavigate} context="settings" />;
      case 'scene-template-catalog-quote':
        return <SceneTemplateConfig templateType="catalog-quote" onNavigate={handleNavigate} context="settings" />;
      case 'scene-template-spec-doc':
        return <SceneTemplateConfig templateType="spec-doc" onNavigate={handleNavigate} context="settings" />;
      case 'scene-template-conversation-starter':
        return <SceneTemplateConfig templateType="conversation-starter" onNavigate={handleNavigate} context="settings" />;
      default:
        return <Overview onNavigate={setActiveView} onCreateDrop={() => setActiveView('create-drop')} />;
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    // Ignore keyboard shortcuts when user is typing in an input field
    const target = e.target as HTMLElement;
    const isTyping = target.tagName === 'INPUT' || 
                     target.tagName === 'TEXTAREA' || 
                     target.isContentEditable;
    
    if (isTyping) return;
    
    if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
      setActiveView('create-drop');
    } else if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
      setActiveView('fast-create-drop');
    } else if (e.key === 'l' && !e.ctrlKey && !e.metaKey) {
      setActiveView('growth-leads');
    } else if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
      setActiveView('growth-grid');
    }
  };

  // Add keyboard listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress as any);
    return () => document.removeEventListener('keydown', handleKeyPress as any);
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg">Distribute v3</h1>
                <p className="text-xs text-muted-foreground">Fast create & distribute</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {navigationItems.map((element) => (
                <SidebarMenuItem key={element.id}>
                  <SidebarMenuButton
                    isActive={activeView === element.id || (element.id === 'growth' && (activeView === 'growth-leads' || activeView === 'growth-grid')) || (element.id === 'settings' && activeView.startsWith('scene-template-'))}
                    onClick={() => handleNavigate(element.id === 'growth' ? 'growth-leads' : element.id as ActiveView)}
                  >
                    <element.icon className="w-4 h-4" />
                    <span>{element.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          {activeView === 'ai-workbench' ? (
            <div className="h-screen flex flex-col">
              <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center px-6">
                  <SidebarTrigger />
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                {renderContent()}
              </div>
            </div>
          ) : (
            <>
              <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center px-6">
                  <SidebarTrigger />
                </div>
              </div>

              <div className="p-6">
                {renderContent()}
              </div>
            </>
          )}
        </main>

        {/* 开发工具面板 */}
        <DevTools />
      </div>
      
      {/* Toast Notifications */}
      <Toaster />
    </SidebarProvider>
  );
}