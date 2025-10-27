import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Clock, Calendar, Sunrise, Sun, Moon } from 'lucide-react';

interface SnoozePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSnooze: (whenISO: string) => void;
}

const snoozeOptions = [
  {
    label: 'Later Today',
    description: '4 hours from now',
    icon: Sun,
    hours: 4
  },
  {
    label: 'Tomorrow Morning',
    description: '9am next day',
    icon: Sunrise,
    getDate: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      return tomorrow;
    }
  },
  {
    label: 'Tomorrow Afternoon',
    description: '2pm next day',
    icon: Sun,
    getDate: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0);
      return tomorrow;
    }
  },
  {
    label: 'In 2 Days',
    description: 'Day after tomorrow',
    icon: Calendar,
    hours: 48
  },
  {
    label: 'Next Week',
    description: '7 days from now',
    icon: Calendar,
    hours: 168
  },
  {
    label: 'In 2 Weeks',
    description: '14 days from now',
    icon: Calendar,
    hours: 336
  }
];

export function SnoozePicker({ isOpen, onClose, onSnooze }: SnoozePickerProps) {
  const handleSnooze = (option: typeof snoozeOptions[0]) => {
    let date: Date;
    if (option.getDate) {
      date = option.getDate();
    } else {
      date = new Date(Date.now() + (option.hours! * 60 * 60 * 1000));
    }
    onSnooze(date.toISOString());
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Set Reminder</DialogTitle>
          <DialogDescription>
            When would you like to be reminded about this lead?
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 py-4">
          {snoozeOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.label}
                onClick={() => handleSnooze(option)}
                className="
                  p-4 rounded-lg border-2 border-gray-200 bg-white
                  hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm
                  transition-all duration-200 text-left
                "
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900 mb-0.5">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
