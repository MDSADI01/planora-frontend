"use client";

import { useMemo } from "react";
import { AdminEvent, AdminUser } from "@/src/app/(DashboardLayout)/(AdminLayout)/action/admin";
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
  LineChart,
  Line,
} from "recharts";

interface AdminDashboardChartsProps {
  events: AdminEvent[];
  users: AdminUser[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function AdminDashboardCharts({ events, users }: AdminDashboardChartsProps) {
  // 1. Events by Category
  const eventsByCategory = useMemo(() => {
    const categoryCounts = events.reduce((acc, curr) => {
      const cat = curr.eventCategory || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  }, [events]);

  // 2. Events by Type (In Person vs Online)
  const eventsByType = useMemo(() => {
    const typeCounts = events.reduce((acc, curr) => {
      const type = curr.type || "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  }, [events]);

  // 3. Top Events by Participants
  const topEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => b._count.participants - a._count.participants)
      .slice(0, 5)
      .map(e => ({
        name: e.title.length > 15 ? e.title.substring(0, 15) + '...' : e.title,
        participants: e._count.participants
      }));
  }, [events]);

  // 4. User Registration Timeline
  const userTimeline = useMemo(() => {
    const timeline = users.reduce((acc, curr) => {
      const date = new Date(curr.createdAt);
      // Format as YYYY-MM
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort chronologically
    return Object.entries(timeline)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, newUsers]) => {
        // Convert 'YYYY-MM' back to 'MMM YYYY' if needed, but 'YYYY-MM' works
        const [year, month] = name.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1);
        return { 
          name: dateObj.toLocaleString('default', { month: 'short', year: 'numeric' }), 
          newUsers 
        };
      });
  }, [users]);

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-8">
      {/* Chart 1: Events by Category */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Events by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={eventsByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {eventsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Events by Type */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Events by Type</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={eventsByType}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#82ca9d"
                dataKey="value"
                label
              >
                {eventsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Top Events by Participants */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Top 5 Events (Participants)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topEvents} layout="vertical" margin={{ left: 40, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="participants" fill="#8884d8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: User Growth */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">User Registrations</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userTimeline} margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
