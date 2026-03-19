import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfiguration } from '@core/api/api-configuration';
import { LoginRequest } from '@core/api/models/login-request';
import { RegisterRequest } from '@core/api/models/register-request';
import { AuthResponse } from '@core/api/models/auth-response';
import { login } from '@core/api/fn/auth-controller/login';
import { register } from '@core/api/fn/auth-controller/register';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private config: ApiConfiguration) {}

  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.config.rootUrl}${login.PATH}`, body);
  }

  register(body: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.config.rootUrl}${register.PATH}`, body);
  }
}
