"use client";

import { FormEvent, useActionState, useEffect, useRef, useState } from "react";
import { useTransition } from "react";
import { z } from "zod";

import { createEventAction } from "@/src/app/(DashboardLayout)/(UserLayout)/action/event";
import { Button } from "@/src/components/ui/button";
import { AutofillInput } from "@/src/components/ui/autofill-input";

const initialState = {
  success: false,
  message: "",
};

const addEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().optional(),
  image: z.url("Please provide a valid image URL"),
  type: z.enum(["IN_PERSON", "ONLINE"], {
    error: "Please select a valid event type",
  }),
  fee: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value || value.trim() === "" || (!Number.isNaN(Number(value)) && Number(value) >= 0),
      "Fee cannot be negative"
    ),
  eventCategory: z.enum(["PRIVATE", "PUBLIC"]).optional(),
  eventTheme: z.enum(["CONFERENCES", "MUSIC_FESTIVAL", "WORKSHOPS", "WEDDINGS", "SPORTS_EVENTS", "MEETUPS"]).optional(),
});

type AddEventFormData = z.infer<typeof addEventSchema>;

type AddEventFormProps = {
  organizerId: string;
};

const AddEventForm = ({ organizerId }: AddEventFormProps) => {
  const [state, formAction, isPending] = useActionState(
    createEventAction,
    initialState
  );
  const [isTransitioning, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof AddEventFormData, string>>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values: AddEventFormData = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      date: String(formData.get("date") ?? ""),
      time: String(formData.get("time") ?? ""),
      venue: String(formData.get("venue") ?? ""),
      image: String(formData.get("image") ?? ""),
      type: String(formData.get("type") ?? "IN_PERSON") as "IN_PERSON" | "ONLINE",
      fee: String(formData.get("fee") ?? ""),
      eventCategory: String(formData.get("eventCategory") ?? "PUBLIC") as
        | "PRIVATE"
        | "PUBLIC",
      eventTheme: String(formData.get("eventTheme") ?? "MEETUPS") as
        | "CONFERENCES"
        | "MUSIC_FESTIVAL"
        | "WORKSHOPS"
        | "WEDDINGS"
        | "SPORTS_EVENTS"
        | "MEETUPS",
    };

    const result = addEventSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0],
        description: fieldErrors.description?.[0],
        date: fieldErrors.date?.[0],
        time: fieldErrors.time?.[0],
        image: fieldErrors.image?.[0],
        type: fieldErrors.type?.[0],
        fee: fieldErrors.fee?.[0],
        eventCategory: fieldErrors.eventCategory?.[0],
        eventTheme: fieldErrors.eventTheme?.[0],
      });
      return;
    }

    setErrors({});
    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (!state.success) return;
    formRef.current?.reset();
    
  }, [state.success]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 rounded-xl border p-6">
      {state.message ? (
        <p
          className={`rounded-md border px-3 py-2 text-sm ${
            state.success
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1 md:col-span-2">
          <AutofillInput
            formId="create-event"
            fieldName="title"
            label="Title *"
            id="title"
            name="title"
            required
            placeholder="Event title"
            showCommonSuggestions={false}
          />
          {errors.title ? <p className="text-sm text-red-500">{errors.title}</p> : null}
        </div>

        <div className="space-y-1 md:col-span-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Write event details..."
          />
          {errors.description ? (
            <p className="text-sm text-red-500">{errors.description}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="date" className="text-sm font-medium">
            Date *
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
          {errors.date ? <p className="text-sm text-red-500">{errors.date}</p> : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="time" className="text-sm font-medium">
            Time *
          </label>
          <input
            id="time"
            name="time"
            type="time"
            required
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
          {errors.time ? <p className="text-sm text-red-500">{errors.time}</p> : null}
        </div>

        <div className="space-y-1">
          <AutofillInput
            formId="create-event"
            fieldName="venue"
            label="Venue"
            id="venue"
            name="venue"
            commonType="venue"
            showCommonSuggestions={true}
            placeholder="Venue (optional)"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="image" className="text-sm font-medium">
            Image URL *
          </label>
          <input
            id="image"
            name="image"
            type="url"
            required
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            placeholder="https://example.com/event.jpg"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="type" className="text-sm font-medium">
            Event Type *
          </label>
          <select
            id="type"
            name="type"
            required
            defaultValue="IN_PERSON"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="IN_PERSON">IN_PERSON</option>
            <option value="ONLINE">ONLINE</option>
          </select>
          {errors.type ? <p className="text-sm text-red-500">{errors.type}</p> : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="eventCategory" className="text-sm font-medium">
            Event Category
          </label>
          <select
            id="eventCategory"
            name="eventCategory"
            defaultValue="PUBLIC"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="PUBLIC">PUBLIC</option>
            <option value="PRIVATE">PRIVATE</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="eventTheme" className="text-sm font-medium">
            Event Theme
          </label>
          <select
            id="eventTheme"
            name="eventTheme"
            defaultValue="MEETUPS"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="CONFERENCES">CONFERENCES</option>
            <option value="MUSIC_FESTIVAL">MUSIC_FESTIVAL</option>
            <option value="WORKSHOPS">WORKSHOPS</option>
            <option value="WEDDINGS">WEDDINGS</option>
            <option value="SPORTS_EVENTS">SPORTS_EVENTS</option>
            <option value="MEETUPS">MEETUPS</option>
          </select>
          {errors.eventTheme ? <p className="text-sm text-red-500">{errors.eventTheme}</p> : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="fee" className="text-sm font-medium">
            Fee
          </label>
          <input
            id="fee"
            name="fee"
            type="number"
            min={0}
            step="0.01"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            placeholder="0"
          />
          {errors.fee ? <p className="text-sm text-red-500">{errors.fee}</p> : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="organizerId" className="text-sm font-medium">
            Organizer ID
          </label>
          <input
            id="organizerId"
            name="organizerId"
            type="text"
            readOnly
            value={organizerId}
            className="h-10 w-full rounded-md border bg-muted px-3 text-sm"
          />
        </div>
      </div>

      <Button type="submit" disabled={isPending || isTransitioning}>
        {isPending || isTransitioning ? "Creating Event..." : "Create Event"}
      </Button>
    </form>
  );
};

export default AddEventForm;
