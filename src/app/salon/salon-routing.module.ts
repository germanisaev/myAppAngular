import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard';
import { GroomingSalonListComponent } from './grooming-salon-list';


const routes: Routes = [
    {
        path: 'salon', component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'inspection/list', pathMatch: 'full' },
            { path: 'inspection/list', component: GroomingSalonListComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalonRoutingModule { }