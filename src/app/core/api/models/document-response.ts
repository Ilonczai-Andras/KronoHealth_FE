export interface DocumentResponse {
  id: string;
  originalFilename: string;
  uploadedAt: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  labName?: string;
  markerCount?: number;
  errorMessage?: string;
}

export interface AnalysisMarker {
  name: string;
  value: number;
  unit: string;
  refMin: number;
  refMax: number;
  status: 'NORMAL' | 'LOW' | 'HIGH' | 'CRITICAL';
  trend: 'UP' | 'DOWN' | 'NEUTRAL';
}

export interface AnalysisResponse {
  documentId: string;
  analyzedAt: string;
  labName?: string;
  markerCount: number;
  markers: AnalysisMarker[];
}
