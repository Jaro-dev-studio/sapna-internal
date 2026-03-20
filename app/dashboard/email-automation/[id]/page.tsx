import { getEmailAutomation } from "@/lib/fetchers";
import { EmailAutomationDetailClient } from "./client";

interface EmailAutomationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmailAutomationDetailPage({ params }: EmailAutomationDetailPageProps) {
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
