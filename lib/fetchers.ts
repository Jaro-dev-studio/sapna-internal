"use server";

import prisma from "@/lib/prisma";
import { getUserPermissions } from "@/lib/permissions";
import type { Permissions } from "@/config/permissions";
import {
  mockSites,
  getSiteById,
  getSitesSummary,
  mockCampaigns,
  getCampaignsBySiteId,
  getCampaignById,
  mockCreatives,
  getCreativesBySiteId,
  getCreativesByCampaignId,
  getAdsSummary,
  mockSEOAnalyses,
  getSEOAnalysisBySiteId,
  getSEOSummary,
  mockProducts,
  getProductsBySiteId,
  getProductById,
  getProductsSummary,
  getAnalyticsSummary,
  getAnalyticsForSite,
} from "@/lib/mock-data";
import type {
  Site,
  Campaign,
  Creative,
  SEOAnalysis,
  ProductListing,
  AnalyticsSummary,
  AnalyticsSnapshot,
} from "@/lib/mock-data/types";

// ============================================
// PROJECTS
// ============================================

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: projects, error: null };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { data: null, error: "Failed to fetch projects" };
  }
}

export async function getProject(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    if (!project) {
      return { data: null, error: "Project not found" };
    }

    return { data: project, error: null };
  } catch (error) {
    console.error("Error fetching project:", error);
    return { data: null, error: "Failed to fetch project" };
  }
}

// ============================================
// USERS
// ============================================

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        projects: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: users, error: null };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { data: null, error: "Failed to fetch users" };
  }
}

export async function getAssignableUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { in: ["ADMIN", "MEMBER"] },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
      orderBy: { email: "asc" },
    });

    return { data: users, error: null };
  } catch (error) {
    console.error("Error fetching assignable users:", error);
    return { data: null, error: "Failed to fetch assignable users" };
  }
}

// ============================================
// TASKS
// ============================================

export async function getTasks() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        blockedByTasks: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        attachments: {
          select: {
            id: true,
            name: true,
            url: true,
            type: true,
            size: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: tasks, error: null };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { data: null, error: "Failed to fetch tasks" };
  }
}

export async function getTask(id: string) {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        blockedByTasks: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        attachments: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
          },
        },
      },
    });

    if (!task) {
      return { data: null, error: "Task not found" };
    }

    return { data: task, error: null };
  } catch (error) {
    console.error("Error fetching task:", error);
    return { data: null, error: "Failed to fetch task" };
  }
}

export async function getTasksByProject(projectId: string) {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        project: {
          select: { id: true, name: true },
        },
        assignee: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        blockedByTasks: {
          select: { id: true, name: true, status: true },
        },
        attachments: {
          select: { id: true, name: true, url: true, type: true, size: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: tasks, error: null };
  } catch (error) {
    console.error("Error fetching tasks by project:", error);
    return { data: null, error: "Failed to fetch tasks" };
  }
}

// ============================================
// RECURRING TASKS
// ============================================

export async function getRecurringTasks() {
  try {
    const recurringTasks = await prisma.recurringTask.findMany({
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: recurringTasks, error: null };
  } catch (error) {
    console.error("Error fetching recurring tasks:", error);
    return { data: null, error: "Failed to fetch recurring tasks" };
  }
}

export async function getRecurringTask(id: string) {
  try {
    const recurringTask = await prisma.recurringTask.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true },
        },
        assignee: {
          select: { id: true, email: true, firstName: true },
        },
      },
    });

    if (!recurringTask) {
      return { data: null, error: "Recurring task not found" };
    }

    return { data: recurringTask, error: null };
  } catch (error) {
    console.error("Error fetching recurring task:", error);
    return { data: null, error: "Failed to fetch recurring task" };
  }
}

// ============================================
// ROLES & PERMISSIONS
// ============================================

export async function getRoles() {
  try {
    const roles = await prisma.role.findMany({
      orderBy: [{ isSystem: "desc" }, { name: "asc" }],
      include: { _count: { select: { users: true } } },
    });

    return { data: roles, error: null };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return { data: null, error: "Failed to fetch roles" };
  }
}

export async function getRole(id: string) {
  try {
    const role = await prisma.role.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });

    if (!role) return { data: null, error: "Role not found" };
    return { data: role, error: null };
  } catch (error) {
    console.error("Error fetching role:", error);
    return { data: null, error: "Failed to fetch role" };
  }
}

