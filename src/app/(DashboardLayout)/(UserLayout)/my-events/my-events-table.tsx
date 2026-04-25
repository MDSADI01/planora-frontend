"use client";

import { useMemo, useState, useTransition } from "react";

import {
  deleteEventAction,
  updateEventAction,
  type MyEvent,
} from "@/src/app/(DashboardLayout)/(UserLayout)/action/event";
import { sendInvitationAction } from "@/src/app/(DashboardLayout)/(UserLayout)/action/invitation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

type MyEventsTableProps = {
  initialEvents: MyEvent[];
};

const formatDate = (dateValue: string) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString();
};

const MyEventsTable = ({ initialEvents }: MyEventsTableProps) => {
  const [events, setEvents] = useState(initialEvents);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [editingEvent, setEditingEvent] = useState<MyEvent | null>(null);
  const [inviteModal, setInviteModal] = useState<{ open: boolean; eventId: string | null }>({ open: false, eventId: null });
  const [inviteEmail, setInviteEmail] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [isPending, startTransition] = useTransition();

  const emptyState = useMemo(() => events.length === 0, [events.length]);

  const onDelete = (eventId: string) => {
    startTransition(async () => {
      const result = await deleteEventAction(eventId);
      setMessage({ ok: result.success, text: result.message });
      if (result.success) {
        setEvents((prev) => prev.filter((event) => event.id !== eventId));
      }
    });
  };

  const onInvite = (eventId: string) => {
    setInviteModal({ open: true, eventId });
    setInviteEmail("");
  };

  const onSendInvitation = () => {
    if (!inviteModal.eventId || !inviteEmail) {
      setMessage({ ok: false, text: "Please enter a valid email address." });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setIsSendingInvite(true);
    startTransition(async () => {
      try {
        const result = await sendInvitationAction(inviteModal.eventId!, inviteEmail);
        setMessage({ ok: result.success, text: result.message });
        if (result.success) {
          setInviteModal({ open: false, eventId: null });
          setInviteEmail("");
        }
      } catch (error) {
        setMessage({ ok: false, text: "Failed to send invitation. Please try again." });
      } finally {
        setIsSendingInvite(false);
        setTimeout(() => setMessage(null), 5000);
      }
    });
  };

  const onUpdateSubmit = (formData: FormData) => {
    if (!editingEvent) return;

    const payload: Partial<MyEvent> = {
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      date: String(formData.get("date") ?? ""),
      time: String(formData.get("time") ?? ""),
      venue: String(formData.get("venue") ?? "").trim() || undefined,
      image: String(formData.get("image") ?? "").trim(),
      type: String(formData.get("type") ?? "IN_PERSON") as "IN_PERSON" | "ONLINE",
      fee: Number(formData.get("fee") ?? 0) || undefined,
      eventCategory: String(formData.get("eventCategory") ?? "PUBLIC") as
        | "PRIVATE"
        | "PUBLIC",
    };

    startTransition(async () => {
      const result = await updateEventAction(editingEvent.id, payload);
      setMessage({ ok: result.success, text: result.message });

      if (result.success) {
        setEvents((prev) =>
          prev.map((event) =>
            event.id === editingEvent.id ? { ...event, ...payload } as MyEvent : event
          )
        );
        setEditingEvent(null);
      }
    });
  };

  return (
    <section className="space-y-4">
      {message ? (
        <p
          className={`rounded-md border px-3 py-2 text-sm ${
            message.ok
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      {emptyState ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          No events yet. Create your first one from Add Events.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Fee</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t">
                  <td className="px-4 py-3">
                    <p className="font-medium">{event.title}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {event.description}
                    </p>
                  </td>
                  <td className="px-4 py-3">{formatDate(event.date)}</td>
                  <td className="px-4 py-3">{event.time}</td>
                  <td className="px-4 py-3">{event.type}</td>
                  <td className="px-4 py-3">{event.eventCategory ?? "-"}</td>
                  <td className="px-4 py-3">{event.fee ? `৳${event.fee}` : "Free"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => onInvite(event.id)}
                      >
                        Send Invite
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => setEditingEvent(event)}
                      >
                        Update
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={isPending}
                        onClick={() => onDelete(event.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingEvent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-background p-5 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Update Event</h2>
            <form
              action={onUpdateSubmit}
              className="grid gap-3 md:grid-cols-2"
            >
              <input name="title" defaultValue={editingEvent.title} className="h-10 rounded-md border px-3 text-sm md:col-span-2" />
              <textarea
                name="description"
                defaultValue={editingEvent.description}
                className="rounded-md border px-3 py-2 text-sm md:col-span-2"
                rows={3}
              />
              <input name="date" type="date" defaultValue={String(editingEvent.date).slice(0, 10)} className="h-10 rounded-md border px-3 text-sm" />
              <input name="time" type="time" defaultValue={editingEvent.time} className="h-10 rounded-md border px-3 text-sm" />
              <input name="venue" defaultValue={editingEvent.venue ?? ""} className="h-10 rounded-md border px-3 text-sm" />
              <input name="image" defaultValue={editingEvent.image} className="h-10 rounded-md border px-3 text-sm" />
              <select name="type" defaultValue={editingEvent.type} className="h-10 rounded-md border px-3 text-sm">
                <option value="IN_PERSON">IN_PERSON</option>
                <option value="ONLINE">ONLINE</option>
              </select>
              <select
                name="eventCategory"
                defaultValue={editingEvent.eventCategory ?? "PUBLIC"}
                className="h-10 rounded-md border px-3 text-sm"
              >
                <option value="PUBLIC">PUBLIC</option>
                <option value="PRIVATE">PRIVATE</option>
              </select>
              <input
                name="fee"
                type="number"
                min={0}
                step="0.01"
                defaultValue={editingEvent.fee ?? 0}
                className="h-10 rounded-md border px-3 text-sm"
              />

              <div className="mt-2 flex justify-end gap-2 md:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingEvent(null)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {inviteModal.open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-background p-5 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Send Invitation</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full"
                />
                <p className="mt-1 text-xs text-gray-500">
                  The email must be accurate and match a registered user
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInviteModal({ open: false, eventId: null })}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={onSendInvitation}
                  disabled={isSendingInvite || !inviteEmail}
                >
                  {isSendingInvite ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Invitation"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default MyEventsTable;

