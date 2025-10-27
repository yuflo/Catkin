import { Send, Phone, Clock, Archive, MessageSquare, Calendar } from 'lucide-react';
import type { NextStepPrimitive } from '../../types/workbench';

interface QuickActionsProps {
  onAction: (type: NextStepPrimitive | 'log_activity' | 'snooze' | 'ignore') => void;
}

const actions = [
  {
    type: 'send_drop' as const,
    label: 'Send General Drop',
    icon: Send,
    description: 'Create Drop without AI',
    shortcut: null
  },
  {
    type: 'log_activity' as const,
    label: 'Log Activity',
    icon: Phone,
    description: 'Record offline communication'
  },
  {
    type: 'schedule_call' as const,
    label: 'Schedule Call',
    icon: Calendar,
    description: 'Book a meeting'
  },
  {
    type: 'snooze' as const,
    label: 'Set Reminder',
    icon: Clock,
    description: 'Snooze for later',
    shortcut: 'S'
  },
  {
    type: 'ignore' as const,
    label: 'Archive',
    icon: Archive,
    description: 'Remove from queue'
  }
];

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Quick Actions</div>
        <div className="text-xs text-gray-400 mt-1">General & non-Drop actions</div>
      </div>
      
      <div className="p-4 grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.type}
              onClick={() => onAction(action.type)}
              className="
                group p-4 rounded-lg border-2 border-gray-200 bg-white
                hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm
                transition-all duration-200 text-left
              "
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{action.label}</span>
                    {action.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] bg-gray-100 rounded border text-gray-600">
                        {action.shortcut}
                      </kbd>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{action.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
