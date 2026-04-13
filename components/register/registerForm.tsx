"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  image: z.url("Enter a valid image URL"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values: RegisterFormData = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      image: String(formData.get("image") ?? ""),
    };
    console.log(values);
    const result = registerSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0] ?? "",
        email: fieldErrors.email?.[0] ?? "",
        password: fieldErrors.password?.[0] ?? "",
        image: fieldErrors.image?.[0] ?? "",
      });
      return;
    }

    setErrors({});
    console.log("Register form is valid", result.data);
  };

  return (
    <div className="w-full max-w-md rounded-lg border p-6 shadow-sm">
      <h2 className="mb-5 text-2xl font-semibold">Register Now</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          />
          {errors.name ? <p className="text-sm text-red-500">{errors.name}</p> : null}
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
          />
          {errors.image ? <p className="text-sm text-red-500">{errors.image}</p> : null}
        </div>

        <Button type="submit" className="w-full">
          Register Now
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
