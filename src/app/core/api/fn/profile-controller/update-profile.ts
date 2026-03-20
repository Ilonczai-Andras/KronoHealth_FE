/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { UserProfile } from '../../models/user-profile';
import { UpdateProfileRequest } from '../../models/update-profile-request';

export interface UpdateProfile$Params {
  body: UpdateProfileRequest;
}

export function updateProfile(
  http: HttpClient,
  rootUrl: string,
  params: UpdateProfile$Params,
  context?: HttpContext,
): Observable<StrictHttpResponse<UserProfile>> {
  const rb = new RequestBuilder(rootUrl, updateProfile.PATH, 'put');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http
    .request(
      rb.build({ responseType: 'json', accept: 'application/json', context }),
    )
    .pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => r as StrictHttpResponse<UserProfile>),
    );
}

updateProfile.PATH = '/api/v1/profile';
