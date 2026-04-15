"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react"; // ✅ removed FormEvent
import { z } from "zod";

import { submitRegister } from "@/src/app/(CommonLayout)/action/auth";
import { Button } from "@/src/components/ui/button";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  image: z.string().url("Enter a valid image URL"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const initialState = {
  success: false,
  message: "",
};

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(submitRegister, initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // ❌ REMOVE handleSubmit COMPLETELY
  // --------------------------------
  // const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   ...
  // }

  // ✅ NEW: validate on submit WITHOUT blocking server action
  const validateFields = (formData: FormData) => {
    const values: RegisterFormData = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      image: String(formData.get("image") ?? ""),
    };

    const result = registerSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        image: fieldErrors.image?.[0],
      });
      return false;
    }

    setErrors({});
    return true;
  };

  useEffect(() => {
    if (!state.success) return;
    formRef.current?.reset();

  }, [state.success]);

  return (
    <div className="w-full max-w-md rounded-lg border p-6 shadow-sm">
      <h2 className="mb-5 text-2xl font-semibold">Register Now</h2>

      {state.message ? (
        <p
          role="status"
          className={`mb-4 rounded-md border px-3 py-2 text-sm ${
            state.success
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      {/* ✅ CHANGED HERE */}
      <form
        ref={formRef}
        action={async (formData) => {
          const isValid = validateFields(formData); // ✅ validate first
          if (!isValid) return; // ❌ stop if invalid
          await formAction(formData); // ✅ then call server action
        }}
        className="space-y-4"
        noValidate
      >
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            placeholder="Enter your name"
            disabled={isPending}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

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
            disabled={isPending}
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
            placeholder="Enter your password"
            disabled={isPending}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="image" className="text-sm font-medium">
            Image Link
          </label>
          <input
            id="image"
            name="image"
            type="url"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            placeholder="https://example.com/image.jpg"
            disabled={isPending}
          />
          {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating account..." : "Register Now"}
        </Button>
      </form>

      <p className="mt-5 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export { RegisterForm, registerSchema };