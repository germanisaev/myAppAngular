import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { tokenGetter } from '@app/app.module';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private jwtHelper: JwtHelperService
    ) { }

    canActivate() {
        const refreshToken = tokenGetter();
        
        if (refreshToken && !this.jwtHelper.isTokenExpired(refreshToken)) {
            return true;
        }
        this.router.navigate(['login']);
        return false;
    }
}