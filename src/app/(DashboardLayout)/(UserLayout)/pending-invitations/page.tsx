import { getMyInvitationsAction } from "@/src/app/(DashboardLayout)/(UserLayout)/action/invitation";
import PendingInvitationsTable from "@/src/components/pending-invitations-table";

const PendingInvitationsPage = async () => {
  const initialInvitations = await getMyInvitationsAction();

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Pending Invitations</h1>
        <p className="text-sm text-muted-foreground">
          Invitations waiting for your response will appear here.
        </p>
      </div>
      <PendingInvitationsTable initialInvitations={initialInvitations} />
    </section>
  );
};

export default PendingInvitationsPage;
