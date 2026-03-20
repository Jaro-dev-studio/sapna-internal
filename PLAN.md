# Implementation Plan - Sapna E-Commerce Operations Platform

## Overview

Building a unified internal operations platform for managing a portfolio of 5+ e-commerce sites. The platform will provide AI-powered tools for SEO, ads management, product listing optimization, and performance analytics - all accessible from a single dashboard.

Based on the discovery call, Sapna runs multiple Shopify e-commerce sites serving US/English-speaking markets and needs to consolidate various tools/processes into one custom solution.

## Architecture

### Tech Stack
- **Frontend**: Next.js 16 with App Router, React 19, TailwindCSS
- **UI Components**: ShadCN/ui (already configured)
- **Authentication**: NextAuth.js with credentials provider (already configured)
- **Database**: NeonDB PostgreSQL with Prisma ORM
- **AI Integration**: OpenAI/Anthropic APIs (already configured)

### Key Architectural Choices
- Server-first approach with Server Components for data fetching
- Mock data layer for all new features (no live DB integration yet)
- Modular sidebar navigation with permission-based access
- Consistent data fetching pattern: `{ data: T | null, error: string | null }`
- All fetchers in `/lib/fetchers.ts`, actions in `/lib/actions.ts`

## Implementation Steps

### Phase 1: Foundation & Navigation (Steps 1-5)
1. **Update Prisma Schema** - Add models for Sites, Campaigns, Creatives, SEOAnalysis, ProductListings, Analytics
2. **Create Mock Data Types** - Define TypeScript interfaces for all new entities
3. **Create Mock Data Fetchers** - Implement fetchers that return realistic mock data
4. **Update Sidebar Navigation** - Add new sections: Sites, SEO, Ads, Products, Analytics
5. **Update Permissions Config** - Add new permission keys for new features

### Phase 2: Sites Management (Steps 6-8)
6. **Sites Dashboard Page** - Overview of all e-commerce sites with key metrics
7. **Site Detail Page** - Individual site view with performance data
8. **Site Settings/Connection** - Mock Shopify connection status

### Phase 3: SEO Agent (Steps 9-12)
9. **SEO Dashboard Page** - Overview of SEO health across all sites
10. **SEO Analysis Component** - Site-specific SEO metrics and recommendations
11. **Keyword Tracking** - Track keyword rankings (mock data)
12. **SEO AI Recommendations** - AI-generated SEO improvement suggestions

### Phase 4: Ads Management (Steps 13-17)
13. **Ads Dashboard Page** - Campaign overview with performance metrics
14. **Creative Library** - View and manage ad creatives
15. **Campaign Performance** - Mock metrics (CTR, ROAS, spend, conversions)
16. **Ad Creative Generator** - UI for AI creative generation (mock)
17. **A/B Testing Results** - Mock creative performance comparison

### Phase 5: Product Optimization (Steps 18-20)
18. **Products Dashboard** - Product listings across all sites
19. **Product Detail/Edit** - Individual product optimization view
20. **AI Product Suggestions** - AI-generated listing improvements

### Phase 6: Analytics (Steps 21-23)
21. **Analytics Dashboard** - Unified performance dashboard
22. **Revenue Metrics** - Sales, conversion, AOV across sites
23. **Comparison Tools** - Site vs site, period vs period comparison

## File Structure

```
/lib
  /mock-data
    sites.ts              # Mock sites data
    seo.ts                # Mock SEO analysis data
    ads.ts                # Mock ads/campaigns data
    products.ts           # Mock product listings
    analytics.ts          # Mock analytics data
  fetchers.ts             # Updated with new mock fetchers
  actions.ts              # Updated with new mock actions

/app/dashboard
  /sites
    page.tsx              # Sites overview
    client.tsx            # Client component
    loading.tsx           # Loading skeleton
    /[id]
      page.tsx            # Site detail
      client.tsx
      loading.tsx

  /seo
    page.tsx              # SEO dashboard
    client.tsx
    loading.tsx
    /[siteId]
      page.tsx            # Site-specific SEO
      client.tsx

  /ads
    page.tsx              # Ads dashboard
    client.tsx
    loading.tsx
    /campaigns
      page.tsx            # All campaigns
    /creatives
      page.tsx            # Creative library
    /[campaignId]
      page.tsx            # Campaign detail

  /products
    page.tsx              # Products overview
    client.tsx
    loading.tsx
    /[id]
      page.tsx            # Product detail

  /analytics
    page.tsx              # Analytics dashboard
    client.tsx
    loading.tsx

/components
  /sites
    site-card.tsx         # Site overview card
    site-metrics.tsx      # Site KPI display
  /seo
    seo-score-card.tsx    # SEO score display
    keyword-table.tsx     # Keyword rankings
    seo-recommendations.tsx
  /ads
    campaign-card.tsx     # Campaign overview
    creative-card.tsx     # Creative preview
    metrics-chart.tsx     # Performance charts
  /products
    product-card.tsx      # Product listing card
    optimization-panel.tsx
  /analytics
    stats-card.tsx        # Metric display card
    trend-chart.tsx       # Time series chart
    comparison-table.tsx  # Site comparison

/config
  permissions.ts          # Updated with new permissions
```

## Key Decisions

### 1. Mock Data Strategy
All new features will use a mock data layer that mimics real API responses. This allows:
- Full UI/UX development without backend dependencies
- Easy transition to real data sources later
- Consistent data shapes for type safety

### 2. Site-Centric Architecture
The platform is organized around sites as the primary entity. Each site can have:
- SEO analysis data
- Ad campaigns/creatives
- Product listings
- Analytics metrics

### 3. AI Integration Points
AI features will be UI-ready but return mock suggestions:
- SEO recommendations
- Ad creative generation
- Product listing optimization
- Performance insights

### 4. Permission Model
New permission resources:
- `sites` - Site management
- `seo` - SEO tools access
- `ads` - Ads management
- `products` - Product optimization
- `analytics` - Analytics dashboard

### 5. Navigation Structure
New sidebar sections:
- **E-Commerce** (new group)
  - Sites
  - Products
- **Marketing** (new group)
  - SEO
  - Ads
- **Insights** (new group)
  - Analytics

## Mock Data Structure Examples

### Site
```typescript
interface Site {
  id: string;
  name: string;
  domain: string;
  platform: "shopify";
  status: "active" | "paused" | "disconnected";
  metrics: {
    revenue30d: number;
    orders30d: number;
    visitors30d: number;
    conversionRate: number;
  };
  createdAt: Date;
}
```

### SEO Analysis
```typescript
interface SEOAnalysis {
  siteId: string;
  overallScore: number;
  metrics: {
    technicalSEO: number;
    onPageSEO: number;
    contentQuality: number;
    backlinks: number;
  };
  keywords: Keyword[];
  recommendations: SEORecommendation[];
}
```

### Campaign
```typescript
interface Campaign {
  id: string;
  siteId: string;
  name: string;
  platform: "meta" | "google" | "tiktok";
  status: "active" | "paused" | "draft";
  budget: number;
  spent: number;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    roas: number;
  };
}
```
