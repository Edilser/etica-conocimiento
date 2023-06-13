import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from "ngx-bootstrap/pagination";

import { PathUnitsRoutingModule } from './path-units-routing.module';
import { PathUnitsComponent } from './path-units.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [PathUnitsComponent],
  imports: [
    CommonModule,
    PathUnitsRoutingModule,
    SharedModule,
    PaginationModule.forRoot()

  ]
})
export class PathUnitsModule { }
