"use client";

import { useMemo } from "react";
import { MyEvent } from "@/src/app/(DashboardLayout)/(UserLayout)/action/event";
import { Invitation } from "@/src/app/(DashboardLayout)/(UserLayout)/action/invitation";
import { Participant } from "@/src/app/(DashboardLayout)/(UserLayout)/action/participant";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface EventWithParticipants {
  eventId: string;
  title: string;
  participants: Participant[];
}

interface UserDashboardChartsProps {
  events: MyEvent[];
  invitations: Invitation[];
  eventsWithParticipants: EventWithParticipants[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function UserDashboardCharts({ events, invitations, eventsWithParticipants }: UserDashboardChartsProps) {
  // 1. My Events by Modality
  const eventsByType = useMemo(() => {
    const typeCounts = events.reduce((acc, curr) => {
      const type = curr.type || "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  }, [events]);

  // 2. Invitations by Status
  const invitationsByStatus = useMemo(() => {
    const statusCounts = invitations.reduce((acc, curr) => {
      const status = curr.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [invitations]);

  // 3. User's Top Events by Participant Count
  const topEvents = useMemo(() => {
    return [...eventsWithParticipants]
      .sort((a, b) => b.participants.length - a.participants.length)
      .slice(0, 5)
      .map(e => ({
        name: e.title.length > 15 ? e.title.substring(0, 15) + '...' : e.title,
        participants: e.participants.length
      }));
  }, [eventsWithParticipants]);

  if (events.length === 0 && invitations.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-dashed p-8 text-center bg-gray-50 text-gray-500 shadow-sm">
        <p>No activity yet! Create an event or receive invitations to see your charts.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-8">
      {/* Chart 1: Events by Type */}
      {events.length > 0 && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">My Events by Type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventsByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {eventsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 2: Invitations */}
      {invitations.length > 0 && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">My Invitations Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={invitationsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#82ca9d"
                  dataKey="value"
                >
                  {invitationsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 3: Top Events by Participants */}
      {eventsWithParticipants.some(e => e.participants.length > 0) && (
        <div className="md:col-span-2 rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Participant Engagement in My Events</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topEvents} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="participants" fill="#FFBB28" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
