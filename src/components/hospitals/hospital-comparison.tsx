"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Star,
  MapPin,
  Phone,
  Bed,
  Activity,
  Clock,
  Check,
  Shield,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Hospital {
  id: string;
  name: string;
  rating: number;
  phone_number: string;
  total_beds: number;
  available_beds: number;
  emergency_capacity: number;
  current_emergency_occupancy: number;
  operates_24x7: boolean;
  facilities: string[];
  accreditations: string[];
  addresses: {
    city: string;
    state: string;
    street_address: string;
  };
}

interface ComparisonProps {
  hospitals: Hospital[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function HospitalComparison({ hospitals, onRemove, onClear }: ComparisonProps) {
  if (hospitals.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-2xl">
      <div className="container mx-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Compare Hospitals ({hospitals.length}/3)
          </h3>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear All
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hospitals.map((hospital) => (
            <Card key={hospital.id} className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-6 w-6 rounded-full p-0"
                onClick={() => onRemove(hospital.id)}
              >
                <X className="h-4 w-4" />
              </Button>

              <CardHeader className="pb-3">
                <CardTitle className="text-base">{hospital.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  {hospital.addresses.city}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{hospital.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Beds Available</span>
                  <span className="font-semibold">
                    {hospital.available_beds}/{hospital.total_beds}
                  </span>
                </div>

                {/* Emergency */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Emergency</span>
                  <span className="font-semibold">
                    {hospital.emergency_capacity - hospital.current_emergency_occupancy}/
                    {hospital.emergency_capacity}
                  </span>
                </div>

                {/* 24/7 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">24/7 Available</span>
                  {hospital.operates_24x7 ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                {/* Facilities */}
                <div>
                  <span className="text-sm text-gray-600">Top Facilities</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {hospital.facilities.slice(0, 2).map((facility, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/hospitals/${hospital.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Details
                    </Button>
                  </Link>
                  <Link href={`/hospitals/${hospital.id}/book`} className="flex-1">
                    <Button size="sm" className="w-full gap-1">
                      Book <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add More Placeholder */}
          {hospitals.length < 3 && (
            <Card className="flex items-center justify-center border-dashed bg-gray-50">
              <CardContent className="py-12 text-center">
                <p className="text-sm text-gray-500">
                  Select up to {3 - hospitals.length} more hospital{hospitals.length < 2 ? "s" : ""} to compare
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

