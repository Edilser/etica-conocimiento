import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultExamRoutingModule } from './result-exam-routing.module';
import { ResultExamComponent } from './result-exam.component';


@NgModule({
  declarations: [ResultExamComponent],
  imports: [
    CommonModule,
    ResultExamRoutingModule
  ]
})
export class ResultExamModule { }
