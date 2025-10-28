"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CreditCard,
  Smartphone,
  Wallet,
  Building2,
  X,
  CheckCircle,
  Shield,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface PaymentModalProps {
  appointmentId: string;
  amount: number;
  hospitalName: string;
  doctorName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({
  appointmentId,
  amount,
  hospitalName,
  doctorName,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "wallet" | "netbanking">(
    "card"
  );
  const [saveCard, setSaveCard] = useState(false);
  const supabase = createClient();

  const handlePayment = async () => {
    setLoading(true);
    try {
      // In a real app, you would integrate with Razorpay/Stripe here
      // Example Razorpay integration:
      /*
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "MediQueue",
        description: `Consultation Fee - ${doctorName}`,
        handler: async function (response: any) {
          // Verify payment on backend
          await verifyPayment(response);
        },
        prefill: {
          name: patient.name,
          email: patient.email,
          contact: patient.phone,
        },
        theme: {
          color: "#3b82f6",
        },
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      */

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create payment record
      const { error: paymentError } = await supabase.from("payments").insert({
        appointment_id: appointmentId,
        amount: amount,
        currency: "INR",
        payment_method: paymentMethod,
        status: "completed",
        transaction_id: `TXN${Date.now()}`,
        paid_at: new Date().toISOString(),
      });

      if (paymentError) throw paymentError;

      // Update appointment status
      const { error: appointmentError } = await supabase
        .from("appointments")
        .update({
          payment_status: "paid",
        })
        .eq("id", appointmentId);

      if (appointmentError) throw appointmentError;

      toast.success("Payment successful!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, RuPay",
    },
    {
      id: "upi",
      name: "UPI",
      icon: Smartphone,
      description: "Google Pay, PhonePe, Paytm",
    },
    {
      id: "wallet",
      name: "Wallet",
      icon: Wallet,
      description: "Paytm, PhonePe, Amazon Pay",
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: Building2,
      description: "All major banks",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Complete Payment</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Secure payment powered by Razorpay
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payment Summary */}
          <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hospital</span>
                <span className="font-medium text-gray-900">{hospitalName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Doctor</span>
                <span className="font-medium text-gray-900">{doctorName}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Select Payment Method</Label>
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 transition-all ${
                    paymentMethod === method.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                  }`}
                  disabled={loading}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      paymentMethod === method.id ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <div className="flex-1 text-left">
                    <p className="font-medium">{method.name}</p>
                    <p className="text-xs text-gray-600">{method.description}</p>
                  </div>
                  {paymentMethod === method.id && (
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Save Card Option (for card payments) */}
          {paymentMethod === "card" && (
            <label className="flex items-center gap-2 rounded-lg border p-3">
              <Checkbox checked={saveCard} onCheckedChange={(checked) => setSaveCard(checked as boolean)} />
              <span className="text-sm">Save card for future payments</span>
            </label>
          )}

          {/* Security Notice */}
          <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
            <Shield className="h-4 w-4 mt-0.5 text-gray-400" />
            <p>
              Your payment information is encrypted and secure. We do not store your card details.
            </p>
          </div>

          {/* Payment Button */}
          <Button onClick={handlePayment} disabled={loading} className="w-full" size="lg">
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay {formatCurrency(amount)}
              </>
            )}
          </Button>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500">
            By proceeding, you agree to our{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}

