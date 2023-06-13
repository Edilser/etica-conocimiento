import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProgressbarModule, BsDropdownModule, PaginationModule, TooltipModule, ModalModule } from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPrintModule } from 'ngx-print';
import { NgxDatatablesComponent } from './ngxdatatable/ngxdatatable.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
@NgModule({
  declarations: [NgxDatatablesComponent, AutocompleteComponent],
  imports: [
    CommonModule,
    NgxDatatableModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    NgxPrintModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  exports: [
    NgxDatatablesComponent,
    AutocompleteComponent
  ]
})
export class SharedModule { }
