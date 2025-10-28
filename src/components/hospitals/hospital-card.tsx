"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MapPin,
  Phone,
  Star,
  Bed,
  Activity,
  Clock,
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
  };
}

interface HospitalCardProps {
  hospital: Hospital;
  isSelected: boolean;
  onToggleCompare: (hospital: Hospital) => void;
  canSelect: boolean;
}

export function HospitalCard({
  hospital,
  isSelected,
  onToggleCompare,
  canSelect,
}: HospitalCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      {/* Compare Checkbox */}
      <div className="absolute left-4 top-4 z-10">
        <label className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleCompare(hospital)}
            disabled={!canSelect && !isSelected}
          />
          <span className="text-sm font-medium">Compare</span>
        </label>
      </div>

      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pt-16">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{hospital.name}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {hospital.addresses?.city}, {hospital.addresses?.state}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 shadow-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{hospital.rating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Facilities */}
        {hospital.facilities && hospital.facilities.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-gray-700">Facilities</p>
            <div className="flex flex-wrap gap-2">
              {hospital.facilities.slice(0, 4).map((facility: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {facility}
                </Badge>
              ))}
              {hospital.facilities.length > 4 && (
                <Badge variant="outline">+{hospital.facilities.length - 4} more</Badge>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-4 grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Bed className="h-4 w-4" />
              Available Beds
            </div>
            <p className="mt-1 text-lg font-semibold">
              {hospital.available_beds}/{hospital.total_beds}
            </p>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{
                  width: `${(hospital.available_beds / hospital.total_beds) * 100}%`,
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Activity className="h-4 w-4" />
              Emergency
            </div>
            <p className="mt-1 text-lg font-semibold">
              {hospital.emergency_capacity - hospital.current_emergency_occupancy}/
              {hospital.emergency_capacity}
            </p>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-green-500 transition-all"
                style={{
                  width: `${
                    ((hospital.emergency_capacity - hospital.current_emergency_occupancy) /
                      hospital.emergency_capacity) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-4 flex flex-wrap gap-2">
          {hospital.operates_24x7 && (
            <Badge className="gap-1 bg-green-600">
              <Clock className="h-3 w-3" />
              24/7 Available
            </Badge>
          )}
          {hospital.accreditations && hospital.accreditations.length > 0 && (
            <Badge variant="outline">{hospital.accreditations[0]}</Badge>
          )}
        </div>

        {/* Contact */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          {hospital.phone_number}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/hospitals/${hospital.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          <Link href={`/hospitals/${hospital.id}/book`} className="flex-1">
            <Button className="w-full gap-2">
              Book Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

