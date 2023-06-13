import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TakeExamRoutingModule } from './take-exam-routing.module';
import { TakeExamComponent } from './take-exam.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [TakeExamComponent],
  imports: [
    CommonModule,
    TakeExamRoutingModule,
    ReactiveFormsModule
  ]
})
export class TakeExamModule { }
