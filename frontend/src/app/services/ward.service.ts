import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WardService {
  private wardsSubject = new Subject<any[]>();
  wards$ = this.wardsSubject.asObservable();

  private apiUrl = 'http://127.0.0.1:5000/wards';

  constructor(private http: HttpClient) {}

  getWards(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addWard(wardName: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { name: wardName });
  }

  deleteWard(id: number): Observable<any> {
    return this.http.request<any>('delete', this.apiUrl, { body: { id } });
  }

  loadWards() {
    this.getWards().subscribe(
      (wards) => this.wardsSubject.next(wards),
      (error) => console.error('Error loading wards', error)
    );
  }
  refreshWards() {
    this.loadWards();
  }
}
