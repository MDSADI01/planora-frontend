"use client";

import { useMemo, useState, useTransition } from "react";
import {
  getMyInvitationsAction,
  respondToInvitationAction,
  type Invitation,
} from "@/src/app/(DashboardLayout)/(UserLayout)/action/invitation";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

type PendingInvitationsTableProps = {
  initialInvitations: Invitation[];
};

const formatDate = (dateValue: string) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString();
};

const PendingInvitationsTable = ({ initialInvitations }: PendingInvitationsTableProps) => {
  const [invitations, setInvitations] = useState(initialInvitations);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  const emptyState = useMemo(() => invitations.length === 0, [invitations.length]);

  const onRespond = (invitationId: string, status: "ACCEPTED" | "REJECTED") => {
    setRespondingTo(invitationId);
    startTransition(async () => {
      try {
        const result = await respondToInvitationAction(invitationId, status);
        setMessage({ ok: result.success, text: result.message });
        if (result.success) {
          setInvitations((prev) =>
            prev.map((invitation) =>
              invitation.id === invitationId
                ? { ...invitation, status }
                : invitation
            )
          );
        }
      } catch (error) {
        setMessage({ ok: false, text: "Failed to respond to invitation. Please try again." });
      } finally {
        setRespondingTo(null);
        setTimeout(() => setMessage(null), 5000);
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
            Accepted
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
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
          No pending invitations. Your invitations will appear here.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Event Title</th>
                <th className="px-4 py-3 font-medium">Organizer</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Fee</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((invitation) => (
                <tr key={invitation.id} className="border-t">
                  <td className="px-4 py-3">
                    <p className="font-medium">{invitation.event.title}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {invitation.event.description}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {invitation.event.organizer.name || "Unknown"}
                  </td>
                  <td className="px-4 py-3">{formatDate(invitation.event.date)}</td>
                  <td className="px-4 py-3">{invitation.event.time}</td>
                  <td className="px-4 py-3">
                    {invitation.event.fee ? `৳${invitation.event.fee}` : "Free"}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(invitation.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {invitation.status === "PENDING" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={respondingTo === invitation.id}
                            >
                              {respondingTo === invitation.id ? (
                                <>
                                  <svg className="mr-2 h-3 w-3 animate-spin" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  Processing...
                                </>
                              ) : (
                                "Pending"
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onRespond(invitation.id, "ACCEPTED")}
                              disabled={respondingTo === invitation.id}
                            >
                              {respondingTo === invitation.id ? "Processing..." : "Accept"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onRespond(invitation.id, "REJECTED")}
                              disabled={respondingTo === invitation.id}
                              className="text-red-600"
                            >
                              {respondingTo === invitation.id ? "Processing..." : "Reject"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {invitation.status.toLowerCase()}
                        </span>
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

export default PendingInvitationsTable;
