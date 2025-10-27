// Mock data for Drop Records

export interface DropRecord {
  id: string;
  health: {
    level: "good" | "average" | "attention";
    reason: string;
  };
  name: string;
  materialPoolName: string;
  stage: "Active" | "Draft" | "Expired";
  ttl: string;
  ttlUrgency: "low" | "medium" | "high";
  engagementScore: {
    level: "high" | "medium" | "low";
    value: number;
    contributors: string;
  };
  owner: {
    name: string;
    initials: string;
  };
  intent: "lead_gen" | "sales_follow_up" | "customer_nurturing" | "all";
}

export const CURRENT_USER = "Sam Rodriguez";

// Configuration arrays for generating varied mock data
const OWNERS = [
  { name: "Sam Rodriguez", initials: "SR" },
  { name: "Emily Chen", initials: "EC" },
  { name: "Michael Brown", initials: "MB" },
  { name: "Sarah Johnson", initials: "SJ" },
  { name: "David Kim", initials: "DK" },
  { name: "Lisa Wang", initials: "LW" },
  { name: "James Wilson", initials: "JW" },
  { name: "Anna Martinez", initials: "AM" },
  { name: "Robert Taylor", initials: "RT" },
  { name: "Jennifer Lee", initials: "JL" },
];

const DROP_TEMPLATES = [
  { 
    nameTemplate: "Spring Collection Preview - {target}",
    pool: "Spring Apparel Collection 2024",
    intent: "sales_follow_up" as const
  },
  {
    nameTemplate: "Industrial Equipment Catalog {quarter}",
    pool: "Industrial Equipment Series",
    intent: "lead_gen" as const
  },
  {
    nameTemplate: "{season} Sale Campaign",
    pool: "{season} Apparel Collection",
    intent: "lead_gen" as const
  },
  {
    nameTemplate: "{company} Exclusive Resource Room",
    pool: "Enterprise Partnership Materials",
    intent: "customer_nurturing" as const
  },
  {
    nameTemplate: "Smart Home Product Discovery",
    pool: "Smart Home Series",
    intent: "lead_gen" as const
  },
  {
    nameTemplate: "{company} Quarterly Update",
    pool: "Customer Communication Materials",
    intent: "customer_nurturing" as const
  },
  {
    nameTemplate: "Prospect Follow-up Pack - {company}",
    pool: "Sales Follow-up Materials",
    intent: "sales_follow_up" as const
  },
  {
    nameTemplate: "VIP Customer {type} Updates",
    pool: "VIP Customer Materials",
    intent: "customer_nurturing" as const
  },
  {
    nameTemplate: "Enterprise Procurement Proposal - {company}",
    pool: "Enterprise Sales Materials",
    intent: "sales_follow_up" as const
  },
  {
    nameTemplate: "Product Roadmap {period}",
    pool: "Product Planning",
    intent: "lead_gen" as const
  },
  {
    nameTemplate: "{product} Launch Campaign",
    pool: "New Product Launch",
    intent: "lead_gen" as const
  },
  {
    nameTemplate: "Partnership Proposal - {company}",
    pool: "Strategic Partnership Materials",
    intent: "sales_follow_up" as const
  },
  {
    nameTemplate: "Customer Success Story - {company}",
    pool: "Case Studies & Testimonials",
    intent: "customer_nurturing" as const
  },
  {
    nameTemplate: "{industry} Solutions Overview",
    pool: "Industry-Specific Solutions",
    intent: "lead_gen" as const
  },
  {
    nameTemplate: "Webinar Follow-up - {topic}",
    pool: "Event Materials",
    intent: "sales_follow_up" as const
  },
];

const REPLACEMENTS = {
  target: ["VIP Customers", "Key Accounts", "New Prospects", "Retail Partners", "Wholesale Buyers"],
  quarter: ["Q1", "Q2", "Q3", "Q4"],
  season: ["Winter", "Spring", "Summer", "Fall", "Holiday"],
  company: ["ACME Corp", "TechCorp", "GlobalTech", "InnovateCo", "FutureSoft", "MegaRetail", "ProManufacturing"],
  type: ["Exclusive", "Premium", "Priority", "Elite"],
  period: ["2025", "H1 2025", "H2 2025", "Q1 2025", "Q2 2025"],
  product: ["SmartHub", "ProDevice", "CloudSync", "DataPro", "AutoMate"],
  industry: ["Healthcare", "Finance", "Manufacturing", "Retail", "Education"],
  topic: ["Digital Transformation", "Cloud Migration", "AI Integration", "Security Best Practices"],
};

// Helper function to generate drop name and pool
function generateDropContent(template: typeof DROP_TEMPLATES[0], index: number) {
  let name = template.nameTemplate;
  let pool = template.pool;
  
  // Replace placeholders with random values
  Object.entries(REPLACEMENTS).forEach(([key, values]) => {
    const placeholder = `{${key}}`;
    if (name.includes(placeholder)) {
      name = name.replace(placeholder, values[index % values.length]);
    }
    if (pool.includes(placeholder)) {
      pool = pool.replace(placeholder, values[index % values.length]);
    }
  });
  
  return { name, pool };
}

// Helper function to generate health data
function generateHealth(stage: string, ttlDays: number, engagementValue: number) {
  if (stage === "Expired") {
    return {
      level: "attention" as const,
      reason: `Expired ${Math.floor(Math.random() * 10) + 1} days ago, suggest archiving or extending`
    };
  }
  
  if (stage === "Draft") {
    return {
      level: "average" as const,
      reason: "Draft status, awaiting publication"
    };
  }
  
  // Active drops
  if (engagementValue >= 70) {
    return {
      level: "good" as const,
      reason: `High engagement (${engagementValue}) with stable conversion, continue current strategy`
    };
  } else if (engagementValue >= 45) {
    return {
      level: "average" as const,
      reason: `Medium engagement (${engagementValue}), suggest optimizing material display order`
    };
  } else if (ttlDays <= 5) {
    return {
      level: "attention" as const,
      reason: `Low engagement (${engagementValue}) and expiring soon, take immediate action or archive`
    };
  } else {
    return {
      level: "attention" as const,
      reason: `Low engagement (${engagementValue}), consider revising content or targeting`
    };
  }
}

// Helper function to generate TTL
function generateTTL(stage: string, index: number) {
  if (stage === "Draft") {
    return { ttl: "Draft", urgency: "low" as const };
  }
  
  if (stage === "Expired") {
    const daysAgo = (index % 20) + 1;
    return { ttl: `Expired ${daysAgo} days ago`, urgency: "high" as const };
  }
  
  // Active drops
  const daysLeft = (index % 60) + 1;
  let urgency: "low" | "medium" | "high" = "low";
  
  if (daysLeft <= 5) {
    urgency = "high";
  } else if (daysLeft <= 14) {
    urgency = "medium";
  }
  
  return { ttl: `${daysLeft} days left`, urgency };
}

// Helper function to generate engagement score
function generateEngagementScore(stage: string, index: number) {
  if (stage === "Draft") {
    return {
      level: "low" as const,
      value: 0,
      contributors: "Not yet published"
    };
  }
  
  if (stage === "Expired") {
    const value = (index % 30) + 5;
    return {
      level: "low" as const,
      value,
      contributors: `${value < 15 ? '1' : '2-3'} views before expiration`
    };
  }
  
  // Active drops - varied engagement patterns
  const patterns = [
    { level: "high" as const, value: 85, contributors: "2 quote requests, 5 spec downloads, 12 page views" },
    { level: "high" as const, value: 88, contributors: "6 video views, 4 product comparisons, 2 form submissions" },
    { level: "high" as const, value: 75, contributors: "1 quote request, 15 document views, 7 days active" },
    { level: "high" as const, value: 82, contributors: "20 days active, 10 deep interactions" },
    { level: "medium" as const, value: 62, contributors: "8 page views, 3 document downloads" },
    { level: "medium" as const, value: 58, contributors: "3 document views, ongoing engagement" },
    { level: "medium" as const, value: 65, contributors: "1 quote request, 4 spec downloads" },
    { level: "medium" as const, value: 55, contributors: "10 page views, 2 link clicks" },
    { level: "low" as const, value: 28, contributors: "Only 2 page views, no deep engagement" },
    { level: "low" as const, value: 12, contributors: "Only 1 initial visit" },
    { level: "low" as const, value: 35, contributors: "4 page views, limited interaction" },
    { level: "low" as const, value: 22, contributors: "Minimal engagement detected" },
  ];
  
  return patterns[index % patterns.length];
}

// Generate 100 mock drops
export const mockDrops: DropRecord[] = Array.from({ length: 100 }, (_, i) => {
  const index = i + 1;
  const template = DROP_TEMPLATES[i % DROP_TEMPLATES.length];
  const { name, pool } = generateDropContent(template, index);
  
  // Determine stage with distribution: 70% Active, 20% Draft, 10% Expired
  let stage: "Active" | "Draft" | "Expired";
  const stageRand = i % 10;
  if (stageRand < 7) {
    stage = "Active";
  } else if (stageRand < 9) {
    stage = "Draft";
  } else {
    stage = "Expired";
  }
  
  const { ttl, urgency } = generateTTL(stage, index);
  const engagementScore = generateEngagementScore(stage, index);
  const health = generateHealth(stage, urgency === "high" ? 3 : urgency === "medium" ? 10 : 30, engagementScore.value);
  const owner = OWNERS[i % OWNERS.length];
  
  return {
    id: `drop_${String(index).padStart(3, '0')}`,
    health,
    name,
    materialPoolName: pool,
    stage,
    ttl,
    ttlUrgency: urgency,
    engagementScore,
    owner,
    intent: template.intent,
  };
});

