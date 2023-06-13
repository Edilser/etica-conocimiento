import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TakeExamComponent } from './take-exam.component';


const routes: Routes = [
  {
    path: ':id',
    component: TakeExamComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TakeExamRoutingModule { }
