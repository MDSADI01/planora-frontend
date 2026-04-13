"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const values: LoginFormData = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const result = loginSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0] ?? "",
        password: fieldErrors.password?.[0] ?? "",
      });
      return;
    }

    setErrors({});
    console.log("Login form is valid", result.data);
  };

  return (
    <div className="w-full max-w-md rounded-lg border p-6 shadow-sm">
      <h2 className="mb-5 text-2xl font-semibold">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            placeholder="Enter your email"
          />
          {errors.email ? <p className="text-sm text-red-500">{errors.email}</p> : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            placeholder="Enter your password"
          />
          {errors.password ? (
            <p className="text-sm text-red-500">{errors.password}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>

      <p className="mt-5 text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export { LoginForm, loginSchema };
