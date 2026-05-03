import { redirect } from "next/navigation";
import { Mail, ShieldCheck, UserRound } from "lucide-react";

import { getLoggedInUser, getMyEventsAction } from "@/src/app/(DashboardLayout)/(UserLayout)/action/event";
import { getMyInvitationsAction } from "@/src/app/(DashboardLayout)/(UserLayout)/action/invitation";
import { getEventParticipantsAction } from "@/src/app/(DashboardLayout)/(UserLayout)/action/participant";
import UserDashboardCharts from "@/src/components/Dashboard/user-dashboard-charts";

const UserProfilePage = async () => {
  const user = await getLoggedInUser();
  const myEvents = await getMyEventsAction();
  const myInvitations = await getMyInvitationsAction();

  const participantsPromises = myEvents.map(event =>
    getEventParticipantsAction(event.id).then(participants => ({
      eventId: event.id,
      title: event.title,
      participants: participants
    }))
  );
  
  const eventsWithParticipants = await Promise.all(participantsPromises);
  console.log(user);

  if (!user) {
    redirect("/login");
  }

  const firstLetter = user.name?.[0]?.toUpperCase() ?? user.email[0]?.toUpperCase() ?? "U";

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Your account details and login information.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-1">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
            {firstLetter}
          </div>
          <h2 className="mt-4 text-center text-xl font-semibold">
            {user.name || "Planora User"}
          </h2>
          <p className="text-center text-sm text-muted-foreground">{user.email}</p>
        </div>

        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold">Account Summary</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-md border p-3">
              <UserRound className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">User ID</p>
                <p className="font-medium">{user.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-md border p-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-md border p-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{user.role || "user"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserDashboardCharts events={myEvents} invitations={myInvitations} eventsWithParticipants={eventsWithParticipants} />
    </section>
  );
};

export default UserProfilePage;