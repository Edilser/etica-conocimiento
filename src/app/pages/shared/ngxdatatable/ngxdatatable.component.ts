import { EventEmitter, HostListener, Output, SimpleChanges, ViewChild } from "@angular/core";
import { Component, Input, OnInit } from "@angular/core";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { BsDatepickerDirective, BsLocaleService } from 'ngx-bootstrap';
import { esLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as moment from 'moment';
import { ApiService } from "src/app/services/api.service";
defineLocale('es', esLocale)
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}
interface TableColumn {
  name: string;
  prop: string;
}

interface RowAction {
  name: string;
  action: string;
  icon: string;
}
@Component({
  selector: "app-ngxdatatablesshared",
  templateUrl: "ngxdatatable.component.html"
})
export class NgxDatatablesComponent implements OnInit {
  @ViewChild('table') table: DatatableComponent;
  @ViewChild(BsDatepickerDirective, { static: false }) datepicker?: BsDatepickerDirective;
  @Input() title = '';
  @Input() description = '';
  @Input() columns = [];
  @Input() rows = [];
  @Input() rowActions: RowAction[];
  @Input() enableSelectMultiple: boolean;
  @Input() refreshTable: boolean;
  @Input() totalElements: number;
  @Input() offset: number;
  @Input() limit: number;
  @Output() tableEventEmitter = new EventEmitter();
  @Input() searchField: any = '';
  @Input() customBtn = {text: '', show: false, action: '', isFile: false};
  @Input() parentId = '';
  @Input() isLoading = {name: '', show: false};
  @Input() messageEmpyData = {
    emptyMessage: `
    <div>
      <p class="text-danger">No hay registros</p>
    </div>
  `,
  totalMessage: 'total'
  }
  isOpen = false;
  searchTerm = '';
  entries = 10;
  page = 0;
  timeoutInputSearch = null;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  maxDate: Date;

  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  showDateFilter: boolean = false;

  @HostListener('window:scroll')
  onScrollEvent() {
    this.datepicker?.hide();
  }
  valueDate:any = '';
  searchData = 'JOSE'
  constructor(private localService: BsLocaleService, private apiService: ApiService) {
    this.localService.use('es')
    this.temp = this.rows.map((prop, key) => {
      return {
        ...prop,
        id: key
      };
    });
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate())
  }

  openDatePicker() {
    if (this.isOpen) this.isOpen = false
    else this.isOpen = true;
  }

  printDate(date) {
    this.emmitRowAction('filterByDate', date.value)
    
  }
  customButton () {
    this.emmitRowAction('custom')
  }
  entriesChange($event) {
    this.table.offset = 0;
    this.entries = $event.target.value;
    if (this.searchField) this.emmitRowAction('entries-search');
    else if (this.valueDate) this.emmitRowAction('entries-date');
    else this.emmitRowAction('entries');
  }

  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  filterTable($event) {
    this.valueDate = ''
    this.isLoading.show = true;
    const input:any = document.getElementById('valueDate');
    input.value = '';
    this.timeoutInputSearch != null ? clearTimeout(this.timeoutInputSearch) : null;
    this.timeoutInputSearch = setTimeout(async () => {
      let val = $event.target.value;
      this.searchField = this.toTitleCase(val);
      this.emmitRowAction('search');
      this.table.offset = 0;
    }, 1000);
    /* this.temp = this.rows.filter(function(d) {
      for (var key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    }); */
  }
  
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push({...selected});
  }
  onActivate(event) {
    this.activeRow = event.row;
  }

  ngOnInit() {
    this.rowActions = this.apiService.getActionsByTable(this.rowActions)
    this.updateTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.refreshTable) {
        if (changes.refreshTable.currentValue) {
            this.updateTable();
            this.refreshTable = false;
        }
    }
  }

  dateChange(value: Date): void {
    const input:any = document.getElementById('searchData');
    input.value = '';
    this.table.offset = 0;
    this.valueDate = moment(value).format('DD/MM/YYYY')
    this.emmitRowAction('change_date');
  }

  updateTable() {
      this.temp = this.rows.map((prop, key) => {
          return {
              ...prop,
              id: key
          };
      });
  }

  setPage(event) {
      this.page = event.offset + 1;
      this.emmitRowAction('change_page', this.valueDate, event);
  }

  uploadExcel(files: FileList) {
    if (files.length > 0) {
      this.emmitRowAction('upload', files.item(0))
    } else this.emmitRowAction('upload')
  }

  emmitRowAction(action, date = null, event = null) {
      if (action == 'change_page') {
          this.tableEventEmitter.emit({
              data: {
                limit: event.limit,
                skip: event.offset*event.limit,
                date: this.valueDate ? this.valueDate : null,
                search: this.searchField ? this.searchField : null
              },
              action: action,
              parentId: this.parentId
          });
      } else if (action == 'change_date') {
        this.tableEventEmitter.emit({
          data: this.valueDate,
          action: action,
          parentId: this.parentId
        });
      } else if (action == 'entries') {
          this.tableEventEmitter.emit({
              data: this.entries,
              action: action,
              parentId: this.parentId
          });
      } else if (action == 'entries-search') {
        this.tableEventEmitter.emit({
            data: {search: this.searchField, entries: this.entries},
            action: action,
            parentId: this.parentId
        });
      } else if (action == 'entries-date') {
        this.tableEventEmitter.emit({
          data: {date: this.valueDate, entries: this.entries},
          action: action,
          parentId: this.parentId
        });
      } else if (action == 'search') {
          this.tableEventEmitter.emit({
            data: this.searchField,
            action: action,
            parentId: this.parentId
          });
      } else if (action == 'custom') {
        this.tableEventEmitter.emit({
          data: '',
          action: this.customBtn.action,
          parentId: this.parentId
        })
      } else if (action === 'filterByDate') {
        this.tableEventEmitter.emit({
          data: date,
          action: action,
          parentId: this.parentId
        });
      } else if (action === 'upload') {
        this.tableEventEmitter.emit({
          data: date,
          action: action,
          parentId: this.parentId
        });
      } else {
        this.tableEventEmitter.emit({
          data: this.activeRow,
          action: action,
          parentId: this.parentId
        });
      }
  }
}
