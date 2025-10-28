import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchNearbyHospitals, getHospitalDetails } from '@/lib/api/google-places';

export const dynamic = 'force-dynamic';

/**
 * API Route to sync real hospital data from Google Places to Supabase
 * GET /api/hospitals/sync?lat=12.9716&lng=77.5946&radius=10000
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '12.9716'); // Default: Bangalore
    const lng = parseFloat(searchParams.get('lng') || '77.5946');
    const radius = parseInt(searchParams.get('radius') || '10000'); // 10km default

    console.log(`🔍 Fetching hospitals near ${lat}, ${lng} within ${radius}m...`);

    // Fetch hospitals from Google Places
    const hospitals = await searchNearbyHospitals(lat, lng, radius);

    if (hospitals.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No hospitals found in the area',
      }, { status: 404 });
    }

    console.log(`✅ Found ${hospitals.length} hospitals from Google Places`);

    const supabase = await createClient();
    const syncedHospitals = [];

    // Sync each hospital to database
    for (const hospital of hospitals.slice(0, 20)) { // Limit to first 20 to avoid rate limits
      try {
        // Get detailed information
        const details = await getHospitalDetails(hospital.place_id || hospital.id);

        // Check if hospital already exists
        const { data: existing } = await supabase
          .from('hospitals')
          .select('id')
          .eq('external_id', hospital.place_id)
          .single();

        const hospitalData = {
          external_id: hospital.place_id,
          name: hospital.name,
          phone_number: (details as any)?.formatted_phone_number || details?.nationalPhoneNumber || null,
          email: null, // Google doesn't provide emails
          website_url: (details as any)?.website || details?.websiteUri || null,
          rating: hospital.rating || 0,
          total_reviews: (hospital as any).user_ratings_total || hospital.userRatingCount || 0,
          is_active: true,
          operates_24x7: (details as any)?.opening_hours?.open_now !== undefined,
          facilities: [], // Will be populated manually or via another API
          accreditations: [],
          emergency_capacity: 10, // Default values
          current_emergency_occupancy: 0,
          total_beds: 50,
          available_beds: 30,
        };

        if (existing) {
          // Update existing hospital
          const { error } = await supabase
            .from('hospitals')
            .update(hospitalData)
            .eq('id', existing.id);

          if (!error) {
            syncedHospitals.push({ ...hospitalData, id: existing.id, action: 'updated' });
          }
        } else {
          // Create new hospital and address
          const { data: addressData, error: addressError } = await supabase
            .from('addresses')
            .insert({
              street_address: details?.formattedAddress || (details as any)?.formatted_address || hospital.vicinity,
              city: 'Auto-detected', // Parse from address in production
              state: 'Auto-detected',
              postal_code: '000000',
              country: 'India',
              latitude: hospital.geometry?.location?.lat || hospital.location?.latitude || 0,
              longitude: hospital.geometry?.location?.lng || hospital.location?.longitude || 0,
            })
            .select()
            .single();

          if (addressError) {
            console.error('Address creation error:', addressError);
            continue;
          }

          const { data: hospitalRecord, error: hospitalError } = await supabase
            .from('hospitals')
            .insert({
              ...hospitalData,
              address_id: addressData.id,
            })
            .select()
            .single();

          if (!hospitalError && hospitalRecord) {
            syncedHospitals.push({ ...hospitalRecord, action: 'created' });
          }
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error syncing hospital ${hospital.name}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${syncedHospitals.length} hospitals`,
      hospitals: syncedHospitals,
      location: { lat, lng },
      radius,
    });
  } catch (error: any) {
    console.error('Hospital sync error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to sync hospitals',
    }, { status: 500 });
  }
}

