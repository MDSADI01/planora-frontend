import { getMyEventsAction } from "@/src/app/(DashboardLayout)/(UserLayout)/action/event";
import MyEventsTable from "@/src/app/(DashboardLayout)/(UserLayout)/my-events/my-events-table";

const MyEventsPage = async () => {
  const events = await getMyEventsAction();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">My Events</h1>
      <p className="text-sm text-muted-foreground">
        Manage your created events: invite, update, and delete from one table.
      </p>
      <MyEventsTable initialEvents={events} />
    </section>
  );
};

export default MyEventsPage;
