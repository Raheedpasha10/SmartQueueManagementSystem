import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Bed,
  Activity,
  Clock,
  Building,
  Award,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { MOCK_HOSPITALS } from "@/lib/data/mock-hospitals";
import { getDoctorsByHospitalId } from "@/lib/data/mock-doctors";

export default async function HospitalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Fetch hospital details
  const { data: hospitalData, error } = await supabase
    .from("hospitals")
    .select(`
      *,
      addresses (*),
      departments (*)
    `)
    .eq("id", params.id)
    .single();

  // If no hospital in DB, use mock data
  let hospital = hospitalData;
  let doctors: any[] = [];
  
  if (error || !hospitalData) {
    const mockHospital = MOCK_HOSPITALS.find(h => h.id === params.id);
    if (!mockHospital) {
      notFound();
    }
    
    // Transform mock hospital to match DB format
    hospital = {
      id: mockHospital.id,
      name: mockHospital.name,
      phone_number: mockHospital.phone,
      email: `info@${mockHospital.id}.com`,
      website_url: null,
      rating: mockHospital.rating,
      total_reviews: mockHospital.userRatingCount,
      operates_24x7: mockHospital.is24x7,
      total_beds: mockHospital.totalBeds,
      available_beds: Math.floor(mockHospital.totalBeds * 0.6),
      emergency_capacity: mockHospital.emergencyCapacity,
      current_emergency_occupancy: Math.floor(mockHospital.emergencyCapacity * 0.3),
      facilities: mockHospital.facilities,
      accreditations: ['NABH Accredited', 'ISO 9001:2015 Certified'],
      specialties: mockHospital.specialties,
      addresses: {
        street_address: mockHospital.address,
        city: mockHospital.city,
        state: mockHospital.state,
        postal_code: '000000',
        country: 'India',
      },
      departments: mockHospital.specialties.map((spec, idx) => ({
        id: `dept-${idx}`,
        name: spec,
        description: `Specialized ${spec} care`,
        floor_number: (idx % 5) + 1
      }))
    };
    
    // Get mock doctors
    const mockDoctors = getDoctorsByHospitalId(params.id);
    doctors = mockDoctors.map(doc => ({
      id: doc.id,
      doctors: {
        id: doc.id,
        specialization: doc.specialization,
        consultation_fee: doc.consultation_fee,
        years_of_experience: doc.years_of_experience,
        rating: doc.rating,
        users: {
          first_name: doc.first_name,
          last_name: doc.last_name
        }
      }
    }));
  } else {
    // Fetch doctors at this hospital from DB
    const { data: doctorsData } = await supabase
      .from("doctor_hospitals")
      .select(`
        *,
        doctors (
          *,
          users (first_name, last_name)
        )
      `)
      .eq("hospital_id", params.id)
      .eq("is_active", true);
    
    doctors = doctorsData || [];
    
    // If no doctors in DB, use mock doctors
    if (doctors.length === 0) {
      const mockDoctors = getDoctorsByHospitalId(params.id);
      doctors = mockDoctors.map(doc => ({
        id: doc.id,
        doctors: {
          id: doc.id,
          specialization: doc.specialization,
          consultation_fee: doc.consultation_fee,
          years_of_experience: doc.years_of_experience,
          rating: doc.rating,
          users: {
            first_name: doc.first_name,
            last_name: doc.last_name
          }
        }
      }));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <Link href="/hospitals">
            <Button variant="ghost" className="mb-4 text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hospitals
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold">{hospital.name}</h1>
              <div className="mt-2 flex items-center gap-2 text-blue-100">
                <MapPin className="h-4 w-4" />
                <span>
                  {hospital.addresses?.street_address}, {hospital.addresses?.city},{" "}
                  {hospital.addresses?.state} - {hospital.addresses?.postal_code}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="text-lg font-semibold">{hospital.rating.toFixed(1)}</span>
                  <span className="text-sm text-blue-100">
                    ({hospital.total_reviews} reviews)
                  </span>
                </div>
                {hospital.operates_24x7 && (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <Clock className="mr-1 h-3 w-3" />
                    24/7 Available
                  </Badge>
                )}
              </div>
            </div>

            <Link href={`/hospitals/${hospital.id}/book`}>
              <Button size="lg" variant="secondary">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Quick Stats */}
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-3">
                      <Bed className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Beds</p>
                      <p className="text-2xl font-bold">{hospital.total_beds}</p>
                      <p className="text-xs text-green-600">
                        {hospital.available_beds} available
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-red-100 p-3">
                      <Activity className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Emergency</p>
                      <p className="text-2xl font-bold">{hospital.emergency_capacity}</p>
                      <p className="text-xs text-green-600">
                        {hospital.emergency_capacity - hospital.current_emergency_occupancy} free
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-3">
                      <Building className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Departments</p>
                      <p className="text-2xl font-bold">{hospital.departments?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Departments */}
            {hospital.departments && hospital.departments.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Departments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {hospital.departments.map((dept: any) => (
                      <div key={dept.id} className="rounded-lg border p-4">
                        <h3 className="font-semibold">{dept.name}</h3>
                        {dept.description && (
                          <p className="mt-1 text-sm text-gray-600">{dept.description}</p>
                        )}
                        {dept.floor_number && (
                          <p className="mt-2 text-xs text-gray-500">Floor {dept.floor_number}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Doctors */}
            {doctors && doctors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Our Doctors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {doctors.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h3 className="font-semibold">
                            Dr. {item.doctors.users.first_name} {item.doctors.users.last_name}
                          </h3>
                          <p className="text-sm text-gray-600">{item.doctors.specialization}</p>
                          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                            <span>{item.doctors.years_of_experience} years exp.</span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {item.doctors.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-blue-600">
                            ₹{item.doctors.consultation_fee}
                          </p>
                          <Link href={`/hospitals/${hospital.id}/book?doctor=${item.doctors.id}`}>
                            <Button size="sm" className="mt-2">
                              Book
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a href={`tel:${hospital.phone_number}`} className="font-medium hover:text-blue-600">
                      {hospital.phone_number}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a href={`mailto:${hospital.email}`} className="font-medium hover:text-blue-600">
                      {hospital.email}
                    </a>
                  </div>
                </div>

                {hospital.website_url && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Website</p>
                      <a
                        href={hospital.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-blue-600"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Facilities */}
            {hospital.facilities && hospital.facilities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Facilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {hospital.facilities.map((facility: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Accreditations */}
            {hospital.accreditations && hospital.accreditations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Accreditations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {hospital.accreditations.map((acc: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm">{acc}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

