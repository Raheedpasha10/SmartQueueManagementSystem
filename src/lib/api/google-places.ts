/**
 * Google Places API Service (NEW API)
 * Fetches real hospital data from Google Maps using Places API (New)
 * Falls back to realistic mock data when API is unavailable
 */

import { MOCK_HOSPITALS, filterHospitalsByLocation, searchHospitalsByText as searchMockByText } from '@/lib/data/mock-hospitals';

export interface HospitalPlace {
  id: string;
  displayName: {
    text: string;
  };
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  userRatingCount?: number;
  currentOpeningHours?: {
    openNow?: boolean;
  };
  nationalPhoneNumber?: string;
  websiteUri?: string;
  // Legacy compatibility
  place_id?: string;
  name?: string;
  vicinity?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface HospitalDetails {
  id: string;
  displayName: {
    text: string;
  };
  formattedAddress: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  currentOpeningHours?: {
    openNow?: boolean;
    weekdayDescriptions?: string[];
  };
  reviews?: Array<{
    authorAttribution: {
      displayName: string;
    };
    rating: number;
    text: {
      text: string;
    };
    publishTime: string;
  }>;
  // Legacy compatibility
  place_id?: string;
  name?: string;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const PLACES_BASE_URL = 'https://places.googleapis.com/v1';

/**
 * Search for hospitals near a location using NEW Places API
 * Automatically falls back to realistic mock data if API is unavailable
 */
export async function searchNearbyHospitals(
  latitude: number,
  longitude: number,
  radius: number = 5000 // 5km default
): Promise<HospitalPlace[]> {
  try {
    // Try Google API first if key is available
    if (API_KEY && API_KEY !== 'your-google-maps-api-key') {
      const url = `${PLACES_BASE_URL}/places:searchNearby`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.nationalPhoneNumber,places.websiteUri'
        },
        body: JSON.stringify({
          includedTypes: ['hospital'],
          maxResultCount: 20,
          locationRestriction: {
            circle: {
              center: {
                latitude: latitude,
                longitude: longitude
              },
              radius: radius
            }
          }
        })
      });

      const data = await response.json();

      // If API succeeds, return the data
      if (response.ok && data.places && data.places.length > 0) {
        console.log(`✅ Found ${data.places.length} hospitals from Google Places API`);
        return data.places.map((place: any) => ({
          ...place,
          place_id: place.id,
          name: place.displayName?.text || 'Unknown Hospital',
          vicinity: place.formattedAddress,
          geometry: {
            location: {
              lat: place.location?.latitude || 0,
              lng: place.location?.longitude || 0
            }
          },
          user_ratings_total: place.userRatingCount,
          opening_hours: {
            open_now: place.currentOpeningHours?.openNow
          }
        }));
      }

      console.warn('Google Places API failed or returned no results, using mock data...');
    }

    // Fall back to mock data
    console.log('📍 Using realistic mock hospital data...');
    const mockHospitals = filterHospitalsByLocation(MOCK_HOSPITALS, latitude, longitude, radius);
    
    console.log(`✅ Found ${mockHospitals.length} hospitals from mock database`);

    // Transform mock data to match API format
    return mockHospitals.map(hospital => ({
      id: hospital.id,
      displayName: {
        text: hospital.name
      },
      formattedAddress: hospital.address,
      location: {
        latitude: hospital.latitude,
        longitude: hospital.longitude
      },
      rating: hospital.rating,
      userRatingCount: hospital.userRatingCount,
      currentOpeningHours: {
        openNow: hospital.is24x7 || true
      },
      nationalPhoneNumber: hospital.phone,
      websiteUri: undefined,
      // Legacy compatibility
      place_id: hospital.id,
      name: hospital.name,
      vicinity: hospital.address,
      geometry: {
        location: {
          lat: hospital.latitude,
          lng: hospital.longitude
        }
      },
      user_ratings_total: hospital.userRatingCount,
      opening_hours: {
        open_now: hospital.is24x7 || true
      }
    }));
  } catch (error) {
    console.error('Error fetching hospitals, using mock data:', error);
    
    // Final fallback to mock data
    const mockHospitals = filterHospitalsByLocation(MOCK_HOSPITALS, latitude, longitude, radius);
    console.log(`✅ Fallback: Found ${mockHospitals.length} hospitals from mock database`);
    
    return mockHospitals.map(hospital => ({
      id: hospital.id,
      displayName: {
        text: hospital.name
      },
      formattedAddress: hospital.address,
      location: {
        latitude: hospital.latitude,
        longitude: hospital.longitude
      },
      rating: hospital.rating,
      userRatingCount: hospital.userRatingCount,
      nationalPhoneNumber: hospital.phone,
      place_id: hospital.id,
      name: hospital.name,
      vicinity: hospital.address,
      geometry: {
        location: {
          lat: hospital.latitude,
          lng: hospital.longitude
        }
      },
      user_ratings_total: hospital.userRatingCount,
      opening_hours: {
        open_now: true
      }
    }));
  }
}

