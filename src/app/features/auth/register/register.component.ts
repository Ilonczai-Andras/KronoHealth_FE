import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { KrIconComponent } from '@shared/components/kr-icon/kr-icon.component';
import { CommonModule } from '@angular/common';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pw  = control.get('password')?.value;
  const pw2 = control.get('confirmPassword')?.value;
  return pw && pw2 && pw !== pw2 ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, KrIconComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  showPassword        = false;
  showConfirmPassword = false;
  isLoading           = false;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        fullName:        ['', [Validators.required, Validators.minLength(2)]],
        email:           ['', [Validators.required, Validators.email]],
        password:        ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        acceptTerms:     [false, Validators.requiredTrue]
      },
      { validators: passwordMatchValidator }
    );
  }

  get fullName()        { return this.form.get('fullName')!; }
  get email()           { return this.form.get('email')!; }
  get password()        { return this.form.get('password')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; }
  get acceptTerms()     { return this.form.get('acceptTerms')!; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    // TODO: dispatch register action via NgRx
    setTimeout(() => { this.isLoading = false; }, 1500);
  }
}
