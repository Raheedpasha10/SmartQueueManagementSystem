"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HospitalFilters, type HospitalFilters as FilterType } from "@/components/hospitals/hospital-filters";
import { HospitalComparison } from "@/components/hospitals/hospital-comparison";
import { HospitalCard } from "@/components/hospitals/hospital-card";
import { Hospital as HospitalIcon, Grid, List } from "lucide-react";

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
  specialties: string[];
  accreditations: string[];
  addresses: {
    city: string;
    state: string;
    street_address: string;
  };
}

interface Props {
  hospitals: Hospital[];
  specialties: string[];
  facilities: string[];
}

export function HospitalsPageClient({ hospitals, specialties, facilities }: Props) {
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    city: "",
    minRating: 0,
    has24x7: false,
    hasEmergency: false,
    selectedSpecialties: [],
    selectedFacilities: [],
    minAvailableBeds: 0,
    sortBy: "name",
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [comparisonList, setComparisonList] = useState<Hospital[]>([]);

  // Filter and sort hospitals
  const filteredHospitals = useMemo(() => {
    let result = [...hospitals];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((h) => h.name.toLowerCase().includes(searchLower));
    }

    // City filter
    if (filters.city) {
      const cityLower = filters.city.toLowerCase();
      result = result.filter((h) =>
        h.addresses?.city?.toLowerCase().includes(cityLower)
      );
    }

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter((h) => h.rating >= filters.minRating);
    }

    // 24/7 filter
    if (filters.has24x7) {
      result = result.filter((h) => h.operates_24x7);
    }

    // Emergency filter
    if (filters.hasEmergency) {
      result = result.filter(
        (h) => h.emergency_capacity && h.emergency_capacity > 0
      );
    }

    // Specialties filter
    if (filters.selectedSpecialties.length > 0) {
      result = result.filter((h) =>
        h.specialties?.some((s) => filters.selectedSpecialties.includes(s))
      );
    }

    // Facilities filter
    if (filters.selectedFacilities.length > 0) {
      result = result.filter((h) =>
        h.facilities?.some((f) => filters.selectedFacilities.includes(f))
      );
    }

    // Available beds filter
    if (filters.minAvailableBeds > 0) {
      result = result.filter((h) => h.available_beds >= filters.minAvailableBeds);
    }

    // Sorting
    switch (filters.sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "availability":
        result.sort((a, b) => b.available_beds - a.available_beds);
        break;
      // distance would require geolocation, placeholder for now
      case "distance":
        break;
    }

    return result;
  }, [hospitals, filters]);

  const handleToggleCompare = (hospital: Hospital) => {
    setComparisonList((prev) => {
      const exists = prev.find((h) => h.id === hospital.id);
      if (exists) {
        return prev.filter((h) => h.id !== hospital.id);
      }
      if (prev.length >= 3) {
        return prev; // Max 3 hospitals
      }
      return [...prev, hospital];
    });
  };

  const handleRemoveFromComparison = (id: string) => {
    setComparisonList((prev) => prev.filter((h) => h.id !== id));
  };

  const handleClearComparison = () => {
    setComparisonList([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Hospitals</h1>
        <p className="text-gray-600">
          Browse and book appointments at our network hospitals
        </p>
      </div>

      {/* Stats Bar */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <HospitalIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Showing</p>
                <p className="text-2xl font-bold">{filteredHospitals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <HospitalIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">24/7 Available</p>
                <p className="text-2xl font-bold">
                  {filteredHospitals.filter((h) => h.operates_24x7).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <HospitalIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold">
                  {filteredHospitals.length
                    ? (
                        filteredHospitals.reduce((sum, h) => sum + h.rating, 0) /
                        filteredHospitals.length
                      ).toFixed(1)
                    : "0.0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2">
                <HospitalIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Comparing</p>
                <p className="text-2xl font-bold">{comparisonList.length}/3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <HospitalFilters
          onFilterChange={setFilters}
          specialties={specialties}
          facilities={facilities}
        />
      </div>

      {/* View Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredHospitals.length} hospital{filteredHospitals.length !== 1 ? "s" : ""} found
        </p>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hospital Grid/List */}
      {filteredHospitals.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-4"
          }
        >
          {filteredHospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              isSelected={comparisonList.some((h) => h.id === hospital.id)}
              onToggleCompare={handleToggleCompare}
              canSelect={comparisonList.length < 3}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <HospitalIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No hospitals found</h3>
          <p className="mt-2 text-sm text-gray-600">
            Try adjusting your filters to see more results.
          </p>
        </Card>
      )}

      {/* Comparison Panel */}
      <HospitalComparison
        hospitals={comparisonList}
        onRemove={handleRemoveFromComparison}
        onClear={handleClearComparison}
      />

      {/* Padding for comparison panel */}
      {comparisonList.length > 0 && <div className="h-80" />}
    </div>
  );
}

