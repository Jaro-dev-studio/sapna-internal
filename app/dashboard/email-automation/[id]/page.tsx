import { authOptions } from "@/authOptions";
import { getUserPermissions, hasPageAccess } from "@/lib/permissions";
import { getEmailAutomation } from "@/lib/fetchers";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { EmailAutomationDetailClient } from "./client";

interface EmailAutomationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmailAutomationDetailPage({ params }: EmailAutomationDetailPageProps) {
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

  const { id } = await params;
  const { data, error } = await getEmailAutomation(id);

  if (!data || error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{error || "Email automation not found"}</p>
      </div>
    );
  }

  return <EmailAutomationDetailClient automation={data} />;
}
