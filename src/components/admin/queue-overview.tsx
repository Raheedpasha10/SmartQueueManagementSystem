"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, Clock } from "lucide-react";

interface QueueStat {
  departmentName: string;
  totalInQueue: number;
  avgWaitTime: number;
  doctorCount: number;
}

export function QueueOverview() {
  const [queueStats, setQueueStats] = useState<QueueStat[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchQueueStats();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("admin-queue")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
        },
        () => {
          fetchQueueStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchQueueStats = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Fetch active appointments grouped by department
      const { data: appointments, error } = await supabase
        .from("appointments")
        .select(`
          id,
          created_at,
          departments (
            id,
            name
          ),
          doctors (id)
        `)
        .eq("appointment_date", today)
        .in("status", ["confirmed", "checked_in", "in_consultation"]);

      if (error) throw error;

      // Group by department
      const departmentMap = new Map<string, any>();

      appointments?.forEach((apt: any) => {
        const deptName = apt.departments?.name || "Unknown";
        if (!departmentMap.has(deptName)) {
          departmentMap.set(deptName, {
            departmentName: deptName,
            totalInQueue: 0,
            avgWaitTime: 0,
            doctorCount: new Set(),
          });
        }

        const dept = departmentMap.get(deptName);
        dept.totalInQueue += 1;
        if (apt.doctors?.id) {
          dept.doctorCount.add(apt.doctors.id);
        }
      });

      // Convert to array and calculate avg wait time (10 min per patient)
      const stats: QueueStat[] = Array.from(departmentMap.values()).map((dept) => ({
        departmentName: dept.departmentName,
        totalInQueue: dept.totalInQueue,
        avgWaitTime: Math.round((dept.totalInQueue / dept.doctorCount.size) * 10) || 0,
        doctorCount: dept.doctorCount.size,
      }));

      setQueueStats(stats);
    } catch (error) {
      console.error("Error fetching queue stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (queueStats.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No active queues
      </div>
    );
  }

  const maxQueue = Math.max(...queueStats.map((s) => s.totalInQueue), 1);

  return (
    <div className="space-y-4">
      {queueStats.map((stat) => (
        <div key={stat.departmentName} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-semibold">{stat.departmentName}</h4>
            <Badge variant="outline">{stat.doctorCount} doctors</Badge>
          </div>

          <div className="mb-2 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">In Queue</span>
            </div>
            <span className="font-bold text-blue-600">{stat.totalInQueue}</span>
          </div>

          <Progress value={(stat.totalInQueue / maxQueue) * 100} className="mb-3 h-2" />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Avg. Wait</span>
            </div>
            <span className="font-medium text-orange-600">{stat.avgWaitTime} min</span>
          </div>
        </div>
      ))}
    </div>
  );
}

