"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface DoctorAvailabilityProps {
  doctorId: string;
  onSlotSelect?: (date: string, time: string) => void;
}

export function DoctorAvailability({ doctorId, onSlotSelect }: DoctorAvailabilityProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchAvailability();
  }, [currentWeek, doctorId]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const weekDates = getWeekDates(currentWeek);
      
      // Fetch doctor's schedule
      const { data: schedules } = await supabase
        .from("doctor_schedules")
        .select("*")
        .eq("doctor_id", doctorId)
        .gte("date", weekDates[0])
        .lte("date", weekDates[6]);

      // Fetch existing appointments to mark slots as booked
      const { data: appointments } = await supabase
        .from("appointments")
        .select("scheduled_time, appointment_date, appointment_time")
        .eq("doctor_id", doctorId)
        .gte("appointment_date", weekDates[0])
        .lte("appointment_date", weekDates[6])
        .in("status", ["confirmed", "checked_in", "in_consultation"]);

      // Build availability map
      const availability: any = {};
      
      weekDates.forEach((date) => {
        const dayOfWeek = new Date(date).getDay();
        const dayName = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][dayOfWeek];
        
        // For demo purposes, set standard working hours
        // In production, this would come from doctor_schedules table
        const isWorkingDay = dayOfWeek >= 1 && dayOfWeek <= 5; // Mon-Fri
        
        if (isWorkingDay) {
          availability[date] = {
            slots: generateTimeSlots(9, 17), // 9 AM to 5 PM
            booked: appointments
              ?.filter((apt) => apt.appointment_date === date)
              .map((apt) => apt.appointment_time) || [],
          };
        } else {
          availability[date] = {
            slots: [],
            booked: [],
          };
        }
      });

      setAvailabilityData(availability);
    } catch (error) {
      console.error("Error fetching availability:", error);
      toast.error("Failed to load availability");
    } finally {
      setLoading(false);
    }
  };

  const getWeekDates = (date: Date): string[] => {
    const week = [];
    const first = date.getDate() - date.getDay();
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(date);
      day.setDate(first + i);
      week.push(day.toISOString().split("T")[0]);
    }
    
    return week;
  };

  const generateTimeSlots = (startHour: number, endHour: number): string[] => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) {
        slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
      }
    }
    return slots;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newWeek);
    setSelectedSlot(null);
  };

  const handleSlotClick = (date: string, time: string) => {
    setSelectedSlot({ date, time });
    if (onSlotSelect) {
      onSlotSelect(date, time);
    }
  };

  const isSlotAvailable = (date: string, time: string): boolean => {
    const dateData = availabilityData[date];
    if (!dateData) return false;
    return dateData.slots.includes(time) && !dateData.booked.includes(time);
  };

  const isSlotBooked = (date: string, time: string): boolean => {
    const dateData = availabilityData[date];
    if (!dateData) return false;
    return dateData.booked.includes(time);
  };

  const weekDates = getWeekDates(currentWeek);
  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Doctor Availability
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Week Header */}
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
              <div key={day} className="text-center">
                <p className="text-xs font-medium text-gray-600">{day}</p>
                <p className={`text-lg font-bold ${
                  weekDates[idx] === today ? "text-blue-600" : "text-gray-900"
                }`}>
                  {new Date(weekDates[idx]).getDate()}
                </p>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {weekDates.map((date) => {
              const dateData = availabilityData[date];
              const isPast = date < today;

              return (
                <div key={date} className="space-y-2">
                  <div className="sticky top-0 bg-white py-1">
                    <p className="text-sm font-semibold text-gray-700">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                      {date === today && (
                        <Badge className="ml-2 bg-blue-500">Today</Badge>
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {dateData?.slots.length > 0 ? (
                      dateData.slots.map((time: string) => {
                        const available = isSlotAvailable(date, time);
                        const booked = isSlotBooked(date, time);
                        const isSelected =
                          selectedSlot?.date === date && selectedSlot?.time === time;

                        return (
                          <button
                            key={time}
                            onClick={() =>
                              available && !isPast && handleSlotClick(date, time)
                            }
                            disabled={!available || isPast}
                            className={`flex items-center justify-center gap-1 rounded-lg border p-2 text-sm font-medium transition-all ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200"
                                : available && !isPast
                                ? "border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100"
                                : booked || isPast
                                ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through"
                                : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                            }`}
                          >
                            {available && !isPast && !isSelected && (
                              <CheckCircle className="h-3 w-3" />
                            )}
                            {(booked || isPast) && <XCircle className="h-3 w-3" />}
                            <span>{time}</span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="col-span-4 py-4 text-center text-sm text-gray-500">
                        No available slots
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 border-t pt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-green-200 bg-green-50" />
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-blue-500 bg-blue-50" />
              <span className="text-gray-600">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-gray-200 bg-gray-100" />
              <span className="text-gray-600">Booked</span>
            </div>
          </div>

          {/* Selected Slot Info */}
          {selectedSlot && (
            <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">Selected Slot</p>
                  <p className="text-sm text-blue-700">
                    {new Date(selectedSlot.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at {selectedSlot.time}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

