/* eslint-disable */
export interface UpdateProfileRequest {
  dateOfBirth?: string;
  biologicalSex?: 'MALE' | 'FEMALE' | string;
  heightCm?: number;
  weightKg?: number;
  activityLevel?: string;
}
