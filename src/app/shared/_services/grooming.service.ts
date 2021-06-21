import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GroomingCreated } from '../_models';
import { Grooming } from '../_models/grooming.model';

@Injectable({
  providedIn: 'root'
})
export class GroomingService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  //private customHeaders: Headers = this.setCredentialsHeader();

  /* setCredentialsHeader() {
    let headers = new Headers();
    let credentials = tokenGetter;
    headers.append('Authorization', 'Basic ' + credentials);
    return headers;
  } */

  constructor(private http: HttpClient) { }

  getAll(): Observable<Grooming[]> {
    return this.http.get<Grooming[]>(`${environment.apiUrl}/grooming`, this.httpOptions);
  }

  getById(id: any): Observable<Grooming> {
    return this.http.get<Grooming>(`${environment.apiUrl}/grooming/${id}`, this.httpOptions);
  }

  deleteItem(id: any) {
    return this.http.delete(`${environment.apiUrl}/grooming/${id}`, this.httpOptions);
  }

  createItem(model: GroomingCreated): Observable<Grooming> {
    return this.http.post<Grooming>(`${environment.apiUrl}/grooming`, JSON.stringify(model), this.httpOptions);
  }

  updateItem(model: Grooming, id: number) {
    return this.http.put(`${environment.apiUrl}/grooming/${id}`, JSON.stringify(model), this.httpOptions);
  }

  getExist(model: GroomingCreated) {
    return this.http.post(`${environment.apiUrl}/spreader/exist`, JSON.stringify(model), this.httpOptions);
  }

}
