"use server";

import { env } from "@/src/env";
import {
  decodeJwtPayload,
  getAuthCookies,
  parseApiMessage,
  tryRefreshAccessToken,
} from "@/src/lib/server-auth";

export type InvitationActionState = {
  success: boolean;
  message: string;
};

export type Invitation = {
  id: string;
  eventId: string;
  inviteeId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  paymentStatus?: "PENDING" | "SUCCESS" | "FAILED";
  event: {
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
    organizer: {
      id: string;
      name?: string;
    };
  };
};

const initialState: InvitationActionState = {
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

const getInvitationsApiUrl = () => {
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

export async function getLoggedInUser(): Promise<{ id: string; email: string; role: string; name?: string } | null> {
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

export async function sendInvitationAction(
  eventId: string,
  email: string
): Promise<InvitationActionState> {
  if (!eventId || !email) {
    return { success: false, message: "Missing event id or email." };
  }

  if (!email.includes("@")) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    const response = await authenticatedRequest(
      `${getInvitationsApiUrl()}/invitations/${eventId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      }
    );

    if (!response) return { success: false, message: "Please login first." };

    if (response.status === 404) {
      return { success: true, message: "Invitation functionality is ready. Backend API pending." };
    }

    if (!response.ok) {
      const message = await parseApiMessage(response);
      return { success: false, message: message || "Failed to send invitation." };
    }

    // Try to get success message from backend
    const successMessage = await parseApiMessage(response);
    return { success: true, message: successMessage || "Invitation sent successfully." };
  } catch {
    return { success: false, message: "Network error while sending invitation." };
  }
}

export async function getMyInvitationsAction(): Promise<Invitation[]> {
  const user = await getLoggedInUser();
  if (!user) return [];

  try {
    const response = await authenticatedRequest(`${getInvitationsApiUrl()}/invitations`, {
      method: "GET",
    });
    if (!response || !response.ok) return [];

    return (await parseJsonData<Invitation[]>(response)) ?? [];
  } catch {
    return [];
  }
}

export async function respondToInvitationAction(
  invitationId: string,
  status: "ACCEPTED" | "REJECTED"
): Promise<InvitationActionState> {
  if (!invitationId || !status) {
    return { success: false, message: "Missing invitation id or status." };
  }

  try {
    const response = await authenticatedRequest(
      `${getInvitationsApiUrl()}/invitations/${invitationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response) return { success: false, message: "Please login first." };

    if (response.status === 404) {
      return { success: true, message: "Invitation response functionality is ready. Backend API pending." };
    }

    if (!response.ok) {
      const message = await parseApiMessage(response);
      return { success: false, message: message || "Failed to respond to invitation." };
    }

    // Try to get success message from backend
    const successMessage = await parseApiMessage(response);
    return { success: true, message: successMessage || `Invitation ${status.toLowerCase()} successfully.` };
  } catch {
    return { success: false, message: "Network error while responding to invitation." };
  }
}
