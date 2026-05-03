import { redirect } from "next/navigation";
import { Mail, ShieldCheck, UserRound } from "lucide-react";

import { getLoggedInUser } from "@/src/app/(DashboardLayout)/(UserLayout)/action/event";
import { getAllUsersAction, getAllEventsAction } from "@/src/app/(DashboardLayout)/(AdminLayout)/action/admin";
import AdminDashboardCharts from "@/src/components/Dashboard/admin-dashboard-charts";

const AdminProfilePage = async () => {
  const user = await getLoggedInUser();
  const users = await getAllUsersAction();
  const events = await getAllEventsAction();
  console.log(user);

  if (!user) {
    redirect("/login");
  }

  const firstLetter = user.name?.[0]?.toUpperCase() ?? user.email[0]?.toUpperCase() ?? "A";

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Profile</h1>
        <p className="text-sm text-muted-foreground">
          Your administrator account details and login information.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-1">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-3xl font-bold text-purple-700">
            {firstLetter}
          </div>
          <h2 className="mt-4 text-center text-xl font-semibold">
            {user.name || "Planora Admin"}
          </h2>
          <p className="text-center text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-2 flex justify-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Administrator
            </span>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold">Account Summary</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-md border p-3">
              <UserRound className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-xs text-muted-foreground">User ID</p>
                <p className="font-medium">{user.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-md border p-3">
              <Mail className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-md border p-3">
              <ShieldCheck className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{user.role || "ADMIN"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminDashboardCharts events={events} users={users} />
    </section>
  );
};

export default AdminProfilePage;
