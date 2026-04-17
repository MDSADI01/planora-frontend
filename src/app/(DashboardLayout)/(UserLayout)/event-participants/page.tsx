"use client";

import { useState, useEffect } from "react";
import { getMyEventsAction, type MyEvent } from "@/src/app/(DashboardLayout)/(UserLayout)/action/event";
import {
  getEventParticipantsAction,
  updateParticipantStatusAction,
  type Participant,
  type ParticipantStatus,
} from "@/src/app/(DashboardLayout)/(UserLayout)/action/participant";
import { Check, X, Clock, UserCheck, Ban, Calendar, CalendarCheck, MinusCircle, Users } from "lucide-react";
import { Button } from "@/src/components/ui/button";

const statusConfig: Record<
  ParticipantStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: <Clock className="w-4 h-4" />,
  },
  APPROVED: {
    label: "Approved",
    color: "bg-green-100 text-green-800",
    icon: <Check className="w-4 h-4" />,
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
    icon: <X className="w-4 h-4" />,
  },
  BANNED: {
    label: "Banned",
    color: "bg-red-100 text-red-800",
    icon: <Ban className="w-4 h-4" />,
  },
  REGISTERED: {
    label: "Registered",
    color: "bg-blue-100 text-blue-800",
    icon: <UserCheck className="w-4 h-4" />,
  },
  ATTENDED: {
    label: "Attended",
    color: "bg-purple-100 text-purple-800",
    icon: <CalendarCheck className="w-4 h-4" />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-800",
    icon: <MinusCircle className="w-4 h-4" />,
  },
};

const EventParticipantsPage = () => {
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [allParticipants, setAllParticipants] = useState<Participant[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      loadParticipants(selectedEventId);
    } else if (events.length > 0) {
      // Load participants for all events
      loadAllParticipants();
    }
  }, [selectedEventId, events]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const eventsData = await getMyEventsAction();
      setEvents(eventsData);
      if (eventsData.length > 0) {
        await loadAllParticipants();
      }
    } catch (err) {
      setMessage({ ok: false, text: "Failed to load events." });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllParticipants = async () => {
    const participantsPromises = events.map((event) =>
      getEventParticipantsAction(event.id)
    );
    const participantsArrays = await Promise.all(participantsPromises);
    const allParticipantsWithEvent = participantsArrays.flatMap((participants, index) =>
      participants.map((p) => ({ ...p, eventName: events[index].title }))
    );
    setAllParticipants(allParticipantsWithEvent);
  };

  const loadParticipants = async (eventId: string) => {
    try {
      const participantsData = await getEventParticipantsAction(eventId);
      const participantsWithEvent = participantsData.map((p) => ({
        ...p,
        eventName: events.find((e) => e.id === eventId)?.title || "Unknown Event",
      }));
      setAllParticipants(participantsWithEvent);
    } catch (err) {
      setMessage({ ok: false, text: "Failed to load participants." });
    }
  };

  const handleStatusChange = async (participantId: string, newStatus: ParticipantStatus) => {
    setUpdatingStatus(participantId);
    try {
      const result = await updateParticipantStatusAction(participantId, newStatus);
      setMessage({ ok: result.success, text: result.message });
      if (result.success) {
        if (selectedEventId) {
          await loadParticipants(selectedEventId);
        } else {
          await loadAllParticipants();
        }
      }
    } catch (err) {
      setMessage({ ok: false, text: "Failed to update participant status." });
    } finally {
      setUpdatingStatus(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star} className="text-yellow-400">
        {star <= rating ? "★" : "☆"}
      </span>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Event Participants</h1>
        <p className="text-sm text-muted-foreground">
          Manage participants for your events and update their status.
        </p>
      </div>

      {message && (
        <div
          className={`rounded-md border px-3 py-2 text-sm ${
            message.ok
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Event Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Filter by Event:</label>
        <select
          value={selectedEventId || ""}
          onChange={(e) => setSelectedEventId(e.target.value || null)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Events</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      {events.length === 0 ? (
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          No events found. Create an event to start managing participants.
        </div>
      ) : allParticipants.length === 0 ? (
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          No participants yet for your events.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Participant</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Current Status</th>
                <th className="px-4 py-3 font-medium">Payment Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allParticipants.map((participant) => (
                <tr key={participant.id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {(participant as any).eventName || "Unknown Event"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {participant.user.image && (
                        <img
                          src={participant.user.image}
                          alt={participant.user.name || "User"}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{participant.user.name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(participant.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{participant.user.email || "N/A"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        statusConfig[participant.status].color
                      }`}
                    >
                      {statusConfig[participant.status].icon}
                      {statusConfig[participant.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        participant.paymentStatus === "SUCCESS"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {participant.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {updatingStatus === participant.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      ) : (
                        <select
                          value={participant.status}
                          onChange={(e) =>
                            handleStatusChange(participant.id, e.target.value as ParticipantStatus)
                          }
                          className="text-sm border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REJECTED">Rejected</option>
                          <option value="BANNED">Banned</option>
                          <option value="REGISTERED">Registered</option>
                          <option value="ATTENDED">Attended</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default EventParticipantsPage;
