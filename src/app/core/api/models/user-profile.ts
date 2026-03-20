/* eslint-disable */
export interface UserProfile {
  name?: string;
  email?: string;
  dateOfBirth?: string;
  biologicalSex?: 'MALE' | 'FEMALE';
  heightCm?: number;
  weightKg?: number;
  activityLevel?:
    | 'SEDENTARY'
    | 'LIGHTLY_ACTIVE'
    | 'MODERATELY_ACTIVE'
    | 'VERY_ACTIVE'
    | 'EXTRA_ACTIVE'
    | string;
  bmi?: number;
  bmr?: number;
  tdee?: number;
}
