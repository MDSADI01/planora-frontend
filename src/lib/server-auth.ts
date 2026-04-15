import { env } from "@/src/env";
import { cookies } from "next/headers";

type JwtPayload = Record<string, unknown>;
const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const decodeJwtPayload = <T extends JwtPayload>(token?: string): T | null => {
  if (!token) return null;

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    return JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf-8")) as T;
  } catch {
    return null;
  }
};

export const getAuthCookies = async () => {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get("accessToken")?.value,
    refreshToken: cookieStore.get("refreshToken")?.value,
    authUser: cookieStore.get("auth_user")?.value,
  };
};

export const setSessionCookies = async (options: {
  email?: string;
  accessToken?: string;
  refreshToken?: string;
}) => {
  const cookieStore = await cookies();

  if (options.email) {
    cookieStore.set("auth_user", options.email, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }

  if (options.accessToken) {
    cookieStore.set("accessToken", options.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });
  }

  if (options.refreshToken) {
    cookieStore.set("refreshToken", options.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }
};

export const clearSessionCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("auth_user");
};

const getAuthApiUrl = () => env.AUTH_API_URL;

export const tryRefreshAccessToken = async () => {
  const { refreshToken } = await getAuthCookies();
  if (!refreshToken) return null;

  const response = await fetch(`${getAuthApiUrl()}/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    accessToken?: string;
    access_token?: string;
    token?: string;
    jwt?: string;
    refreshToken?: string;
    refresh_token?: string;
  };

  const accessToken = data.accessToken ?? data.access_token ?? data.token ?? data.jwt;
  const rotatedRefreshToken = data.refreshToken ?? data.refresh_token;

  if (!accessToken) return null;

  await setSessionCookies({
    accessToken,
    refreshToken: rotatedRefreshToken,
  });

  return accessToken;
};

export const parseApiMessage = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return ((await response.json()) as { message?: string }).message ?? "";
  }
  return await response.text();
};

