export interface DocumentResponse {
  id: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  description: string | null;
  uploadedAt: string;
}

export interface LabResult {
  testName: string;
  value: string;
  unit: string | null;
  referenceRange: string | null;
  status: 'NORMAL' | 'HIGH' | 'LOW' | 'UNKNOWN';
  interpretation: string | null;
}

export interface AnalysisResult {
  documentType: string;
  issuedDate: string | null;
  facilityName: string | null;
  physicianName: string | null;
  patientInfo: {
    name: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    patientId: string | null;
  } | null;
  labResults: LabResult[];
  diagnoses: string | null;
  medications: string | null;
  clinicalNotes: string | null;
  summary: string | null;
}

export interface AnalysisResponse {
  id: string;
  documentId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  result: AnalysisResult | null;
  errorMessage: string | null;
  createdAt: string;
  analyzedAt: string | null;
  reviewedAt: string | null;
  reviewedByUserId: string | null;
}
