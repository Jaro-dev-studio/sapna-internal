// E-Commerce Sites
export interface Site {
  id: string;
  name: string;
  domain: string;
  platform: "shopify";
  status: "ACTIVE" | "PAUSED" | "DISCONNECTED";
  description: string | null;
  logoUrl: string | null;
  metrics: {
    revenue30d: number;
    orders30d: number;
    visitors30d: number;
    conversionRate: number;
    averageOrderValue: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Ad Campaigns
export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  platform: "META" | "GOOGLE" | "TIKTOK" | "PINTEREST";
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";
  objective: string | null;
  budget: number;
  dailyBudget: number;
  spent: number;
  startDate: Date | null;
  endDate: Date | null;
  siteId: string;
  site: { id: string; name: string };
  metrics: CampaignMetrics | null;
  creativesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
}

// Ad Creatives
export interface Creative {
  id: string;
  name: string;
  type: "IMAGE" | "VIDEO" | "CAROUSEL" | "UGC";
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "ARCHIVED";
  headline: string | null;
  description: string | null;
  callToAction: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  siteId: string;
  site: { id: string; name: string };
  campaignId: string | null;
  campaign: { id: string; name: string } | null;
  metrics: CreativeMetrics | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreativeMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cvr: number;
}

// SEO Analysis
export interface SEOAnalysis {
  id: string;
  siteId: string;
  site: { id: string; name: string; domain: string };
  overallScore: number;
  technicalScore: number;
  onPageScore: number;
  contentScore: number;
  backlinksScore: number;
  totalKeywords: number;
  keywordsTop10: number;
  keywordsTop100: number;
  organicTraffic: number;
  backlinksCount: number;
  domainAuthority: number;
  issues: SEOIssue[];
  recommendations: SEORecommendation[];
  keywords: SEOKeyword[];
  analyzedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SEOIssue {
  id: string;
  severity: "critical" | "warning" | "info";
  category: "technical" | "content" | "performance" | "mobile";
  title: string;
  description: string;
  affectedPages: number;
}

export interface SEORecommendation {
  id: string;
  priority: "high" | "medium" | "low";
  category: "technical" | "content" | "backlinks" | "keywords";
  title: string;
  description: string;
  impact: string;
  effort: string;
}

export interface SEOKeyword {
  id: string;
  keyword: string;
  position: number | null;
  previousPosition: number | null;
  change: number;
  searchVolume: number;
  difficulty: number;
  url: string | null;
}

// Product Listings
export interface ProductListing {
  id: string;
  siteId: string;
  site: { id: string; name: string };
  externalId: string | null;
  title: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  images: string[];
  category: string | null;
  tags: string[];
  inventory: number;
  sku: string | null;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED" | "OUT_OF_STOCK";
  seoTitle: string | null;
  seoDescription: string | null;
  optimizationScore: number;
  optimizationSuggestions: ProductSuggestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSuggestion {
  id: string;
  type: "title" | "description" | "image" | "seo" | "pricing";
  priority: "high" | "medium" | "low";
  suggestion: string;
  currentValue: string | null;
  suggestedValue: string | null;
}

// Analytics
export interface AnalyticsSnapshot {
  id: string;
  siteId: string;
  date: Date;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  visitors: number;
  pageViews: number;
  bounceRate: number;
  conversionRate: number;
  cartAbandonment: number;
  topProducts: TopProduct[];
  topSources: TopSource[];
  topPages: TopPage[];
}

export interface TopProduct {
  id: string;
  name: string;
  revenue: number;
  units: number;
}

export interface TopSource {
  source: string;
  visitors: number;
  conversions: number;
}

export interface TopPage {
  path: string;
  views: number;
  avgTimeOnPage: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  totalVisitors: number;
  avgConversionRate: number;
  avgOrderValue: number;
  revenueChange: number;
  ordersChange: number;
  visitorsChange: number;
  conversionChange: number;
  dailyData: {
    date: string;
    revenue: number;
    orders: number;
    visitors: number;
  }[];
  siteBreakdown: {
    siteId: string;
    siteName: string;
    revenue: number;
    orders: number;
    visitors: number;
    conversionRate: number;
  }[];
}
