import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { KrIconComponent } from '@shared/components/kr-icon/kr-icon.component';
import { loadProfile } from '@store/user/user.actions';
import {
  selectUserProfile,
  selectUserLoading,
} from '@store/user/user.selectors';
import { UserProfile } from '@core/api/models/user-profile';

export interface WeightEntry {
  date: string; // ISO date string
  weightKg: number;
  bmi: number | null;
  note: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, KrIconComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  weightForm!: FormGroup;
  readonly Math = Math;

  weightHistory: WeightEntry[] = [];

  profile$ = this.store.select(selectUserProfile);
  loading$ = this.store.select(selectUserLoading);
  private profileData: UserProfile | null = null;

  readonly sexOptions = [
    { value: 'male', label: 'Férfi' },
    { value: 'female', label: 'Nő' },
    { value: 'other', label: 'Egyéb' },
  ];

  readonly activityOptions = [
    { value: 'sedentary', label: 'Ülő (kevés vagy semmi mozgás)' },
    { value: 'light', label: 'Könnyű (heti 1–3 nap sport)' },
    { value: 'moderate', label: 'Mérsékelt (heti 3–5 nap sport)' },
    { value: 'active', label: 'Aktív (heti 6–7 nap sport)' },
    { value: 'very_active', label: 'Nagyon aktív (napi intenzív edzés)' },
  ];

  get bmi(): number | null {
    return this.profileData?.bmi ?? null;
  }

  get bmr(): number | null {
    return this.profileData?.bmr ?? null;
  }

  get tdee(): number | null {
    return this.profileData?.tdee ?? null;
  }

  get bmiCategory(): string {
    const b = this.bmi;
    if (b === null) return '';
    if (b < 18.5) return 'Alulsúlyos';
    if (b < 25) return 'Normál';
    if (b < 30) return 'Túlsúlyos';
    return 'Elhízott';
  }

  get bmiClass(): string {
    const b = this.bmi;
    if (b === null) return '';
    if (b < 18.5) return 'warn';
    if (b < 25) return 'ok';
    if (b < 30) return 'warn';
    return 'danger';
  }

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.weightForm = this.fb.group({
      date: [new Date().toISOString().split('T')[0], Validators.required],
      weightKg: [
        null,
        [Validators.required, Validators.min(20), Validators.max(500)],
      ],
      note: [''],
    });

    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', Validators.required],
      sex: ['', Validators.required],
      heightCm: [
        null,
        [Validators.required, Validators.min(50), Validators.max(280)],
      ],
      weightKg: [
        null,
        [Validators.required, Validators.min(20), Validators.max(500)],
      ],
      activityLevel: ['', Validators.required],
    });

    this.store.dispatch(loadProfile());

    this.profile$.subscribe((profile) => {
      if (!profile) return;
      this.profileData = profile;
      this.form.patchValue({
        fullName: profile.name ?? '',
        dateOfBirth: profile.dateOfBirth ?? '',
        sex: this.mapBiologicalSex(profile.biologicalSex),
        heightCm: profile.heightCm ?? null,
        weightKg: profile.weightKg ?? null,
        activityLevel: this.mapActivityLevel(profile.activityLevel),
      });
    });
  }

  private mapBiologicalSex(value?: string): string {
    if (!value) return '';
    const map: Record<string, string> = {
      MALE: 'male',
      FEMALE: 'female',
      OTHER: 'other',
    };
    return map[value.toUpperCase()] ?? value.toLowerCase();
  }

  private mapActivityLevel(value?: string): string {
    if (!value) return '';
    const map: Record<string, string> = {
      SEDENTARY: 'sedentary',
      LIGHTLY_ACTIVE: 'light',
      LIGHT: 'light',
      MODERATELY_ACTIVE: 'moderate',
      MODERATE: 'moderate',
      VERY_ACTIVE: 'active',
      ACTIVE: 'active',
      EXTRA_ACTIVE: 'very_active',
    };
    return map[value.toUpperCase()] ?? value.toLowerCase();
  }

  get fullName() {
    return this.form.get('fullName')!;
  }
  get dateOfBirth() {
    return this.form.get('dateOfBirth')!;
  }
  get sex() {
    return this.form.get('sex')!;
  }
  get heightCm() {
    return this.form.get('heightCm')!;
  }
  get weightKg() {
    return this.form.get('weightKg')!;
  }
  get activityLevel() {
    return this.form.get('activityLevel')!;
  }

  get wDate() {
    return this.weightForm.get('date')!;
  }
  get wWeightKg() {
    return this.weightForm.get('weightKg')!;
  }

  get weightDelta(): number | null {
    if (this.weightHistory.length < 2) return null;
    const last = this.weightHistory[0].weightKg;
    const prev = this.weightHistory[1].weightKg;
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
      ...this.weightHistory,
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
