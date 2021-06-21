import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../shared/_services/auth.service';
import { SalonRoutingModule } from './salon-routing.module';
import { DashboardComponent } from './dashboard';
import { HeaderComponent } from './header/header.component';
import { GroomingSalonListComponent } from './grooming-salon-list';
import { FilterPipe } from '../shared/_pipes/filter.pipe';
import { ModalAppointmnetComponent } from './modal-appointmnet';
import { ModalContentComponent } from './modal-content/modal-content.component';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SalonRoutingModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        DashboardComponent,
        GroomingSalonListComponent,
        ModalAppointmnetComponent,
        ModalContentComponent,
        HeaderComponent,
        FilterPipe,
    ],
    providers: [
        AuthService
    ]
})
export class SalonModule { }