import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResultExamComponent } from './result-exam.component';


const routes: Routes = [
  {
    path: '',
    component: ResultExamComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultExamRoutingModule { }
