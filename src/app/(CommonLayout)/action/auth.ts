"use server";

import { env } from "@/src/env";
import { redirect } from "next/navigation";
import {
  clearSessionCookies,
  getAuthCookies,
  setSessionCookies,
} from "@/src/lib/server-auth";

export type AuthActionState = {
  success: boolean;
  message: string;
};

const initialState: AuthActionState = {
  success: false,
  message: "",
};

type AuthApiResponse = {
  message?: string;
  token?: string;
  accessToken?: string;
  access_token?: string;
  jwt?: string;
  refreshToken?: string;
  refresh_token?: string;
  user?: {
    email?: string;
  };
};

const AUTH_API_URL = env.AUTH_API_URL || "https://your-api-url.com/auth";

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const data = (await response.json()) as AuthApiResponse;
    return {
      message: data.message,
      accessToken: data.accessToken ?? data.access_token ?? data.token ?? data.jwt,
      refreshToken: data.refreshToken ?? data.refresh_token,
      userEmail: data.user?.email,
    };
  }

  const text = await response.text();
  return {
    message: text,
    accessToken: "",
    refreshToken: "",
    userEmail: "",
  };
}

async function callAuthApi(endpoint: "login" | "register", payload: Record<string, string>, failMessage: string, redirectUrl: string = "/") {
  try {
    const response = await fetch(`${AUTH_API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        success: false,
        message: data.message || failMessage,
      } satisfies AuthActionState;
    }

    await setSessionCookies({
      email: data.userEmail || payload.email,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    redirect(redirectUrl);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    return {
      success: false,
      message: "Network error. Please try again.",
    } satisfies AuthActionState;
  }
}

export async function submitLogin(_prevState: AuthActionState = initialState, formData: FormData): Promise<AuthActionState> {
  const payload = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const redirectUrl = String(formData.get("redirect") ?? "/");

  return callAuthApi("login", payload, "Login failed. Please try again.", redirectUrl);
}

export async function submitRegister(_prevState: AuthActionState = initialState, formData: FormData): Promise<AuthActionState> {
  const payload = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    image: String(formData.get("image") ?? ""),
  };

  return callAuthApi("register", payload, "Registration failed. Please try again.");
}

export async function logoutAction() {
  const { accessToken, refreshToken } = await getAuthCookies();

  try {
    await fetch(`${AUTH_API_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
  } catch {
    // Continue clearing cookies even if API logout fails.
  }

  await clearSessionCookies();

  redirect("/login");
}
