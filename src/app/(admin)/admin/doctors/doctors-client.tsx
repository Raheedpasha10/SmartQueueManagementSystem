"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DoctorManagementClientProps {
  doctors: any[];
  departments: any[];
  hospitals: any[];
}

export function DoctorManagementClient({
  doctors,
}: Pick<DoctorManagementClientProps, 'doctors'>) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Doctor Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Doctor management interface is under development.
            </p>
            <p className="text-sm text-gray-500">
              Total Doctors: {doctors.length}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
