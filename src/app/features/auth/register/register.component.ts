import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { KrIconComponent } from '@shared/components/kr-icon/kr-icon.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { registerAction } from '@app/store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '@app/store/auth/auth.selectors';

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
export class RegisterComponent implements OnInit, OnDestroy {

  showPassword        = false;
  showConfirmPassword = false;
  isLoading           = false;
  error: string | null = null;

  form: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private store: Store) {
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

  ngOnInit(): void {
    this.store.select(selectAuthLoading).pipe(takeUntil(this.destroy$)).subscribe(l => this.isLoading = l);
    this.store.select(selectAuthError).pipe(takeUntil(this.destroy$)).subscribe(e => this.error = e);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    const { fullName: name, email, password } = this.form.value;
    this.store.dispatch(registerAction({ name, email, password }));
  }
}
