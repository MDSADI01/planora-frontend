"use server";

import { env } from "@/src/env";
import {
  getAuthCookies,
  parseApiMessage,
  tryRefreshAccessToken,
} from "@/src/lib/server-auth";

export type AdminUser = {
  id: string;
  name?: string;
  email: string;
  role: string;
  image?: string;
  createdAt: string;
};

export type AdminEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue?: string | null;
  image: string;
  type: "IN_PERSON" | "ONLINE";
  fee?: number | null;
  eventCategory?: "PRIVATE" | "PUBLIC" | null;
  organizerId: string;
  organizer: {
    id: string;
    name?: string;
    email: string;
  };
  _count: {
    participants: number;
    payments: number;
  };
  createdAt: string;
};

export type AdminActionState = {
  success: boolean;
  message: string;
};

const getAdminApiUrl = () => {
  return (
    env.NEXT_PUBLIC_API_BASE_URL ||
    env.AUTH_API_URL.replace(/\/auth\/?$/, "")
  );
};

const authenticatedRequest = async (
  input: string,
  init: RequestInit = {}
) => {
  let { accessToken, refreshToken } = await getAuthCookies();
  if (!accessToken) return null;

  const execute = (token: string) =>
    fetch(input, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

  let response = await execute(accessToken);

  if ((response.status === 401 || response.status === 403) && refreshToken) {
    const refreshedToken = await tryRefreshAccessToken();
    if (refreshedToken) {
      accessToken = refreshedToken;
      ({ refreshToken } = await getAuthCookies());
      response = await execute(accessToken);
    }
  }

  return response;
};

const parseJsonData = async <T>(response: Response) => {
  const data = (await response.json()) as { data?: T };
  return data.data;
};

export async function getAllUsersAction(): Promise<AdminUser[]> {
  try {
    const response = await authenticatedRequest(
      `${getAdminApiUrl()}/admin/users`,
      {
        method: "GET",
      }
    );

    if (!response || !response.ok) return [];

    return (await parseJsonData<AdminUser[]>(response)) ?? [];
  } catch {
    return [];
  }
}

export async function deleteUserAction(userId: string): Promise<AdminActionState> {
  if (!userId) {
    return { success: false, message: "Missing user id." };
  }

  try {
    const response = await authenticatedRequest(
      `${getAdminApiUrl()}/admin/users/${userId}`,
      {
        method: "DELETE",
      }
    );

    if (!response) return { success: false, message: "Please login first." };

    if (!response.ok) {
      const message = await parseApiMessage(response);
      return { success: false, message: message || "Failed to delete user." };
    }

    const successMessage = await parseApiMessage(response);
    return { success: true, message: successMessage || "User deleted successfully." };
  } catch {
    return { success: false, message: "Network error while deleting user." };
  }
}

export async function getAllEventsAction(): Promise<AdminEvent[]> {
  try {
    const response = await authenticatedRequest(
      `${getAdminApiUrl()}/admin/events`,
      {
        method: "GET",
      }
    );

    if (!response || !response.ok) return [];

    return (await parseJsonData<AdminEvent[]>(response)) ?? [];
  } catch {
    return [];
  }
}

export async function deleteEventAction(eventId: string): Promise<AdminActionState> {
  if (!eventId) {
    return { success: false, message: "Missing event id." };
  }

  try {
    const response = await authenticatedRequest(
      `${getAdminApiUrl()}/admin/events/${eventId}`,
      {
        method: "DELETE",
      }
    );

    if (!response) return { success: false, message: "Please login first." };

    if (!response.ok) {
      const message = await parseApiMessage(response);
      return { success: false, message: message || "Failed to delete event." };
    }

    const successMessage = await parseApiMessage(response);
    return { success: true, message: successMessage || "Event deleted successfully." };
  } catch {
    return { success: false, message: "Network error while deleting event." };
  }
}
