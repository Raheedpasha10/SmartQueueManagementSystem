"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Upload,
  File,
  X,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface DocumentUploadProps {
  patientId: string;
  onUploadComplete?: () => void;
}

const DOCUMENT_TYPES = [
  { value: "insurance_card", label: "Insurance Card", icon: FileText },
  { value: "id_proof", label: "ID Proof (Aadhaar/PAN/Passport)", icon: FileText },
  { value: "medical_report", label: "Medical Report", icon: FileText },
  { value: "lab_report", label: "Lab Report", icon: FileText },
  { value: "prescription", label: "Prescription", icon: FileText },
  { value: "discharge_summary", label: "Discharge Summary", icon: FileText },
  { value: "vaccination_record", label: "Vaccination Record", icon: FileText },
  { value: "other", label: "Other", icon: File },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = {
  "image/*": [".png", ".jpg", ".jpeg", ".webp"],
  "application/pdf": [".pdf"],
};

export function DocumentUpload({ patientId, onUploadComplete }: DocumentUploadProps) {
  const [selectedType, setSelectedType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const supabase = createClient();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 5MB limit");
        return;
      }

      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    multiple: false,
    maxSize: MAX_FILE_SIZE,
  });

  const handleUpload = async () => {
    if (!selectedFile || !selectedType) {
      toast.error("Please select document type and file");
      return;
    }

    setUploading(true);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate unique file name
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("patient-documents")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("patient-documents").getPublicUrl(fileName);

      // Save document metadata to database
      const { error: dbError } = await supabase.from("patient_documents").insert({
        patient_id: patientId,
        document_type: selectedType,
        document_name: selectedFile.name,
        file_path: uploadData.path,
        file_size: selectedFile.size,
        mime_type: selectedFile.type,
        metadata: {
          original_name: selectedFile.name,
          uploaded_by: user.id,
        },
      });

      if (dbError) throw dbError;

      toast.success("Document uploaded successfully");
      setSelectedFile(null);
      setSelectedType("");
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Document
        </CardTitle>
        <CardDescription>
          Upload insurance cards, ID proofs, medical reports, and other documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Document Type Selection */}
        <div className="space-y-2">
          <Label>Document Type *</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {DOCUMENT_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setSelectedType(type.value)}
                  className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-all ${
                    selectedType === type.value
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                      : "hover:border-gray-400"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0 text-gray-600" />
                  <span className="line-clamp-2">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* File Upload Dropzone */}
        <div className="space-y-2">
          <Label>File *</Label>
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragActive
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                {selectedFile.type.startsWith("image/") ? (
                  <ImageIcon className="h-8 w-8 text-blue-600" />
                ) : (
                  <FileText className="h-8 w-8 text-blue-600" />
                )}
                <div className="text-left">
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="ml-auto rounded-full p-1 hover:bg-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {isDragActive ? "Drop file here" : "Drag & drop file here"}
                  </p>
                  <p className="text-xs text-gray-600">or click to browse</p>
                </div>
                <p className="text-xs text-gray-500">
                  Supported: PDF, JPG, PNG (Max 5MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Info */}
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-600" />
            <div className="space-y-1 text-sm">
              <p className="font-medium text-blue-900">Important:</p>
              <ul className="list-inside list-disc space-y-1 text-blue-800">
                <li>Ensure documents are clear and readable</li>
                <li>For insurance cards, upload both front and back</li>
                <li>Personal information should be visible</li>
                <li>Maximum file size: 5MB</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !selectedType || uploading}
          className="w-full"
          size="lg"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              Upload Document
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

