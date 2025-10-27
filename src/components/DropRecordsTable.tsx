import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { ExternalLink, Edit, Copy, Archive, MoreHorizontal, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { EngagementScoreCell } from './EngagementScoreCell';
import { toast } from 'sonner@2.0.3';
import type { DropRecord } from '../data/mockDrops';

interface DropRecordsTableProps {
  drops: DropRecord[];
  highlightedDropId?: string;
  onRowClick: (dropId: string) => void;
}

const ITEMS_PER_PAGE = 20;

export function DropRecordsTable({ drops, highlightedDropId, onRowClick }: DropRecordsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Reset to page 1 when drops array changes (e.g., filter changes)
  useEffect(() => {
    setCurrentPage(1);
  }, [drops.length]);
  
  // Calculate pagination
  const totalPages = Math.ceil(drops.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDrops = drops.slice(startIndex, endIndex);
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, and pages around current page
      if (currentPage <= 3) {
        // Near start
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  const getHealthIcon = (level: string) => {
    switch (level) {
      case "good": 
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "average": 
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "attention": 
        return <XCircle className="h-5 w-5 text-red-600" />;
      default: 
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStageVariant = (stage: string): "default" | "secondary" | "destructive" => {
    switch (stage) {
      case "Active": return "default";
      case "Draft": return "secondary";
      case "Expired": return "destructive";
      default: return "secondary";
    }
  };

  const getTTLColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-red-600";
      case "medium": return "text-orange-600";
      case "low": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const handleAction = (dropId: string, action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const drop = drops.find(d => d.id === dropId);
    const dropName = drop?.name || "Drop";
    
    switch (action) {
      case 'open':
        toast.success(`Opening ${dropName}`);
        break;
      case 'edit':
        toast.success(`Editing ${dropName}`);
        break;
      case 'copy':
        toast.success(`Copied ${dropName}`);
        break;
      case 'archive':
        toast.success(`Archived ${dropName}`);
        break;
    }
  };

  const handleQuickAction = (dropId: string, action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const drop = drops.find(d => d.id === dropId);
    const dropName = drop?.name || "Drop";
    
    switch (action) {
      case 'archive':
        toast.success(`Archived ${dropName}`);
        break;
      case 'restart':
        toast.success(`Copied and restarted ${dropName}`);
        break;
      case 'extend':
        toast.success(`Extended TTL for ${dropName}`);
        break;
    }
  };

  if (drops.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="text-6xl">📦</div>
        <div>
          <h3 className="text-xl mb-2">No Matching Drops Found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or create a new Drop</p>
        </div>
        <Button>Create Drop</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Health</TableHead>
              <TableHead>Drop Name</TableHead>
              <TableHead className="w-32">Stage</TableHead>
              <TableHead className="w-40">TTL</TableHead>
              <TableHead className="w-48">Engagement</TableHead>
              <TableHead className="w-40">Owner</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDrops.map((drop) => {
            const isHighlighted = drop.id === highlightedDropId;
            return (
              <TableRow
                key={drop.id}
                data-drop-id={drop.id}
                onClick={() => onRowClick(drop.id)}
                className={`cursor-pointer transition-colors ${
                  isHighlighted 
                    ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                    : 'hover:bg-muted/50'
                }`}
              >
                {/* Health */}
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help inline-flex">
                          {getHealthIcon(drop.health.level)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <div className="space-y-3">
                          <p className="text-sm mb-2">{drop.health.reason}</p>
                          
                          {drop.health.level === "attention" && (
                            <div className="border-t pt-3 space-y-2">
                              <p className="text-xs text-muted-foreground mb-2">Quick Actions:</p>
                              <div className="flex gap-2 flex-wrap">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => handleQuickAction(drop.id, 'archive', e)}
                                >
                                  Archive
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => handleQuickAction(drop.id, 'restart', e)}
                                >
                                  Copy & Restart
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => handleQuickAction(drop.id, 'extend', e)}
                                >
                                  Extend TTL
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>

                {/* Drop Name */}
                <TableCell>
                  <div>
                    <div>{drop.name}</div>
                    <div className="text-sm text-muted-foreground">{drop.materialPoolName}</div>
                  </div>
                </TableCell>

                {/* Stage */}
                <TableCell>
                  <Badge variant={getStageVariant(drop.stage)}>
                    {drop.stage}
                  </Badge>
                </TableCell>

                {/* TTL */}
                <TableCell>
                  <span className={getTTLColor(drop.ttlUrgency)}>
                    {drop.ttl}
                  </span>
                </TableCell>

                {/* Engagement Score */}
                <TableCell>
                  <EngagementScoreCell score={drop.engagementScore} />
                </TableCell>

                {/* Owner */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {drop.owner.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{drop.owner.name}</span>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleAction(drop.id, 'open', e)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Drop
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleAction(drop.id, 'edit', e)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleAction(drop.id, 'copy', e)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => handleAction(drop.id, 'archive', e)}
                        className="text-red-600"
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
    
    {/* Pagination Controls */}
    {totalPages > 1 && (
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, drops.length)} of {drops.length} Drops
        </div>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {getPageNumbers().map((pageNum, idx) => (
              pageNum === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNum)}
                    isActive={currentPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    )}
  </div>
  );
}
