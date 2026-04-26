import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_API_URL: z.string().url().optional(),
  },

  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
  },

  runtimeEnv: {
    AUTH_API_URL: process.env.AUTH_API_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  emptyStringAsUndefined: true,
});