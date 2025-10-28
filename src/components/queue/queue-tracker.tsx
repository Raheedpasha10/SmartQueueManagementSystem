"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Clock,
  TrendingDown,
  Activity,
  AlertCircle,
  CheckCircle2,
  Timer,
} from "lucide-react";
import { toast } from "sonner";

interface QueueInfo {
  appointmentId: string;
  tokenNumber: string;
  status: string;
  queuePosition: number;
  totalInQueue: number;
  estimatedWaitTime: number;
  doctorName: string;
  departmentName: string;
  scheduledTime: string;
}

interface QueueTrackerProps {
  appointmentId: string;
}

export function QueueTracker({ appointmentId }: QueueTrackerProps) {
  const [queueInfo, setQueueInfo] = useState<QueueInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const supabase = createClient();

  useEffect(() => {
    fetchQueueInfo();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`queue-${appointmentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `id=eq.${appointmentId}`,
        },
        (payload) => {
          console.log("Queue update received:", payload);
          fetchQueueInfo();
          setLastUpdate(new Date());
          toast.info("Your queue position has been updated");
        }
      )
      .subscribe();

    // Also subscribe to other appointments that might affect queue position
    const queueChannel = supabase
      .channel("queue-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
        },
        () => {
          fetchQueueInfo();
          setLastUpdate(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(queueChannel);
    };
  }, [appointmentId]);

  const fetchQueueInfo = async () => {
    try {
      // Fetch current appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from("appointments")
        .select(`
          id,
          token_number,
          status,
          appointment_date,
          appointment_time,
          doctor:doctors (
            id,
            full_name,
            department:departments (
              name
            )
          )
        `)
        .eq("id", appointmentId)
        .single();

      if (appointmentError) throw appointmentError;

      if (!appointment) {
        setLoading(false);
        return;
      }

      // Calculate queue position
      const { data: queueData, error: queueError } = await supabase
        .from("appointments")
        .select("id, status, created_at")
        .eq("doctor_id", (appointment.doctor as any).id)
        .eq("appointment_date", appointment.appointment_date)
        .in("status", ["confirmed", "checked_in", "in_consultation"])
        .order("created_at", { ascending: true });

      if (queueError) throw queueError;

      const currentIndex = queueData.findIndex((a) => a.id === appointmentId);
      const queuePosition = currentIndex >= 0 ? currentIndex + 1 : 0;
      const totalInQueue = queueData.length;

      // Calculate estimated wait time (10 minutes per patient ahead)
      const estimatedWaitTime = currentIndex > 0 ? currentIndex * 10 : 0;

      setQueueInfo({
        appointmentId,
        tokenNumber: appointment.token_number,
        status: appointment.status,
        queuePosition,
        totalInQueue,
        estimatedWaitTime,
        doctorName: (appointment.doctor as any).full_name,
        departmentName: (appointment.doctor as any).department.name,
        scheduledTime: appointment.appointment_time,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching queue info:", error);
      toast.error("Failed to fetch queue information");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </CardContent>
      </Card>
    );
  }

  if (!queueInfo) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">Queue information not available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-500";
      case "checked_in":
        return "bg-yellow-500";
      case "in_consultation":
        return "bg-green-500";
      case "completed":
        return "bg-gray-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="secondary">Confirmed</Badge>;
      case "checked_in":
        return <Badge className="bg-yellow-500">Checked In</Badge>;
      case "in_consultation":
        return <Badge className="bg-green-500">In Consultation</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const progressPercentage = queueInfo.totalInQueue > 0
    ? ((queueInfo.totalInQueue - queueInfo.queuePosition + 1) / queueInfo.totalInQueue) * 100
    : 0;

  return (
    <div className="space-y-4">
      {/* Main Queue Card */}
      <Card className="overflow-hidden border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Your Queue Status</CardTitle>
              <CardDescription className="mt-1">
                Token #{queueInfo.tokenNumber} • {queueInfo.doctorName}
              </CardDescription>
            </div>
            {getStatusBadge(queueInfo.status)}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Queue Position */}
          <div className="mb-6 text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Your Position</span>
            </div>
            <div className="mb-2 text-6xl font-bold text-blue-600">
              {queueInfo.queuePosition}
            </div>
            <p className="text-sm text-gray-600">
              out of {queueInfo.totalInQueue} in queue
            </p>

            {/* Progress Bar */}
            <div className="mx-auto mt-4 max-w-md">
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Estimated Wait Time */}
            <div className="rounded-lg border bg-gradient-to-br from-orange-50 to-red-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">
                  Estimated Wait
                </span>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {queueInfo.estimatedWaitTime} min
              </p>
              {queueInfo.queuePosition <= 3 && (
                <p className="mt-1 text-xs text-orange-600">You're up soon!</p>
              )}
            </div>

            {/* Scheduled Time */}
            <div className="rounded-lg border bg-gradient-to-br from-purple-50 to-pink-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Timer className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">
                  Scheduled Time
                </span>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {queueInfo.scheduledTime}
              </p>
              <p className="mt-1 text-xs text-gray-600">{queueInfo.departmentName}</p>
            </div>
          </div>

          {/* Live Update Indicator */}
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-xs text-gray-600">Live updates enabled</span>
            </div>
            <span className="text-xs text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>

          {/* Call to Action */}
          {queueInfo.queuePosition <= 2 && queueInfo.status !== "in_consultation" && (
            <div className="mt-4 rounded-lg bg-yellow-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">
                    Please be ready!
                  </p>
                  <p className="mt-1 text-sm text-yellow-700">
                    You'll be called soon. Make sure you're at the hospital.
                  </p>
                </div>
              </div>
            </div>
          )}

          {queueInfo.status === "in_consultation" && (
            <div className="mt-4 rounded-lg bg-green-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">
                    You're in consultation
                  </p>
                  <p className="mt-1 text-sm text-green-700">
                    The doctor is attending to you now.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Queue Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <TrendingDown className="h-4 w-4 mt-0.5 text-blue-600" />
              <span>
                Arrive 15 minutes before your estimated time
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Activity className="h-4 w-4 mt-0.5 text-blue-600" />
              <span>
                Queue times update automatically as patients are served
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-blue-600" />
              <span>
                Emergency cases may affect wait times
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

