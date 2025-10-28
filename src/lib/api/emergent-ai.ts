/**
 * Emergent AI Service (Claude Sonnet 4.5)
 * Powers intelligent features like triage, symptom analysis, and recommendations
 */

const API_KEY = process.env.EMERGENT_API_KEY;
const API_URL = process.env.EMERGENT_API_URL || 'https://api.emergent.ai/v1';

interface EmergentMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface EmergentResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Call Emergent AI API
 */
async function callEmergentAI(
  messages: EmergentMessage[],
  temperature: number = 0.7,
  maxTokens: number = 1000
): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4.5',
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Emergent API Error:', error);
      throw new Error(`API Error: ${response.status}`);
    }

    const data: EmergentResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Emergent AI:', error);
    throw error;
  }
}

/**
 * Emergency Triage Analysis
 */
export interface TriageInput {
  symptoms: string[];
  chiefComplaint: string;
  painLevel: number;
  consciousness: 'alert' | 'verbal' | 'pain' | 'unresponsive';
  breathing: 'normal' | 'difficulty' | 'severe';
  heartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  temperature?: number;
  oxygenSaturation?: number;
}

export interface TriageAnalysis {
  triageLevel: 1 | 2 | 3 | 4 | 5;
  severity: 'critical' | 'urgent' | 'semi-urgent' | 'non-urgent' | 'minor';
  potentialConditions: string[];
  immediateActions: string[];
  needsAmbulance: boolean;
  recommendedSpecialty: string;
  reasoning: string;
  estimatedWaitTime: number; // in minutes
}

