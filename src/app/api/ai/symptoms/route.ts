import { NextRequest, NextResponse } from 'next/server';
import { analyzeSymptoms } from '@/lib/api/emergent-ai';

/**
 * AI Symptom Checker Endpoint
 * POST /api/ai/symptoms
 */
export async function POST(request: NextRequest) {
  try {
    const { symptoms }: { symptoms: string[] } = await request.json();

    if (!symptoms || symptoms.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Symptoms are required',
      }, { status: 400 });
    }

    console.log('🤖 Analyzing symptoms with AI...');
    console.log('Symptoms:', symptoms);

    const analysis = await analyzeSymptoms(symptoms);

    console.log('✅ Symptom Analysis Complete');
    console.log('Urgency:', analysis.urgencyLevel);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error('Symptom Analysis Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Analysis failed',
      fallback: {
        likelyConditions: [
          {
            name: 'Medical Evaluation Needed',
            probability: 'medium' as const,
            description: 'Please consult a healthcare provider',
          },
        ],
        urgencyLevel: 'today' as const,
        recommendedActions: ['Consult a doctor', 'Monitor symptoms'],
        warningSign: false,
      },
    }, { status: 200 });
  }
}

