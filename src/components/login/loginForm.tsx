"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { z } from "zod";

import { submitLogin } from "@/src/app/(CommonLayout)/action/auth";
import { Button } from "@/src/components/ui/button";
import { AutofillInput } from "@/src/components/ui/autofill-input";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const initialState = {
  success: false,
  message: "",
};

const LoginForm = ({ redirectUrl }: { redirectUrl?: string }) => {
  const [state, formAction, isPending] = useActionState(submitLogin, initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormAction = async (formData: FormData) => {
    const values: LoginFormData = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const result = loginSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});

    if (redirectUrl) {
      formData.append("redirect", redirectUrl);
    }

    startTransition(() => formAction(formData));
  };

  useEffect(() => {
    if (!state.success) return;
    formRef.current?.reset();
  }, [state.success]);

  // 🔑 Demo login — builds FormData directly and fires the server action
  const handleDemoLogin = (role: "admin" | "user") => {
    const credentials = {
      admin: { email: "admin@planora.com", password: "admin123" },
      user: { email: "user1@gmail.com", password: "user1@1234" },
    };

    const { email, password } = credentials[role];

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);

    if (redirectUrl) {
      formData.append("redirect", redirectUrl);
    }

    setErrors({});
    startTransition(() => formAction(formData));
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-border/50 bg-background p-8 shadow-xl shadow-black/5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your Planora account
        </p>
      </div>

      {state.message && (
        <p
          className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-800/40 dark:bg-red-950/40 dark:text-red-300"
          }`}
        >
          {state.message}
        </p>
      )}

      {/* 🔑 Demo Credentials */}
      <div className="mb-6 rounded-xl border border-indigo-200/60 bg-indigo-50/60 p-4 dark:border-indigo-800/40 dark:bg-indigo-950/30">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <span>🔑</span> Demo Credentials
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleDemoLogin("admin")}
            disabled={isPending}
            className="group flex flex-col items-start gap-0.5 rounded-xl border border-indigo-300/60 bg-white px-4 py-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-500 hover:shadow-md disabled:pointer-events-none disabled:opacity-60 dark:border-indigo-700/50 dark:bg-indigo-950/50 dark:hover:border-indigo-400"
          >
            <span className="flex items-center gap-1.5 text-sm font-semibold text-indigo-700 dark:text-indigo-300 group-hover:text-indigo-800 dark:group-hover:text-indigo-200">
              <span>🛡️</span> Login as Admin
            </span>
            <span className="text-xs text-muted-foreground">admin@planora.com</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin("user")}
            disabled={isPending}
            className="group flex flex-col items-start gap-0.5 rounded-xl border border-violet-300/60 bg-white px-4 py-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-500 hover:shadow-md disabled:pointer-events-none disabled:opacity-60 dark:border-violet-700/50 dark:bg-violet-950/50 dark:hover:border-violet-400"
          >
            <span className="flex items-center gap-1.5 text-sm font-semibold text-violet-700 dark:text-violet-300 group-hover:text-violet-800 dark:group-hover:text-violet-200">
              <span>👤</span> Login as User
            </span>
            <span className="text-xs text-muted-foreground">user1@gmail.com</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground">
            or sign in manually
          </span>
        </div>
      </div>

      <form ref={formRef} action={handleFormAction} className="space-y-4" noValidate>
        <div className="space-y-1">
          <AutofillInput
            formId="login"
            fieldName="email"
            label="Email"
            id="email"
            name="email"
            type="email"
            disabled={isPending}
            placeholder="Enter your email"
            showCommonSuggestions={false}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
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
            disabled={isPending}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <Button type="submit" className="w-full rounded-xl" disabled={isPending}>
          {isPending ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export { LoginForm, loginSchema };