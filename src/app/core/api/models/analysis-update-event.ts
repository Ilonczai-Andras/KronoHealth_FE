export interface AnalysisUpdateEvent {
  analysisId: string;
  documentId: string;
  status: 'COMPLETED' | 'FAILED';
  analyzedAt: string;
  errorMessage?: string;
}