// Feedback Panel Mock Data
export interface Material {
  name: string;
  icon: string;
  size: string;
  type: string;
}

export interface Lead {
  name: string;
  avatar: string;
  company: string;
  lastActivity: string;
  engagementLevel: "high" | "medium" | "low";
}

export interface FeedbackViewData {
  id: string;
  name: string;
  materialPoolName: string;
  engagementScore: {
    level: "high" | "medium" | "low";
    value: number;
    contributors: string;
  };
  keyOutcomes: Array<{
    icon: string;
    text: string;
  }>;
  recentActivities: Array<{
    actor: string;
    action: string;
    timestamp: string;
  }>;
  materials: Material[];
  leads: Lead[];
}

export const getMockFeedbackData = (dropId: string): FeedbackViewData | null => {
  const drop = mockDrops.find(d => d.id === dropId);
  if (!drop) return null;

  // Generate different feedback data based on drop intent
  const feedbackData: Record<string, FeedbackViewData> = {
    drop_001: {
      id: "drop_001",
      name: "Spring Collection Preview - VIP Customers",
      materialPoolName: "Spring Apparel Collection 2024",
      engagementScore: {
        level: "high",
        value: 85,
        contributors: "2 quote requests, 5 spec downloads, 12 page views"
      },
      keyOutcomes: [
        { icon: "🏆", text: "2 quote requests" },
        { icon: "📄", text: "5 spec sheet downloads" },
        { icon: "👀", text: "12 page views" },
        { icon: "✅", text: "Avg. time 3.5 minutes" }
      ],
      recentActivities: [
        {
          actor: "Wei Zhang (VIP Customer)",
          action: "Requested product quote",
          timestamp: "2 hours ago"
        },
        {
          actor: "Na Li (Procurement Manager)",
          action: "Downloaded product spec sheet",
          timestamp: "5 hours ago"
        },
        {
          actor: "Qiang Wang (Decision Maker)",
          action: "Browsed 3 product pages",
          timestamp: "1 day ago"
        }
      ],
      materials: [
        { name: "Spring Product Catalog.pdf", icon: "📄", size: "2.4 MB", type: "PDF" },
        { name: "Product Specifications.pdf", icon: "📄", size: "1.8 MB", type: "PDF" },
        { name: "Product Video.mp4", icon: "🎥", size: "15.2 MB", type: "Video" },
        { name: "Price List.xlsx", icon: "📊", size: "245 KB", type: "Excel" }
      ],
      leads: [
        {
          name: "Wei Zhang",
          avatar: "WZ",
          company: "Huamei Group",
          lastActivity: "Requested quote 2 hours ago",
          engagementLevel: "high"
        },
        {
          name: "Na Li",
          avatar: "NL",
          company: "Innovation Tech",
          lastActivity: "Downloaded doc 5 hours ago",
          engagementLevel: "high"
        },
        {
          name: "Qiang Wang",
          avatar: "QW",
          company: "Future Enterprises",
          lastActivity: "Browsed pages 1 day ago",
          engagementLevel: "medium"
        }
      ]
    },
    drop_002: {
      id: "drop_002",
      name: "Industrial Equipment Catalog Q2",
      materialPoolName: "Industrial Equipment Series",
      engagementScore: {
        level: "medium",
        value: 62,
        contributors: "8 page views, 3 document downloads"
      },
      keyOutcomes: [
        { icon: "👀", text: "8 page views" },
        { icon: "📄", text: "3 document downloads" },
        { icon: "🔗", text: "5 link clicks" }
      ],
      recentActivities: [
        {
          actor: "Ming Chen (Engineer)",
          action: "Downloaded technical spec document",
          timestamp: "3 hours ago"
        },
        {
          actor: "Fang Liu (Procurement)",
          action: "Viewed equipment parameters",
          timestamp: "1 day ago"
        }
      ],
      materials: [
        { name: "Equipment Catalog.pdf", icon: "📄", size: "3.2 MB", type: "PDF" },
        { name: "Technical Specifications.pdf", icon: "📄", size: "1.5 MB", type: "PDF" }
      ],
      leads: [
        {
          name: "Ming Chen",
          avatar: "MC",
          company: "Industrial Group",
          lastActivity: "Downloaded doc 3 hours ago",
          engagementLevel: "medium"
        },
        {
          name: "Fang Liu",
          avatar: "FL",
          company: "Manufacturing Co.",
          lastActivity: "Viewed params 1 day ago",
          engagementLevel: "medium"
        }
      ]
    },
    drop_004: {
      id: "drop_004",
      name: "ACME Corp Exclusive Resource Room",
      materialPoolName: "Enterprise Partnership Materials",
      engagementScore: {
        level: "high",
        value: 75,
        contributors: "1 quote request, 15 document views, 7 days active"
      },
      keyOutcomes: [
        { icon: "🏆", text: "1 quote request" },
        { icon: "📄", text: "15 document views" },
        { icon: "✅", text: "7 days active" },
        { icon: "💎", text: "High satisfaction" }
      ],
      recentActivities: [
        {
          actor: "John Smith (ACME)",
          action: "Requested annual partnership quote",
          timestamp: "1 day ago"
        },
        {
          actor: "Mary Johnson (ACME)",
          action: "Reviewed partnership agreement",
          timestamp: "2 days ago"
        },
        {
          actor: "Bob Wilson (ACME)",
          action: "Downloaded product update materials",
          timestamp: "3 days ago"
        }
      ],
      materials: [
        { name: "Partnership Agreement.pdf", icon: "📄", size: "856 KB", type: "PDF" },
        { name: "Product Updates.pdf", icon: "📄", size: "1.2 MB", type: "PDF" },
        { name: "Annual Quote.xlsx", icon: "📊", size: "185 KB", type: "Excel" }
      ],
      leads: [
        {
          name: "John Smith",
          avatar: "JS",
          company: "ACME Corp",
          lastActivity: "Requested quote 1 day ago",
          engagementLevel: "high"
        },
        {
          name: "Mary Johnson",
          avatar: "MJ",
          company: "ACME Corp",
          lastActivity: "Reviewed doc 2 days ago",
          engagementLevel: "high"
        }
      ]
    },
    drop_007: {
      id: "drop_007",
      name: "Smart Home Product Discovery",
      materialPoolName: "Smart Home Series",
      engagementScore: {
        level: "high",
        value: 88,
        contributors: "6 video views, 4 product comparisons, 2 form submissions"
      },
      keyOutcomes: [
        { icon: "🎥", text: "6 video views" },
        { icon: "📝", text: "2 form submissions" },
        { icon: "🔍", text: "4 product comparisons" },
        { icon: "🎁", text: "2 reward inquiries" }
      ],
      recentActivities: [
        {
          actor: "Min Zhao (New Customer)",
          action: "Submitted product inquiry form",
          timestamp: "30 minutes ago"
        },
        {
          actor: "Hao Sun (Prospect)",
          action: "Watched product demo video",
          timestamp: "2 hours ago"
        },
        {
          actor: "Jie Zhou (Prospect)",
          action: "Compared 3 smart speakers",
          timestamp: "4 hours ago"
        }
      ],
      materials: [
        { name: "Product Demo Video.mp4", icon: "🎥", size: "28.5 MB", type: "Video" },
        { name: "Product Comparison.pdf", icon: "📄", size: "890 KB", type: "PDF" },
        { name: "Smart Home Guide.pdf", icon: "📄", size: "2.1 MB", type: "PDF" }
      ],
      leads: [
        {
          name: "Min Zhao",
          avatar: "MZ",
          company: "Individual Consumer",
          lastActivity: "Submitted form 30 min ago",
          engagementLevel: "high"
        },
        {
          name: "Hao Sun",
          avatar: "HS",
          company: "Individual Consumer",
          lastActivity: "Watched video 2 hours ago",
          engagementLevel: "high"
        },
        {
          name: "Jie Zhou",
          avatar: "JZ",
          company: "Individual Consumer",
          lastActivity: "Compared products 4 hours ago",
          engagementLevel: "medium"
        }
      ]
    }
  };

  // Return specific feedback data, or default data
  return feedbackData[dropId] || {
    id: dropId,
    name: drop.name,
    materialPoolName: drop.materialPoolName,
    engagementScore: drop.engagementScore,
    keyOutcomes: [
      { icon: "👀", text: "Page view activity" },
      { icon: "📄", text: "Document access records" }
    ],
    recentActivities: [
      {
        actor: "Visitor",
        action: "Visited the page",
        timestamp: "Recently"
      }
    ],
    materials: [
      { name: "Sample Document.pdf", icon: "📄", size: "1.0 MB", type: "PDF" }
    ],
    leads: [
      {
        name: "Visitor",
        avatar: "V",
        company: "Unknown",
        lastActivity: "Recent visit",
        engagementLevel: "low"
      }
    ]
  };
};
