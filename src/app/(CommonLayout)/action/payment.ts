"use server";

import { env } from "@/src/env";
import {
  getAuthCookies,
  parseApiMessage,
  tryRefreshAccessToken,
} from "@/src/lib/server-auth";

export type PaymentActionState = {
  success: boolean;
  message: string;
  data?: {
    paymentUrl: string;
  };
};

const getPaymentApiUrl = () => {
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

export async function initiateEventPaymentAction(
  eventId: string
): Promise<PaymentActionState> {
  if (!eventId) {
    return { success: false, message: "Missing event ID." };
  }

  try {
    const response = await authenticatedRequest(
      `${getPaymentApiUrl()}/payments/initiate`,
      {
        method: "POST",
        body: JSON.stringify({ eventId }),
      }
    );

    if (!response) return { success: false, message: "Please login first." };

    if (!response.ok) {
      const message = await parseApiMessage(response);
      return { success: false, message: message || "Failed to initiate payment." };
    }

    const data = (await response.json()) as {
      success: boolean;
      data: {
        paymentUrl: string;
      };
    };

    return {
      success: true,
      message: "Payment session created successfully.",
      data: data.data,
    };
  } catch (error) {
    console.error("Payment initiation error:", error);
    return { success: false, message: "Network error while initiating payment." };
  }
}
