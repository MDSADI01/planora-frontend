import Link from "next/link";
import { CheckCircle, Home, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-6 animate-bounce">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your payment. Your registration is now complete.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 space-y-4">
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Registration Confirmed</span>
          </div>
          <p className="text-sm text-gray-600">
            You will receive a confirmation email with your event details shortly.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Link href="/profile">
            <Button className="w-full h-12 text-lg">
              <Calendar className="mr-2 h-5 w-5" />
              View My Events
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full h-12">
              <Home className="mr-2 h-5 w-5" />
              Return to Home
            </Button>
          </Link>
        </div>

        <p className="text-xs text-gray-500">
          If you have any questions, please contact our support team.
        </p>
      </div>
    </div>
  );
}
