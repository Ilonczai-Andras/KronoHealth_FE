import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfiguration } from '@core/api/api-configuration';
import { UserProfile } from '@core/api/models/user-profile';
import { getProfile } from '@core/api/fn/profile-controller/get-profile';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(
    private http: HttpClient,
    private config: ApiConfiguration,
  ) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      `${this.config.rootUrl}${getProfile.PATH}`,
    );
  }
}
