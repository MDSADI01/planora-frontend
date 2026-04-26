"use server";

import { env } from "@/src/env";
import {
  decodeJwtPayload,
  getAuthCookies,
  parseApiMessage,
  tryRefreshAccessToken,
} from "@/src/lib/server-auth";

export type LoggedInUser = {
  id: string;
  email: string;
  role: string;
  name?: string;
};

export type EventActionState = {
  success: boolean;
  message: string;
};

export type MyEvent = {
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
};

const initialState: EventActionState = {
  success: false,
  message: "",
};

type JwtPayload = {
  sub?: string;
  id?: string;
  userId?: string;
  email?: string;
  role?: string;
  userRole?: string;
  name?: string;
};

const getEventsApiUrl = () => {
  return (
    env.NEXT_PUBLIC_API_BASE_URL ||
    (env.AUTH_API_URL || "https://your-api-url.com/auth").replace(/\/auth\/?$/, "")
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

const createEventRequest = async (
  payload: Record<string, unknown>,
  token: string
) => {
  return fetch(`${getEventsApiUrl()}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
};

export async function getLoggedInUser(): Promise<LoggedInUser | null> {
  const { accessToken: token, authUser: emailFromCookie = "" } = await getAuthCookies();

  if (!token) return null;

  const payload = decodeJwtPayload<JwtPayload>(token);
  if (!payload) return null;

  const id = payload.userId ?? payload.id ?? payload.sub;
  const role = payload.role ?? payload.userRole ?? "";
  const email = payload.email ?? emailFromCookie;

  if (!id || !email) return null;

  return {
    id,
    email,
    role,
    name: payload.name,
  };
}

export async function createEventAction(
  _prevState: EventActionState = initialState,
  formData: FormData
): Promise<EventActionState> {
  const { accessToken: token } = await getAuthCookies();
  const user = await getLoggedInUser();

  if (!token || !user) {
    return { success: false, message: "Please login first." };
  }

  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    venue: String(formData.get("venue") ?? "").trim() || undefined,
    image: String(formData.get("image") ?? "").trim(),
    type: String(formData.get("type") ?? ""),
    fee: Number(formData.get("fee") ?? 0) || undefined,
    eventCategory: String(formData.get("eventCategory") ?? "") || undefined,
    organizerId: user.id,
  };

  if (!payload.title || !payload.description || !payload.date || !payload.time) {
    return { success: false, message: "Please fill all required fields." };
  }

  if (!payload.image) {
    return { success: false, message: "Image is required." };
  }

  if (payload.type !== "IN_PERSON" && payload.type !== "ONLINE") {
    return { success: false, message: "Please select a valid event type." };
  }

  if (
    payload.eventCategory &&
    payload.eventCategory !== "PRIVATE" &&
    payload.eventCategory !== "PUBLIC"
  ) {
    return { success: false, message: "Please select a valid event category." };
  }

  try {
    const response = await authenticatedRequest(`${getEventsApiUrl()}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response) {
      return { success: false, message: "Please login first." };
    }

    if (!response.ok) {
      const message = await parseApiMessage(response);

      return {
        success: false,
        message: message || "Failed to create event.",
      };
    }

    return {
      success: true,
      message: "Event created successfully.",
    };
  } catch {
    return {
      success: false,
      message: "Network error while creating event.",
    };
  }
}

export async function getMyEventsAction(): Promise<MyEvent[]> {
  const user = await getLoggedInUser();
  if (!user) return [];

  try {
    const response = await authenticatedRequest(`${getEventsApiUrl()}/events`, {
      method: "GET",
    });
    if (!response || !response.ok) return [];

    const events = (await parseJsonData<MyEvent[]>(response)) ?? [];
    return events.filter((event) => event.organizerId === user.id);
  } catch {
    return [];
  }
}

export async function deleteEventAction(eventId: string): Promise<EventActionState> {
  if (!eventId) return { success: false, message: "Missing event id." };

  try {
    const response = await authenticatedRequest(`${getEventsApiUrl()}/events/${eventId}`, {
      method: "DELETE",
    });

    if (!response) return { success: false, message: "Please login first." };
    if (!response.ok) {
      const message = await parseApiMessage(response);
      return { success: false, message: message || "Failed to delete event." };
    }

    return { success: true, message: "Event deleted successfully." };
  } catch {
    return { success: false, message: "Network error while deleting event." };
  }
}

export async function updateEventAction(
  eventId: string,
  data: Partial<MyEvent>
): Promise<EventActionState> {
  if (!eventId) return { success: false, message: "Missing event id." };

  const payload: Record<string, unknown> = {};

  if (typeof data.title === "string" && data.title.trim()) {
    payload.title = data.title.trim();
  }

  if (typeof data.description === "string" && data.description.trim()) {
    payload.description = data.description.trim();
  }

  if (typeof data.date === "string" && data.date) {
    const date = new Date(data.date);
    if (!Number.isNaN(date.getTime())) {
      payload.date = date.toISOString();
    }
  }

  if (typeof data.time === "string" && data.time) {
    payload.time = data.time;
  }

  if (typeof data.venue === "string") {
    const trimmedVenue = data.venue.trim();
    if (trimmedVenue) {
      payload.venue = trimmedVenue;
    }
  }

  if (typeof data.image === "string" && data.image.trim()) {
    payload.image = data.image.trim();
  }

  if (data.type === "IN_PERSON" || data.type === "ONLINE") {
    payload.type = data.type;
  }

  if (data.eventCategory === "PRIVATE" || data.eventCategory === "PUBLIC") {
    payload.eventCategory = data.eventCategory;
  }

  if (data.fee !== undefined && data.fee !== null) {
    const feeNumber = Number(data.fee);
    if (!Number.isNaN(feeNumber) && feeNumber >= 0) {
      payload.fee = feeNumber;
    }
  }

  try {
    const response = await authenticatedRequest(`${getEventsApiUrl()}/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response) return { success: false, message: "Please login first." };
    if (!response.ok) {
      const message = await parseApiMessage(response);
      return { success: false, message: message || "Failed to update event." };
    }

    return { success: true, message: "Event updated successfully." };
  } catch {
    return { success: false, message: "Network error while updating event." };
  }
}

export async function sendInviteAction(eventId: string): Promise<EventActionState> {
  if (!eventId) return { success: false, message: "Missing event id." };

  try {
    const response = await authenticatedRequest(
      `${getEventsApiUrl()}/events/${eventId}/invite`,
      {
        method: "POST",
      }
    );

    if (!response) return { success: false, message: "Please login first." };

    // If endpoint does not exist yet, keep a friendly fallback.
    if (response.status === 404) {
      return { success: true, message: "Invite action is ready. Backend invite API pending." };
    }

    if (!response.ok) {
      const message = await parseApiMessage(response);
      return { success: false, message: message || "Failed to send invite." };
    }

    return { success: true, message: "Invitation sent successfully." };
  } catch {
    return { success: false, message: "Network error while sending invite." };
  }
}
