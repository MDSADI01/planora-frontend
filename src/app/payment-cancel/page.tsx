import Link from "next/link";
import { XCircle, Home, RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-6">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Payment Cancelled</h1>
          <p className="text-lg text-gray-600">
            Your payment was cancelled. You can try again or register for the event later.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 space-y-4">
          <div className="flex items-center justify-center gap-2 text-orange-600">
            <XCircle className="h-5 w-5" />
            <span className="font-medium">Payment Not Completed</span>
          </div>
          <p className="text-sm text-gray-600">
            Your registration was not completed. You can retry the payment or contact support if you continue to experience issues.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Link href="/paymentGateway">
            <Button className="w-full h-12 text-lg">
              <RefreshCw className="mr-2 h-5 w-5" />
              Try Payment Again
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="w-full h-12">
              <Calendar className="mr-2 h-5 w-5" />
              View My Events
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="w-full h-12">
              <Home className="mr-2 h-5 w-5" />
              Return to Home
            </Button>
          </Link>
        </div>

        <p className="text-xs text-gray-500">
          Need help? Contact our support team for assistance.
        </p>
      </div>
    </div>
  );
}
