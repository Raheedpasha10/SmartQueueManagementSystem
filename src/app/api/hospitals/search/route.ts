import { NextRequest, NextResponse } from 'next/server';
import { searchNearbyHospitals } from '@/lib/api/google-places';

export const dynamic = 'force-dynamic';

/**
 * API Route to search hospitals without syncing to database
 * GET /api/hospitals/search?lat=12.9716&lng=77.5946&radius=10000
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '12.9716'); // Default: Bangalore
    const lng = parseFloat(searchParams.get('lng') || '77.5946');
    const radius = parseInt(searchParams.get('radius') || '10000'); // 10km default

    console.log(`🔍 Searching hospitals near ${lat}, ${lng} within ${radius}m...`);

    // Fetch hospitals from Google Places (or mock data)
    const hospitals = await searchNearbyHospitals(lat, lng, radius);

    console.log(`✅ Found ${hospitals.length} hospitals`);

    return NextResponse.json({
      success: true,
      count: hospitals.length,
      hospitals: hospitals.map(h => ({
        id: h.place_id || h.id,
        name: h.name || h.displayName?.text,
        address: h.vicinity || h.formattedAddress,
        rating: h.rating,
        reviews: (h as any).user_ratings_total || h.userRatingCount,
        phone: h.nationalPhoneNumber,
        location: {
          lat: h.geometry?.location?.lat || h.location?.latitude,
          lng: h.geometry?.location?.lng || h.location?.longitude
        }
      })),
      location: { lat, lng },
      radius,
    });
  } catch (error: any) {
    console.error('Hospital search error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to search hospitals',
    }, { status: 500 });
  }
}

