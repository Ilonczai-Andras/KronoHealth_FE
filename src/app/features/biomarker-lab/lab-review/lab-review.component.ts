import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KrIconComponent } from '@shared/components/kr-icon/kr-icon.component';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface LabField {
  key: string;
  label: string;
  value: string | number;
  unit: string;
  confidence: ConfidenceLevel;
  confidencePct: number;
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface BnoCode {
  code: string;
  name: string;
}

// Mock data – will be replaced by backend response
const MOCK_FIELDS: LabField[] = [
  {
    key: 'glucose',
    label: 'Glükóz',
    value: 5.2,
    unit: 'mmol/L',
    confidence: 'high',
    confidencePct: 97,
  },
  {
    key: 'hba1c',
    label: 'HbA1c',
    value: 5.8,
    unit: '%',
    confidence: 'high',
    confidencePct: 94,
  },
  {
    key: 'ldl',
    label: 'LDL',
    value: 3.1,
    unit: 'mmol/L',
    confidence: 'medium',
    confidencePct: 72,
  },
  {
    key: 'hdl',
    label: 'HDL',
    value: 1.2,
    unit: 'mmol/L',
    confidence: 'high',
    confidencePct: 96,
  },
  {
    key: 'triglyceride',
    label: 'Triglicerid',
    value: 2.1,
    unit: 'mmol/L',
    confidence: 'medium',
    confidencePct: 68,
  },
  {
    key: 'tsh',
    label: 'TSH',
    value: 2.4,
    unit: 'mIU/L',
    confidence: 'high',
    confidencePct: 91,
  },
  {
    key: 'testosterone',
    label: 'Tesztoszteron',
    value: 14.5,
    unit: 'nmol/L',
    confidence: 'low',
    confidencePct: 41,
  },
  {
    key: 'ferritin',
    label: 'Ferritin',
    value: 42,
    unit: 'ng/mL',
    confidence: 'high',
    confidencePct: 88,
  },
  {
    key: 'vitamin_d',
    label: 'D-vitamin',
    value: 28,
    unit: 'ng/mL',
    confidence: 'low',
    confidencePct: 38,
  },
  {
    key: 'b12',
    label: 'B12',
    value: 185,
    unit: 'pg/mL',
    confidence: 'medium',
    confidencePct: 75,
  },
  {
    key: 'hscrp',
    label: 'hsCRP',
    value: 0.4,
    unit: 'mg/L',
    confidence: 'high',
    confidencePct: 93,
  },
  {
    key: 'ggt',
    label: 'GGT',
    value: 65,
    unit: 'U/L',
    confidence: 'medium',
    confidencePct: 70,
  },
];

const MOCK_TRENDS: Record<string, TrendPoint[]> = {
  glucose: [
    { date: 'Aug 25', value: 4.9 },
    { date: 'Nov 25', value: 5.1 },
    { date: 'Feb 26', value: 5.2 },
  ],
  hba1c: [
    { date: 'Aug 25', value: 5.3 },
    { date: 'Nov 25', value: 5.5 },
    { date: 'Feb 26', value: 5.8 },
  ],
  ldl: [
    { date: 'Aug 25', value: 2.8 },
    { date: 'Nov 25', value: 3.0 },
    { date: 'Feb 26', value: 3.1 },
  ],
  hdl: [
    { date: 'Aug 25', value: 1.4 },
    { date: 'Nov 25', value: 1.3 },
    { date: 'Feb 26', value: 1.2 },
  ],
  triglyceride: [
    { date: 'Aug 25', value: 1.8 },
    { date: 'Nov 25', value: 1.9 },
    { date: 'Feb 26', value: 2.1 },
  ],
  tsh: [
    { date: 'Aug 25', value: 2.8 },
    { date: 'Nov 25', value: 2.6 },
    { date: 'Feb 26', value: 2.4 },
  ],
  testosterone: [
    { date: 'Aug 25', value: 15.2 },
    { date: 'Nov 25', value: 14.8 },
    { date: 'Feb 26', value: 14.5 },
  ],
  ferritin: [
    { date: 'Aug 25', value: 55 },
    { date: 'Nov 25', value: 48 },
    { date: 'Feb 26', value: 42 },
  ],
  vitamin_d: [
    { date: 'Aug 25', value: 34 },
    { date: 'Nov 25', value: 31 },
    { date: 'Feb 26', value: 28 },
  ],
  b12: [
    { date: 'Aug 25', value: 210 },
    { date: 'Nov 25', value: 195 },
    { date: 'Feb 26', value: 185 },
  ],
  hscrp: [
    { date: 'Aug 25', value: 0.6 },
    { date: 'Nov 25', value: 0.5 },
    { date: 'Feb 26', value: 0.4 },
  ],
  ggt: [
    { date: 'Aug 25', value: 52 },
    { date: 'Nov 25', value: 58 },
    { date: 'Feb 26', value: 65 },
  ],
};

const MOCK_BNO: BnoCode[] = [
  { code: 'E11', name: '2-es típusú diabetes mellitus' },
  { code: 'E78.0', name: 'Tiszta hiperkoleszterinémia' },
  { code: 'E78.5', name: 'Hiperlipidémia, k.m.n.' },
  { code: 'E55.9', name: 'D-vitamin hiány, k.m.n.' },
  { code: 'E61.1', name: 'Vashiány' },
  { code: 'I10', name: 'Esszenciális (primer) hypertonia' },
  { code: 'E03.9', name: 'Hypothyreosis, k.m.n.' },
  { code: 'E66.0', name: 'Elhízás, táplálkozási túlsúly miatt' },
  { code: 'D50.9', name: 'Vashiány-anaemia, k.m.n.' },
  { code: 'N18.3', name: 'Krónikus vesebetegség, III. stádium' },
  { code: 'K29.5', name: 'Krónikus gastritis, k.m.n.' },
  { code: 'F32.9', name: 'Depresszív epizód, k.m.n.' },
  { code: 'J45.9', name: 'Asthma, k.m.n.' },
  { code: 'M81.0', name: 'Postmenopausás osteoporosis' },
];

@Component({
  selector: 'app-lab-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, KrIconComponent],
  templateUrl: './lab-review.component.html',
  styleUrls: ['./lab-review.component.scss'],
})
export class LabReviewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  docId = '';
  fields: LabField[] = MOCK_FIELDS;
  form!: FormGroup;

  /** PDF blob URL – will come from backend */
  pdfUrl = 'about:blank';

  saveState: 'idle' | 'saving' | 'saved' | 'error' = 'idle';

  // ── Tabs ──────────────────────────────────────
  activeTab: 'fields' | 'trends' | 'diagnoses' = 'fields';

  // ── Trend chart ───────────────────────────────
  readonly CHART_W = 300;
  readonly CHART_H = 120;
  selectedMarker = 'glucose';

  get currentTrend(): TrendPoint[] {
    return MOCK_TRENDS[this.selectedMarker] ?? [];
  }

  get currentField(): LabField | undefined {
    return this.fields.find((f) => f.key === this.selectedMarker);
  }

  selectMarker(key: string): void {
    this.selectedMarker = key;
  }

  getChartLinePath(): string {
    return this.buildBezierPath(this.currentTrend);
  }

  getChartAreaPath(): string {
    const pts = this.currentTrend;
    if (pts.length < 2) return '';
    const coords = this.coordsFor(pts);
    const line = this.buildBezierPath(pts);
    const last = coords[coords.length - 1];
    return `${line} L ${last.x.toFixed(1)} ${this.CHART_H} L ${coords[0].x.toFixed(1)} ${this.CHART_H} Z`;
  }

  getChartDots(): { x: number; y: number; value: number; date: string }[] {
    const pts = this.currentTrend;
    return this.coordsFor(pts).map((c, i) => ({
      ...c,
      value: pts[i].value,
      date: pts[i].date,
    }));
  }

  getXLabels(): { x: number; label: string }[] {
    const pts = this.currentTrend;
    return this.coordsFor(pts).map((c, i) => ({ x: c.x, label: pts[i].date }));
  }

  getYGrid(): { y: number; label: string }[] {
    const pts = this.currentTrend;
    if (!pts.length) return [];
    const vals = pts.map((p) => p.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    return [0, 0.5, 1].map((s) => ({
      y: this.CHART_H - 14 - s * (this.CHART_H - 24),
      label: (min + s * range).toFixed(1),
    }));
  }

  private coordsFor(pts: TrendPoint[]): { x: number; y: number }[] {
    const vals = pts.map((p) => p.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const padX = 10,
      padY = 12;
    return pts.map((p, i) => ({
      x: padX + (i / (pts.length - 1)) * (this.CHART_W - 2 * padX),
      y:
        this.CHART_H -
        padY -
        ((p.value - min) / range) * (this.CHART_H - 2 * padY - 10),
    }));
  }

  private buildBezierPath(pts: TrendPoint[]): string {
    if (pts.length < 2) return '';
    const coords = this.coordsFor(pts);
    let d = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
    for (let i = 1; i < coords.length; i++) {
      const p = coords[i - 1],
        c = coords[i];
      const cpx = ((p.x + c.x) / 2).toFixed(1);
      d += ` C ${cpx} ${p.y.toFixed(1)}, ${cpx} ${c.y.toFixed(1)}, ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
    }
    return d;
  }

  // ── BNO autocomplete ──────────────────────────
  bnoQuery = '';
  bnoResults: BnoCode[] = [];
  selectedBnoCodes: BnoCode[] = [];
  bnoOpen = false;

  onBnoInput(event: Event): void {
    const q = (event.target as HTMLInputElement).value;
    this.bnoQuery = q;
    const lq = q.trim().toLowerCase();
    this.bnoResults =
      lq.length > 0
        ? MOCK_BNO.filter(
            (b) =>
              b.code.toLowerCase().includes(lq) ||
              b.name.toLowerCase().includes(lq),
          ).slice(0, 6)
        : [];
    this.bnoOpen = this.bnoResults.length > 0;
  }

  selectBno(b: BnoCode): void {
    if (!this.selectedBnoCodes.some((c) => c.code === b.code)) {
      this.selectedBnoCodes = [...this.selectedBnoCodes, b];
    }
    this.bnoQuery = '';
    this.bnoResults = [];
    this.bnoOpen = false;
  }

  removeBno(code: string): void {
    this.selectedBnoCodes = this.selectedBnoCodes.filter(
      (c) => c.code !== code,
    );
  }

  closeBnoDropdown(): void {
    setTimeout(() => {
      this.bnoOpen = false;
    }, 150);
  }

  // ── Form / lifecycle ──────────────────────────
  ngOnInit(): void {
    this.docId = this.route.snapshot.paramMap.get('id') ?? '';
    this.buildForm();
  }

  private buildForm(): void {
    const controls: Record<string, unknown[]> = {};
    for (const f of this.fields) {
      controls[f.key] = [f.value, [Validators.required]];
    }
    this.form = this.fb.group(controls);
  }

  goBack(): void {
    this.router.navigate(['/app/biomarker-lab']);
  }

  getConfidenceLabel(level: ConfidenceLevel): string {
    return { high: 'Magas', medium: 'Közepes', low: 'Alacsony' }[level];
  }

  hasError(key: string): boolean {
    const ctrl = this.form.get(key);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  onSave(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.saveState = 'saving';
    setTimeout(() => {
      this.saveState = 'saved';
      setTimeout(() => (this.saveState = 'idle'), 3000);
    }, 1200);
  }
}
