import AdminUsersTable from "@/src/components/admin-users-table";

const AdminUsersPage = () => {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Manage Users</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all registered users.
        </p>
      </div>
      <AdminUsersTable />
    </section>
  );
};

export default AdminUsersPage;
