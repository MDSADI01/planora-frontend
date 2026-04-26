"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CreditCard, Loader2, Calendar, MapPin, Clock, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initiateEventPaymentAction } from "@/src/app/(CommonLayout)/action/payment";
import { getEventByIdAction, type Event } from "@/src/app/(CommonLayout)/action/event";
import { getLoggedInUser, type LoggedInUser } from "@/src/app/(DashboardLayout)/(UserLayout)/action/event";

const PaymentGatewayContent = () => {
  const searchParams = useSearchParams();
  const [eventId, setEventId] = useState("");
  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const eventIdParam = searchParams.get("eventId");
      if (eventIdParam) {
        setEventId(eventIdParam);

        // Fetch event details
        try {
          const eventData = await getEventByIdAction(eventIdParam);
          setEvent(eventData);
        } catch (error) {
          console.error("Failed to fetch event:", error);
        }

        // Fetch user details
        try {
          const userData = await getLoggedInUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
      setIsFetching(false);
    };

    fetchData();
  }, [searchParams]);

  const handlePayment = async () => {
    if (!eventId) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await initiateEventPaymentAction(eventId);

      setMessage({ ok: result.success, text: result.message });

      if (result.success && result.data?.paymentUrl) {
        // Redirect to Stripe checkout
        window.location.href = result.data.paymentUrl;
      }
    } catch (error) {
      setMessage({ ok: false, text: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-4 mb-4">
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Secure payment powered by Stripe</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Event Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Event Details
            </h2>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Date</p>
                    <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Time</p>
                    <p className="text-sm text-gray-600">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Venue</p>
                    <p className="text-sm text-gray-600">{event.venue}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User & Payment Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Account Details
            </h2>

            {user && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Amount to Pay</span>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-3xl font-bold text-gray-900">
                    {event.fee?.toFixed(2)}
                  </span>
                </div>
              </div>

              {message && (
                <div
                  className={`mb-4 rounded-md border px-4 py-3 text-sm ${
                    message.ok
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Button
                onClick={handlePayment}
                className="w-full h-12 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pay Now
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentGateway = () => {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <PaymentGatewayContent />
    </Suspense>
  );
};

export default PaymentGateway;