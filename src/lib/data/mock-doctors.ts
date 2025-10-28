/**
 * Mock Doctors Data for Development & Demo
 * Realistic doctor data mapped to mock hospitals
 */

export interface MockDoctor {
  id: string;
  hospital_id: string;
  first_name: string;
  last_name: string;
  specialization: string;
  qualification: string;
  years_of_experience: number;
  consultation_fee: number;
  rating: number;
  is_available_for_emergency: boolean;
  available_days: string[];
  available_time_start: string;
  available_time_end: string;
}

export const MOCK_DOCTORS: MockDoctor[] = [
  // AIIMS Delhi Doctors
  {
    id: 'doc-aiims-1',
    hospital_id: 'aiims-delhi',
    first_name: 'Rajesh',
    last_name: 'Kumar',
    specialization: 'Cardiology',
    qualification: 'MD, DM (Cardiology)',
    years_of_experience: 18,
    consultation_fee: 1500,
    rating: 4.8,
    is_available_for_emergency: true,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    available_time_start: '09:00',
    available_time_end: '17:00'
  },
  {
    id: 'doc-aiims-2',
    hospital_id: 'aiims-delhi',
    first_name: 'Priya',
    last_name: 'Sharma',
    specialization: 'Neurology',
    qualification: 'MD, DM (Neurology)',
    years_of_experience: 15,
    consultation_fee: 1800,
    rating: 4.9,
    is_available_for_emergency: true,
    available_days: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    available_time_start: '10:00',
    available_time_end: '18:00'
  },
  {
    id: 'doc-aiims-3',
    hospital_id: 'aiims-delhi',
    first_name: 'Anil',
    last_name: 'Verma',
    specialization: 'Orthopedics',
    qualification: 'MS (Orthopedics)',
    years_of_experience: 20,
    consultation_fee: 1200,
    rating: 4.7,
    is_available_for_emergency: false,
    available_days: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
    available_time_start: '09:00',
    available_time_end: '16:00'
  },

  // Apollo Hospitals Doctors
  {
    id: 'doc-apollo-delhi-1',
    hospital_id: 'apollo-delhi',
    first_name: 'Sunita',
    last_name: 'Reddy',
    specialization: 'Oncology',
    qualification: 'MD, DM (Medical Oncology)',
    years_of_experience: 16,
    consultation_fee: 2000,
    rating: 4.8,
    is_available_for_emergency: false,
    available_days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    available_time_start: '10:00',
    available_time_end: '17:00'
  },
  {
    id: 'doc-apollo-delhi-2',
    hospital_id: 'apollo-delhi',
    first_name: 'Vikram',
    last_name: 'Singh',
    specialization: 'Cardiology',
    qualification: 'MD, DM (Cardiology)',
    years_of_experience: 22,
    consultation_fee: 2500,
    rating: 4.9,
    is_available_for_emergency: true,
    available_days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    available_time_start: '09:00',
    available_time_end: '18:00'
  },

  // Fortis Escorts Doctors
  {
    id: 'doc-fortis-delhi-1',
    hospital_id: 'fortis-escorts-delhi',
    first_name: 'Meera',
    last_name: 'Patel',
    specialization: 'Cardiology',
    qualification: 'MD, DM (Cardiology)',
    years_of_experience: 14,
    consultation_fee: 1800,
    rating: 4.7,
    is_available_for_emergency: true,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    available_time_start: '09:00',
    available_time_end: '17:00'
  },
  {
    id: 'doc-fortis-delhi-2',
    hospital_id: 'fortis-escorts-delhi',
    first_name: 'Arjun',
    last_name: 'Mehta',
    specialization: 'Cardiac Surgery',
    qualification: 'MCh (Cardiothoracic Surgery)',
    years_of_experience: 19,
    consultation_fee: 2200,
    rating: 4.8,
    is_available_for_emergency: true,
    available_days: ['Tuesday', 'Thursday', 'Saturday'],
    available_time_start: '10:00',
    available_time_end: '16:00'
  },

  // Max Saket Doctors
  {
    id: 'doc-max-saket-1',
    hospital_id: 'max-saket',
    first_name: 'Kavita',
    last_name: 'Desai',
    specialization: 'Oncology',
    qualification: 'MD, DM (Medical Oncology)',
    years_of_experience: 17,
    consultation_fee: 2000,
    rating: 4.8,
    is_available_for_emergency: false,
    available_days: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    available_time_start: '09:00',
    available_time_end: '17:00'
  },
  {
    id: 'doc-max-saket-2',
    hospital_id: 'max-saket',
    first_name: 'Rohan',
    last_name: 'Kapoor',
    specialization: 'Neurology',
    qualification: 'MD, DM (Neurology)',
    years_of_experience: 13,
    consultation_fee: 1600,
    rating: 4.6,
    is_available_for_emergency: true,
    available_days: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
    available_time_start: '10:00',
    available_time_end: '18:00'
  },

  // Mumbai Hospitals - Kokilaben
  {
    id: 'doc-kokilaben-1',
    hospital_id: 'kokilaben-mumbai',
    first_name: 'Deepak',
    last_name: 'Joshi',
    specialization: 'Cardiology',
    qualification: 'MD, DM (Cardiology)',
    years_of_experience: 21,
    consultation_fee: 2500,
    rating: 4.9,
    is_available_for_emergency: true,
    available_days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    available_time_start: '09:00',
    available_time_end: '17:00'
  },
  {
    id: 'doc-kokilaben-2',
    hospital_id: 'kokilaben-mumbai',
    first_name: 'Anjali',
    last_name: 'Nair',
    specialization: 'Oncology',
    qualification: 'MD, DM (Medical Oncology)',
    years_of_experience: 18,
    consultation_fee: 2800,
    rating: 4.8,
    is_available_for_emergency: false,
    available_days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    available_time_start: '10:00',
    available_time_end: '18:00'
  },

  // Bangalore Hospitals - Manipal
  {
    id: 'doc-manipal-1',
    hospital_id: 'manipal-bangalore',
    first_name: 'Suresh',
    last_name: 'Rao',
    specialization: 'Neurology',
    qualification: 'MD, DM (Neurology)',
    years_of_experience: 16,
    consultation_fee: 1800,
    rating: 4.7,
    is_available_for_emergency: true,
    available_days: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    available_time_start: '09:00',
    available_time_end: '17:00'
  },
  {
    id: 'doc-manipal-2',
    hospital_id: 'manipal-bangalore',
    first_name: 'Lakshmi',
    last_name: 'Iyer',
    specialization: 'Orthopedics',
    qualification: 'MS (Orthopedics)',
    years_of_experience: 14,
    consultation_fee: 1500,
    rating: 4.6,
    is_available_for_emergency: false,
    available_days: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
    available_time_start: '10:00',
    available_time_end: '16:00'
  },

  // Narayana Health
  {
    id: 'doc-narayana-1',
    hospital_id: 'narayana-health-bangalore',
    first_name: 'Devi',
    last_name: 'Shetty',
    specialization: 'Cardiac Surgery',
    qualification: 'MCh (Cardiothoracic Surgery)',
    years_of_experience: 25,
    consultation_fee: 3000,
    rating: 4.9,
    is_available_for_emergency: true,
    available_days: ['Monday', 'Wednesday', 'Friday'],
    available_time_start: '09:00',
    available_time_end: '15:00'
  },
  {
    id: 'doc-narayana-2',
    hospital_id: 'narayana-health-bangalore',
    first_name: 'Ramesh',
    last_name: 'Kumar',
    specialization: 'Cardiology',
    qualification: 'MD, DM (Cardiology)',
    years_of_experience: 19,
    consultation_fee: 2000,
    rating: 4.8,
    is_available_for_emergency: true,
    available_days: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
    available_time_start: '10:00',
    available_time_end: '18:00'
  },

  // Add doctors for remaining hospitals
  {
    id: 'doc-apollo-chennai-1',
    hospital_id: 'apollo-chennai',
    first_name: 'Karthik',
    last_name: 'Subramanian',
    specialization: 'Cardiology',
    qualification: 'MD, DM (Cardiology)',
    years_of_experience: 20,
    consultation_fee: 2200,
    rating: 4.8,
    is_available_for_emergency: true,
    available_days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    available_time_start: '09:00',
    available_time_end: '17:00'
  },
  {
    id: 'doc-apollo-chennai-2',
    hospital_id: 'apollo-chennai',
    first_name: 'Divya',
    last_name: 'Krishnan',
    specialization: 'Oncology',
    qualification: 'MD, DM (Medical Oncology)',
    years_of_experience: 15,
    consultation_fee: 2000,
    rating: 4.7,
    is_available_for_emergency: false,
    available_days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    available_time_start: '10:00',
    available_time_end: '17:00'
  },

  // More doctors for better coverage
  {
    id: 'doc-generic-1',
    hospital_id: 'fortis-bangalore',
    first_name: 'Amit',
    last_name: 'Sharma',
    specialization: 'General Medicine',
    qualification: 'MBBS, MD (Medicine)',
    years_of_experience: 12,
    consultation_fee: 800,
    rating: 4.5,
    is_available_for_emergency: true,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    available_time_start: '09:00',
    available_time_end: '17:30'
  },
  {
    id: 'doc-generic-2',
    hospital_id: 'apollo-bangalore',
    first_name: 'Neha',
    last_name: 'Gupta',
    specialization: 'General Medicine',
    qualification: 'MBBS, MD (Medicine)',
    years_of_experience: 10,
    consultation_fee: 700,
    rating: 4.4,
    is_available_for_emergency: true,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    available_time_start: '09:00',
    available_time_end: '18:00'
  }
];

