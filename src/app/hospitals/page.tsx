import { createClient } from "@/lib/supabase/server";
import { HospitalsPageClient } from "./hospitals-client";
import { MOCK_HOSPITALS } from "@/lib/data/mock-hospitals";

export default async function HospitalsPage() {
  const supabase = await createClient();

  // Fetch hospitals with their addresses
  const { data: dbHospitals, error } = await supabase
    .from("hospitals")
    .select(`
      *,
      addresses (*)
    `)
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Error fetching hospitals:", error);
  }

  // Use mock data if database is empty or has errors
  let hospitals = dbHospitals || [];
  
  if (hospitals.length === 0) {
    console.log("📍 No hospitals in database, using mock data...");
    // Transform mock data to match database format
    hospitals = MOCK_HOSPITALS.map((mock) => ({
      id: mock.id,
      name: mock.name,
      phone_number: mock.phone,
      email: null,
      website_url: null,
      rating: mock.rating,
      total_reviews: mock.userRatingCount,
      is_active: true,
      operates_24x7: mock.is24x7,
      facilities: mock.facilities,
      specialties: mock.specialties,
      emergency_capacity: mock.emergencyCapacity,
      current_emergency_occupancy: 0,
      total_beds: mock.totalBeds,
      available_beds: Math.floor(mock.totalBeds * 0.6),
      accreditations: [],
      external_id: mock.id,
      addresses: {
        street_address: mock.address,
        city: mock.city,
        state: mock.state,
        postal_code: "000000",
        country: "India",
        latitude: mock.latitude,
        longitude: mock.longitude,
      },
    }));
  }

  // Extract unique specialties and facilities for filters
  const allSpecialties = new Set<string>();
  const allFacilities = new Set<string>();

  hospitals?.forEach((hospital: any) => {
    if (hospital.specialties && Array.isArray(hospital.specialties)) {
      hospital.specialties.forEach((s: string) => allSpecialties.add(s));
    }
    if (hospital.facilities && Array.isArray(hospital.facilities)) {
      hospital.facilities.forEach((f: string) => allFacilities.add(f));
    }
  });

  return (
    <HospitalsPageClient
      hospitals={hospitals || []}
      specialties={Array.from(allSpecialties).sort()}
      facilities={Array.from(allFacilities).sort()}
    />
  );
}
