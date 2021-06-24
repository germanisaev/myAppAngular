import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../shared/_services/auth.service';
import { GroomingService } from '../shared/_services/grooming.service';

import { SalonRoutingModule } from './salon-routing.module';
import { DashboardComponent } from './dashboard';
import { HeaderComponent } from './header/header.component';
import { FilterPipe } from '../shared/_pipes/filter.pipe';
import { ModalCreateComponent } from './modal-create';
import { ModalEditComponent } from './modal-edit/modal-edit.component';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { GroomingHomeComponent } from './grooming/grooming-home/grooming-home.component';
import { GroomingTableComponent } from './grooming/grooming-table/grooming-table.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { GrommingToolsComponent } from './grooming/gromming-tools/gromming-tools.component';
import { ModalViewComponent } from './modal-view/modal-view.component';
import { GroomingFormComponent } from './grooming/grooming-form/grooming-form.component';
import { CustomerService, VeterinarService } from '@app/shared/_services';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SalonRoutingModule,
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        TooltipModule.forRoot()
    ],
    declarations: [
        DashboardComponent,
        ModalCreateComponent,
        ModalEditComponent,
        HeaderComponent,
        FilterPipe,
        GroomingHomeComponent,
        GroomingTableComponent,
        ModalConfirmComponent,
        GrommingToolsComponent,
        ModalViewComponent,
        GroomingFormComponent,
    ],
    providers: [
        AuthService,
        GroomingService,
        CustomerService,
        VeterinarService
    ]
})
export class SalonModule { }