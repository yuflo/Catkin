import { Mail, ExternalLink, Phone, Calendar, MessageSquare, StickyNote } from 'lucide-react';
import type { Activity } from '../../types/workbench';

interface TimelineProps {
  activities: Activity[];
}

const activityIcons = {
  email_sent: Mail,
  email_opened: Mail,
  link_clicked: ExternalLink,
  meeting_scheduled: Calendar,
  call_completed: Phone,
  note_added: StickyNote
};

const activityColors = {
  email_sent: 'bg-blue-100 text-blue-600',
  email_opened: 'bg-green-100 text-green-600',
  link_clicked: 'bg-purple-100 text-purple-600',
  meeting_scheduled: 'bg-amber-100 text-amber-600',
  call_completed: 'bg-indigo-100 text-indigo-600',
  note_added: 'bg-gray-100 text-gray-600'
};

export function Timeline({ activities }: TimelineProps) {
  const formatTimeAgo = (isoDate: string) => {
    const hours = Math.floor((Date.now() - new Date(isoDate).getTime()) / 3600000);
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} weeks ago`;
  };
  
  return (
    <div className="space-y-3">
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent activity</p>
        </div>
      ) : (
        activities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          const colorClass = activityColors[activity.type];
          
          return (
            <div key={activity.id} className="flex gap-3">
              <div className="relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {index < activities.length - 1 && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-200" />
                )}
              </div>
              
              <div className="flex-1 pb-4">
                <div className="text-sm text-gray-900">{activity.description}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                  {activity.actor && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{activity.actor}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
