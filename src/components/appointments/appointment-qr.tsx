"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, QrCode } from "lucide-react";
import { toast } from "sonner";

interface AppointmentQRProps {
  appointmentId: string;
  tokenNumber: string;
  patientName: string;
  hospitalName: string;
  appointmentDate: string;
  appointmentTime: string;
}

export function AppointmentQR({
  appointmentId,
  tokenNumber,
  patientName,
  hospitalName,
  appointmentDate,
  appointmentTime,
}: AppointmentQRProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);

  useEffect(() => {
    generateQR();
  }, [appointmentId]);

  const generateQR = async () => {
    if (!canvasRef.current) return;

    try {
      // Create QR data
      const qrData = JSON.stringify({
        appointmentId,
        tokenNumber,
        patientName,
        hospitalName,
        appointmentDate,
        appointmentTime,
        type: "MEDIQUEUE_CHECKIN",
        timestamp: new Date().toISOString(),
      });

      await QRCode.toCanvas(canvasRef.current, qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      setQrGenerated(true);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    try {
      const url = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `mediqueue-${tokenNumber}.png`;
      link.href = url;
      link.click();
      toast.success("QR code downloaded");
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Failed to download QR code");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Check-in QR Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6">
            <canvas ref={canvasRef} />
          </div>

          {qrGenerated && (
            <>
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <p className="text-sm font-medium text-blue-900">Token Number</p>
                <p className="text-3xl font-bold text-blue-600">{tokenNumber}</p>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>How to use:</strong>
                </p>
                <ol className="ml-4 list-decimal space-y-1">
                  <li>Show this QR code at the hospital reception</li>
                  <li>Scan at the check-in kiosk</li>
                  <li>Your check-in will be automatically registered</li>
                </ol>
              </div>

              <Button onClick={handleDownload} className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download QR Code
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