export async function analyzeEmergencyTriage(input: TriageInput): Promise<TriageAnalysis> {
  const prompt = `You are an expert emergency medical triage AI. Analyze this patient presentation and provide IMMEDIATE triage assessment.

CRITICAL: If this is life-threatening, you MUST recommend triage level 1 and ambulance.

Patient Information:
- Chief Complaint: ${input.chiefComplaint}
- Symptoms: ${input.symptoms.join(', ')}
- Pain Level: ${input.painLevel}/10
- Consciousness: ${input.consciousness}
- Breathing Status: ${input.breathing}
${input.heartRate ? `- Heart Rate: ${input.heartRate} bpm` : ''}
${input.bloodPressureSystolic && input.bloodPressureDiastolic 
  ? `- Blood Pressure: ${input.bloodPressureSystolic}/${input.bloodPressureDiastolic} mmHg` 
  : ''}
${input.temperature ? `- Temperature: ${input.temperature}°F` : ''}
${input.oxygenSaturation ? `- Oxygen Saturation: ${input.oxygenSaturation}%` : ''}

Provide response in this EXACT JSON format:
{
  "triageLevel": (1-5, where 1=immediate, 2=very urgent, 3=urgent, 4=less urgent, 5=non-urgent),
  "severity": "critical|urgent|semi-urgent|non-urgent|minor",
  "potentialConditions": ["most likely condition", "second possibility", "third possibility"],
  "immediateActions": ["action 1", "action 2", "action 3"],
  "needsAmbulance": true|false,
  "recommendedSpecialty": "cardiology|neurology|emergency medicine|etc",
  "reasoning": "brief medical reasoning for triage level",
  "estimatedWaitTime": (minutes patient can safely wait)
}

Remember: 
- Triage 1: Life-threatening (0-15 min wait)
- Triage 2: Very urgent (15-60 min wait)
- Triage 3: Urgent (1-2 hours wait)
- Triage 4: Less urgent (2-4 hours wait)
- Triage 5: Non-urgent (4+ hours wait)`;

  try {
    const response = await callEmergentAI(
      [
        {
          role: 'system',
          content: 'You are a medical triage expert. Always err on the side of caution with patient safety. Respond ONLY with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      0.3, // Low temperature for consistent medical advice
      1500
    );

    // Parse JSON response
    const analysis: TriageAnalysis = JSON.parse(response);
    return analysis;
  } catch (error) {
    console.error('AI Triage Analysis Error:', error);
    // Return safe fallback
    return {
      triageLevel: 3,
      severity: 'urgent',
      potentialConditions: ['Requires medical evaluation'],
      immediateActions: ['Seek medical attention', 'Monitor symptoms'],
      needsAmbulance: false,
      recommendedSpecialty: 'emergency medicine',
      reasoning: 'Unable to analyze - please consult medical professional',
      estimatedWaitTime: 60,
    };
  }
}

/**
 * Symptom Checker
 */
export interface SymptomAnalysis {
  likelyConditions: Array<{
    name: string;
    probability: 'high' | 'medium' | 'low';
    description: string;
  }>;
  urgencyLevel: 'immediate' | 'today' | 'this week' | 'routine';
  recommendedActions: string[];
  warningSign: boolean;
  warningMessage?: string;
}

export async function analyzeSymptoms(symptoms: string[]): Promise<SymptomAnalysis> {
  const prompt = `Analyze these symptoms and provide medical guidance:

Symptoms: ${symptoms.join(', ')}

Provide response in this EXACT JSON format:
{
  "likelyConditions": [
    {
      "name": "condition name",
      "probability": "high|medium|low",
      "description": "brief explanation"
    }
  ],
  "urgencyLevel": "immediate|today|this week|routine",
  "recommendedActions": ["action 1", "action 2"],
  "warningSign": true|false,
  "warningMessage": "if warning sign is true, explain why"
}`;

  try {
    const response = await callEmergentAI(
      [
        {
          role: 'system',
          content: 'You are a medical symptom analysis AI. Always prioritize patient safety. Respond ONLY with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      0.4,
      1000
    );

    return JSON.parse(response);
  } catch (error) {
    console.error('Symptom Analysis Error:', error);
    return {
      likelyConditions: [
        {
          name: 'Unknown',
          probability: 'medium',
          description: 'Please consult a healthcare provider',
        },
      ],
      urgencyLevel: 'today',
      recommendedActions: ['Consult a doctor', 'Monitor symptoms'],
      warningSign: false,
    };
  }
}

/**
 * Doctor Recommendation
 */
export interface DoctorRecommendation {
  recommendedDoctorId: string;
  reasoning: string;
  specialtyMatch: number; // 0-100
  alternativeDoctors: string[];
}

export async function recommendDoctor(
  condition: string,
  doctors: Array<{ id: string; name: string; specialization: string; experience: number; rating: number }>
): Promise<DoctorRecommendation> {
  const doctorList = doctors.map(
    (d) => `- ${d.name} (${d.specialization}, ${d.experience} years exp, ${d.rating}★) [ID: ${d.id}]`
  ).join('\n');

  const prompt = `For a patient with: ${condition}

Available doctors:
${doctorList}

Recommend the BEST doctor and explain why. Provide response in this EXACT JSON format:
{
  "recommendedDoctorId": "doctor-id-here",
  "reasoning": "why this doctor is best for this condition",
  "specialtyMatch": (0-100 how well specialty matches),
  "alternativeDoctors": ["doctor-id-2", "doctor-id-3"]
}`;

  try {
    const response = await callEmergentAI(
      [
        {
          role: 'system',
          content: 'You are a medical specialist matcher. Consider specialty, experience, and ratings. Respond ONLY with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      0.5,
      800
    );

    return JSON.parse(response);
  } catch (error) {
    console.error('Doctor Recommendation Error:', error);
    // Fallback to highest rated doctor
    const sorted = [...doctors].sort((a, b) => b.rating - a.rating);
    return {
      recommendedDoctorId: sorted[0]?.id || '',
      reasoning: 'Highest rated available doctor',
      specialtyMatch: 50,
      alternativeDoctors: sorted.slice(1, 3).map((d) => d.id),
    };
  }
}

/**
 * Smart Queue Prioritization
 */
export interface QueuePriority {
  priorityScore: number; // 0-100
  reasoning: string;
  estimatedWaitReduction: number; // minutes
  shouldFastTrack: boolean;
}

export async function calculateQueuePriority(
  patientCondition: string,
  currentQueueLength: number,
  averageWaitTime: number
): Promise<QueuePriority> {
  const prompt = `Analyze queue priority for:
- Patient Condition: ${patientCondition}
- Current Queue: ${currentQueueLength} patients
- Average Wait: ${averageWaitTime} minutes

Provide response in this EXACT JSON format:
{
  "priorityScore": (0-100, higher = more priority),
  "reasoning": "why this score",
  "estimatedWaitReduction": (minutes to reduce wait),
  "shouldFastTrack": true|false
}`;

  try {
    const response = await callEmergentAI(
      [
        {
          role: 'system',
          content: 'You are a queue management AI. Balance urgency with fairness. Respond ONLY with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      0.4,
      500
    );

    return JSON.parse(response);
  } catch (error) {
    console.error('Queue Priority Error:', error);
    return {
      priorityScore: 50,
      reasoning: 'Standard priority',
      estimatedWaitReduction: 0,
      shouldFastTrack: false,
    };
  }
}

