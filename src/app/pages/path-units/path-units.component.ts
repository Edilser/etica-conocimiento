import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import Chart from "chart.js";
import { saveAs } from 'file-saver';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}
var routeChart;
@Component({
  selector: 'app-path-units',
  templateUrl: './path-units.component.html',
  styleUrls: ['./path-units.component.scss']
})
export class PathUnitsComponent implements OnInit {
  routes:any = [];
  fileToUpload: File | null = null;
  paramsCustomBtn = {text: 'Descargar', show: true, isFile: true, action: "downloadExcel"}
  entries: number = 10;
	selected: any[] = [];
	temp = [];
	activeRow: any;
	columnsIncidentsDetails: any = [
		{
		name: 'Id de ruta',
		prop: 'routeId'
		},
		{
		name: 'Cliente',
		prop: 'client'
		},
		{  
		name: 'Número del conductor',
		prop: 'phoneNameDriver',
		},
		{  
		name: 'Movimiento',
		prop: 'mov',
		}
	]
  rowsIncidentsDetails: any = [

	];
  tableActions = [
		/* {
		name: 'Ver detalle',
		action: 'view',
		icon: 'far fa-eye'
		},
		{
		name: 'Editar',
		action: 'edit',
		icon: 'fas fa-edit text-primary'
		},
		{
		name: 'Eliminar',
		action: 'delete',
		icon: 'fas fa-trash text-danger'
		} */
	];
  rows: any = [];
	SelectionType = SelectionType;
	updateDataInTable = false;
	offset = 0;
	limit = 10;
  totalRoutes = 0;
  routeChart;
  tempDataChart = [];
  stateWidth = true;
  loadingRoutes = {name: 'Cargando rutas', show: false}
  constructor(private apiService: ApiService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.getAllRoutesUnit();
    this.countRoutes();
  }
  getAllRoutesUnit() {
    this.loadingRoutes.show = true;
    this.apiService.getRoutesUnit().subscribe((result: any) => {
        this.routes = result;
        this.totalRoutes = result.totalCount;
        const data = this.setDataFormatgOnTable(this.routes);
        this.setDataTable(data)
    }, error => {
        console.log(<any>error);
      }
    );
  }

  async tableEvents(e) {
    switch (e.action) {
      case 'change_page':
        this.loadingRoutes.show = true;
        if (e.data.date) {
          this.getRoutesPaginationPages({limit: e.data.limit, skip: e.data.skip}, e.data.date).then(res => {
            this.setDataTable(res);
          })
        } else if (e.data.search) {
          this.getRoutesPaginationPages({limit: e.data.limit, skip: e.data.skip}, null, e.data.search).then(res => {
            this.setDataTable(res);
          })
        } else {
          this.getRoutesPaginationPages({limit: e.data.limit, skip: e.data.skip}).then(res => {
            this.setDataTable(res);
          })
        }
        break;
      case 'entries':
        this.loadingRoutes.show = true;
        this.getRoutesPaginationPages({limit: e.data, skip: 0}).then(res => {
          this.setDataTable(res);
        })
        break;
      case 'change_date':
        this.loadingRoutes.show = true;
        this.getRoutePaginationDate(e.data).then(res => {
          this.setDataTable(res);
        })
        break;
      case 'search':
        this.loadingRoutes.show = true;
          this.getRouteActivities(e.data).then(res => {
            this.setDataTable(res);
          });
        break;
      case 'entries-date':
        this.loadingRoutes.show = true;
        this.getRoutesPaginationPages({limit: e.data.entries, skip: 0}, e.data.date).then(res => {
          this.setDataTable(res);
        })
        break;
      case 'entries-search':
        this.loadingRoutes.show = true;
        this.getRoutesPaginationPages({limit: e.data.entries, skip: 0}, null, e.data.search).then(res => {
          this.setDataTable(res);
        })
        break;
      case 'upload':
        if (e.data) {
          this.apiService.uploadPathUnits(e.data).subscribe(data => {
            if(data['message']){
              this.notificationService.showSwal('Carga exitosa', 'se han cargado los datos correctamente', 'success')
              this.getAllRoutesUnit()
            }
          }, error => {
              this.notificationService.showSwal('Ocurrió un inconveniente al cargar las unidades en ruta', 'Por favor intente nuevamente', 'warning')
              console.log(error);
          });
        } else {
          this.notificationService.showSwal('Por favor, seleccione un documento de excel', '', 'warning')
        }
        break;
      case 'downloadExcel':
        this.notificationService.showLoadingSwal('Descargando unidades en ruta', 'Por favor espere un momento...', false)
				this.apiService.getDownloadPathUnit().subscribe((data: any) => {
					/* const blob = new Blob([data.body], { type: 'application/ms-excel;charset=utf-8' }); */
					saveAs(data.body, 'unidadesEnRuta.xlsx')
					this.notificationService.closeLoadingSwal();	
				}, error => {
					this.notificationService.closeLoadingSwal();
          this.notificationService.showSwal('Ocurrió un inconveniente al descargar las unidades en ruta', 'Por favor intente nuevamente', 'error')
					console.error(error);		
				});
        break;
    }
  }

