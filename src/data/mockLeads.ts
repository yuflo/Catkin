/**
 * Mock Lead Data
 * 用于 Recipient Selector 的模拟联系人数据
 */

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  role?: string;
  avatar?: string;
}

export const mockLeads: Lead[] = [
  {
    id: 'lead_001',
    name: 'Jane Doe',
    email: 'jane.doe@acme.com',
    company: 'ACME Corp',
    role: 'Procurement Manager',
    avatar: 'JD'
  },
  {
    id: 'lead_002',
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    company: 'TechCorp',
    role: 'CTO',
    avatar: 'JS'
  },
  {
    id: 'lead_003',
    name: 'Sarah Johnson',
    email: 'sarah.j@innovate.io',
    company: 'Innovate Inc',
    role: 'VP of Operations',
    avatar: 'SJ'
  },
  {
    id: 'lead_004',
    name: 'Michael Brown',
    email: 'michael.brown@globaltech.com',
    company: 'GlobalTech',
    role: 'Product Manager',
    avatar: 'MB'
  },
  {
    id: 'lead_005',
    name: 'Emily Chen',
    email: 'emily.chen@startup.co',
    company: 'Startup Co',
    role: 'CEO',
    avatar: 'EC'
  },
  {
    id: 'lead_006',
    name: 'David Kim',
    email: 'david.kim@enterprise.com',
    company: 'Enterprise Solutions',
    role: 'Director of Purchasing',
    avatar: 'DK'
  },
  {
    id: 'lead_007',
    name: 'Lisa Wang',
    email: 'lisa.wang@manufacturing.com',
    company: 'Manufacturing Co',
    role: 'Operations Lead',
    avatar: 'LW'
  },
  {
    id: 'lead_008',
    name: 'Robert Taylor',
    email: 'robert.t@techsolutions.com',
    company: 'Tech Solutions',
    role: 'Senior Buyer',
    avatar: 'RT'
  }
];

/**
 * Search leads by name, email, or company
 */
export function searchLeads(query: string): Lead[] {
  if (!query || query.trim().length === 0) {
    return mockLeads;
  }
  
  const lowerQuery = query.toLowerCase();
  return mockLeads.filter(lead => 
    lead.name.toLowerCase().includes(lowerQuery) ||
    lead.email.toLowerCase().includes(lowerQuery) ||
    lead.company.toLowerCase().includes(lowerQuery) ||
    (lead.role && lead.role.toLowerCase().includes(lowerQuery))
  );
}
