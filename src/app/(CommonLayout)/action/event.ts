"use server";

import { env } from "@/src/env";
import {
  getAuthCookies,
  tryRefreshAccessToken,
} from "@/src/lib/server-auth";

export type Event = {
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
  eventTheme?: "CONFERENCES" | "MUSIC_FESTIVAL" | "WORKSHOPS" | "WEDDINGS" | "SPORTS_EVENTS" | "MEETUPS" | null;
  organizerId: string;
  organizer: {
    id: string;
    name?: string;
    image?: string;
  };
  participants?: unknown[];
  reviews?: {
    id: string;
    rating: number;
    comment: string;
    user: {
      name?: string;
      image?: string;
    };
  }[];
};

export type EventFilters = {
  eventCategory?: "PRIVATE" | "PUBLIC";
  type?: "IN_PERSON" | "ONLINE";
  searchTerm?: string;
  isFree?: boolean;
};

const getNumericFee = (fee: Event["fee"]) => {
  const numericFee = Number(fee ?? 0);
  return Number.isNaN(numericFee) ? 0 : numericFee;
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
  if (!accessToken) {
    // For public endpoints, we can try without auth first
    return fetch(input, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
  }

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
  console.log(data.data);
  return data.data;
};

export async function getEventsAction(filters?: EventFilters): Promise<Event[]> {
  try {
    const params = new URLSearchParams();
    
    if (filters?.eventCategory) {
      params.append('eventCategory', filters.eventCategory);
    }
    if (filters?.type) {
      params.append('type', filters.type);
    }
    if (filters?.searchTerm) {
      params.append('search', filters.searchTerm);
    }
    const url = params.toString() 
      ? `${getEventsApiUrl()}/events?${params.toString()}`
      : `${getEventsApiUrl()}/events`;

    const response = await authenticatedRequest(url, {
      method: "GET",
    });
    
    if (!response || !response.ok) return [];

    const events = (await parseJsonData<Event[]>(response)) ?? [];

    if (filters?.isFree === undefined) {
      return events;
    }

    return events.filter((event) => {
      const isFreeEvent = getNumericFee(event.fee) === 0;
      return filters.isFree ? isFreeEvent : !isFreeEvent;
    });
  } catch {
    return [];
  }
}

export async function getEventByIdAction(id: string): Promise<Event | null> {
  if (!id) return null;

  try {
    const response = await authenticatedRequest(`${getEventsApiUrl()}/events/${id}`, {
      method: "GET",
    });
    console.log(response);

    if (!response || !response.ok) return null

    // const data = await parseJsonData<Event>(response);
    // console.log(data);

    return (await parseJsonData<Event>(response)) ?? null;
  } catch {
    return null;
  }
}

export async function getTrendingEventsAction(): Promise<Event[]> {
  try {
    const response = await authenticatedRequest(`${getEventsApiUrl()}/events/trending`, {
      method: "GET",
    });

    if (!response || !response.ok) return [];

    return (await parseJsonData<Event[]>(response)) ?? [];
  } catch {
    return [];
  }
}

export async function getSearchSuggestionsAction(searchTerm: string): Promise<Event[]> {
  if (!searchTerm || searchTerm.length < 2) return [];
  try {
    const params = new URLSearchParams({ q: searchTerm });
    const response = await authenticatedRequest(`${getEventsApiUrl()}/events/search-suggestions?${params.toString()}`, {
      method: "GET",
    });

    if (!response || !response.ok) return [];

    return (await parseJsonData<Event[]>(response)) ?? [];
  } catch {
    return [];
  }
}
