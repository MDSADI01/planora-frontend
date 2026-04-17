"use server";

import { env } from "@/src/env";
import {
  getAuthCookies,
  parseApiMessage,
  tryRefreshAccessToken,
} from "@/src/lib/server-auth";

export type Review = {
  id: string;
  userId: string;
  eventId: string;
  rating: number;
  reviewText?: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    name?: string;
    image?: string;
  };
  event?: {
    id: string;
    title: string;
    image: string;
    date: string;
  };
};

export type ReviewActionState = {
  success: boolean;
  message: string;
};

const getReviewsApiUrl = () => {
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

export async function addReviewAction(
  eventId: string,
  rating: number,
  reviewText?: string
): Promise<ReviewActionState> {
  if (!eventId || !rating) {
    return { success: false, message: "Missing event id or rating." };
  }

  if (rating < 1 || rating > 5) {
    return { success: false, message: "Rating must be between 1 and 5." };
  }

  try {
    const response = await authenticatedRequest(
      `${getReviewsApiUrl()}/reviews/${eventId}`,
      {
        method: "POST",
        body: JSON.stringify({ rating, reviewText }),
      }
    );

    if (!response) return { success: false, message: "Please login first." };

    if (!response.ok) {
      const message = await parseApiMessage(response);
      return { success: false, message: message || "Failed to add review." };
    }

    const successMessage = await parseApiMessage(response);
    return { success: true, message: successMessage || "Review added successfully." };
  } catch {
    return { success: false, message: "Network error while adding review." };
  }
}

export async function getEventReviewsAction(eventId: string): Promise<Review[]> {
  if (!eventId) return [];

  try {
    const response = await authenticatedRequest(
      `${getReviewsApiUrl()}/reviews/${eventId}`,
      {
        method: "GET",
      }
    );

    if (!response || !response.ok) return [];

    return (await parseJsonData<Review[]>(response)) ?? [];
  } catch {
    return [];
  }
}

export async function getMyReviewsAction(): Promise<Review[]> {
  try {
    const response = await authenticatedRequest(
      `${getReviewsApiUrl()}/reviews/myReviews`,
      {
        method: "GET",
      }
    );

    if (!response || !response.ok) return [];

    return (await parseJsonData<Review[]>(response)) ?? [];
  } catch {
    return [];
  }
}

export async function updateReviewAction(
  reviewId: string,
  rating?: number,
  reviewText?: string
): Promise<ReviewActionState> {
  if (!reviewId) {
    return { success: false, message: "Missing review id." };
  }

  if (rating !== undefined && (rating < 1 || rating > 5)) {
    return { success: false, message: "Rating must be between 1 and 5." };
  }

  try {
    const response = await authenticatedRequest(
      `${getReviewsApiUrl()}/reviews/${reviewId}`,
      {
        method: "PUT",
        body: JSON.stringify({ rating, reviewText }),
      }
    );

    if (!response) return { success: false, message: "Please login first." };

    if (!response.ok) {
      const message = await parseApiMessage(response);
      return { success: false, message: message || "Failed to update review." };
    }

    const successMessage = await parseApiMessage(response);
    return { success: true, message: successMessage || "Review updated successfully." };
  } catch {
    return { success: false, message: "Network error while updating review." };
  }
}

export async function deleteReviewAction(reviewId: string): Promise<ReviewActionState> {
  if (!reviewId) {
    return { success: false, message: "Missing review id." };
  }

  try {
    const response = await authenticatedRequest(
      `${getReviewsApiUrl()}/reviews/${reviewId}`,
      {
        method: "DELETE",
      }
    );

    if (!response) return { success: false, message: "Please login first." };

    if (!response.ok) {
      const message = await parseApiMessage(response);
      return { success: false, message: message || "Failed to delete review." };
    }

    const successMessage = await parseApiMessage(response);
    return { success: true, message: successMessage || "Review deleted successfully." };
  } catch {
    return { success: false, message: "Network error while deleting review." };
  }
}
