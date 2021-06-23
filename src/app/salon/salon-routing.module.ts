import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard';
import { GroomingHomeComponent } from './grooming/grooming-home/grooming-home.component';


const routes: Routes = [
    {
        path: 'salon', component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'inspection/list', pathMatch: 'full' },
            { path: 'inspection/list', component: GroomingHomeComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalonRoutingModule { }