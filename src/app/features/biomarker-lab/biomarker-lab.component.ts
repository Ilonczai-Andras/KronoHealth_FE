import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KrIconComponent } from '@shared/components/kr-icon/kr-icon.component';

interface BloodMarker {
  name: string;
  value: number;
  unit: string;
  ref_min: number;
  ref_max: number;
  status: 'normal' | 'low' | 'high' | 'critical';
  trend: 'up' | 'down' | 'neutral';
}

interface LabDocument {
  id: string;
  filename: string;
  uploadDate: string;
  status: 'processing' | 'done' | 'error';
  markerCount?: number;
  lab?: string;
  errorMsg?: string;
}

@Component({
  selector: 'app-biomarker-lab',
  standalone: true,
  imports: [KrIconComponent],
  templateUrl: './biomarker-lab.component.html',
  styleUrls: ['./biomarker-lab.component.scss'],
})
export class BiomarkerLabComponent {
  private router = inject(Router);
  @ViewChild('fileInput') private fileInputRef!: ElementRef<HTMLInputElement>;

  isDragging = false;
  uploadState: 'idle' | 'uploading' | 'done' | 'error' = 'idle';
  uploadProgress = 0;
  uploadFileName = '';
  uploadErrorMsg = '';
  private _uploadTimer?: ReturnType<typeof setInterval>;

  markers: BloodMarker[] = [
    {
      name: 'Glükóz',
      value: 5.2,
      unit: 'mmol/L',
      ref_min: 3.9,
      ref_max: 6.1,
      status: 'normal',
      trend: 'neutral',
    },
    {
      name: 'HbA1c',
      value: 5.8,
      unit: '%',
      ref_min: 4.0,
      ref_max: 5.6,
      status: 'high',
      trend: 'up',
    },
    {
      name: 'LDL',
      value: 3.1,
      unit: 'mmol/L',
      ref_min: 0,
      ref_max: 3.4,
      status: 'normal',
      trend: 'down',
    },
    {
      name: 'HDL',
      value: 1.2,
      unit: 'mmol/L',
      ref_min: 1.0,
      ref_max: 2.5,
      status: 'normal',
      trend: 'up',
    },
    {
      name: 'Triglicerid',
      value: 2.1,
      unit: 'mmol/L',
      ref_min: 0,
      ref_max: 1.7,
      status: 'high',
      trend: 'up',
    },
    {
      name: 'TSH',
      value: 2.4,
      unit: 'mIU/L',
      ref_min: 0.4,
      ref_max: 4.0,
      status: 'normal',
      trend: 'neutral',
    },
    {
      name: 'Tesztoszteron',
      value: 14.5,
      unit: 'nmol/L',
      ref_min: 9.9,
      ref_max: 27.8,
      status: 'normal',
      trend: 'neutral',
    },
    {
      name: 'Ferritin',
      value: 42,
      unit: 'ng/mL',
      ref_min: 22,
      ref_max: 322,
      status: 'normal',
      trend: 'neutral',
    },
    {
      name: 'D-vitamin',
      value: 28,
      unit: 'ng/mL',
      ref_min: 30,
      ref_max: 100,
      status: 'low',
      trend: 'down',
    },
    {
      name: 'B12',
      value: 185,
      unit: 'pg/mL',
      ref_min: 180,
      ref_max: 900,
      status: 'normal',
      trend: 'neutral',
    },
    {
      name: 'hsCRP',
      value: 0.4,
      unit: 'mg/L',
      ref_min: 0,
      ref_max: 1.0,
      status: 'normal',
      trend: 'down',
    },
    {
      name: 'GGT',
      value: 65,
      unit: 'U/L',
      ref_min: 0,
      ref_max: 55,
      status: 'high',
      trend: 'up',
    },
  ];

  documents: LabDocument[] = [
    {
      id: 'DOC-004',
      filename: 'lelet_2026_marc.pdf',
      uploadDate: '2026. március 21.',
      status: 'processing',
    },
    {
      id: 'DOC-003',
      filename: 'lelet_2026_feb.pdf',
      uploadDate: '2026. február 12.',
      status: 'done',
      lab: 'Synlab Magyarország',
      markerCount: 24,
    },
    {
      id: 'DOC-002',
      filename: 'lelet_2025_nov.pdf',
      uploadDate: '2025. november 3.',
      status: 'done',
      lab: 'Medicover Lab',
      markerCount: 18,
    },
    {
      id: 'DOC-001',
      filename: 'scan_2025_aug.pdf',
      uploadDate: '2025. augusztus 8.',
      status: 'error',
      errorMsg: 'A PDF nem olvasható, kérjük tölts fel jobb minőségű fájlt.',
    },
  ];

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
    clearInterval(this._uploadTimer);
    this._uploadTimer = setInterval(() => {
      this.uploadProgress = Math.min(
        this.uploadProgress + Math.round(Math.random() * 15 + 5),
        100,
      );
      if (this.uploadProgress >= 100) {
        this.uploadState = 'done';
        clearInterval(this._uploadTimer);
      }
    }, 200);
  }

  openReview(doc: LabDocument): void {
    if (doc.status !== 'done') return;
    this.router.navigate(['/app/biomarker-lab/review', doc.id]);
  }

  resetUpload(): void {
    clearInterval(this._uploadTimer);
    this.uploadState = 'idle';
    this.uploadProgress = 0;
    this.uploadFileName = '';
    this.uploadErrorMsg = '';
  }

  getBarWidth(m: BloodMarker): number {
    const range = m.ref_max - m.ref_min;
    if (range <= 0) return 50;
    const pct = ((m.value - m.ref_min) / range) * 100;
    return Math.min(Math.max(pct, 0), 100);
  }
}
