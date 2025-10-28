"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Star,
  Bed,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

interface FilterProps {
  onFilterChange: (filters: HospitalFilters) => void;
  specialties: string[];
  facilities: string[];
}

export interface HospitalFilters {
  search: string;
  city: string;
  minRating: number;
  has24x7: boolean;
  hasEmergency: boolean;
  selectedSpecialties: string[];
  selectedFacilities: string[];
  minAvailableBeds: number;
  sortBy: "name" | "rating" | "distance" | "availability";
}

export function HospitalFilters({ onFilterChange, specialties, facilities }: FilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<HospitalFilters>({
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

  const updateFilters = (updates: Partial<HospitalFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleSpecialty = (specialty: string) => {
    const updated = filters.selectedSpecialties.includes(specialty)
      ? filters.selectedSpecialties.filter((s) => s !== specialty)
      : [...filters.selectedSpecialties, specialty];
    updateFilters({ selectedSpecialties: updated });
  };

  const toggleFacility = (facility: string) => {
    const updated = filters.selectedFacilities.includes(facility)
      ? filters.selectedFacilities.filter((f) => f !== facility)
      : [...filters.selectedFacilities, facility];
    updateFilters({ selectedFacilities: updated });
  };

  const clearFilters = () => {
    const defaultFilters: HospitalFilters = {
      search: "",
      city: "",
      minRating: 0,
      has24x7: false,
      hasEmergency: false,
      selectedSpecialties: [],
      selectedFacilities: [],
      minAvailableBeds: 0,
      sortBy: "name",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.has24x7 ? 1 : 0) +
    (filters.hasEmergency ? 1 : 0) +
    filters.selectedSpecialties.length +
    filters.selectedFacilities.length +
    (filters.minAvailableBeds > 0 ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search and Quick Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search hospitals by name..."
            className="pl-10"
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>
        <div className="relative w-full sm:w-48">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="City"
            className="pl-10"
            value={filters.city}
            onChange={(e) => updateFilters({ city: e.target.value })}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="space-y-6 rounded-lg border bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Advanced Filters</h3>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Rating Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Minimum Rating
              </Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={filters.minRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilters({ minRating: rating })}
                  >
                    {rating}+
                  </Button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Bed className="h-4 w-4" />
                Available Beds
              </Label>
              <Input
                type="number"
                min="0"
                placeholder="Min. available beds"
                value={filters.minAvailableBeds || ""}
                onChange={(e) =>
                  updateFilters({ minAvailableBeds: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label>Sort By</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={filters.sortBy}
                onChange={(e) =>
                  updateFilters({
                    sortBy: e.target.value as HospitalFilters["sortBy"],
                  })
                }
              >
                <option value="name">Name (A-Z)</option>
                <option value="rating">Highest Rated</option>
                <option value="availability">Most Available</option>
                <option value="distance">Nearest</option>
              </select>
            </div>
          </div>

          {/* Quick Toggle Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.has24x7 ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilters({ has24x7: !filters.has24x7 })}
            >
              24/7 Available
            </Button>
            <Button
              variant={filters.hasEmergency ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilters({ hasEmergency: !filters.hasEmergency })}
            >
              Emergency Services
            </Button>
          </div>

          {/* Specialties Filter */}
          {specialties.length > 0 && (
            <div className="space-y-2">
              <Label>Specialties</Label>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <Badge
                    key={specialty}
                    variant={
                      filters.selectedSpecialties.includes(specialty)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleSpecialty(specialty)}
                  >
                    {specialty}
                    {filters.selectedSpecialties.includes(specialty) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Facilities Filter */}
          {facilities.length > 0 && (
            <div className="space-y-2">
              <Label>Facilities</Label>
              <div className="flex flex-wrap gap-2">
                {facilities.map((facility) => (
                  <Badge
                    key={facility}
                    variant={
                      filters.selectedFacilities.includes(facility) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleFacility(facility)}
                  >
                    {facility}
                    {filters.selectedFacilities.includes(facility) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

