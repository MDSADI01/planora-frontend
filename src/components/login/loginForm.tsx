"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
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

  // ✅ VALIDATION BEFORE SERVER ACTION
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

      return; // ❌ STOP HERE
    }

    setErrors({});

    // Add redirect URL to form data
    if (redirectUrl) {
      formData.append("redirect", redirectUrl);
    }

    // ✅ IMPORTANT: call server action properly
    formAction(formData);
  };

  useEffect(() => {
    if (!state.success) return;

    formRef.current?.reset();
   
  }, [state.success]);

  return (
    <div className="w-full max-w-md rounded-lg border p-6 shadow-sm">
      <h2 className="mb-5 text-2xl font-semibold">Login</h2>

      {state.message && (
        <p
          className={`mb-4 rounded-md border px-3 py-2 text-sm ${
            state.success
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {state.message}
        </p>
      )}

      {/* 🔥 FIX: REMOVE onSubmit */}
      <form
        ref={formRef}
        action={handleFormAction}   // ✅ THIS FIXES THE ERROR
        className="space-y-4"
        noValidate
      >
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
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing in..." : "Login"}
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