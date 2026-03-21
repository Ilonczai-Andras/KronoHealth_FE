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
  confidence: ConfidenceLevel; // 0-100 → mapped to level
  confidencePct: number;
  validators?: 'required' | 'number';
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
    // Simulate async save – replace with real API call
    setTimeout(() => {
      this.saveState = 'saved';
      setTimeout(() => (this.saveState = 'idle'), 3000);
    }, 1200);
  }
}
