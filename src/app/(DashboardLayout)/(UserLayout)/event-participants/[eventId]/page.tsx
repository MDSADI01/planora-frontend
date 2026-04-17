import EventParticipantsTable from "@/src/components/event-participants-table";

interface EventParticipantsPageProps {
  params: {
    eventId: string;
  };
}

const EventParticipantsPage = async ({ params }: EventParticipantsPageProps) => {
  const { eventId } = await params;

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Event Participants</h1>
        <p className="text-sm text-muted-foreground">
          Manage participants for your event and update their status.
        </p>
      </div>
      <EventParticipantsTable eventId={eventId} />
    </section>
  );
};

export default EventParticipantsPage;
