import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewModuleComponent } from './view-module.component';


const routes: Routes = [
  {
    path: ':id',
    component: ViewModuleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewModuleRoutingModule { }
