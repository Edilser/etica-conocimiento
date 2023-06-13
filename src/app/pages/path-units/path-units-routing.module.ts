import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathUnitsComponent } from './path-units.component';


const routes: Routes = [
  {
    path: '',
    component: PathUnitsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PathUnitsRoutingModule { }
