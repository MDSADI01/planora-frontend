import React from 'react'
import EventDetail from "@/src/components/Home/EventSection/event-detail";

interface EventPageProps {
  params: {
    id: string;
  };
}

const EventDetails = async ({ params }: EventPageProps) => {

    const { id } = await params;

  return <EventDetail eventId={id} />;
};

export default EventDetails