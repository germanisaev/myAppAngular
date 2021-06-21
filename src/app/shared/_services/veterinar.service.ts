import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Veterinar } from '../_models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VeterinarService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getAll(): Observable<Veterinar[]> {
    return this.http.get<Veterinar[]>(`${environment.apiUrl}/veterinars`);
  }

  getBy(id: any): Observable<Veterinar> {
    return this.http.get<Veterinar>(`${environment.apiUrl}/veterinars/${id}`);
  }
}
