import AdminEventsTable from "@/src/components/admin-events-table";

const AdminEventsPage = () => {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Manage Events</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all events in the platform.
        </p>
      </div>
      <AdminEventsTable />
    </section>
  );
};

export default AdminEventsPage;
