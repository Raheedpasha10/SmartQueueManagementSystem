"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  FileText,
  Image as ImageIcon,
  Download,
  Trash2,
  Eye,
  Loader2,
  CheckCircle,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DocumentListProps {
  patientId: string;
  refreshTrigger?: number;
}

interface Document {
  id: string;
  document_type: string;
  document_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  is_verified: boolean;
  verified_at: string | null;
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  insurance_card: "Insurance Card",
  id_proof: "ID Proof",
  medical_report: "Medical Report",
  lab_report: "Lab Report",
  prescription: "Prescription",
  discharge_summary: "Discharge Summary",
  vaccination_record: "Vaccination Record",
  other: "Other",
};

export function DocumentList({ patientId, refreshTrigger }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadDocuments();
  }, [patientId, refreshTrigger]);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from("patient_documents")
        .select("*")
        .eq("patient_id", patientId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error("Error loading documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from("patient-documents")
        .download(document.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = document.document_name;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Document downloaded successfully");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };

  const handleView = async (document: Document) => {
    try {
      const {
        data: { publicUrl },
      } = supabase.storage.from("patient-documents").getPublicUrl(document.file_path);

      window.open(publicUrl, "_blank");
    } catch (error: any) {
      console.error("View error:", error);
      toast.error("Failed to view document");
    }
  };

  const handleDelete = async (documentId: string, filePath: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this document? This action cannot be undone."
    );
    if (!confirm) return;

    setDeletingId(documentId);
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("patient-documents")
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("patient_documents")
        .delete()
        .eq("id", documentId);

      if (dbError) throw dbError;

      toast.success("Document deleted successfully");
      loadDocuments();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Failed to delete document");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-600">No documents uploaded yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Upload your insurance cards, ID proofs, and medical reports
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          My Documents ({documents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((document) => {
            const isImage = document.mime_type?.startsWith("image/");
            const Icon = isImage ? ImageIcon : FileText;

            return (
              <div
                key={document.id}
                className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>

                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 truncate">
                      {document.document_name}
                    </p>
                    {document.is_verified && (
                      <Badge variant="default" className="bg-green-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                    <Badge variant="secondary">
                      {DOCUMENT_TYPE_LABELS[document.document_type] || document.document_type}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(document.uploaded_at)}
                    </span>
                    <span>{(document.file_size / 1024).toFixed(2)} KB</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(document)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(document)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(document.id, document.file_path)}
                    disabled={deletingId === document.id}
                    className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    {deletingId === document.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

