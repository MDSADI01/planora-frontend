import { redirect } from "next/navigation";

import { getLoggedInUser } from "@/src/app/(DashboardLayout)/(UserLayout)/action/event";
import AddEventForm from "@/src/app/(DashboardLayout)/(UserLayout)/add-events/add-event-form";

const AddEventsPage = async () => {
  const user = await getLoggedInUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Add Events</h1>
        <p className="text-sm text-muted-foreground">
          Fill all required fields and publish your event.
        </p>
      </div>
      <AddEventForm organizerId={user.id} />
    </section>
  );
};

export default AddEventsPage;
