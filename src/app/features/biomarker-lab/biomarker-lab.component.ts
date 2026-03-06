import { Component } from '@angular/core';
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

interface LabReport {
  date: string;
  lab: string;
  markerCount: number;
  id: string;
}

@Component({
  selector: 'app-biomarker-lab',
  standalone: true,
  imports: [KrIconComponent],
  templateUrl: './biomarker-lab.component.html',
  styleUrls: ['./biomarker-lab.component.scss']
})
export class BiomarkerLabComponent {
  isDragging = false;

  markers: BloodMarker[] = [
    { name: 'Glükóz',       value: 5.2,  unit: 'mmol/L', ref_min: 3.9,  ref_max: 6.1,  status: 'normal',   trend: 'neutral' },
    { name: 'HbA1c',        value: 5.8,  unit: '%',       ref_min: 4.0,  ref_max: 5.6,  status: 'high',     trend: 'up'      },
    { name: 'LDL',          value: 3.1,  unit: 'mmol/L', ref_min: 0,    ref_max: 3.4,  status: 'normal',   trend: 'down'    },
    { name: 'HDL',          value: 1.2,  unit: 'mmol/L', ref_min: 1.0,  ref_max: 2.5,  status: 'normal',   trend: 'up'      },
    { name: 'Triglicerid',  value: 2.1,  unit: 'mmol/L', ref_min: 0,    ref_max: 1.7,  status: 'high',     trend: 'up'      },
    { name: 'TSH',          value: 2.4,  unit: 'mIU/L',  ref_min: 0.4,  ref_max: 4.0,  status: 'normal',   trend: 'neutral' },
    { name: 'Tesztoszteron',value: 14.5, unit: 'nmol/L', ref_min: 9.9,  ref_max: 27.8, status: 'normal',   trend: 'neutral' },
    { name: 'Ferritin',     value: 42,   unit: 'ng/mL',  ref_min: 22,   ref_max: 322,  status: 'normal',   trend: 'neutral' },
    { name: 'D-vitamin',    value: 28,   unit: 'ng/mL',  ref_min: 30,   ref_max: 100,  status: 'low',      trend: 'down'    },
    { name: 'B12',          value: 185,  unit: 'pg/mL',  ref_min: 180,  ref_max: 900,  status: 'normal',   trend: 'neutral' },
    { name: 'hsCRP',        value: 0.4,  unit: 'mg/L',   ref_min: 0,    ref_max: 1.0,  status: 'normal',   trend: 'down'    },
    { name: 'GGT',          value: 65,   unit: 'U/L',    ref_min: 0,    ref_max: 55,   status: 'high',     trend: 'up'      },
  ];

  reports: LabReport[] = [
    { date: '2026. február 12.', lab: 'Synlab Magyarország', markerCount: 24, id: 'RPT-003' },
    { date: '2025. november 3.', lab: 'Medicover Lab',       markerCount: 18, id: 'RPT-002' },
    { date: '2025. augusztus 8.',lab: 'Synlab Magyarország', markerCount: 22, id: 'RPT-001' },
  ];

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(): void { this.isDragging = false; }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragging = false;
    // TODO: handle file upload
  }

  getBarWidth(m: BloodMarker): number {
    const range = m.ref_max - m.ref_min;
    if (range <= 0) return 50;
    const pct = ((m.value - m.ref_min) / range) * 100;
    return Math.min(Math.max(pct, 0), 100);
  }
}