export async function fetchUserPermissions(userId: string): Promise<{
  data: Permissions | null;
  error: string | null;
}> {
  try {
    const permissions = await getUserPermissions(userId);
    return { data: permissions, error: null };
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return { data: null, error: "Failed to fetch permissions" };
  }
}

// ============================================
// SITES (Mock Data)
// ============================================

export async function getSites(): Promise<{
  data: Site[] | null;
  error: string | null;
}> {
  try {
    console.log("[Sites] Fetching all sites...");
    return { data: mockSites, error: null };
  } catch (error) {
    console.error("Error fetching sites:", error);
    return { data: null, error: "Failed to fetch sites" };
  }
}

export async function getSite(id: string): Promise<{
  data: Site | null;
  error: string | null;
}> {
  try {
    console.log("[Sites] Fetching site:", id);
    const site = getSiteById(id);
    if (!site) {
      return { data: null, error: "Site not found" };
    }
    return { data: site, error: null };
  } catch (error) {
    console.error("Error fetching site:", error);
    return { data: null, error: "Failed to fetch site" };
  }
}

export async function getSitesDashboardData(): Promise<{
  data: {
    sites: Site[];
    summary: ReturnType<typeof getSitesSummary>;
  } | null;
  error: string | null;
}> {
  try {
    console.log("[Sites] Fetching sites dashboard data...");
    return {
      data: {
        sites: mockSites,
        summary: getSitesSummary(),
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching sites dashboard:", error);
    return { data: null, error: "Failed to fetch sites dashboard" };
  }
}

// ============================================
// ADS & CAMPAIGNS (Mock Data)
// ============================================

export async function getCampaigns(): Promise<{
  data: Campaign[] | null;
  error: string | null;
}> {
  try {
    console.log("[Ads] Fetching all campaigns...");
    return { data: mockCampaigns, error: null };
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return { data: null, error: "Failed to fetch campaigns" };
  }
}

export async function getCampaign(id: string): Promise<{
  data: Campaign | null;
  error: string | null;
}> {
  try {
    console.log("[Ads] Fetching campaign:", id);
    const campaign = getCampaignById(id);
    if (!campaign) {
      return { data: null, error: "Campaign not found" };
    }
    return { data: campaign, error: null };
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return { data: null, error: "Failed to fetch campaign" };
  }
}

export async function getCampaignsForSite(siteId: string): Promise<{
  data: Campaign[] | null;
  error: string | null;
}> {
  try {
    console.log("[Ads] Fetching campaigns for site:", siteId);
    return { data: getCampaignsBySiteId(siteId), error: null };
  } catch (error) {
    console.error("Error fetching site campaigns:", error);
    return { data: null, error: "Failed to fetch campaigns" };
  }
}

export async function getCreatives(): Promise<{
  data: Creative[] | null;
  error: string | null;
}> {
  try {
    console.log("[Ads] Fetching all creatives...");
    return { data: mockCreatives, error: null };
  } catch (error) {
    console.error("Error fetching creatives:", error);
    return { data: null, error: "Failed to fetch creatives" };
  }
}

export async function getCreativesForSite(siteId: string): Promise<{
  data: Creative[] | null;
  error: string | null;
}> {
  try {
    console.log("[Ads] Fetching creatives for site:", siteId);
    return { data: getCreativesBySiteId(siteId), error: null };
  } catch (error) {
    console.error("Error fetching site creatives:", error);
    return { data: null, error: "Failed to fetch creatives" };
  }
}

export async function getCreativesForCampaign(campaignId: string): Promise<{
  data: Creative[] | null;
  error: string | null;
}> {
  try {
    console.log("[Ads] Fetching creatives for campaign:", campaignId);
    return { data: getCreativesByCampaignId(campaignId), error: null };
  } catch (error) {
    console.error("Error fetching campaign creatives:", error);
    return { data: null, error: "Failed to fetch creatives" };
  }
}

export async function getAdsDashboardData(): Promise<{
  data: {
    campaigns: Campaign[];
    creatives: Creative[];
    summary: ReturnType<typeof getAdsSummary>;
  } | null;
  error: string | null;
}> {
  try {
    console.log("[Ads] Fetching ads dashboard data...");
    return {
      data: {
        campaigns: mockCampaigns,
        creatives: mockCreatives,
        summary: getAdsSummary(),
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching ads dashboard:", error);
    return { data: null, error: "Failed to fetch ads dashboard" };
  }
}

// ============================================
// SEO (Mock Data)
// ============================================

export async function getSEOAnalyses(): Promise<{
  data: SEOAnalysis[] | null;
  error: string | null;
}> {
  try {
    console.log("[SEO] Fetching all SEO analyses...");
    return { data: mockSEOAnalyses, error: null };
  } catch (error) {
    console.error("Error fetching SEO analyses:", error);
    return { data: null, error: "Failed to fetch SEO analyses" };
  }
}

export async function getSEOAnalysisForSite(siteId: string): Promise<{
  data: SEOAnalysis | null;
  error: string | null;
}> {
  try {
    console.log("[SEO] Fetching SEO analysis for site:", siteId);
    const analysis = getSEOAnalysisBySiteId(siteId);
    if (!analysis) {
      return { data: null, error: "SEO analysis not found for this site" };
    }
    return { data: analysis, error: null };
  } catch (error) {
    console.error("Error fetching site SEO analysis:", error);
    return { data: null, error: "Failed to fetch SEO analysis" };
  }
}

export async function getSEODashboardData(): Promise<{
  data: {
    analyses: SEOAnalysis[];
    summary: ReturnType<typeof getSEOSummary>;
  } | null;
  error: string | null;
}> {
  try {
    console.log("[SEO] Fetching SEO dashboard data...");
    return {
      data: {
        analyses: mockSEOAnalyses,
        summary: getSEOSummary(),
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching SEO dashboard:", error);
    return { data: null, error: "Failed to fetch SEO dashboard" };
  }
}

// ============================================
// PRODUCTS (Mock Data)
// ============================================

export async function getProductListings(): Promise<{
  data: ProductListing[] | null;
  error: string | null;
}> {
  try {
    console.log("[Products] Fetching all product listings...");
    return { data: mockProducts, error: null };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: null, error: "Failed to fetch products" };
  }
}

export async function getProductListing(id: string): Promise<{
  data: ProductListing | null;
  error: string | null;
}> {
  try {
    console.log("[Products] Fetching product:", id);
    const product = getProductById(id);
    if (!product) {
      return { data: null, error: "Product not found" };
    }
    return { data: product, error: null };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { data: null, error: "Failed to fetch product" };
  }
}

export async function getProductsForSite(siteId: string): Promise<{
  data: ProductListing[] | null;
  error: string | null;
}> {
  try {
    console.log("[Products] Fetching products for site:", siteId);
    return { data: getProductsBySiteId(siteId), error: null };
  } catch (error) {
    console.error("Error fetching site products:", error);
    return { data: null, error: "Failed to fetch products" };
  }
}

export async function getProductsDashboardData(): Promise<{
  data: {
    products: ProductListing[];
    summary: ReturnType<typeof getProductsSummary>;
  } | null;
  error: string | null;
}> {
  try {
    console.log("[Products] Fetching products dashboard data...");
    return {
      data: {
        products: mockProducts,
        summary: getProductsSummary(),
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching products dashboard:", error);
    return { data: null, error: "Failed to fetch products dashboard" };
  }
}

// ============================================
// ANALYTICS (Mock Data)
// ============================================

export async function getAnalyticsDashboardData(days: number = 30): Promise<{
  data: AnalyticsSummary | null;
  error: string | null;
}> {
  try {
    console.log("[Analytics] Fetching analytics dashboard data for", days, "days...");
    return { data: getAnalyticsSummary(days), error: null };
  } catch (error) {
    console.error("Error fetching analytics dashboard:", error);
    return { data: null, error: "Failed to fetch analytics" };
  }
}

export async function getSiteAnalytics(siteId: string, days: number = 30): Promise<{
  data: AnalyticsSnapshot[] | null;
  error: string | null;
}> {
  try {
    console.log("[Analytics] Fetching analytics for site:", siteId);
    return { data: getAnalyticsForSite(siteId, days), error: null };
  } catch (error) {
    console.error("Error fetching site analytics:", error);
    return { data: null, error: "Failed to fetch site analytics" };
  }
}
