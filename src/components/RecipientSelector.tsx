import { useState, useRef, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { X, User, Mail, Building } from 'lucide-react';
import { Lead, searchLeads } from '../data/mockLeads';

interface RecipientSelectorProps {
  selectedLead: Lead | null;
  onSelectLead: (lead: Lead | null) => void;
}

export function RecipientSelector({ selectedLead, onSelectLead }: RecipientSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const results = searchLeads(searchQuery);
    setFilteredLeads(results);
  }, [searchQuery]);

  const handleSelect = (lead: Lead) => {
    onSelectLead(lead);
    setOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onSelectLead(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm mb-1">Recipient</p>
          <p className="text-xs text-muted-foreground">
            Select the contact or customer for this Drop
          </p>
        </div>
      </div>

      {selectedLead ? (
        // Selected Lead Display
        <div className="border rounded-lg p-3 bg-blue-50/50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-500 text-white">
                  {selectedLead.avatar || selectedLead.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate">{selectedLead.name}</p>
                  {selectedLead.role && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedLead.role}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{selectedLead.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building className="h-3 w-3" />
                    <span className="truncate">{selectedLead.company}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 hover:bg-blue-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        // Search Input
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-start text-left font-normal"
            >
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Search for a contact or customer...</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>No contacts found.</CommandEmpty>
                <CommandGroup heading="Contacts">
                  {filteredLeads.slice(0, 8).map((lead) => (
                    <CommandItem
                      key={lead.id}
                      onSelect={() => handleSelect(lead)}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {lead.avatar || lead.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{lead.name}</p>
                          {lead.role && (
                            <Badge variant="secondary" className="text-xs">
                              {lead.role}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span className="truncate">{lead.email}</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="truncate">{lead.company}</span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
