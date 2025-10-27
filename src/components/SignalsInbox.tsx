import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Mail, 
  MessageSquare, 
  Download, 
  AlertCircle, 
  Clock, 
  CheckCircle,
  Reply,
  ExternalLink,
  Filter,
  Search,
  Archive,
  Star,
  StarOff,
  Inbox
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Signal {
  id: string;
  type: 'quote_request' | 'question' | 'download_blocked' | 'high_engagement' | 'verification_needed';
  title: string;
  description: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'in_progress' | 'resolved';
  contact?: {
    name: string;
    email: string;
    company?: string;
  };
  dropName: string;
  isStarred: boolean;
  content?: string;
}

const mockSignals: Signal[] = [
  {
    id: '1',
    type: 'quote_request',
    title: 'Quote request for Winter Collection',
    description: 'Sarah Chen requested pricing for 24 items from Winter Collection 2024',
    timestamp: '2 hours ago',
    priority: 'high',
    status: 'new',
    contact: {
      name: 'Sarah Chen',
      email: 'sarah.chen@retailco.com',
      company: 'RetailCo'
    },
    dropName: 'Winter Collection 2024',
    isStarred: false,
    content: 'Hi! I\'m interested in bulk pricing for the entire winter collection. Could you provide quotes for quantities of 50, 100, and 200 pieces? We\'re looking to place an order by end of month.'
  },
  {
    id: '2',
    type: 'question',
    title: 'Product specification inquiry',
    description: 'Michael Rodriguez asked about fabric composition for Premium Wool Sweater',
    timestamp: '5 hours ago',
    priority: 'medium',
    status: 'new',
    contact: {
      name: 'Michael Rodriguez',
      email: 'm.rodriguez@fashionhouse.com',
      company: 'Fashion House'
    },
    dropName: 'Premium SKU-7841',
    isStarred: true,
    content: 'Can you provide detailed fabric composition and care instructions for the Premium Wool Sweater? Also, do you have this available in other colors?'
  },
  {
    id: '3',
    type: 'download_blocked',
    title: 'Download access blocked',
    description: '3 users unable to access spec sheets due to L3 security settings',
    timestamp: '1 day ago',
    priority: 'medium',
    status: 'in_progress',
    dropName: 'Q1 Product Line',
    isStarred: false
  },
  {
    id: '4',
    type: 'high_engagement',
    title: 'High engagement alert',
    description: 'Premium Wool Sweater receiving unusual traffic spike (500% above normal)',
    timestamp: '2 days ago',
    priority: 'low', 
    status: 'resolved',
    dropName: 'Premium SKU-7841',
    isStarred: false
  }
];

export function SignalsInbox() {
  const [signals, setSignals] = useState(mockSignals);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [replyText, setReplyText] = useState('');

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'quote_request': return <Mail className="w-4 h-4 text-blue-600" />;
      case 'question': return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'download_blocked': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'high_engagement': return <Clock className="w-4 h-4 text-purple-600" />;
      case 'verification_needed': return <CheckCircle className="w-4 h-4 text-yellow-600" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleToggleStar = (signalId: string) => {
    setSignals(prev => prev.map(signal =>
      signal.id === signalId
        ? { ...signal, isStarred: !signal.isStarred }
        : signal
    ));
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedSignal) return;
    
    toast.success('Reply sent successfully');
    setReplyText('');
    
    // Update signal status
    setSignals(prev => prev.map(signal =>
      signal.id === selectedSignal.id
        ? { ...signal, status: 'in_progress' as const }
        : signal
    ));
  };

  const handleMarkResolved = (signalId: string) => {
    setSignals(prev => prev.map(signal =>
      signal.id === signalId
        ? { ...signal, status: 'resolved' as const }
        : signal
    ));
    toast.success('Signal marked as resolved');
  };

  const filteredSignals = signals.filter(signal => {
    if (activeTab === 'all') return true;
    if (activeTab === 'starred') return signal.isStarred;
    if (activeTab === 'unread') return signal.status === 'new';
    return signal.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Signals Inbox</h2>
          <p className="text-muted-foreground">Review and respond to customer intents and system alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Archive className="w-4 h-4 mr-2" />
            Archive All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signals List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Signals</CardTitle>
                <Badge variant="secondary">{filteredSignals.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="px-6 pb-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                    <TabsTrigger value="starred">Starred</TabsTrigger>
                  </TabsList>
                </div>

                <div className="px-6 pb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search signals..." className="pl-10" />
                  </div>
                </div>

                <TabsContent value={activeTab} className="mt-0">
                  <div className="space-y-0">
                    {filteredSignals.map((signal) => (
                      <div
                        key={signal.id}
                        className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedSignal?.id === signal.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => setSelectedSignal(signal)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getSignalIcon(signal.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getPriorityColor(signal.priority)}>
                                  {signal.priority}
                                </Badge>
                                <Badge variant="outline" className={getStatusColor(signal.status)}>
                                  {signal.status}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStar(signal.id);
                                }}
                              >
                                {signal.isStarred ? (
                                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                ) : (
                                  <StarOff className="w-3 h-3 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                            <h4 className="text-sm font-medium mb-1 truncate">{signal.title}</h4>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {signal.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{signal.timestamp}</span>
                              <span className="truncate ml-2">{signal.dropName}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Signal Detail */}
        <div className="lg:col-span-2">
          {selectedSignal ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getSignalIcon(selectedSignal.type)}
                    </div>
                    <div>
                      <CardTitle>{selectedSignal.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {selectedSignal.description}
                      </CardDescription>
                      <div className="flex items-center gap-3 mt-3">
                        <Badge variant="outline" className={getPriorityColor(selectedSignal.priority)}>
                          {selectedSignal.priority} priority
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(selectedSignal.status)}>
                          {selectedSignal.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{selectedSignal.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Drop
                    </Button>
                    {selectedSignal.status !== 'resolved' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMarkResolved(selectedSignal.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact Info */}
                {selectedSignal.contact && (
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedSignal.contact.name}`} />
                      <AvatarFallback>
                        {selectedSignal.contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedSignal.contact.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedSignal.contact.email}</div>
                      {selectedSignal.contact.company && (
                        <div className="text-sm text-muted-foreground">{selectedSignal.contact.company}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Message Content */}
                {selectedSignal.content && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="mb-2">Message</h4>
                    <p className="text-sm">{selectedSignal.content}</p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  {selectedSignal.type === 'quote_request' && (
                    <>
                      <Button size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Quote
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Products
                      </Button>
                    </>
                  )}
                  {selectedSignal.type === 'download_blocked' && (
                    <>
                      <Button size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Grant Access
                      </Button>
                      <Button variant="outline" size="sm">
                        Adjust Security
                      </Button>
                    </>
                  )}
                  {selectedSignal.type === 'question' && (
                    <Button size="sm">
                      <Reply className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                  )}
                </div>

                {/* Reply Section */}
                {selectedSignal.contact && selectedSignal.status !== 'resolved' && (
                  <div className="space-y-3">
                    <h4>Send Reply</h4>
                    <Textarea 
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                    />
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Reply will be sent to {selectedSignal.contact.name}
                      </div>
                      <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                        <Reply className="w-4 h-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3>Select a signal to view details</h3>
                <p className="text-muted-foreground">
                  Choose a signal from the list to review and respond
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}