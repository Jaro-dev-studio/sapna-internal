"use server";

import prisma from "@/lib/prisma";
import { getUserPermissions } from "@/lib/permissions";
import type { Permissions } from "@/config/permissions";
import {
  getAdPlatformConnections as getAdPlatformConnectionsFromDb,
  getAdsDashboardData as getAdsDashboardDataFromDb,
  getAnalyticsDashboardData as getAnalyticsDashboardDataFromDb,
  getCampaign as getCampaignFromDb,
  getCampaigns as getCampaignsFromDb,
  getCampaignsForSite as getCampaignsForSiteFromDb,
  getCreative as getCreativeFromDb,
  getCreatives as getCreativesFromDb,
  getCreativesForCampaign as getCreativesForCampaignFromDb,
  getCreativesForSite as getCreativesForSiteFromDb,
  getEmailAutomation as getEmailAutomationFromDb,
  getEmailAutomations as getEmailAutomationsFromDb,
  getProductListing as getProductListingFromDb,
  getProductListings as getProductListingsFromDb,
  getProductsDashboardData as getProductsDashboardDataFromDb,
  getProductsForSite as getProductsForSiteFromDb,
  getSEOAnalyses as getSEOAnalysesFromDb,
  getSEOAnalysisForSite as getSEOAnalysisForSiteFromDb,
  getSEODashboardData as getSEODashboardDataFromDb,
  getSite as getSiteFromDb,
  getSiteAnalytics as getSiteAnalyticsFromDb,
  getSites as getSitesFromDb,
  getSitesDashboardData as getSitesDashboardDataFromDb,
} from "@/lib/ecommerce-fetchers";

// ============================================
// PROJECTS
// ============================================

export async function getProjects() {
  try {
    // Sites are the canonical workspaces; expose them through the
    // existing "projects" fetcher contract for task/user flows.
    const sites = await prisma.site.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const taskCounts = await prisma.task.groupBy({
      by: ["projectId"],
      _count: { _all: true },
      where: {
        projectId: { in: sites.map((site) => site.id) },
      },
    });

    const taskCountMap = new Map(taskCounts.map((row) => [row.projectId, row._count._all]));

    const projects = sites.map((site) => {
      const normalizedStatus: "ACTIVE" | "ARCHIVED" =
        site.status === "ACTIVE" ? "ACTIVE" : "ARCHIVED";

      return {
        ...site,
        status: normalizedStatus,
        _count: {
          tasks: taskCountMap.get(site.id) ?? 0,
          members: 0,
        },
      };
    });

    return { data: projects, error: null };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { data: null, error: "Failed to fetch projects" };
  }
}

export async function getProject(id: string) {
  try {
    const site = await prisma.site.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!site) {
      return { data: null, error: "Project not found" };
    }

    const taskCount = await prisma.task.count({
      where: { projectId: id },
    });

    const normalizedStatus: "ACTIVE" | "ARCHIVED" =
      site.status === "ACTIVE" ? "ACTIVE" : "ARCHIVED";

    return {
      data: {
        ...site,
        status: normalizedStatus,
        members: [],
        _count: { tasks: taskCount },
      },
      error: null,
    };
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
// E-COMMERCE DATA
// ============================================

export async function getSites() {
  return getSitesFromDb();
}

export async function getSite(id: string) {
  return getSiteFromDb(id);
}

export async function getSitesDashboardData() {
  return getSitesDashboardDataFromDb();
}

export async function getCampaigns() {
  return getCampaignsFromDb();
}

export async function getCampaign(id: string) {
  return getCampaignFromDb(id);
}

export async function getCampaignsForSite(siteId: string) {
  return getCampaignsForSiteFromDb(siteId);
}

export async function getCreatives() {
  return getCreativesFromDb();
}

export async function getCreativesForSite(siteId: string) {
  return getCreativesForSiteFromDb(siteId);
}

export async function getCreativesForCampaign(campaignId: string) {
  return getCreativesForCampaignFromDb(campaignId);
}

export async function getCreative(id: string) {
  return getCreativeFromDb(id);
}

export async function getAdsDashboardData() {
  return getAdsDashboardDataFromDb();
}

export async function getAdPlatformConnections() {
  return getAdPlatformConnectionsFromDb();
}

export async function getSEOAnalyses() {
  return getSEOAnalysesFromDb();
}

export async function getSEOAnalysisForSite(siteId: string) {
  return getSEOAnalysisForSiteFromDb(siteId);
}

export async function getSEODashboardData() {
  return getSEODashboardDataFromDb();
}

export async function getProductListings() {
  return getProductListingsFromDb();
}

export async function getProductListing(id: string) {
  return getProductListingFromDb(id);
}

export async function getProductsForSite(siteId: string) {
  return getProductsForSiteFromDb(siteId);
}

export async function getProductsDashboardData() {
  return getProductsDashboardDataFromDb();
}

export async function getAnalyticsDashboardData(days: number = 30) {
  return getAnalyticsDashboardDataFromDb(days);
}

export async function getSiteAnalytics(siteId: string, days: number = 30) {
  return getSiteAnalyticsFromDb(siteId, days);
}

export async function getEmailAutomations() {
  return getEmailAutomationsFromDb();
}

export async function getEmailAutomation(id: string) {
  return getEmailAutomationFromDb(id);
}
