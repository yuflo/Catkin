import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Copy, ExternalLink, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getMockFeedbackData, type FeedbackViewData } from '../data/mockDrops';

interface FeedbackPanelProps {
  dropId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackPanel({ dropId, isOpen, onClose }: FeedbackPanelProps) {
  const data = dropId ? getMockFeedbackData(dropId) : null;

  if (!data) {
    return null;
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?highlight=${data.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleOpenInNewWindow = () => {
    toast.success(`Opening ${data.name} in new window`);
  };

  const getScoreColor = () => {
    switch (data.engagementScore.level) {
      case "high": return "text-green-600";
      case "medium": return "text-blue-600";
      case "low": return "text-gray-600";
    }
  };

  const getScoreLabel = () => {
    switch (data.engagementScore.level) {
      case "high": return "High";
      case "medium": return "Medium";
      case "low": return "Low";
    }
  };

  const getEngagementVariant = (level: string): "default" | "secondary" | "outline" => {
    switch (level) {
      case "high": return "default";
      case "medium": return "secondary";
      case "low": return "outline";
    }
  };

  const getEngagementBadgeStyle = (level: string) => {
    switch (level) {
      case "high": return "bg-orange-100 text-orange-700";
      case "medium": return "bg-green-100 text-green-700";
      case "low": return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="space-y-3">
          <SheetTitle>{data.name}</SheetTitle>
          <SheetDescription>{data.materialPoolName}</SheetDescription>
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button variant="outline" size="sm" onClick={handleOpenInNewWindow}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Window
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-4">
              {/* Engagement Score Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className={`text-4xl ${getScoreColor()}`}>
                      {data.engagementScore.value}/100
                    </div>
                    <Badge variant={getEngagementVariant(data.engagementScore.level)}>
                      Engagement: {getScoreLabel()}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      {data.engagementScore.contributors}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Key Outcomes */}
              <div>
                <h4 className="mb-3">Key Outcomes</h4>
                <div className="grid gap-2">
                  {data.keyOutcomes.map((outcome, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                    >
                      <span className="text-2xl">{outcome.icon}</span>
                      <span className="text-sm">{outcome.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div>
                <h4 className="mb-3">Recent Activities</h4>
                <div className="space-y-3">
                  {data.recentActivities.map((activity, index) => (
                    <div key={index} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {activity.actor.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">{activity.actor}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="materials" className="space-y-2 mt-4">
              {data.materials.map((material, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{material.icon}</span>
                    <div>
                      <p className="text-sm">{material.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {material.type} • {material.size}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </TabsContent>

            {/* Leads Tab */}
            <TabsContent value="leads" className="space-y-2 mt-4">
              {data.leads.map((lead, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {lead.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.company}</p>
                      <p className="text-xs text-muted-foreground">{lead.lastActivity}</p>
                    </div>
                  </div>
                  <Badge className={getEngagementBadgeStyle(lead.engagementLevel)}>
                    {lead.engagementLevel === "high" ? "High" : lead.engagementLevel === "medium" ? "Medium" : "Low"}
                  </Badge>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