/**
 * Get detailed information about a hospital using NEW Places API
 */
export async function getHospitalDetails(placeId: string): Promise<HospitalDetails | null> {
  try {
    if (!API_KEY) {
      console.error('Google Maps API Key is missing');
      return null;
    }

    const url = `${PLACES_BASE_URL}/places/${placeId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,nationalPhoneNumber,websiteUri,rating,userRatingCount,currentOpeningHours,reviews'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Places Details Error:', response.status, data);
      return null;
    }

    // Add legacy compatibility fields
    return {
      ...data,
      place_id: data.id,
      name: data.displayName?.text,
      formatted_address: data.formattedAddress,
      formatted_phone_number: data.nationalPhoneNumber,
      website: data.websiteUri,
      user_ratings_total: data.userRatingCount,
      opening_hours: {
        open_now: data.currentOpeningHours?.openNow,
        weekday_text: data.currentOpeningHours?.weekdayDescriptions
      }
    };
  } catch (error) {
    console.error('Error fetching hospital details:', error);
    return null;
  }
}

/**
 * Get photo URL from photo reference
 */
export function getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
  return `${PLACES_BASE_URL}/photo?` +
    `maxwidth=${maxWidth}` +
    `&photo_reference=${photoReference}` +
    `&key=${API_KEY}`;
}

/**
 * Search hospitals by text query using NEW Places API
 * Falls back to mock data if API unavailable
 */
export async function searchHospitalsByText(
  query: string,
  location?: { lat: number; lng: number }
): Promise<HospitalPlace[]> {
  try {
    // Try Google API first
    if (API_KEY && API_KEY !== 'your-google-maps-api-key') {
      const url = `${PLACES_BASE_URL}/places:searchText`;

      const requestBody: any = {
        textQuery: `${query} hospital`,
        maxResultCount: 20
      };

      if (location) {
        requestBody.locationBias = {
          circle: {
            center: {
              latitude: location.lat,
              longitude: location.lng
            },
            radius: 10000
          }
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.nationalPhoneNumber,places.websiteUri'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok && data.places && data.places.length > 0) {
        return data.places.map((place: any) => ({
          ...place,
          place_id: place.id,
          name: place.displayName?.text || 'Unknown Hospital',
          vicinity: place.formattedAddress,
          geometry: {
            location: {
              lat: place.location?.latitude || 0,
              lng: place.location?.longitude || 0
            }
          },
          user_ratings_total: place.userRatingCount,
          opening_hours: {
            open_now: place.currentOpeningHours?.openNow
          }
        }));
      }
    }

    // Fall back to mock data search
    console.log('📍 Searching mock hospital database...');
    const mockResults = searchMockByText(query);
    
    return mockResults.map(hospital => ({
      id: hospital.id,
      displayName: {
        text: hospital.name
      },
      formattedAddress: hospital.address,
      location: {
        latitude: hospital.latitude,
        longitude: hospital.longitude
      },
      rating: hospital.rating,
      userRatingCount: hospital.userRatingCount,
      nationalPhoneNumber: hospital.phone,
      place_id: hospital.id,
      name: hospital.name,
      vicinity: hospital.address,
      geometry: {
        location: {
          lat: hospital.latitude,
          lng: hospital.longitude
        }
      },
      user_ratings_total: hospital.userRatingCount,
      opening_hours: {
        open_now: true
      }
    }));
  } catch (error) {
    console.error('Error searching hospitals, using mock data:', error);
    const mockResults = searchMockByText(query);
    return mockResults.map(hospital => ({
      id: hospital.id,
      displayName: { text: hospital.name },
      formattedAddress: hospital.address,
      location: { latitude: hospital.latitude, longitude: hospital.longitude },
      rating: hospital.rating,
      userRatingCount: hospital.userRatingCount,
      nationalPhoneNumber: hospital.phone,
      place_id: hospital.id,
      name: hospital.name,
      vicinity: hospital.address,
      geometry: {
        location: { lat: hospital.latitude, lng: hospital.longitude }
      },
      user_ratings_total: hospital.userRatingCount,
      opening_hours: { open_now: true }
    }));
  }
}

/**
 * Get user's current location using browser geolocation
 */
export function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        // Fallback to Bangalore coordinates if user denies location
        console.warn('Geolocation error, using default location:', error);
        resolve({ lat: 12.9716, lng: 77.5946 });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Calculate distance between two coordinates (in km)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

