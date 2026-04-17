"use server";

import { env } from "@/src/env";
import {
  getAuthCookies,
  parseApiMessage,
  tryRefreshAccessToken,
} from "@/src/lib/server-auth";

export type ParticipantStatus = "PENDING" | "APPROVED" | "REJECTED" | "BANNED" | "REGISTERED" | "ATTENDED" | "CANCELLED";

export type Participant = {
  id: string;
  userId: string;
  eventId: string;
  status: ParticipantStatus;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
};

export type ParticipantActionState = {
  success: boolean;
  message: string;
};

const getParticipantsApiUrl = () => {
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

export async function joinEventAction(eventId: string): Promise<ParticipantActionState> {
  if (!eventId) {
    return { success: false, message: "Missing event id." };
  }

  try {
    const response = await authenticatedRequest(
      `${getParticipantsApiUrl()}/participants`,
      {
        method: "POST",
        body: JSON.stringify({ eventId }),
      }
    );

    if (!response) return { success: false, message: "Please login first." };

    if (!response.ok) {
      const message = await parseApiMessage(response);
      return { success: false, message: message || "Failed to join event." };
    }

    const successMessage = await parseApiMessage(response);
    return { success: true, message: successMessage || "Successfully joined event." };
  } catch {
    return { success: false, message: "Network error while joining event." };
  }
}

export async function getEventParticipantsAction(eventId: string): Promise<Participant[]> {
  if (!eventId) return [];

  try {
    const response = await authenticatedRequest(
      `${getParticipantsApiUrl()}/participants/${eventId}`,
      {
        method: "GET",
      }
    );

    if (!response || !response.ok) return [];

    return (await parseJsonData<Participant[]>(response)) ?? [];
  } catch {
    return [];
  }
}

export async function updateParticipantStatusAction(
  participantId: string,
  status: ParticipantStatus
): Promise<ParticipantActionState> {
  if (!participantId || !status) {
    return { success: false, message: "Missing participant id or status." };
  }

  try {
    const response = await authenticatedRequest(
      `${getParticipantsApiUrl()}/participants/${participantId}`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      }
    );

    if (!response) return { success: false, message: "Please login first." };

    if (!response.ok) {
      const message = await parseApiMessage(response);
      return { success: false, message: message || "Failed to update participant status." };
    }

    const successMessage = await parseApiMessage(response);
    return { success: true, message: successMessage || "Participant status updated successfully." };
  } catch {
    return { success: false, message: "Network error while updating participant status." };
  }
}