  getRoutesPaginationPages ({limit, skip}, date = null, search = null) {
    return new Promise(resolve => {
      if (date || search) {
        this.apiService.getRoutesFiltersByPagination(limit, skip, date ? date: null, search ? search : null).subscribe((res: any) => {
          if (res.results.length > 0) {
            resolve(this.setDataFormatgOnTable(res))
          } else {
            resolve([]);
          }
        })
      } else {
        this.apiService.getRoutesFiltersByPagination(limit, skip).subscribe((res: any) => {
          if (res.results.length > 0) {
            resolve(this.setDataFormatgOnTable(res))
          } else {
            resolve([]);
          }
        })
      }
    })
  }

  getRoutePaginationDate (date) {
    return new Promise(resolve => {
      this.apiService.getRoutesFiltersByDate(date).subscribe((res: any) => {
        this.totalRoutes = res.totalCount;
        if (res.results.length > 0) {
          resolve(this.setDataFormatgOnTable(res))
        } else {
          resolve([]);
        }
      })
    })
  }

  getRouteActivities (data) {
    return new Promise(resolve => {
      this.apiService.getRoutesFiltersBySearch(data).subscribe((res: any) => {
        this.totalRoutes = res.totalCount;
        if (res.results.length > 0) {
          resolve(this.setDataFormatgOnTable(res))
        } else {
          resolve([]);
        }
      })
    })
  }

  async countRoutes () {
    const distribution: any = await this.apiService.getRoutesByTypeMov('Distribucion');
    const graneleras: any = await this.apiService.getRoutesByTypeMov('Graneleras');
    const reparto: any = await this.apiService.getRoutesByTypeMov('Reparto');
    if (distribution && graneleras && reparto) {
      this.setChartRoutes([distribution.total, graneleras.total, reparto.total]);
    }
  }

  onResize(event) {
    const width = event.target.innerWidth;
    if (width <= 760 && this.stateWidth) {
      this.setChartRoutes([], 1);
      this.stateWidth = false;
    } else if (width > 760 && !this.stateWidth) {
      this.stateWidth = true;
      this.setChartRoutes([], 0)
    }
  }

  setChartRoutes (dataTotal, type = null) {
    const typeChart = ['bar', 'horizontalBar'];
    if (this.tempDataChart.length > 0) {
      this.routeChart.destroy();
      this.setChartByWidthScreen(typeChart[type], this.tempDataChart)
    } else {
      this.tempDataChart = dataTotal;
      if (window.innerWidth <= 760) {
        this.setChartByWidthScreen(typeChart[1], dataTotal)
      } else {
        this.setChartByWidthScreen(typeChart[0], dataTotal)
      }
    }
  }

  setChartByWidthScreen (type, dataTotal) {
    const labels = ['Distribución', 'Graneleras', 'Reparto']
    const colors = ['#75B8EC', '#67D847', '#F38901', '#DA7157', '#AD57DA', '#33D15B', '#728476', '#BCDF71', '#DAF418', '#E5C70D', '#A713A4', '#221E60'];
    const chartTotal = document.getElementById("chart-bars");
    routeChart = new Chart(chartTotal, {
      type: type,
      data: {
        labels: labels,
        datasets: [{
          axis: 'y',
          label: '',
          data: dataTotal,
          fill: false,
          borderColor: colors,
          backgroundColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          yAxes: [{
            ticks: {
              suggestedMin: 0
            }
          }],
          xAxes: [{
            ticks: {
              suggestedMin: 0
            }
          }]
        },
        legend: {
          display: false
        },
        responsive: true,
          hover: {
            animationDuration: 0
          },
          animation: {
            onComplete: function() {
              const chartInstance = routeChart,
              ctx = chartInstance.ctx;
              ctx.font = Chart.helpers.fontString(
                12,
                Chart.defaults.global.defaultFontStyle,
                Chart.defaults.global.defaultFontFamily
              );
              this.data.datasets.forEach(function(dataset, i) {
                const meta = chartInstance.controller.getDatasetMeta(i);
                meta.data.forEach(function(bar, index) {
                  const data = dataset.data[index];
                  ctx.fillStyle = "#000";
                  ctx.fillText(data, bar._model.x, bar._model.y-2);
                });
              });
            }
          },
      }
    });
  }

  setDataFormatgOnTable (array) {
    const temp = []
    array.results.forEach(route => {
      temp.push({
        routeId: route?.routeId ? route.routeId : '',
        client: route?.client ? route.client : '', 
        phoneNameDriver: route?.phoneNameDriver ? route.phoneNameDriver : '', 
        mov: route?.mov ? route.mov : '', 
      })
    });
    return temp;
  }

  setDataTable (data) {
    this.rowsIncidentsDetails = data;
    this.updateDataInTable = true;
    setTimeout(() => {
      this.loadingRoutes.show = false;
      this.updateDataInTable = false;
    }, 1000);
  }
}
