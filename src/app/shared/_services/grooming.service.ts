import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Inspection } from '../_models';

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

  

  _baseUrl = environment.apiUrl + '/grooming';

  constructor(private http: HttpClient) { }

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  private getCollectionUrl() {
    return this._baseUrl;
  }

  private getElementUrl(elementId: any) {
    return this._baseUrl + '/' + encodeURIComponent(String(elementId));
  }

  getAll(): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(this.getCollectionUrl(), this.httpOptions);
  }

  getById(id: any): Observable<Inspection> {
    return this.http.get<Inspection>(this.getElementUrl(id), this.httpOptions);
  }

  deleteItem(id: any) {
    return this.http.delete(this.getElementUrl(id), this.httpOptions);
  }

  createItem(model: Inspection): Observable<Inspection> {
    return this.http.post<Inspection>(this.getCollectionUrl(), JSON.stringify(model), this.httpOptions)
    .pipe(
      tap(() => {
        this.refreshNeeded$.next();
      }));
  }

  updateItem(model: Inspection, id?: number) {
    if(!id) {
      id = model.Id
    }
    return this.http.put(this.getElementUrl(id), JSON.stringify(model), this.httpOptions)
    .pipe(
      tap(() => {
        this.refreshNeeded$.next();
      }));
  }

  getExist(model: Inspection) {
    return this.http.post(`${environment.apiUrl}/spreader/exist`, JSON.stringify(model), this.httpOptions);
  }

}
