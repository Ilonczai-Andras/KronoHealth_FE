import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfiguration } from '@core/api/api-configuration';
import {
  DocumentResponse,
  AnalysisResponse,
} from '@core/api/models/document-response';

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfiguration);

  private get base(): string {
    return `${this.config.rootUrl}/api/v1/documents`;
  }

  getDocuments(): Observable<DocumentResponse[]> {
    return this.http.get<DocumentResponse[]>(this.base);
  }

  uploadDocument(file: File): Observable<HttpEvent<DocumentResponse>> {
    const form = new FormData();
    form.append('file', file, file.name);
    const req = new HttpRequest('POST', this.base, form, {
      reportProgress: true,
    });
    return this.http.request<DocumentResponse>(req);
  }

  getAnalysis(documentId: string): Observable<AnalysisResponse> {
    return this.http.get<AnalysisResponse>(`${this.base}/${documentId}/analysis`);
  }

  triggerAnalysis(documentId: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${documentId}/analyze`, {});
  }
}
