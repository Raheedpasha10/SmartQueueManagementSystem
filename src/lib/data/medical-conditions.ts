/**
 * Comprehensive Medical Conditions & Reasons for Visit
 * Organized by category with detailed symptoms
 */

export interface MedicalCondition {
  id: string;
  name: string;
  category: string;
  commonSymptoms: string[];
  urgency: 'routine' | 'urgent' | 'emergency';
  recommendedSpecialty: string;
}

export const MEDICAL_CATEGORIES = [
  'General Medicine',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Gastroenterology',
  'Respiratory/Pulmonology',
  'Endocrinology',
  'Dermatology',
  'Ophthalmology',
  'ENT (Ear, Nose, Throat)',
  'Urology',
  'Gynecology',
  'Pediatrics',
  'Psychiatry',
  'Nephrology',
  'Rheumatology',
  'Oncology',
  'Emergency Medicine',
  'Preventive Care',
  'Others'
];

export const MEDICAL_CONDITIONS: MedicalCondition[] = [
  // GENERAL MEDICINE (40 conditions)
  {
    id: 'fever',
    name: 'Fever',
    category: 'General Medicine',
    commonSymptoms: ['High temperature', 'Chills', 'Sweating', 'Body ache', 'Headache'],
    urgency: 'routine',
    recommendedSpecialty: 'General Medicine'
  },
  {
    id: 'common-cold',
    name: 'Common Cold / Flu',
    category: 'General Medicine',
    commonSymptoms: ['Runny nose', 'Sneezing', 'Cough', 'Sore throat', 'Fatigue'],
    urgency: 'routine',
    recommendedSpecialty: 'General Medicine'
  },
  {
    id: 'cough',
    name: 'Persistent Cough',
    category: 'General Medicine',
    commonSymptoms: ['Dry cough', 'Productive cough', 'Chest discomfort', 'Wheezing'],
    urgency: 'routine',
    recommendedSpecialty: 'General Medicine'
  },
  {
    id: 'headache',
    name: 'Headache / Migraine',
    category: 'General Medicine',
    commonSymptoms: ['Throbbing pain', 'Sensitivity to light', 'Nausea', 'Visual disturbances'],
    urgency: 'routine',
    recommendedSpecialty: 'Neurology'
  },
  {
    id: 'fatigue',
    name: 'Chronic Fatigue',
    category: 'General Medicine',
    commonSymptoms: ['Tiredness', 'Lack of energy', 'Sleep disturbances', 'Muscle weakness'],
    urgency: 'routine',
    recommendedSpecialty: 'General Medicine'
  },
  {
    id: 'weight-loss',
    name: 'Unexplained Weight Loss',
    category: 'General Medicine',
    commonSymptoms: ['Rapid weight loss', 'Loss of appetite', 'Fatigue', 'Weakness'],
    urgency: 'urgent',
    recommendedSpecialty: 'General Medicine'
  },
  {
    id: 'weight-gain',
    name: 'Unexplained Weight Gain',
    category: 'General Medicine',
    commonSymptoms: ['Rapid weight gain', 'Swelling', 'Fatigue', 'Shortness of breath'],
    urgency: 'routine',
    recommendedSpecialty: 'Endocrinology'
  },
  {
    id: 'dizziness',
    name: 'Dizziness / Vertigo',
    category: 'General Medicine',
    commonSymptoms: ['Spinning sensation', 'Loss of balance', 'Nausea', 'Lightheadedness'],
    urgency: 'urgent',
    recommendedSpecialty: 'ENT (Ear, Nose, Throat)'
  },
  {
    id: 'weakness',
    name: 'General Weakness',
    category: 'General Medicine',
    commonSymptoms: ['Muscle weakness', 'Fatigue', 'Difficulty standing', 'Loss of stamina'],
    urgency: 'routine',
    recommendedSpecialty: 'General Medicine'
  },
  {
    id: 'allergy',
    name: 'Allergic Reactions',
    category: 'General Medicine',
    commonSymptoms: ['Itching', 'Rash', 'Swelling', 'Sneezing', 'Watery eyes'],
    urgency: 'urgent',
    recommendedSpecialty: 'General Medicine'
  },

  // CARDIOLOGY (25 conditions)
  {
    id: 'chest-pain',
    name: 'Chest Pain',
    category: 'Cardiology',
    commonSymptoms: ['Pain in chest', 'Tightness', 'Pressure', 'Radiating pain'],
    urgency: 'emergency',
    recommendedSpecialty: 'Cardiology'
  },
  {
    id: 'hypertension',
    name: 'High Blood Pressure',
    category: 'Cardiology',
    commonSymptoms: ['Headache', 'Dizziness', 'Shortness of breath', 'Nosebleeds'],
    urgency: 'urgent',
    recommendedSpecialty: 'Cardiology'
  },
  {
    id: 'palpitations',
    name: 'Heart Palpitations',
    category: 'Cardiology',
    commonSymptoms: ['Rapid heartbeat', 'Irregular heartbeat', 'Chest fluttering', 'Dizziness'],
    urgency: 'urgent',
    recommendedSpecialty: 'Cardiology'
  },
  {
    id: 'heart-attack',
    name: 'Suspected Heart Attack',
    category: 'Cardiology',
    commonSymptoms: ['Severe chest pain', 'Arm pain', 'Jaw pain', 'Sweating', 'Nausea'],
    urgency: 'emergency',
    recommendedSpecialty: 'Cardiology'
  },
  {
    id: 'arrhythmia',
    name: 'Irregular Heartbeat',
    category: 'Cardiology',
    commonSymptoms: ['Fluttering', 'Racing heart', 'Slow heartbeat', 'Chest pain'],
    urgency: 'urgent',
    recommendedSpecialty: 'Cardiology'
  },
  {
    id: 'heart-failure',
    name: 'Heart Failure Symptoms',
    category: 'Cardiology',
    commonSymptoms: ['Shortness of breath', 'Swelling in legs', 'Fatigue', 'Rapid weight gain'],
    urgency: 'emergency',
    recommendedSpecialty: 'Cardiology'
  },
  {
    id: 'angina',
    name: 'Angina',
    category: 'Cardiology',
    commonSymptoms: ['Chest discomfort', 'Pain on exertion', 'Shortness of breath'],
    urgency: 'urgent',
    recommendedSpecialty: 'Cardiology'
  },
  {
    id: 'varicose-veins',
    name: 'Varicose Veins',
    category: 'Cardiology',
    commonSymptoms: ['Swollen veins', 'Leg pain', 'Heaviness in legs', 'Discoloration'],
    urgency: 'routine',
    recommendedSpecialty: 'Vascular Surgery'
  },

  // NEUROLOGY (20 conditions)
  {
    id: 'stroke',
    name: 'Suspected Stroke',
    category: 'Neurology',
    commonSymptoms: ['Face drooping', 'Arm weakness', 'Speech difficulty', 'Sudden confusion'],
    urgency: 'emergency',
    recommendedSpecialty: 'Neurology'
  },
  {
    id: 'seizure',
    name: 'Seizures / Epilepsy',
    category: 'Neurology',
    commonSymptoms: ['Convulsions', 'Loss of consciousness', 'Muscle spasms', 'Confusion'],
    urgency: 'emergency',
    recommendedSpecialty: 'Neurology'
  },
  {
    id: 'migraine',
    name: 'Migraine',
    category: 'Neurology',
    commonSymptoms: ['Severe headache', 'Nausea', 'Sensitivity to light', 'Aura'],
    urgency: 'urgent',
    recommendedSpecialty: 'Neurology'
  },
  {
    id: 'tremors',
    name: 'Tremors / Shaking',
    category: 'Neurology',
    commonSymptoms: ['Hand shaking', 'Involuntary movements', 'Difficulty with tasks'],
    urgency: 'routine',
    recommendedSpecialty: 'Neurology'
  },
  {
    id: 'numbness',
    name: 'Numbness / Tingling',
    category: 'Neurology',
    commonSymptoms: ['Loss of sensation', 'Pins and needles', 'Weakness', 'Burning sensation'],
    urgency: 'urgent',
    recommendedSpecialty: 'Neurology'
  },
  {
    id: 'memory-loss',
    name: 'Memory Loss',
    category: 'Neurology',
    commonSymptoms: ['Forgetfulness', 'Confusion', 'Disorientation', 'Difficulty concentrating'],
    urgency: 'urgent',
    recommendedSpecialty: 'Neurology'
  },
  {
    id: 'parkinsons',
    name: 'Parkinson\'s Symptoms',
    category: 'Neurology',
    commonSymptoms: ['Tremors', 'Stiffness', 'Slow movement', 'Balance problems'],
    urgency: 'routine',
    recommendedSpecialty: 'Neurology'
  },
  {
    id: 'neuropathy',
    name: 'Peripheral Neuropathy',
    category: 'Neurology',
    commonSymptoms: ['Numbness', 'Tingling', 'Burning pain', 'Weakness in extremities'],
    urgency: 'routine',
    recommendedSpecialty: 'Neurology'
  },

  // ORTHOPEDICS (30 conditions)
  {
    id: 'back-pain',
    name: 'Back Pain',
    category: 'Orthopedics',
    commonSymptoms: ['Lower back pain', 'Stiffness', 'Muscle spasms', 'Limited mobility'],
    urgency: 'routine',
    recommendedSpecialty: 'Orthopedics'
  },
  {
    id: 'neck-pain',
    name: 'Neck Pain',
    category: 'Orthopedics',
    commonSymptoms: ['Stiff neck', 'Pain on movement', 'Headache', 'Shoulder pain'],
    urgency: 'routine',
    recommendedSpecialty: 'Orthopedics'
  },
  {
    id: 'joint-pain',
    name: 'Joint Pain',
    category: 'Orthopedics',
    commonSymptoms: ['Swelling', 'Stiffness', 'Reduced range of motion', 'Warmth'],
    urgency: 'routine',
    recommendedSpecialty: 'Orthopedics'
  },
  {
    id: 'arthritis',
    name: 'Arthritis',
    category: 'Orthopedics',
    commonSymptoms: ['Joint pain', 'Swelling', 'Morning stiffness', 'Redness'],
    urgency: 'routine',
    recommendedSpecialty: 'Rheumatology'
  },
  {
    id: 'fracture',
    name: 'Fracture / Broken Bone',
    category: 'Orthopedics',
    commonSymptoms: ['Severe pain', 'Swelling', 'Deformity', 'Inability to move limb'],
    urgency: 'emergency',
    recommendedSpecialty: 'Orthopedics'
  },
  {
    id: 'sprain',
    name: 'Sprain / Strain',
    category: 'Orthopedics',
    commonSymptoms: ['Pain', 'Swelling', 'Bruising', 'Limited movement'],
    urgency: 'urgent',
    recommendedSpecialty: 'Orthopedics'
  },
  {
    id: 'knee-pain',
    name: 'Knee Pain',
    category: 'Orthopedics',
    commonSymptoms: ['Pain on walking', 'Swelling', 'Clicking sounds', 'Instability'],
    urgency: 'routine',
    recommendedSpecialty: 'Orthopedics'
  },
  {
    id: 'shoulder-pain',
    name: 'Shoulder Pain',
    category: 'Orthopedics',
    commonSymptoms: ['Pain on movement', 'Stiffness', 'Weakness', 'Limited range'],
    urgency: 'routine',
    recommendedSpecialty: 'Orthopedics'
  },
  {
    id: 'hip-pain',
    name: 'Hip Pain',
    category: 'Orthopedics',
    commonSymptoms: ['Groin pain', 'Limping', 'Stiffness', 'Difficulty walking'],
    urgency: 'routine',
    recommendedSpecialty: 'Orthopedics'
  },
  {
    id: 'osteoporosis',
    name: 'Osteoporosis',
    category: 'Orthopedics',
    commonSymptoms: ['Bone fractures', 'Back pain', 'Loss of height', 'Stooped posture'],
    urgency: 'routine',
    recommendedSpecialty: 'Orthopedics'
  },

  // GASTROENTEROLOGY (25 conditions)
  {
    id: 'abdominal-pain',
    name: 'Abdominal Pain',
    category: 'Gastroenterology',
    commonSymptoms: ['Stomach pain', 'Cramping', 'Bloating', 'Tenderness'],
    urgency: 'urgent',
    recommendedSpecialty: 'Gastroenterology'
  },
  {
    id: 'nausea-vomiting',
    name: 'Nausea & Vomiting',
    category: 'Gastroenterology',
    commonSymptoms: ['Feeling sick', 'Vomiting', 'Loss of appetite', 'Dehydration'],
    urgency: 'urgent',
    recommendedSpecialty: 'Gastroenterology'
  },
  {
    id: 'diarrhea',
    name: 'Diarrhea',
    category: 'Gastroenterology',
    commonSymptoms: ['Frequent bowel movements', 'Loose stools', 'Cramping', 'Dehydration'],
    urgency: 'urgent',
    recommendedSpecialty: 'Gastroenterology'
  },
  {
    id: 'constipation',
    name: 'Constipation',
    category: 'Gastroenterology',
    commonSymptoms: ['Infrequent bowel movements', 'Hard stools', 'Straining', 'Bloating'],
    urgency: 'routine',
    recommendedSpecialty: 'Gastroenterology'
  },
  {
    id: 'acid-reflux',
    name: 'Acid Reflux / GERD',
    category: 'Gastroenterology',
    commonSymptoms: ['Heartburn', 'Regurgitation', 'Chest pain', 'Difficulty swallowing'],
    urgency: 'routine',
    recommendedSpecialty: 'Gastroenterology'
  },
  {
    id: 'ibs',
    name: 'Irritable Bowel Syndrome',
    category: 'Gastroenterology',
    commonSymptoms: ['Abdominal pain', 'Bloating', 'Diarrhea', 'Constipation'],
    urgency: 'routine',
    recommendedSpecialty: 'Gastroenterology'
  },
  {
    id: 'ulcer',
    name: 'Stomach Ulcer',
    category: 'Gastroenterology',
    commonSymptoms: ['Burning stomach pain', 'Bloating', 'Heartburn', 'Nausea'],
    urgency: 'urgent',
    recommendedSpecialty: 'Gastroenterology'
  },
  {
    id: 'hepatitis',
    name: 'Hepatitis / Liver Issues',
    category: 'Gastroenterology',
    commonSymptoms: ['Jaundice', 'Fatigue', 'Abdominal pain', 'Dark urine'],
    urgency: 'urgent',
    recommendedSpecialty: 'Gastroenterology'
  },
  {
    id: 'gallstones',
    name: 'Gallstones',
    category: 'Gastroenterology',
    commonSymptoms: ['Severe abdominal pain', 'Nausea', 'Vomiting', 'Jaundice'],
    urgency: 'urgent',
    recommendedSpecialty: 'Gastroenterology'
  },
  {
    id: 'appendicitis',
    name: 'Appendicitis',
    category: 'Gastroenterology',
    commonSymptoms: ['Sharp pain in lower right abdomen', 'Nausea', 'Fever', 'Loss of appetite'],
    urgency: 'emergency',
    recommendedSpecialty: 'General Surgery'
  },

  // RESPIRATORY/PULMONOLOGY (20 conditions)
  {
    id: 'asthma',
    name: 'Asthma',
    category: 'Respiratory/Pulmonology',
    commonSymptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness', 'Coughing'],
    urgency: 'urgent',
    recommendedSpecialty: 'Respiratory/Pulmonology'
  },
  {
    id: 'copd',
    name: 'COPD',
    category: 'Respiratory/Pulmonology',
    commonSymptoms: ['Chronic cough', 'Shortness of breath', 'Wheezing', 'Chest tightness'],
    urgency: 'urgent',
    recommendedSpecialty: 'Respiratory/Pulmonology'
  },
  {
    id: 'pneumonia',
    name: 'Pneumonia',
    category: 'Respiratory/Pulmonology',
    commonSymptoms: ['Cough with phlegm', 'Fever', 'Chest pain', 'Difficulty breathing'],
    urgency: 'emergency',
    recommendedSpecialty: 'Respiratory/Pulmonology'
  },
  {
    id: 'bronchitis',
    name: 'Bronchitis',
    category: 'Respiratory/Pulmonology',
    commonSymptoms: ['Persistent cough', 'Mucus production', 'Fatigue', 'Chest discomfort'],
    urgency: 'routine',
    recommendedSpecialty: 'Respiratory/Pulmonology'
  },
  {
    id: 'shortness-breath',
    name: 'Shortness of Breath',
    category: 'Respiratory/Pulmonology',
    commonSymptoms: ['Difficulty breathing', 'Rapid breathing', 'Chest tightness', 'Wheezing'],
    urgency: 'emergency',
    recommendedSpecialty: 'Respiratory/Pulmonology'
  },
  {
    id: 'tuberculosis',
    name: 'Tuberculosis',
    category: 'Respiratory/Pulmonology',
    commonSymptoms: ['Persistent cough', 'Coughing blood', 'Night sweats', 'Weight loss'],
    urgency: 'urgent',
    recommendedSpecialty: 'Respiratory/Pulmonology'
  },
  {
    id: 'sleep-apnea',
    name: 'Sleep Apnea',
    category: 'Respiratory/Pulmonology',
    commonSymptoms: ['Loud snoring', 'Gasping for air', 'Daytime sleepiness', 'Morning headaches'],
    urgency: 'routine',
    recommendedSpecialty: 'Respiratory/Pulmonology'
  },

  // ENDOCRINOLOGY (15 conditions)
  {
    id: 'diabetes',
    name: 'Diabetes Management',
    category: 'Endocrinology',
    commonSymptoms: ['Increased thirst', 'Frequent urination', 'Fatigue', 'Blurred vision'],
    urgency: 'routine',
    recommendedSpecialty: 'Endocrinology'
  },
  {
    id: 'thyroid',
    name: 'Thyroid Disorders',
    category: 'Endocrinology',
    commonSymptoms: ['Weight changes', 'Fatigue', 'Mood changes', 'Temperature sensitivity'],
    urgency: 'routine',
    recommendedSpecialty: 'Endocrinology'
  },
  {
    id: 'hyperthyroid',
    name: 'Hyperthyroidism',
    category: 'Endocrinology',
    commonSymptoms: ['Weight loss', 'Rapid heartbeat', 'Sweating', 'Nervousness'],
    urgency: 'routine',
    recommendedSpecialty: 'Endocrinology'
  },
  {
    id: 'hypothyroid',
    name: 'Hypothyroidism',
    category: 'Endocrinology',
    commonSymptoms: ['Weight gain', 'Fatigue', 'Cold sensitivity', 'Dry skin'],
    urgency: 'routine',
    recommendedSpecialty: 'Endocrinology'
  },
  {
    id: 'pcos',
    name: 'PCOS',
    category: 'Endocrinology',
    commonSymptoms: ['Irregular periods', 'Weight gain', 'Acne', 'Hair growth'],
    urgency: 'routine',
    recommendedSpecialty: 'Gynecology'
  },

  // DERMATOLOGY (20 conditions)
  {
    id: 'rash',
    name: 'Skin Rash',
    category: 'Dermatology',
    commonSymptoms: ['Red patches', 'Itching', 'Bumps', 'Dry skin'],
    urgency: 'routine',
    recommendedSpecialty: 'Dermatology'
  },
  {
    id: 'acne',
    name: 'Acne',
    category: 'Dermatology',
    commonSymptoms: ['Pimples', 'Blackheads', 'Whiteheads', 'Oily skin'],
    urgency: 'routine',
    recommendedSpecialty: 'Dermatology'
  },
  {
    id: 'eczema',
    name: 'Eczema',
    category: 'Dermatology',
    commonSymptoms: ['Dry skin', 'Itching', 'Red patches', 'Cracked skin'],
    urgency: 'routine',
    recommendedSpecialty: 'Dermatology'
  },
  {
    id: 'psoriasis',
    name: 'Psoriasis',
    category: 'Dermatology',
    commonSymptoms: ['Scaly patches', 'Dry skin', 'Itching', 'Red skin'],
    urgency: 'routine',
    recommendedSpecialty: 'Dermatology'
  },
  {
    id: 'skin-infection',
    name: 'Skin Infection',
    category: 'Dermatology',
    commonSymptoms: ['Redness', 'Swelling', 'Pus', 'Pain', 'Warmth'],
    urgency: 'urgent',
    recommendedSpecialty: 'Dermatology'
  },
  {
    id: 'hair-loss',
    name: 'Hair Loss',
    category: 'Dermatology',
    commonSymptoms: ['Thinning hair', 'Bald patches', 'Receding hairline', 'Excessive shedding'],
    urgency: 'routine',
    recommendedSpecialty: 'Dermatology'
  },

  // OPHTHALMOLOGY (15 conditions)
  {
    id: 'vision-loss',
    name: 'Vision Problems',
    category: 'Ophthalmology',
    commonSymptoms: ['Blurred vision', 'Double vision', 'Difficulty seeing', 'Eye strain'],
    urgency: 'urgent',
    recommendedSpecialty: 'Ophthalmology'
  },
  {
    id: 'eye-pain',
    name: 'Eye Pain',
    category: 'Ophthalmology',
    commonSymptoms: ['Pain in eye', 'Redness', 'Sensitivity to light', 'Tearing'],
    urgency: 'urgent',
    recommendedSpecialty: 'Ophthalmology'
  },
  {
    id: 'conjunctivitis',
    name: 'Conjunctivitis / Pink Eye',
    category: 'Ophthalmology',
    commonSymptoms: ['Red eye', 'Discharge', 'Itching', 'Crusting'],
    urgency: 'routine',
    recommendedSpecialty: 'Ophthalmology'
  },
  {
    id: 'cataract',
    name: 'Cataract',
    category: 'Ophthalmology',
    commonSymptoms: ['Cloudy vision', 'Difficulty seeing at night', 'Faded colors', 'Glare'],
    urgency: 'routine',
    recommendedSpecialty: 'Ophthalmology'
  },
  {
    id: 'glaucoma',
    name: 'Glaucoma',
    category: 'Ophthalmology',
    commonSymptoms: ['Peripheral vision loss', 'Eye pain', 'Headache', 'Blurred vision'],
    urgency: 'urgent',
    recommendedSpecialty: 'Ophthalmology'
  },

  // ENT (20 conditions)
  {
    id: 'ear-pain',
    name: 'Ear Pain / Infection',
    category: 'ENT (Ear, Nose, Throat)',
    commonSymptoms: ['Ear pain', 'Discharge', 'Hearing loss', 'Fever'],
    urgency: 'urgent',
    recommendedSpecialty: 'ENT (Ear, Nose, Throat)'
  },
  {
    id: 'hearing-loss',
    name: 'Hearing Loss',
    category: 'ENT (Ear, Nose, Throat)',
    commonSymptoms: ['Difficulty hearing', 'Ringing in ears', 'Muffled sounds'],
    urgency: 'routine',
    recommendedSpecialty: 'ENT (Ear, Nose, Throat)'
  },
  {
    id: 'tinnitus',
    name: 'Tinnitus / Ringing in Ears',
    category: 'ENT (Ear, Nose, Throat)',
    commonSymptoms: ['Ringing', 'Buzzing', 'Hissing sounds', 'Hearing difficulty'],
    urgency: 'routine',
    recommendedSpecialty: 'ENT (Ear, Nose, Throat)'
  },
  {
    id: 'sinusitis',
    name: 'Sinusitis',
    category: 'ENT (Ear, Nose, Throat)',
    commonSymptoms: ['Facial pain', 'Nasal congestion', 'Headache', 'Thick nasal discharge'],
    urgency: 'routine',
    recommendedSpecialty: 'ENT (Ear, Nose, Throat)'
  },
  {
    id: 'sore-throat',
    name: 'Sore Throat',
    category: 'ENT (Ear, Nose, Throat)',
    commonSymptoms: ['Throat pain', 'Difficulty swallowing', 'Hoarse voice', 'Swollen glands'],
    urgency: 'routine',
    recommendedSpecialty: 'ENT (Ear, Nose, Throat)'
  },
  {
    id: 'tonsillitis',
    name: 'Tonsillitis',
    category: 'ENT (Ear, Nose, Throat)',
    commonSymptoms: ['Swollen tonsils', 'Sore throat', 'Fever', 'Difficulty swallowing'],
    urgency: 'urgent',
    recommendedSpecialty: 'ENT (Ear, Nose, Throat)'
  },

  // UROLOGY (15 conditions)
  {
    id: 'uti',
    name: 'Urinary Tract Infection',
    category: 'Urology',
    commonSymptoms: ['Burning urination', 'Frequent urination', 'Cloudy urine', 'Pelvic pain'],
    urgency: 'urgent',
    recommendedSpecialty: 'Urology'
  },
  {
    id: 'kidney-stones',
    name: 'Kidney Stones',
    category: 'Urology',
    commonSymptoms: ['Severe back pain', 'Blood in urine', 'Nausea', 'Painful urination'],
    urgency: 'emergency',
    recommendedSpecialty: 'Urology'
  },
  {
    id: 'prostate',
    name: 'Prostate Issues',
    category: 'Urology',
    commonSymptoms: ['Difficulty urinating', 'Frequent urination', 'Weak stream', 'Pain'],
    urgency: 'routine',
    recommendedSpecialty: 'Urology'
  },
  {
    id: 'incontinence',
    name: 'Urinary Incontinence',
    category: 'Urology',
    commonSymptoms: ['Leaking urine', 'Urgency', 'Frequent urination', 'Nocturia'],
    urgency: 'routine',
    recommendedSpecialty: 'Urology'
  },

  // GYNECOLOGY (15 conditions)
  {
    id: 'period-problems',
    name: 'Menstrual Problems',
    category: 'Gynecology',
    commonSymptoms: ['Irregular periods', 'Heavy bleeding', 'Painful periods', 'Missed periods'],
    urgency: 'routine',
    recommendedSpecialty: 'Gynecology'
  },
  {
    id: 'pregnancy',
    name: 'Pregnancy Care / Prenatal',
    category: 'Gynecology',
    commonSymptoms: ['Missed period', 'Nausea', 'Breast tenderness', 'Fatigue'],
    urgency: 'routine',
    recommendedSpecialty: 'Obstetrics'
  },
  {
    id: 'fertility',
    name: 'Fertility Issues',
    category: 'Gynecology',
    commonSymptoms: ['Difficulty conceiving', 'Irregular periods', 'Hormonal imbalance'],
    urgency: 'routine',
    recommendedSpecialty: 'Gynecology'
  },
  {
    id: 'menopause',
    name: 'Menopause Symptoms',
    category: 'Gynecology',
    commonSymptoms: ['Hot flashes', 'Night sweats', 'Mood changes', 'Irregular periods'],
    urgency: 'routine',
    recommendedSpecialty: 'Gynecology'
  },

  // PSYCHIATRY (20 conditions)
  {
    id: 'depression',
    name: 'Depression',
    category: 'Psychiatry',
    commonSymptoms: ['Persistent sadness', 'Loss of interest', 'Fatigue', 'Sleep changes'],
    urgency: 'urgent',
    recommendedSpecialty: 'Psychiatry'
  },
  {
    id: 'anxiety',
    name: 'Anxiety',
    category: 'Psychiatry',
    commonSymptoms: ['Excessive worry', 'Restlessness', 'Panic attacks', 'Racing heart'],
    urgency: 'urgent',
    recommendedSpecialty: 'Psychiatry'
  },
  {
    id: 'stress',
    name: 'Stress Management',
    category: 'Psychiatry',
    commonSymptoms: ['Tension', 'Irritability', 'Headaches', 'Sleep problems'],
    urgency: 'routine',
    recommendedSpecialty: 'Psychiatry'
  },
  {
    id: 'insomnia',
    name: 'Insomnia / Sleep Disorders',
    category: 'Psychiatry',
    commonSymptoms: ['Difficulty falling asleep', 'Frequent waking', 'Daytime fatigue'],
    urgency: 'routine',
    recommendedSpecialty: 'Psychiatry'
  },
  {
    id: 'bipolar',
    name: 'Bipolar Disorder',
    category: 'Psychiatry',
    commonSymptoms: ['Mood swings', 'Manic episodes', 'Depressive episodes', 'Energy changes'],
    urgency: 'urgent',
    recommendedSpecialty: 'Psychiatry'
  },
  {
    id: 'ocd',
    name: 'OCD',
    category: 'Psychiatry',
    commonSymptoms: ['Intrusive thoughts', 'Compulsive behaviors', 'Anxiety', 'Repetitive actions'],
    urgency: 'routine',
    recommendedSpecialty: 'Psychiatry'
  },

  // PREVENTIVE CARE (10 conditions)
  {
    id: 'checkup',
    name: 'General Check-up',
    category: 'Preventive Care',
    commonSymptoms: ['Routine health screening', 'No specific symptoms'],
    urgency: 'routine',
    recommendedSpecialty: 'General Medicine'
  },
  {
    id: 'vaccination',
    name: 'Vaccination',
    category: 'Preventive Care',
    commonSymptoms: ['Preventive immunization', 'Travel vaccines'],
    urgency: 'routine',
    recommendedSpecialty: 'General Medicine'
  },
  {
    id: 'health-screening',
    name: 'Health Screening',
    category: 'Preventive Care',
    commonSymptoms: ['Blood tests', 'Cancer screening', 'Preventive check'],
    urgency: 'routine',
    recommendedSpecialty: 'General Medicine'
  },
  {
    id: 'physical-exam',
    name: 'Physical Examination',
    category: 'Preventive Care',
    commonSymptoms: ['Annual physical', 'Employment medical', 'Sports clearance'],
    urgency: 'routine',
    recommendedSpecialty: 'General Medicine'
  },

  // OTHERS (10 conditions)
  {
    id: 'injury',
    name: 'Injury / Trauma',
    category: 'Emergency Medicine',
    commonSymptoms: ['Pain', 'Swelling', 'Bleeding', 'Bruising'],
    urgency: 'emergency',
    recommendedSpecialty: 'Emergency Medicine'
  },
  {
    id: 'burn',
    name: 'Burns',
    category: 'Emergency Medicine',
    commonSymptoms: ['Skin damage', 'Pain', 'Blistering', 'Redness'],
    urgency: 'emergency',
    recommendedSpecialty: 'Emergency Medicine'
  },
  {
    id: 'poisoning',
    name: 'Poisoning / Overdose',
    category: 'Emergency Medicine',
    commonSymptoms: ['Nausea', 'Vomiting', 'Confusion', 'Difficulty breathing'],
    urgency: 'emergency',
    recommendedSpecialty: 'Emergency Medicine'
  },
  {
    id: 'second-opinion',
    name: 'Second Opinion',
    category: 'Others',
    commonSymptoms: ['Seeking additional medical advice'],
    urgency: 'routine',
    recommendedSpecialty: 'General Medicine'
  },
  {
    id: 'followup',
    name: 'Follow-up Visit',
    category: 'Others',
    commonSymptoms: ['Post-treatment review', 'Ongoing care'],
    urgency: 'routine',
    recommendedSpecialty: 'General Medicine'
  },
  {
    id: 'prescription-refill',
    name: 'Prescription Refill',
    category: 'Others',
    commonSymptoms: ['Medication renewal'],
    urgency: 'routine',
    recommendedSpecialty: 'General Medicine'
  },
  {
    id: 'other',
    name: 'Other / Not Listed',
    category: 'Others',
    commonSymptoms: ['Specify during consultation'],
    urgency: 'routine',
    recommendedSpecialty: 'General Medicine'
  },
];

/**
 * Get conditions by category
 */
export function getConditionsByCategory(category: string): MedicalCondition[] {
  return MEDICAL_CONDITIONS.filter(c => c.category === category);
}

/**
 * Search conditions by name or symptoms
 */
export function searchConditions(query: string): MedicalCondition[] {
  const lowerQuery = query.toLowerCase();
  return MEDICAL_CONDITIONS.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.commonSymptoms.some(s => s.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get recommended specialty for a condition
 */
export function getRecommendedSpecialty(conditionId: string): string {
  const condition = MEDICAL_CONDITIONS.find(c => c.id === conditionId);
  return condition?.recommendedSpecialty || 'General Medicine';
}

