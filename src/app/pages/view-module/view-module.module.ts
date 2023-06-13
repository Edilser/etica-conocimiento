import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewModuleRoutingModule } from './view-module-routing.module';
import { ViewModuleComponent } from './view-module.component';


@NgModule({
  declarations: [ViewModuleComponent],
  imports: [
    CommonModule,
    ViewModuleRoutingModule
  ]
})
export class ViewModuleModule { }
