import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  private apiUrl = 'http://127.0.0.1:5050/operations';

  constructor(private http: HttpClient) {}

  scheduleOperation(operation: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, operation);
  }

  getOperations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteOperation(id: number): Observable<any> {
    return this.http.request<any>('delete', this.apiUrl, { body: { id } });
  }

  updateOperation(operation: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, operation);
  }
}
