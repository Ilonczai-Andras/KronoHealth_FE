import { Component, ElementRef, ViewChild, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { KrIconComponent } from '@shared/components/kr-icon/kr-icon.component';
import { ToastService } from '@shared/services/toast.service';
import { DocumentsService } from '@core/services/documents.service';
import {
  DocumentResponse,
  AnalysisMarker,
} from '@core/api/models/document-response';
import { selectAllAnalysisUpdates } from '../../store/analysis/analysis.selectors';
import * as AnalysisActions from '../../store/analysis/analysis.actions';

interface LabDocument {
  id: string;
  filename: string;
  uploadDate: string;
  status: 'processing' | 'done' | 'error';
  markerCount?: number;
  lab?: string;
  errorMsg?: string;
}

function mapDoc(d: DocumentResponse): LabDocument {
  return {
    id: d.id,
    filename: d.originalFilename,
    uploadDate: new Date(d.uploadedAt).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    status:
      d.status === 'COMPLETED'
        ? 'done'
        : d.status === 'FAILED'
          ? 'error'
          : 'processing',
    markerCount: d.markerCount,
    lab: d.labName,
    errorMsg: d.errorMessage,
  };
}

@Component({
  selector: 'app-biomarker-lab',
  standalone: true,
  imports: [KrIconComponent],
  templateUrl: './biomarker-lab.component.html',
  styleUrls: ['./biomarker-lab.component.scss'],
})
export class BiomarkerLabComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private store = inject(Store);
  private toastService = inject(ToastService);
  private documentsService = inject(DocumentsService);
  @ViewChild('fileInput') private fileInputRef!: ElementRef<HTMLInputElement>;

  private analysisSub?: Subscription;
  private uploadSub?: Subscription;

  // ── Document list ──────────────────────────────
  documents: LabDocument[] = [];
  loadingDocuments = false;
  loadingDocumentsError = '';

  // ── Markers (most recent completed doc) ───────
  markers: AnalysisMarker[] = [];
  loadingMarkers = false;
  mostRecentLab = '';
  mostRecentDate = '';
  mostRecentMarkerCount = 0;

  // ── Upload state ──────────────────────────────
  isDragging = false;
  uploadState: 'idle' | 'uploading' | 'done' | 'error' = 'idle';
  uploadProgress = 0;
  uploadFileName = '';
  uploadErrorMsg = '';

  ngOnInit(): void {
    this.loadDocuments();
    this.subscribeToSseUpdates();
  }

  ngOnDestroy(): void {
    this.analysisSub?.unsubscribe();
    this.uploadSub?.unsubscribe();
  }

  // ── Load documents ─────────────────────────────
  loadDocuments(): void {
    this.loadingDocuments = true;
    this.loadingDocumentsError = '';
    this.documentsService.getDocuments().subscribe({
      next: (docs) => {
        this.loadingDocuments = false;
        this.documents = docs.map(mapDoc);
        this.loadMarkersFromMostRecent(docs);
      },
      error: (err) => {
        this.loadingDocuments = false;
        this.loadingDocumentsError =
          err.error?.message ?? 'A dokumentumok betöltése sikertelen.';
      },
    });
  }

  private loadMarkersFromMostRecent(docs: DocumentResponse[]): void {
    const recent = docs
      .filter((d) => d.status === 'COMPLETED')
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      )[0];

    if (!recent) return;

    this.loadingMarkers = true;
    this.documentsService.getAnalysis(recent.id).subscribe({
      next: (analysis) => {
        this.loadingMarkers = false;
        this.markers = analysis.markers;
        this.mostRecentLab = analysis.labName ?? '';
        this.mostRecentDate = new Date(analysis.analyzedAt).toLocaleDateString(
          'hu-HU',
          { year: 'numeric', month: 'long', day: 'numeric' },
        );
        this.mostRecentMarkerCount = analysis.markerCount;
      },
      error: () => {
        this.loadingMarkers = false;
      },
    });
  }

  // ── SSE updates ────────────────────────────────
  private subscribeToSseUpdates(): void {
    this.analysisSub = this.store
      .select(selectAllAnalysisUpdates)
      .subscribe((updates) => {
        Object.values(updates).forEach((event) => {
          const doc = this.documents.find((d) => d.id === event.documentId);
          if (!doc) return;

          if (event.status === 'COMPLETED') {
            if (doc.status !== 'done') {
              doc.status = 'done';
              this.toastService.show(
                `AI elemzés kész: ${doc.filename}`,
                'success',
              );
              // Reload document list and markers to get real data from backend
              this.loadDocuments();
            }
          } else if (event.status === 'FAILED') {
            if (doc.status !== 'error') {
              doc.status = 'error';
              doc.errorMsg = event.errorMessage ?? 'Az elemzés sikertelen.';
              this.toastService.show(
                `Elemzési hiba: ${doc.filename}`,
                'error',
                {
                  label: 'Újra',
                  callback: () => this.retryAnalysis(doc.id),
                },
              );
            }
          }
        });
      });
  }

  // ── Upload ─────────────────────────────────────
  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragging = false;
    const file = e.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  triggerFileInput(): void {
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.processFile(file);
    input.value = '';
  }

  private processFile(file: File): void {
    if (file.type !== 'application/pdf') {
      this.uploadState = 'error';
      this.uploadFileName = file.name;
      this.uploadErrorMsg = 'Csak PDF fájl tölthető fel!';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.uploadState = 'error';
      this.uploadFileName = file.name;
      this.uploadErrorMsg = 'A fájl mérete meghaladja a 10 MB-ot!';
      return;
    }

    this.uploadFileName = file.name;
    this.uploadErrorMsg = '';
    this.uploadProgress = 0;
    this.uploadState = 'uploading';
    this.uploadSub?.unsubscribe();

    this.uploadSub = this.documentsService.uploadDocument(file).subscribe({
      next: (httpEvent) => {
        if (httpEvent.type === HttpEventType.UploadProgress) {
          const total = httpEvent.total ?? 1;
          this.uploadProgress = Math.round((httpEvent.loaded / total) * 100);
        } else if (httpEvent.type === HttpEventType.Response) {
          this.uploadProgress = 100;
          this.uploadState = 'done';
          if (httpEvent.body) {
            this.documents = [mapDoc(httpEvent.body), ...this.documents];
          }
        }
      },
      error: (err) => {
        this.uploadState = 'error';
        this.uploadErrorMsg =
          err.error?.message ?? 'A feltöltés sikertelen. Próbáld újra.';
      },
    });
  }

  openReview(doc: LabDocument): void {
    if (doc.status !== 'done') return;
    this.router.navigate(['/app/biomarker-lab/review', doc.id]);
  }

  resetUpload(): void {
    this.uploadSub?.unsubscribe();
    this.uploadState = 'idle';
    this.uploadProgress = 0;
    this.uploadFileName = '';
    this.uploadErrorMsg = '';
  }

  retryAnalysis(documentId: string): void {
    const doc = this.documents.find((d) => d.id === documentId);
    if (doc) {
      doc.status = 'processing';
      doc.errorMsg = undefined;
    }
    this.store.dispatch(AnalysisActions.retryAnalysis({ documentId }));
  }

  getBarWidth(m: AnalysisMarker): number {
    const range = m.refMax - m.refMin;
    if (range <= 0) return 50;
    const pct = ((m.value - m.refMin) / range) * 100;
    return Math.min(Math.max(pct, 0), 100);
  }
}



