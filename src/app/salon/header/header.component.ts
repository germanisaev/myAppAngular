import { AfterViewInit, Component, OnChanges } from '@angular/core';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/shared/_services/auth.service';


@Component({
  selector: 'tool-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  fullname: any;

  constructor(private authService: AuthService) { 
    var token = this.authService.userValue;
    let decoded: any = jwt_decode(JSON.stringify(token));
    this.fullname = decoded.given_name + ' ' + decoded.family_name;
    localStorage.setItem('storage', this.fullname);
  }

  logout() {
    this.authService.logout();
  }

}
