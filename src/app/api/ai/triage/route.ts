import { NextRequest, NextResponse } from 'next/server';
import { analyzeEmergencyTriage, type TriageInput } from '@/lib/api/emergent-ai';

/**
 * AI-Powered Emergency Triage Endpoint
 * POST /api/ai/triage
 */
export async function POST(request: NextRequest) {
  try {
    const body: TriageInput = await request.json();

    // Validate required fields
    if (!body.chiefComplaint || !body.symptoms || body.symptoms.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Chief complaint and symptoms are required',
      }, { status: 400 });
    }

    console.log('🤖 Analyzing emergency triage with AI...');
    console.log('Chief Complaint:', body.chiefComplaint);
    console.log('Symptoms:', body.symptoms);

    // Call Emergent AI for analysis
    const analysis = await analyzeEmergencyTriage(body);

    console.log('✅ AI Triage Analysis Complete');
    console.log('Triage Level:', analysis.triageLevel);
    console.log('Severity:', analysis.severity);
    console.log('Needs Ambulance:', analysis.needsAmbulance);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error('AI Triage Error:', error);
    
    // Return safe fallback response
    return NextResponse.json({
      success: false,
      error: 'AI analysis failed',
      fallback: {
        triageLevel: 3,
        severity: 'urgent',
        potentialConditions: ['Requires medical evaluation'],
        immediateActions: ['Seek medical attention', 'Monitor symptoms closely'],
        needsAmbulance: false,
        recommendedSpecialty: 'emergency medicine',
        reasoning: 'Please consult with a healthcare professional for proper assessment',
        estimatedWaitTime: 60,
      },
    }, { status: 200 }); // Return 200 with fallback instead of error
  }
}

