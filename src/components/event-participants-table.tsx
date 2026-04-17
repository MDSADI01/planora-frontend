"use client";

import { useState, useEffect } from "react";
import { Check, X, Clock, UserCheck, Ban, Calendar, CalendarCheck, MinusCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  getEventParticipantsAction,
  updateParticipantStatusAction,
  type Participant,
  type ParticipantStatus,
} from "@/src/app/(DashboardLayout)/(UserLayout)/action/participant";

interface EventParticipantsTableProps {
  eventId: string;
}

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

const EventParticipantsTable = ({ eventId }: EventParticipantsTableProps) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    loadParticipants();
  }, [eventId]);

  const loadParticipants = async () => {
    setIsLoading(true);
    try {
      const participantsData = await getEventParticipantsAction(eventId);
      setParticipants(participantsData);
    } catch (err) {
      setMessage({ ok: false, text: "Failed to load participants." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (participantId: string, newStatus: ParticipantStatus) => {
    setUpdatingStatus(participantId);
    try {
      const result = await updateParticipantStatusAction(participantId, newStatus);
      setMessage({ ok: result.success, text: result.message });
      if (result.success) {
        await loadParticipants();
      }
    } catch (err) {
      setMessage({ ok: false, text: "Failed to update participant status." });
    } finally {
      setUpdatingStatus(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

      {participants.length === 0 ? (
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          No participants yet for this event.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Participant</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Current Status</th>
                <th className="px-4 py-3 font-medium">Payment Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <tr key={participant.id} className="border-t">
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
    </div>
  );
};

export default EventParticipantsTable;
