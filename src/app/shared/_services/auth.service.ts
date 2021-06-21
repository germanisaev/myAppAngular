import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';


import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private userSubject: BehaviorSubject<string>;
    public user: Observable<string>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        const storage: string = localStorage.getItem('user');
        this.userSubject = new BehaviorSubject<string>(storage);
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): string {
        return this.userSubject.value;
    }

    login(credentials) {
        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, credentials)
            .pipe(
                catchError(this.errorHandler),
                map(
                user => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('user', JSON.stringify(user));
                    this.userSubject.next(JSON.stringify(user));
                    return user;
                },
                err => {
                    console.error(err);
                    return null;
                })
                );
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }



    /* login(email:string, password:string ) {
        return this.http.post<User>('/api/login', {email, password})
            .do(res => this.setSession) 
            .shareReplay();
    } */
          
    private setSession(authResult) {
        const expiresAt = moment().add(authResult.expiresIn,'second');

        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    }          

    /* logout() {
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
    } */

    public isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }  
    
    errorHandler(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }
}