/**
 * Generate generic doctors for a hospital
 * Used when no specific doctors are defined
 */
function generateGenericDoctors(hospitalId: string): MockDoctor[] {
  const specialties = [
    { name: 'General Medicine', qualification: 'MBBS, MD (Medicine)', fee: 500 },
    { name: 'Cardiology', qualification: 'MD, DM (Cardiology)', fee: 1200 },
    { name: 'Orthopedics', qualification: 'MS (Orthopedics)', fee: 1000 },
    { name: 'Pediatrics', qualification: 'MD (Pediatrics)', fee: 800 },
    { name: 'Dermatology', qualification: 'MD (Dermatology)', fee: 900 }
  ];

  const firstNames = ['Amit', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Anjali', 'Rajesh', 'Kavita'];
  const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Gupta', 'Verma', 'Desai'];

  return specialties.map((specialty, index) => ({
    id: `doc-${hospitalId}-gen-${index + 1}`,
    hospital_id: hospitalId,
    first_name: firstNames[index % firstNames.length],
    last_name: lastNames[index % lastNames.length],
    specialization: specialty.name,
    qualification: specialty.qualification,
    years_of_experience: 8 + index * 2,
    consultation_fee: specialty.fee,
    rating: 4.3 + (index * 0.1),
    is_available_for_emergency: index < 3, // First 3 are available for emergency
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    available_time_start: '09:00',
    available_time_end: '17:00'
  }));
}

/**
 * Get doctors by hospital ID
 * Returns specific doctors if available, otherwise generates generic ones
 */
export function getDoctorsByHospitalId(hospitalId: string): MockDoctor[] {
  const specificDoctors = MOCK_DOCTORS.filter(doc => doc.hospital_id === hospitalId);
  
  // If we have specific doctors for this hospital, return them
  if (specificDoctors.length > 0) {
    return specificDoctors;
  }
  
  // Otherwise, generate generic doctors
  console.log(`Generating generic doctors for hospital: ${hospitalId}`);
  return generateGenericDoctors(hospitalId);
}

/**
 * Get doctor by ID
 */
export function getDoctorById(doctorId: string): MockDoctor | undefined {
  return MOCK_DOCTORS.find(doc => doc.id === doctorId);
}

/**
 * Get available time slots for a doctor on a given date
 */
export function getAvailableTimeSlots(doctor: MockDoctor, date: Date): string[] {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  
  if (!doctor.available_days.includes(dayName)) {
    return [];
  }

  const slots: string[] = [];
  const [startHour, startMin] = doctor.available_time_start.split(':').map(Number);
  const [endHour, endMin] = doctor.available_time_end.split(':').map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    slots.push(`${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`);
    
    // 30-minute slots
    currentMin += 30;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour += 1;
    }
  }

  return slots;
}

