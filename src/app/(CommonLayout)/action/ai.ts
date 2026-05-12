"use server";

import { env } from "@/src/env";

type AiChatResponse = {
  success?: boolean;
  data?: string;
  message?: string;
  response?: string;
};

const readAiResponse = async (response: Response) => {
  try {
    return (await response.json()) as AiChatResponse;
  } catch {
    return null;
  }
};

const getApiBaseUrl = () => {
  return (
    env.NEXT_PUBLIC_API_BASE_URL ||
    (env.AUTH_API_URL || "http://localhost:8000/api").replace(/\/auth\/?$/, "")
  );
};

export async function sendAiChatMessageAction(message: string) {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return "Ask me about events, free tickets, categories, venues, or recommendations.";
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: trimmedMessage }),
      cache: "no-store",
    });

    const result = await readAiResponse(response);

    if (!response.ok) {
      return result?.message
        ? `Backend AI error: ${result.message}`
        : "I could not reach the AI assistant right now. Please try again in a moment.";
    }

    return (
      result?.data ||
      result?.response ||
      result?.message ||
      "I could not find a helpful answer for that yet."
    );
  } catch {
    return "The AI assistant is unavailable right now. Please make sure the backend is running on port 8000.";
  }
}
