import { authOptions } from "@/authOptions";
import { getUserPermissions, hasPageAccess } from "@/lib/permissions";
import { getEmailAutomations, getSites } from "@/lib/fetchers";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { EmailAutomationClient } from "./client";

export default async function EmailAutomationPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    redirect("/");
  }

  const permissions = await getUserPermissions(user.id);
  if (!hasPageAccess(permissions, "emailAutomation")) {
    redirect("/dashboard");
  }

  const [{ data: automations, error }, { data: sites, error: sitesError }] = await Promise.all([
    getEmailAutomations(),
    getSites(),
  ]);

  if (!automations || !sites || error || sitesError) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{error || sitesError || "Failed to load email automation"}</p>
      </div>
    );
  }

  return <EmailAutomationClient automations={automations} sites={sites} />;
}
