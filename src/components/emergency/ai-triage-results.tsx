"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Brain,
  Ambulance,
} from "lucide-react";
import type { TriageAnalysis } from "@/lib/api/emergent-ai";

interface AITriageResultsProps {
  analysis: TriageAnalysis;
  isLoading?: boolean;
}

export function AITriageResults({ analysis, isLoading }: AITriageResultsProps) {
  if (isLoading) {
    return (
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 animate-pulse text-blue-600" />
            <div>
              <CardTitle>AI Analyzing...</CardTitle>
              <CardDescription>Processing your symptoms with AI</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 animate-pulse text-blue-600" />
            <p className="text-sm text-gray-600">Please wait while our AI analyzes your condition...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'semi-urgent':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'non-urgent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      case 'urgent':
        return <AlertTriangle className="h-6 w-6 text-orange-600" />;
      default:
        return <Activity className="h-6 w-6 text-blue-600" />;
    }
  };

  const getTriageLevelInfo = (level: number) => {
    const levels = {
      1: { label: 'IMMEDIATE', color: 'bg-red-600 text-white', time: '0-15 min' },
      2: { label: 'VERY URGENT', color: 'bg-orange-600 text-white', time: '15-60 min' },
      3: { label: 'URGENT', color: 'bg-yellow-600 text-white', time: '1-2 hours' },
      4: { label: 'LESS URGENT', color: 'bg-blue-600 text-white', time: '2-4 hours' },
      5: { label: 'NON-URGENT', color: 'bg-gray-600 text-white', time: '4+ hours' },
    };
    return levels[level as keyof typeof levels] || levels[3];
  };

  const triageInfo = getTriageLevelInfo(analysis.triageLevel);

  return (
    <div className="space-y-4">
      {/* AI Analysis Header */}
      <Card className={`border-2 ${getSeverityColor(analysis.severity)}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-7 w-7 text-purple-600" />
              <div>
                <CardTitle className="text-xl">AI Triage Analysis Complete</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Powered by Claude Sonnet 4.5
                </CardDescription>
              </div>
            </div>
            {getSeverityIcon(analysis.severity)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Triage Level */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/60">
            <div>
              <p className="text-sm font-medium text-gray-600">Recommended Triage Level</p>
              <p className="text-3xl font-bold mt-1">Level {analysis.triageLevel}</p>
            </div>
            <Badge className={`px-4 py-2 text-sm font-bold ${triageInfo.color}`}>
              {triageInfo.label}
            </Badge>
          </div>

          {/* Severity & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-white/60">
              <p className="text-xs font-medium text-gray-600 mb-1">Severity</p>
              <p className="text-lg font-semibold capitalize">{analysis.severity}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/60">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <p className="text-xs font-medium text-gray-600">Wait Time</p>
              </div>
              <p className="text-lg font-semibold mt-1">{triageInfo.time}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ambulance Alert */}
      {analysis.needsAmbulance && (
        <Alert className="border-red-500 bg-red-50 animate-pulse">
          <Ambulance className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800 font-semibold">
            <strong>CALL AMBULANCE IMMEDIATELY!</strong>
            <br />
            <span className="text-sm font-normal">
              Based on your symptoms, immediate emergency services are recommended. 
              Call emergency services (108/102) now!
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Potential Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Potential Conditions</CardTitle>
          <CardDescription>AI-identified possible diagnoses (not a final diagnosis)</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.potentialConditions.map((condition, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{condition}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Immediate Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommended Immediate Actions</CardTitle>
          <CardDescription>What you should do right now</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {analysis.immediateActions.map((action, index) => (
              <li key={index} className="flex items-start gap-3">
                <Badge variant="outline" className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center">
                  {index + 1}
                </Badge>
                <span className="text-sm">{action}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Specialty Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommended Specialty</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="text-base px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            {analysis.recommendedSpecialty}
          </Badge>
          <p className="text-sm text-gray-600 mt-3">{analysis.reasoning}</p>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-xs text-gray-600">
          <strong>Medical Disclaimer:</strong> This AI analysis is for triage assistance only and 
          is not a medical diagnosis. Always consult with a qualified healthcare professional for 
          medical advice, diagnosis, or treatment. In case of emergency, call emergency services immediately.
        </AlertDescription>
      </Alert>
    </div>
  );
}

