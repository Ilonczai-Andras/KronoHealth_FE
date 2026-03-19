import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KrIconComponent } from '@shared/components/kr-icon/kr-icon.component';

export interface WeightEntry {
  date: string;      // ISO date string
  weightKg: number;
  bmi: number | null;
  note: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, KrIconComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  weightForm!: FormGroup;
  readonly Math = Math;

  weightHistory: WeightEntry[] = [];

  readonly sexOptions = [
    { value: 'male',   label: 'Férfi' },
    { value: 'female', label: 'Nő'    },
    { value: 'other',  label: 'Egyéb' },
  ];

  readonly activityOptions = [
    { value: 'sedentary',     label: 'Ülő (kevés vagy semmi mozgás)'          },
    { value: 'light',         label: 'Könnyű (heti 1–3 nap sport)'            },
    { value: 'moderate',      label: 'Mérsékelt (heti 3–5 nap sport)'         },
    { value: 'active',        label: 'Aktív (heti 6–7 nap sport)'             },
    { value: 'very_active',   label: 'Nagyon aktív (napi intenzív edzés)'     },
  ];

  get bmi(): number | null {
    const { heightCm, weightKg } = this.form?.value ?? {};
    if (!heightCm || !weightKg || heightCm <= 0) return null;
    const h = heightCm / 100;
    return Math.round((weightKg / (h * h)) * 10) / 10;
  }

  get bmr(): number | null {
    const { heightCm, weightKg, dateOfBirth, sex } = this.form?.value ?? {};
    if (!heightCm || !weightKg || !dateOfBirth || !sex) return null;
    const age = Math.floor((Date.now() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000));
    if (sex === 'male') {
      return Math.round(88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age);
    } else {
      return Math.round(447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.330 * age);
    }
  }

  get bmiCategory(): string {
    const b = this.bmi;
    if (b === null) return '';
    if (b < 18.5) return 'Alulsúlyos';
    if (b < 25)   return 'Normál';
    if (b < 30)   return 'Túlsúlyos';
    return 'Elhízott';
  }

  get bmiClass(): string {
    const b = this.bmi;
    if (b === null) return '';
    if (b < 18.5) return 'warn';
    if (b < 25)   return 'ok';
    if (b < 30)   return 'warn';
    return 'danger';
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.weightForm = this.fb.group({
      date:     [new Date().toISOString().split('T')[0], Validators.required],
      weightKg: [null, [Validators.required, Validators.min(20), Validators.max(500)]],
      note:     ['']
    });

    this.form = this.fb.group({
      fullName:    ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', Validators.required],
      sex:         ['', Validators.required],
      heightCm:    [null, [Validators.required, Validators.min(50), Validators.max(280)]],
      weightKg:    [null, [Validators.required, Validators.min(20), Validators.max(500)]],
      activityLevel: ['', Validators.required],
    });
  }

  get fullName()      { return this.form.get('fullName')!; }
  get dateOfBirth()   { return this.form.get('dateOfBirth')!; }
  get sex()           { return this.form.get('sex')!; }
  get heightCm()      { return this.form.get('heightCm')!; }
  get weightKg()      { return this.form.get('weightKg')!; }
  get activityLevel() { return this.form.get('activityLevel')!; }

  get wDate()     { return this.weightForm.get('date')!; }
  get wWeightKg() { return this.weightForm.get('weightKg')!; }

  get weightDelta(): number | null {
    if (this.weightHistory.length < 2) return null;
    const last  = this.weightHistory[0].weightKg;
    const prev  = this.weightHistory[1].weightKg;
    return Math.round((last - prev) * 10) / 10;
  }

  addWeightEntry(): void {
    if (this.weightForm.invalid) {
      this.weightForm.markAllAsTouched();
      return;
    }
    const { date, weightKg, note } = this.weightForm.value;
    const heightCm = this.form.get('heightCm')?.value;
    let bmi: number | null = null;
    if (heightCm && weightKg) {
      const h = heightCm / 100;
      bmi = Math.round((weightKg / (h * h)) * 10) / 10;
    }
    this.weightHistory = [
      { date, weightKg, bmi, note: note ?? '' },
      ...this.weightHistory
    ];
    this.weightForm.patchValue({ weightKg: null, note: '' });
  }

  removeWeightEntry(index: number): void {
    this.weightHistory = this.weightHistory.filter((_, i) => i !== index);
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // TODO: dispatch profile save action / call profile API
    console.log('Profile data:', this.form.value);
  }
}
