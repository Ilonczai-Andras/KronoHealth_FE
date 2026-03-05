import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * GET request
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http
      .get<T>(`${this.apiUrl}/${endpoint}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .post<T>(`${this.apiUrl}/${endpoint}`, body)
      .pipe(catchError(this.handleError));
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .put<T>(`${this.apiUrl}/${endpoint}`, body)
      .pipe(catchError(this.handleError));
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http
      .delete<T>(`${this.apiUrl}/${endpoint}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Error handling
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
