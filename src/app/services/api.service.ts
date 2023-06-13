import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  @Output() public outEven: EventEmitter<any> = new EventEmitter();
  httpOptions;
  httpOptionsFilters;
  filesHttpOptions;

  API_URL = environment.api_url;
  constructor(private http: HttpClient,
    private router: Router) {
    if (localStorage.getItem("token")) {
      this.setHttpOptions(localStorage.getItem("token"), localStorage.getItem('token_type'))
    } 
  }

  setHttpOptions(token, tokenType) {
      localStorage.setItem('token', token);
      localStorage.setItem('token_type', tokenType);
      this.httpOptions = {
          headers: new HttpHeaders({
                  Authorization: `${tokenType} ${token}`,
                  'Content-type': 'application/json'
              }
          )
      };

      this.httpOptionsFilters = new HttpHeaders({
        Authorization: `${tokenType} ${token}`,
        'Content-type': 'application/json'
      })

      this.filesHttpOptions = {
          headers: new HttpHeaders({
              Authorization: 'Bearer ' + token
          })
      }
  }

  getCountries() {    
    return new Promise(resolve => {
      this.http.get(`${this.API_URL}/country`, this.httpOptions)
        .subscribe((response: any) => {
            //!TODO request and saves user data
            resolve(response.results)
        }, error => {
            resolve(false);
            console.log(error);
            if (error.status == 401 && error.error == "Unauthorized"){
              this.router.navigate(["/auth/login"])
            }
        });
    });
  }

  getCountry(countryId) {    
    return new Promise(resolve => {
      this.http.get(`${this.API_URL}/country/${countryId}`, this.httpOptions)
        .subscribe((response: any) => {
            //!TODO request and saves user data
            resolve(response)
        }, error => {
            resolve(false);
            console.log(error);
            if (error.status == 401 && error.error == "Unauthorized"){
              this.router.navigate(["/auth/login"])
            }
        });
    });
  }

  getIndustries() {    
    return new Promise(resolve => {
      this.http.get(`${this.API_URL}/industry`, this.httpOptions)
        .subscribe((response: any) => {
            //!TODO request and saves user data
            resolve(response.results)
        }, error => {
            resolve(false);
            console.log(error);
            if (error.status == 401 && error.error == "Unauthorized"){
              this.router.navigate(["/auth/login"])
            }
        });
    });
  }

  getIndustry(industryId) {    
    return new Promise(resolve => {
      this.http.get(`${this.API_URL}/industry/${industryId}`, this.httpOptions)
        .subscribe(response => {
            //!TODO request and saves user data
            resolve(response)
        }, error => {
            resolve(false);
            console.log(error);
            if (error.status == 401 && error.error == "Unauthorized"){
              this.router.navigate(["/auth/login"])
            }
        });
    });
  }

  getCommerces() {    
    return new Promise(resolve => {
      this.http.get(`${this.API_URL}/commerce`, this.httpOptions)
        .subscribe((response: any) => {
            //!TODO request and saves user data
            resolve(response.results)
        }, error => {
            resolve(false);
            console.log(error);
            if (error.status == 401 && error.error == "Unauthorized"){
              this.router.navigate(["/auth/login"])
            }
        });
    });
  }

  getCommerce(commerceId) {    
    return new Promise(resolve => {
      this.http.get(`${this.API_URL}/commerce/${commerceId}`, this.httpOptions)
        .subscribe(response => {
            //!TODO request and saves user data
            resolve(response)
        }, error => {
            resolve(false);
            console.log(error);
            if (error.status == 401 && error.error == "Unauthorized"){
              this.router.navigate(["/auth/login"])
            }
        });
    });
  }
  getUsers(){
    return this.http.get(`${this.API_URL}/user?limit=10`, this.httpOptions);
  }
  registerUser(user) {
    return this.http.post(`${this.API_URL}/auth/register`, user, this.httpOptions);
  }
  deleteUser(id) {
    return this.http.delete(`${this.API_URL}/user/${id}`, this.httpOptions);
  }
  getRoles() {    
    return this.http.get(`${this.API_URL}/role`, this.httpOptions);
  }
  getRoutesUnit() {    
    return this.http.get(`${this.API_URL}/routeunit?limit=10`, this.httpOptions);
  }

  uploadPathUnits(fileToUpload: File){
    const formData: FormData = new FormData();
    formData.append('routes', fileToUpload, fileToUpload.name);
    return this.http.post(`${this.API_URL}/import/routes`, formData, this.filesHttpOptions);
  }
  getJobApplications({country, industry}) {
    if (country && industry) {
      return this.http.get(`${this.API_URL}/jobapplication?country=${country}&industry=${industry}`, this.httpOptions);
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/jobapplication?country=${country}&industry=${industry}`, this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/jobapplication?country=${country}`, this.httpOptions);
    } else if (industry) {
      return this.http.get(`${this.API_URL}/jobapplication?industry=${industry}`, this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/jobapplication?country=${country}&limit=10`, this.httpOptions);
    } else if (industry) {
      return this.http.get(`${this.API_URL}/jobapplication?industry=${industry}`, this.httpOptions);
    } else {
      return this.http.get(`${this.API_URL}/jobapplication?limit=10`, this.httpOptions);
    }
  }
  uploadJobApplications(fileToUpload: File){
    const formData: FormData = new FormData();
    formData.append('job application', fileToUpload);
    return this.http.post(`${this.API_URL}/import/job-application`, formData, this.filesHttpOptions);
  }

  uploadManagmentPersonal (fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('users', fileToUpload, fileToUpload.name);
    return this.http.post(`${this.API_URL}/import/users`, formData, this.filesHttpOptions);
  }

  uploadInventory (formData) {
    return this.http.post(`${this.API_URL}/import/inventory`, formData, this.filesHttpOptions);
  }

  createIncident (incident) {
    return this.http.post(`${this.API_URL}/securityincident`, incident, this.httpOptions);
  }

  getIncidents () {
    return this.http.get(`${this.API_URL}/securityincident&limit=10`, this.httpOptions);
  }

  sendEvent (type, value) {
    this.outEven.emit({type: type, data: value})
  }

  getIncidentsFilters ({country, industry, commerce}) {
    if (country && industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&commerce=${commerce}&sort=createdAt DESC`, this.httpOptions);
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&sort=createdAt DESC`, this.httpOptions);
    } else if (country && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&commerce=${commerce}&sort=createdAt DESC`, this.httpOptions);
    } else if (industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&commerce=${commerce}&sort=createdAt DESC`, this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&limit=10&sort=createdAt DESC`, this.httpOptions);
    } else if (industry) {
      return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&sort=createdAt DESC`, this.httpOptions);
    } else if (commerce) {
      return this.http.get(`${this.API_URL}/securityincident?commerce=${commerce}&sort=createdAt DESC`, this.httpOptions);
    } else {
      return this.http.get(`${this.API_URL}/securityincident?limit=10&sort=createdAt DESC`, this.httpOptions);
    }
  }

  getAllIncidentsFilters ({country, industry, commerce}) {
    if (country && industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&commerce=${commerce}&limit=-1`, this.httpOptions);
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&limit=-1`, this.httpOptions);
    } else if (country && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&commerce=${commerce}&limit=-1`, this.httpOptions);
    } else if (industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&commerce=${commerce}&limit=-1`, this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&limit=-1`, this.httpOptions);
    } else if (industry) {
      return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&limit=-1`, this.httpOptions);
    } else if (commerce) {
      return this.http.get(`${this.API_URL}/securityincident?commerce=${commerce}&limit=-1`, this.httpOptions);
    } else {
      return this.http.get(`${this.API_URL}/securityincident?limit=-1`, this.httpOptions);
    }
  }

  getIncidentsHeatMap ({country, industry, commerce}, month = null, year = null) {
    let queryString = ''
    if (country && industry && commerce) {
      queryString = month && year ? `?country=${country}&industry=${industry}&commerce=${commerce}&month=${month}&year=${year}&limit=-1`
      : month ? `?country=${country}&industry=${industry}&commerce=${commerce}&month=${month}&limit=-1`
      : year ? `?country=${country}&industry=${industry}&commerce=${commerce}&year=${year}&limit=-1`
      : `?country=${country}&industry=${industry}&commerce=${commerce}&limit=-1`
    } else if (country && industry) {
      queryString = month && year ? `?country=${country}&industry=${industry}&month=${month}&year=${year}&limit=-1`
      : month ? `?country=${country}&industry=${industry}&month=${month}&limit=-1`
      : year ? `?country=${country}&industry=${industry}&year=${year}&limit=-1`
      : `?country=${country}&industry=${industry}&limit=-1`
    } else if (country && commerce) {
      queryString = month && year ? `?country=${country}&commerce=${commerce}&month=${month}&year=${year}&limit=-1`
      : month ? `?country=${country}&commerce=${commerce}&month=${month}&limit=-1`
      : year ? `?country=${country}&commerce=${commerce}&year=${year}&limit=-1`
      : `?country=${country}&commerce=${commerce}&limit=-1`
    } else if (industry && commerce) {
      queryString = month && year ? `?industry=${industry}&commerce=${commerce}&month=${month}&year=${year}&limit=-1`
      : month ? `?industry=${industry}&commerce=${commerce}&month=${month}&limit=-1`
      : year ? `?industry=${industry}&commerce=${commerce}&year=${year}&limit=-1`
      : `?industry=${industry}&commerce=${commerce}&limit=-1`
    } else if (country) {
      queryString = month && year ? `?country=${country}&month=${month}&year=${year}&limit=-1`
      : month ? `?country=${country}&month=${month}&limit=-1`
      : year ? `?country=${country}&year=${year}&limit=-1`
      : `?country=${country}&limit=-1`
    } else if (industry) {
      queryString = month && year ? `?industry=${industry}&month=${month}&year=${year}&limit=-1`
      : month ? `?industry=${industry}&month=${month}&limit=-1`
      : year ? `?industry=${industry}&year=${year}&limit=-1`
      : `?industry=${industry}&limit=-1`
    } else if (commerce) {
      queryString = month && year ? `?commerce=${commerce}&month=${month}&year=${year}&limit=-1`
      : month ? `?commerce=${commerce}&month=${month}&limit=-1`
      : year ? `?commerce=${commerce}&year=${year}&limit=-1`
      : `?commerce=${commerce}&limit=-1`
    } else {
      queryString = month && year ? `?month=${month}&year=${year}&limit=-1`
      : month ? `?month=${month}&limit=-1`
      : year ? `?year=${year}&limit=-1`
      : `?limit=-1`
    }
    return this.http.get(this.API_URL+'/securityincident'+queryString, this.httpOptions);
  }

  getRiskAnalysis ({country, industry, commerce}) {
    if (country && industry && commerce) {
      return this.http.get(`${this.API_URL}/riskanalysis?country=${country}&industry=${industry}&commerce=${commerce}`, this.httpOptions);
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/riskanalysis?country=${country}&industry=${industry}`, this.httpOptions);
    } else if (country && commerce) {
      return this.http.get(`${this.API_URL}/riskanalysis?country=${country}&commerce=${commerce}`, this.httpOptions);
    } else if (industry && commerce) {
      return this.http.get(`${this.API_URL}/riskanalysis?industry=${industry}&commerce=${commerce}`, this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/riskanalysis?country=${country}`, this.httpOptions);
    } else if (industry) {
      return this.http.get(`${this.API_URL}/riskanalysis?industry=${industry}`, this.httpOptions);
    } else if (commerce) {
      return this.http.get(`${this.API_URL}/riskanalysis?commerce=${commerce}`, this.httpOptions);
    } else {
      return this.http.get(`${this.API_URL}/riskanalysis`, this.httpOptions);
    }
  }

  getPlazas () {
    return this.http.get(`${this.API_URL}/jobapplication?limit=10`, this.httpOptions);
  }

  createRiskAnalysis(riskAnalysis) {
    return this.http.post(`${this.API_URL}/riskanalysis`, riskAnalysis, this.httpOptions);
  }

  getDownloadRiskAnalysis () {
    let token = localStorage.getItem('token');
    let tokenType = localStorage.getItem('token_type');
    let httpOptions = {
      headers: new HttpHeaders({
              Authorization: `${tokenType} ${token}`,
              'Content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'Accept': "*/*",
              /* 'Content-disposition': 'Reporte.xlsx' */
          }
      ),
      responseType: 'blob'
    };
    return this.http.get(`${this.API_URL}/export/riskanalysis`, { ...httpOptions, observe: 'response',  responseType: 'blob' });
  }

  getDataInventory () {
    return this.http.get(`${this.API_URL}/inventory`, this.httpOptions);
  }
  displayInventory (inventoryId) {
    return this.http.get(`${this.API_URL}/inventory/${inventoryId}`, this.httpOptions);
  }
  getInventoryLabels() {
    return this.http.get(`${this.API_URL}/translate`, this.httpOptions);
  }

  getActivities () {
    return this.http.get(`${this.API_URL}/activity?limit=10&sort=createdAt DESC`, this.httpOptions);
  }

  getJobsApplicationByTypeResult (type, {country, industry}) {
    return new Promise(resolve => {
      if (country && industry) {
        this.http.get(`${this.API_URL}/jobapplication?result=${type}&limit=0&country=${country}&industry=${industry}`, this.httpOptions).subscribe((res: any) => {
          resolve({total:res.totalCount})
        });
      } else if (country) {
        this.http.get(`${this.API_URL}/jobapplication?result=${type}&limit=0&country=${country}`, this.httpOptions).subscribe((res: any) => {
          resolve({total:res.totalCount})
        });
      } else if (industry) {
        this.http.get(`${this.API_URL}/jobapplication?result=${type}&limit=0&industry=${industry}`, this.httpOptions).subscribe((res: any) => {
          resolve({total:res.totalCount})
        });
      } else {
        this.http.get(`${this.API_URL}/jobapplication?result=${type}&limit=0`, this.httpOptions).subscribe((res: any) => {
          resolve({total: res.totalCount})
        })
      }
    })
  }

  getJobsApplicationByMonth ({country, industry}) {
    return new Promise(resolve => {
      if (country && industry) {
        this.http.get(`${this.API_URL}/total/job-application/grouped-by-month?countryId=${country}&industryId=${industry}`, this.httpOptions).subscribe((res: any) => {
          resolve(res)
        });
      } else if (country) {
        this.http.get(`${this.API_URL}/total/job-application/grouped-by-month?countryId=${country}`, this.httpOptions).subscribe((res: any) => {
          resolve(res)
        });
      } else if (industry) {
        this.http.get(`${this.API_URL}/total/job-application/grouped-by-month?industryId=${industry}`, this.httpOptions).subscribe((res: any) => {
          resolve(res)
        });
      } else {
        this.http.get(`${this.API_URL}/total/job-application/grouped-by-month?result=confiable condicionado&year=2022`, this.httpOptions).subscribe((res: any) => {
          resolve(res)
        })
      }
    })
  }

  getAllJobsApplication ({country, industry}) {
    if (country && industry) {
      return this.http.get(`${this.API_URL}/jobapplication?country=${country}&industry=${industry}&limit=-1`, this.httpOptions);
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/jobapplication?country=${country}&industry=${industry}&limit=-1`, this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/jobapplication?country=${country}&limit=-1`, this.httpOptions);
    } else if (industry) {
      return this.http.get(`${this.API_URL}/jobapplication?industry=${industry}&limit=-1`, this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/jobapplication?country=${country}&limit=-1`, this.httpOptions);
    } else if (industry) {
      return this.http.get(`${this.API_URL}/jobapplication?industry=${industry}&limit=-1`, this.httpOptions);
    } else {
      return this.http.get(`${this.API_URL}/jobapplication?limit=-1`, this.httpOptions);
    }
    /* return new Promise(resolve => {
      this.http.get(`${this.API_URL}/jobapplication?limit=-1`, this.httpOptions).subscribe((res: any) => {
        resolve(res.results)
      })
    }) */
  }

  getDownloadJobApplication () {
    let token = localStorage.getItem('token');
    let tokenType = localStorage.getItem('token_type');
    let httpOptions = {
      headers: new HttpHeaders({
              Authorization: `${tokenType} ${token}`,
              'Content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'Accept': "*/*",
              /* 'Content-disposition': 'Reporte.xlsx' */
          }
      ),
      responseType: 'blob'
    };
    return this.http.get(`${this.API_URL}/export/jobapplications`, { ...httpOptions, observe: 'response',  responseType: 'blob' });
  }

  getRoutesByTypeMov (type) {
    return new Promise(resolve => {
      this.http.get(`${this.API_URL}/routeunit?mov=${type}&limit=0`, this.httpOptions).subscribe((res: any) => {
        resolve({total: res.totalCount})
      })
    })
  }

  getIncidentsByType ({country, industry, commerce}, type: string) {
    return new Promise(resolve => {
      if (country && industry && commerce) {
        return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&commerce=${commerce}&incidentType=${type}`, this.httpOptions).subscribe((res: any) => {
          resolve({total:res.totalCount})
        });
      } else if (country && industry) {
        return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&incidentType=${type}`, this.httpOptions).subscribe((res: any) => {
          resolve({total:res.totalCount})
        });
      } else if (country && commerce) {
        return this.http.get(`${this.API_URL}/securityincident?country=${country}&commerce=${commerce}&incidentType=${type}`, this.httpOptions).subscribe((res: any) => {
          resolve({total:res.totalCount})
        });
      } else if (industry && commerce) {
        return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&commerce=${commerce}&incidentType=${type}`, this.httpOptions).subscribe((res: any) => {
          resolve({total:res.totalCount})
        });
      } else if (country) {
        return this.http.get(`${this.API_URL}/securityincident?country=${country}&incidentType=${type}`, this.httpOptions).subscribe((res: any) => {
          resolve({total:res.totalCount})
        });
      } else if (industry) {
        return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&incidentType=${type}`, this.httpOptions).subscribe((res: any) => {
          resolve({total:res.totalCount})
        });
      } else if (commerce) {
        return this.http.get(`${this.API_URL}/securityincident?commerce=${commerce}&incidentType=${type}`, this.httpOptions).subscribe((res: any) => {
          resolve({total:res.totalCount})
        });
      } else {
        return this.http.get(`${this.API_URL}/securityincident?incidentType=${type}`, this.httpOptions).subscribe((res: any) => {
          resolve({total:res.totalCount})
        });
      }
    })
  }

  //FILTERS INCIDENTS BY SEARCH AND DATE
  getIncidentsFiltersBySearch ({country, industry, commerce}, data) {
    //, "incidentDetail":{"contains": "${data}"}, "incidentType":{"contains": "${data}"}, "internalClassification":{"contains": "${data}"}, "year":{"contains": "${data}"}
    let queryString = `where={"location":{"contains":"${data}"}}`;
    const params = new HttpParams({
      fromString: queryString
    });
    if (country && industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&commerce=${commerce}&${queryString}`, this.httpOptions);
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&${queryString}`, this.httpOptions);
    } else if (country && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&commerce=${commerce}&${queryString}`, this.httpOptions);
    } else if (industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&commerce=${commerce}&${queryString}`, this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}`, {params: params, headers: this.httpOptionsFilters});
    } else if (industry) {
      return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&${queryString}`, this.httpOptions);
    }else if (commerce) {
      return this.http.get(`${this.API_URL}/securityincident?commerce=${commerce}&${queryString}`, this.httpOptions);
    } else {
      return this.http.get(`${this.API_URL}/securityincident?${queryString}`, this.httpOptions);
    }
  }

  getCountIncidents () {
    return this.http.get(`${this.API_URL}/securityincident/count`, this.httpOptions);
  }

  getIncidentsFiltersByPagination ({country, industry, commerce}, limit, skip) {
    if (country && industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&commerce=${commerce}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
    } else if (country && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&commerce=${commerce}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
    } else if (industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&commerce=${commerce}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
    } else if (industry) {
      return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
    }else if (commerce) {
      return this.http.get(`${this.API_URL}/securityincident?commerce=${commerce}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
    } else {
      return this.http.get(`${this.API_URL}/securityincident?&limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
    }
  }

  getIncidentsFiltersByDate ({country, industry, commerce}, date) {
    if (country && industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&commerce=${commerce}&sort=createdAt DESC`, this.httpOptions);
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&sort=createdAt DESC`, this.httpOptions);
    } else if (country && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&commerce=${commerce}&sort=createdAt DESC`, this.httpOptions);
    } else if (industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&commerce=${commerce}&sort=createdAt DESC`, this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&where: {createdAt: {'>': new Date('2021-11-01T00:00:00.000Z').getTime(),'<': new Date('2021-12-05T00:00:00.000Z').getTime()}`, this.httpOptions);
    } else if (industry) {
      return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&sort=createdAt DESC`, this.httpOptions);
    }else if (commerce) {
      return this.http.get(`${this.API_URL}/securityincident?commerce=${commerce}&sort=createdAt DESC`, this.httpOptions);
    } else {
      return this.http.get(`${this.API_URL}/securityincident?sort=createdAt DESC`, this.httpOptions);
    }
  }

  //FILTERS ACTIVITY BY SEARCH AND DATE
  getCountActivities () {
    return this.http.get(`${this.API_URL}/activity/count`, this.httpOptions);
  }

  getActivityFiltersByPagination (limit, skip, date = null, search = null) {
    let queryString = `where={"action":{"contains":"${search}"}}`;
    const params = new HttpParams({
      fromString: queryString
    });
    let queryStringDate = `where={"date":{"contains":"${date}"}}`;
    const paramsDate = new HttpParams({
      fromString: queryStringDate
    });
    if (date) {
      return this.http.get(`${this.API_URL}/activity?date=${date}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, {params: paramsDate, headers: this.httpOptionsFilters});
    } else if (search) {
      return this.http.get(`${this.API_URL}/activity?limit=${limit}&skip=${skip}&sort=createdAt DESC`, {params: params, headers: this.httpOptionsFilters});
    } else return this.http.get(`${this.API_URL}/activity?limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
  }

  getActivityFiltersByDate (date) {
    let queryString = `where={"date":{"contains":"${date}"}}`;
    const params = new HttpParams({
      fromString: queryString
    });
    return this.http.get(`${this.API_URL}/activity?limit=10&sort=createdAt DESC`, {params: params, headers: this.httpOptionsFilters});
  }

  getActivityFiltersBySearch (search) {
    let queryString = `where={"action":{"contains":"${search}"}}`;
    const params = new HttpParams({
      fromString: queryString
    });
    return this.http.get(`${this.API_URL}/activity?limit=10`, {params: params, headers: this.httpOptionsFilters});
  }

  //FILTERS RESOURCES HUMAN BY SEARCH AND DATE
  getCountHuman () {
    return this.http.get(`${this.API_URL}/jobapplication/count`, this.httpOptions);
  }

  getHumanFiltersByPagination ({country, industry}, limit, skip, date = null, search = null) {
    let day = 0;
    let queryString = `where={"or":[{"adviser":{"contains":"${search}"}},{"analyst":{"contains":"${search}"}},{"applicant":{"contains":"${search}"}},{"company":{"contains":"${search}"}},{"jobPosition":{"contains":"${search}"}},{"result":{"contains":"${search}"}},{"dpi":{"contains":"${search}"}}]}`;
    const params = new HttpParams({
      fromString: queryString
    });
    if (date) {
      //day = (date.split('/')[0]).length <= 2 ? parseInt(date.split('/')[0]) : date.split('/')[0];
      date = date.split('/')[2]+'-'+date.split('/')[1]+'-'+date.split('/')[0];
    }
    
    let queryStringDate = `where={"applicationDate":{"contains":"${date}"}}`;
    const paramsDate = new HttpParams({
      fromString: queryStringDate
    });
    if (country && industry) {
      if (date || search) return this.http.get(`${this.API_URL}/jobapplication?country=${country}&industry=${industry}&limit=${limit}&skip=${skip}`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/jobapplication?country=${country}&industry=${industry}&limit=${limit}&skip=${skip}`, this.httpOptions);
    } else if (country && industry) {
      if (date || search) return this.http.get(`${this.API_URL}/jobapplication?country=${country}&industry=${industry}&limit=${limit}&skip=${skip}`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/jobapplication?country=${country}&industry=${industry}&limit=${limit}&skip=${skip}`, this.httpOptions);
    } else if (country) {
      if (date || search) return this.http.get(`${this.API_URL}/jobapplication?country=${country}&limit=${limit}&skip=${skip}`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/jobapplication?country=${country}&limit=${limit}&skip=${skip}`, this.httpOptions);
    } else if (industry) {
      if (date || search) return this.http.get(`${this.API_URL}/jobapplication?industry=${industry}&limit=${limit}&skip=${skip}`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/jobapplication?industry=${industry}&limit=${limit}&skip=${skip}`, this.httpOptions);
    } else if (country) {
      if (date || search) return this.http.get(`${this.API_URL}/jobapplication?country=${country}&limit=${limit}&skip=${skip}`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/jobapplication?country=${country}&limit=${limit}&skip=${skip}`, this.httpOptions);
    } else if (industry) {
      if (date || search) return this.http.get(`${this.API_URL}/jobapplication?industry=${industry}&limit=${limit}&skip=${skip}`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/jobapplication?industry=${industry}&limit=${limit}&skip=${skip}`, this.httpOptions);
    } else {
      if (date || search) return this.http.get(`${this.API_URL}/jobapplication?limit=${limit}&skip=${skip}`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/jobapplication?limit=${limit}&skip=${skip}`, this.httpOptions);
    }
  }

  getHumanFiltersBySearchDate ({country, industry}, date = null, search = null) {
    let day = 0;
    let queryString = `where={"or":[{"adviser":{"contains":"${search}"}},{"analyst":{"contains":"${search}"}},{"applicant":{"contains":"${search}"}},{"company":{"contains":"${search}"}},{"jobPosition":{"contains":"${search}"}},{"result":{"contains":"${search}"}},{"dpi":{"contains":"${search}"}}]}`;
    const params = new HttpParams({
      fromString: queryString
    });

    if (date) {
      //day = (date.split('/')[0]).length <= 2 ? parseInt(date.split('/')[0]) : date.split('/')[0];
      date = date.split('/')[2]+'-'+date.split('/')[1]+'-'+date.split('/')[0];
    }

    let queryStringDate = `where={"applicationDate":{"contains":"${date}"}}`;
    const paramsDate = new HttpParams({
      fromString: queryStringDate
    });

    if (country && industry) {
      return this.http.get(`${this.API_URL}/jobapplication?country=${country}&industry=${industry}&limit=10`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/jobapplication?country=${country}&industry=${industry}&limit=10`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else if (country) {
      return this.http.get(`${this.API_URL}/jobapplication?country=${country}&limit=10`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else if (industry) {
      return this.http.get(`${this.API_URL}/jobapplication?industry=${industry}&limit=10`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else if (country) {
      return this.http.get(`${this.API_URL}/jobapplication?country=${country}&limit=10`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else if (industry) {
      return this.http.get(`${this.API_URL}/jobapplication?industry=${industry}&limit=10`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else {
      return this.http.get(`${this.API_URL}/jobapplication?limit=10`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    }
  }

  //FILTERS USERS BY SEARCH AND DATE
  getCountUsers () {
    return this.http.get(`${this.API_URL}/user/count`, this.httpOptions);
  }

  getUsersFiltersByPagination (limit, skip, date = null, search = null) {
    let queryStringSearch = `where={"or":[{"email":{"contains":"${search}"}},{"fullName":{"contains":"${search}"}},{"phone":{"contains":"${search}"}}]}`;
    const paramsSearch = new HttpParams({
      fromString: queryStringSearch
    });
    if (date) {
      const splitDate = date.split('/');
      date = splitDate[2]+'-'+splitDate[1]+'-'+splitDate[0]
      let queryString = `where={"createdAt":{"contains":"${date}"}}`;
      const params = new HttpParams({
        fromString: queryString
      });
      return this.http.get(`${this.API_URL}/user?limit=${limit}&skip=${skip}`, {params: params, headers: this.httpOptionsFilters});
    } else if (search) {
      return this.http.get(`${this.API_URL}/user?limit=${limit}&skip=${skip}`, {params: paramsSearch, headers: this.httpOptionsFilters});
    } else return this.http.get(`${this.API_URL}/user?limit=${limit}&skip=${skip}`, this.httpOptions);
  }

  getUsersFiltersByDate (date) {
    const splitDate = date.split('/');
    date = splitDate[2]+'-'+splitDate[1]+'-'+splitDate[0]
    let queryString = `where={"createdAt":{"contains":"${date}"}}`;
    return this.http.get(`${this.API_URL}/user?${queryString}&limit=10`, this.httpOptions);
  }

  getUsersFiltersBySearch (search) {
    let queryString = `where={"or":[{"email":{"contains":"${search}"}},{"fullName":{"contains":"${search}"}},{"phone":{"contains":"${search}"}}]}`;
    const params = new HttpParams({
      fromString: queryString
    });
    return this.http.get(`${this.API_URL}/user?limit=10`, {params: params, headers: this.httpOptionsFilters});
  }

  //FILTERS ROUTE
  getRoutesFiltersByPagination (limit, skip, date = null, search = null) {
    if (date) date = date.split('/')[2]+'-'+date.split('/')[1]+'-'+date.split('/')[0];
    let queryString = `where={"or":[{"client":{"contains":"${search}"}},{"mov":{"contains":"${search}"}},{"phoneNameDriver":{"contains":"${search}"}}]}`;
    const params = new HttpParams({
      fromString: queryString
    });
    let queryStringDate = `where={"createdAt":{"contains":"${date}"}}`;
    const paramsDate = new HttpParams({
      fromString: queryStringDate
    });
    if (date) {
      return this.http.get(`${this.API_URL}/routeunit?limit=${limit}&skip=${skip}`, {params: paramsDate, headers: this.httpOptionsFilters});
    } else if (search) {
      return this.http.get(`${this.API_URL}/routeunit?limit=${limit}&skip=${skip}`, {params: params, headers: this.httpOptionsFilters});
    } else return this.http.get(`${this.API_URL}/routeunit?limit=${limit}&skip=${skip}`, this.httpOptions);
  }

  getRoutesFiltersByDate (date) {
    date = date.split('/')[2]+'-'+date.split('/')[1]+'-'+date.split('/')[0];
    let queryString = `where={"createdAt":{"contains":"${date}"}}`;
    const params = new HttpParams({
      fromString: queryString
    });
    return this.http.get(`${this.API_URL}/routeunit?limit=10`, {params: params, headers: this.httpOptionsFilters});
  }

  getRoutesFiltersBySearch (search) {
    let queryString = `where={"or":[{"client":{"contains":"${search}"}},{"mov":{"contains":"${search}"}},{"phoneNameDriver":{"contains":"${search}"}}]}`;
    const params = new HttpParams({
      fromString: queryString
    });
    return this.http.get(`${this.API_URL}/routeunit?limit=10`, {params: params, headers: this.httpOptionsFilters});
  }

  // FILTERS HISTORY INCIDENTS
  getHistoryIncidentsFiltersBySearchDate ({country, industry, commerce}, date = null, search = null) {
    let day = 0;
    let queryString = `where={"or":[{"incidentType":{"contains":"${search}"}},{"status":{"contains":"${search}"}},{"year":{"contains":"${search}"}},{"location":{"contains":"${search}"}}]}`;
    const params = new HttpParams({
      fromString: queryString
    });

    if (date) {
      day = (date.split('/')[0]).length <= 2 ? parseInt(date.split('/')[0]) : date.split('/')[0];
      date = day+'/'+date.split('/')[1]+'/'+date.split('/')[2];
    }

    let queryStringDate = `where={"date":{"contains":"${date}"}}`;
    const paramsDate = new HttpParams({
      fromString: queryStringDate
    });

    if (country && industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&commerce=${commerce}&limit=10&sort=createdAt DESC`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&limit=10&sort=createdAt DESC`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else if (country && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&commerce=${commerce}&limit=10&sort=createdAt DESC`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else if (industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&commerce=${commerce}&limit=10&sort=createdAt DESC`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else if (country) {
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&limit=10&sort=createdAt DESC`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else if (industry) {
      return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&limit=10&sort=createdAt DESC`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    }else if (commerce) {
      return this.http.get(`${this.API_URL}/securityincident?commerce=${commerce}&limit=10&sort=createdAt DESC`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else {
      return this.http.get(`${this.API_URL}/securityincident?limit=10&sort=createdAt DESC`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    }
  }

  getHistoryIncidentsFiltersByPagination ({country, industry, commerce}, limit, skip, date = null, search = null) {
    let day = 0;
    let queryString = `where={"or":[{"incidentType":{"contains":"${search}"}},{"status":{"contains":"${search}"}},{"year":{"contains":"${search}"}},{"location":{"contains":"${search}"}}]}`;
    const params = new HttpParams({
      fromString: queryString
    });
    if (date) {
      day = (date.split('/')[0]).length <= 2 ? parseInt(date.split('/')[0]) : date.split('/')[0];
      date = day+'/'+date.split('/')[1]+'/'+date.split('/')[2];
    }
    
    let queryStringDate = `where={"date":{"contains":"${date}"}}`;
    const paramsDate = new HttpParams({
      fromString: queryStringDate
    });
    if (country && industry && commerce) {
      if (date || search) return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&commerce=${commerce}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&commerce=${commerce}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
    } else if (country && industry) {
      if (date || search) return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&industry=${industry}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
    } else if (country && commerce) {
      if (date || search) return this.http.get(`${this.API_URL}/securityincident?country=${country}&commerce=${commerce}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&commerce=${commerce}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
    } else if (industry && commerce) {
      if (date || search) return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&commerce=${commerce}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&commerce=${commerce}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
    } else if (country) {
      if (date || search) return this.http.get(`${this.API_URL}/securityincident?country=${country}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/securityincident?country=${country}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
    } else if (industry) {
      if (date || search) return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/securityincident?industry=${industry}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
    }else if (commerce) {
      if (date || search) return this.http.get(`${this.API_URL}/securityincident?commerce=${commerce}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/securityincident?commerce=${commerce}&limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
    } else {
      if (date || search) return this.http.get(`${this.API_URL}/securityincident?limit=${limit}&skip=${skip}&sort=createdAt DESC`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/securityincident?limit=${limit}&skip=${skip}&sort=createdAt DESC`, this.httpOptions);
    }
  }

  // FILTERS HUMAN RESOURCER
  

  //SET ACTIONS BY ROLE ON TABLE
  getActionsByTable (actions) {
    const role =  localStorage.getItem('role')
    if (role === '619be69a94fe7a57107594cd') {
      return actions
    } else if (role === '619be7c994fe7a57107594d0') {
      return actions
    } else if (role === '619be7e194fe7a57107594d1') {
      const state = actions.find(res => res.action  === 'delete');
      if (state) return []
      else return actions;
    }
  }

  getDownloadIncidentHistory () {
    let token = localStorage.getItem('token');
    let tokenType = localStorage.getItem('token_type');
    let httpOptions = {
      headers: new HttpHeaders({
              Authorization: `${tokenType} ${token}`,
              'Content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'Accept': "*/*",
              /* 'Content-disposition': 'Reporte.xlsx' */
          }
      ),
      responseType: 'blob'
    };
    return this.http.get(`${this.API_URL}/export/securityincident`, { ...httpOptions, observe: 'response',  responseType: 'blob' });
  }

  getDownloadPathUnit () {
    let token = localStorage.getItem('token');
    let tokenType = localStorage.getItem('token_type');
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: `${tokenType} ${token}`,
        'Content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Accept': "*/*",
      }),
      responseType: 'blob'
    };
    return this.http.get(`${this.API_URL}/export/routeunit`, { ...httpOptions, observe: 'response',  responseType: 'blob' });
  }

  //FILTERS INVENTORY
  getInventoryFilters ({country, industry}) {
    if (country && industry) {
      return this.http.get(`${this.API_URL}/inventory?country=${country}&industry=${industry}&limit=10`, this.httpOptions);
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/inventory?country=${country}&industry=${industry}`, this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/inventory?country=${country}&limit=10`, this.httpOptions);
    } else if (industry) {
      return this.http.get(`${this.API_URL}/inventory?industry=${industry}&limit=10`, this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/inventory?country=${country}&limit=10`, this.httpOptions);
    } else if (industry) {
      return this.http.get(`${this.API_URL}/inventory?industry=${industry}`, this.httpOptions);
    } else {
      return this.http.get(`${this.API_URL}/inventory?limit=10`, this.httpOptions);
    }
  }

  getInventoryFiltersBySearchDate ({country, industry}, date = null, search = null) {
    let day = 0;
    let queryString = `where={"or":[{"accessControlSoftwareManager":{"contains":"${search}"}},{"alarmCommunicatorManager":{"contains":"${search}"}},{"alarmPanelManager":{"contains":"${search}"}},{"dvrManager":{"contains":"${search}"}}]}`;
    const params = new HttpParams({
      fromString: queryString
    });

    if (date) {
      const splitDate = date.split('/');
      date = splitDate[2]+'-'+splitDate[1]+'-'+splitDate[0]
    }

    let queryStringDate = `where={"createdAt":{"contains":"${date}"}}`;
    const paramsDate = new HttpParams({
      fromString: queryStringDate
    });

    if (country && industry) {
      return this.http.get(`${this.API_URL}/inventory?country=${country}&industry=${industry}&limit=10`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/inventory?country=${country}&industry=${industry}&limit=10`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else if (country) {
      return this.http.get(`${this.API_URL}/inventory?country=${country}&limit=10`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else if (industry) {
      return this.http.get(`${this.API_URL}/inventory?industry=${industry}&limit=10`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else if (country) {
      return this.http.get(`${this.API_URL}/inventory?country=${country}&limit=10`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else if (industry) {
      return this.http.get(`${this.API_URL}/inventory?industry=${industry}&limit=10`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    } else {
      return this.http.get(`${this.API_URL}/inventory?limit=10`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
    }
  }

  getInventoryFiltersByPagination ({country, industry}, limit, skip, date = null, search = null) {
    let day = 0;
    let queryString = `where={"or":[{"accessControlSoftwareManager":{"contains":"${search}"}},{"alarmCommunicatorManager":{"contains":"${search}"}},{"alarmPanelManager":{"contains":"${search}"}},{"dvrManager":{"contains":"${search}"}}]}`;
    const params = new HttpParams({
      fromString: queryString
    });
    if (date) {
      const splitDate = date.split('/');
      date = splitDate[2]+'-'+splitDate[1]+'-'+splitDate[0]
    }
    
    let queryStringDate = `where={"createdAt":{"contains":"${date}"}}`;
    const paramsDate = new HttpParams({
      fromString: queryStringDate
    });
    if (country && industry) {
      if (date || search) return this.http.get(`${this.API_URL}/inventory?country=${country}&industry=${industry}&limit=${limit}&skip=${skip}`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/inventory?country=${country}&industry=${industry}&limit=${limit}&skip=${skip}`, this.httpOptions);
    } else if (country && industry) {
      if (date || search) return this.http.get(`${this.API_URL}/inventory?country=${country}&industry=${industry}&limit=${limit}&skip=${skip}`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/inventory?country=${country}&industry=${industry}&limit=${limit}&skip=${skip}`, this.httpOptions);
    } else if (country) {
      if (date || search) return this.http.get(`${this.API_URL}/inventory?country=${country}&limit=${limit}&skip=${skip}`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/inventory?country=${country}&limit=${limit}&skip=${skip}`, this.httpOptions);
    } else if (industry) {
      if (date || search) return this.http.get(`${this.API_URL}/inventory?industry=${industry}&limit=${limit}&skip=${skip}`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/inventory?industry=${industry}&limit=${limit}&skip=${skip}`, this.httpOptions);
    } else if (country) {
      if (date || search) return this.http.get(`${this.API_URL}/inventory?country=${country}&limit=${limit}&skip=${skip}`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/inventory?country=${country}&limit=${limit}&skip=${skip}`, this.httpOptions);
    } else if (industry) {
      if (date || search) return this.http.get(`${this.API_URL}/inventory?industry=${industry}&limit=${limit}&skip=${skip}`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/inventory?industry=${industry}&limit=${limit}&skip=${skip}`, this.httpOptions);
    } else {
      if (date || search) return this.http.get(`${this.API_URL}/inventory?limit=${limit}&skip=${skip}`, {params: search ? params : paramsDate, headers: this.httpOptionsFilters});
      return this.http.get(`${this.API_URL}/inventory?limit=${limit}&skip=${skip}`, this.httpOptions);
    }
  }

  //CHARTS
  getChartTotalIncidents ({country, industry, commerce}, startYear: number, endYear: number) {
    if (country && industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident/count?countryId=${country}&industryId=${industry}&commerceId=${commerce}&startYear=${startYear}&endYear=${endYear}`, this.httpOptions);
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/securityincident/count?countryId=${country}&industryId=${industry}&startYear=${startYear}&endYear=${endYear}`, this.httpOptions);
    } else if (country && commerce) {
      return this.http.get(`${this.API_URL}/securityincident/count?countryId=${country}&commerceId=${commerce}&startYear=${startYear}&endYear=${endYear}`, this.httpOptions);
    } else if (industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident/count?industryId=${industry}&commerceId=${commerce}&startYear=${startYear}&endYear=${endYear}`, this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/securityincident/count?countryId=${country}&startYear=${startYear}&endYear=${endYear}`, this.httpOptions);
    } else if (industry) {
      return this.http.get(`${this.API_URL}/securityincident/count?industryId=${industry}&startYear=${startYear}&endYear=${endYear}`, this.httpOptions);
    } else if (commerce) {
      return this.http.get(`${this.API_URL}/securityincident/count?commerceId=${commerce}&startYear=${startYear}&endYear=${endYear}`, this.httpOptions);
    } else {
      return this.http.get(`${this.API_URL}/securityincident/count?startYear=${startYear}&endYear=${endYear}`, this.httpOptions);
    }
  }

  getChartImpactQuantity ({country, industry, commerce}, startYear: number, endYear: number) {
    if (country && industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident/done-and-undone?countryId=${country}&industryId=${industry}&commerceId=${commerce}`+(startYear ? `&startYear=${startYear}&endYear=${endYear}`: ''), this.httpOptions);
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/securityincident/done-and-undone?countryId=${country}&industryId=${industry}`+(startYear ? `&startYear=${startYear}&endYear=${endYear}`: ''), this.httpOptions);
    } else if (country && commerce) {
      return this.http.get(`${this.API_URL}/securityincident/done-and-undone?countryId=${country}&commerceId=${commerce}`+(startYear ? `&startYear=${startYear}&endYear=${endYear}`: ''), this.httpOptions);
    } else if (industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident/done-and-undone?industryId=${industry}&commerceId=${commerce}`+(startYear ? `&startYear=${startYear}&endYear=${endYear}`: ''), this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/securityincident/done-and-undone?countryId=${country}`+(startYear ? `&startYear=${startYear}&endYear=${endYear}`: ''), this.httpOptions);
    } else if (industry) {
      return this.http.get(`${this.API_URL}/securityincident/done-and-undone?industryId=${industry}`+(startYear ? `&startYear=${startYear}&endYear=${endYear}`: ''), this.httpOptions);
    } else if (commerce) {
      return this.http.get(`${this.API_URL}/securityincident/done-and-undone?commerceId=${commerce}`+(startYear ? `&startYear=${startYear}&endYear=${endYear}`: ''), this.httpOptions);
    } else {
      return this.http.get(`${this.API_URL}/securityincident/done-and-undone`+(startYear ? `?startYear=${startYear}&endYear=${endYear}`: ''), this.httpOptions);
    }
  }

  getChartImpactAmount ({country, industry, commerce}, startYear: number, endYear: number) {
    if (country && industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident/done-and-undone/economic-impact?countryId=${country}&industryId=${industry}&commerceId=${commerce}&startYear=${startYear}&endYear=${endYear}`, this.httpOptions);
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/securityincident/done-and-undone/economic-impact?countryId=${country}&industryId=${industry}&startYear=${startYear}&endYear=${endYear}`, this.httpOptions);
    } else if (country && commerce) {
      return this.http.get(`${this.API_URL}/securityincident/done-and-undone/economic-impact?countryId=${country}&commerceId=${commerce}&startYear=${startYear}&endYear=${endYear}`, this.httpOptions);
    } else if (industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident/done-and-undone/economic-impact?industryId=${industry}&commerceId=${commerce}&startYear=${startYear}&endYear=${endYear}`, this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/securityincident/done-and-undone/economic-impact?countryId=${country}&startYear=${startYear}&endYear=${endYear}`, this.httpOptions);
    } else if (industry) {
      return this.http.get(`${this.API_URL}/securityincident/done-and-undone/economic-impact?industryId=${industry}&startYear=${startYear}&endYear=${endYear}`, this.httpOptions);
    } else if (commerce) {
      return this.http.get(`${this.API_URL}/securityincident/done-and-undone/economic-impact?commerceId=${commerce}&startYear=${startYear}&endYear=${endYear}`, this.httpOptions);
    } else {
      return this.http.get(`${this.API_URL}/securityincident/done-and-undone/economic-impact?startYear=${startYear}&endYear=${endYear}`, this.httpOptions);
    }
  }

  getChartIncidentesByUEN ({country, industry}) {
    if (country && industry) {
      return this.http.get(`${this.API_URL}/securityincident/lastyear/count?countryId=${country}&industryId=${industry}`, this.httpOptions);
    } else if (country) { 
      return this.http.get(`${this.API_URL}/securityincident/lastyear/count?countryId=${country}`, this.httpOptions);
    } else if (industry) { 
      return this.http.get(`${this.API_URL}/securityincident/lastyear/count?industryId=${industry}`, this.httpOptions);
    } else {
      return this.http.get(`${this.API_URL}/securityincident/lastyear/count`, this.httpOptions);
    }
  }

  getChartIncidentsByMonthAndYear ({country, industry, commerce}, startYear: number, endYear: number) {
    if (country && industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident/years/months/count?countryId=${country}&industryId=${industry}&commerceId=${commerce}`+(startYear ? `&startYear=${startYear}&endYear=${endYear}`: ''), this.httpOptions);
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/securityincident/years/months/count?countryId=${country}&industryId=${industry}`+(startYear ? `&startYear=${startYear}&endYear=${endYear}`: ''), this.httpOptions);
    } else if (country && commerce) {
      return this.http.get(`${this.API_URL}/securityincident/years/months/count?countryId=${country}&commerceId=${commerce}`+(startYear ? `&startYear=${startYear}&endYear=${endYear}`: ''), this.httpOptions);
    } else if (industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident/years/months/count?industryId=${industry}&commerceId=${commerce}`+(startYear ? `&startYear=${startYear}&endYear=${endYear}`: ''), this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/securityincident/years/months/count?countryId=${country}`+(startYear ? `&startYear=${startYear}&endYear=${endYear}`: ''), this.httpOptions);
    } else if (industry) {
      return this.http.get(`${this.API_URL}/securityincident/years/months/count?industryId=${industry}`+(startYear ? `&startYear=${startYear}&endYear=${endYear}`: ''), this.httpOptions);
    } else if (commerce) {
      return this.http.get(`${this.API_URL}/securityincident/years/months/count?commerceId=${commerce}`+(startYear ? `&startYear=${startYear}&endYear=${endYear}`: ''), this.httpOptions);
    } else {
      return this.http.get(`${this.API_URL}/securityincident/years/months/count`+(startYear ? `?startYear=${startYear}&endYear=${endYear}`: ''), this.httpOptions);
    }
  }

  getLocationsHeatMap ({country, industry, commerce}) {
    if (country && industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident/positions?countryId=${country}&industryId=${industry}&commerceId=${commerce}`, this.httpOptions);
    } else if (country && industry) {
      return this.http.get(`${this.API_URL}/securityincident/positions?countryId=${country}&industryId=${industry}`, this.httpOptions);
    } else if (country && commerce) {
      return this.http.get(`${this.API_URL}/securityincident/positions?countryId=${country}&commerceId=${commerce}`, this.httpOptions);
    } else if (industry && commerce) {
      return this.http.get(`${this.API_URL}/securityincident/positions?industryId=${industry}&commerceId=${commerce}`, this.httpOptions);
    } else if (country) {
      return this.http.get(`${this.API_URL}/securityincident/positions?countryId=${country}`, this.httpOptions);
    } else if (industry) {
      return this.http.get(`${this.API_URL}/securityincident/positions?industryId=${industry}`, this.httpOptions);
    } else if (commerce) {
      return this.http.get(`${this.API_URL}/securityincident/positions?commerceId=${commerce}`, this.httpOptions);
    } else {
      return this.http.get(`${this.API_URL}/securityincident/positions`, this.httpOptions);
    }
  }

  getChartTotalIncidentsHistory ({country, industry, commerce}, incidentType: string, year: string) {
    let query = '';
    if (country) query += `countryId=${country}`
    if (industry) query += query ? `&industryId=${industry}` : `industryId=${industry}`
    if (commerce) query += query ? `&commerceId=${commerce}` : `commerceId=${commerce}`
    //if (month) query += query ? `&month=${month}` : `month=${month}`
    if (year) query += query ? `&startYear=${year}&endYear=${year}` : `startYear=${year}&endYear=${year}`
    if (incidentType) query += query ? `&incidentType=${incidentType}` : `incidentType=${incidentType}`

    if (!query) return this.http.get(`${this.API_URL}/securityincident/years/months/count`, this.httpOptions);
    else return this.http.get(`${this.API_URL}/securityincident/years/months/count?${query}`, this.httpOptions);
  }

  getChartTotalMaterializeHistory ({country, industry, commerce}, incidentType: string, month: string, year: string) {
    let query = '';
    if (country) query += `countryId=${country}`
    if (industry) query += query ? `&industryId=${industry}` : `industryId=${industry}`
    if (commerce) query += query ? `&commerceId=${commerce}` : `commerceId=${commerce}`
    if (month) query += query ? `&month=${month}` : `month=${month}`
    if (year) query += query ? `&startYear=${year}&endYear=${year}` : `startYear=${year}&endYear=${year}`
    if (incidentType) query += query ? `&incidentType=${incidentType}` : `incidentType=${incidentType}`

    if (!query) return this.http.get(`${this.API_URL}/securityincident/done-and-undone`, this.httpOptions);
    else return this.http.get(`${this.API_URL}/securityincident/done-and-undone?${query}`, this.httpOptions);
  }

  getChartTotalAmountAnalysisHistory ({country, industry, commerce}, incidentType: string, month: string, year: string) {
    let query = '';
    if (country) query += `countryId=${country}`
    if (industry) query += query ? `&industryId=${industry}` : `industryId=${industry}`
    if (commerce) query += query ? `&commerceId=${commerce}` : `commerceId=${commerce}`
    if (month) query += query ? `&month=${month}` : `month=${month}`
    if (year) query += query ? `&startYear=${year}&endYear=${year}` : `startYear=${year}&endYear=${year}`
    if (incidentType) query += query ? `&incidentType=${incidentType}` : `incidentType=${incidentType}`

    if (!query) return this.http.get(`${this.API_URL}/securityincident/total/impact-and-recovered-amount?groupByYears=false`, this.httpOptions);
    else return this.http.get(`${this.API_URL}/securityincident/total/impact-and-recovered-amount?${query}&groupByYears=false`, this.httpOptions);
  }

  getChartTotalAmountAnalysisManagment ({country, industry, commerce}, startYear, endYear) {
    let query = '';
    if (country) query += `countryId=${country}`
    if (industry) query += query ? `&industryId=${industry}` : `industryId=${industry}`
    if (commerce) query += query ? `&commerceId=${commerce}` : `commerceId=${commerce}`
    if (startYear) query += query ? `&startYear=${startYear}&endYear=${endYear}` : `startYear=${startYear}&endYear=${endYear}`

    if (!query) return this.http.get(`${this.API_URL}/securityincident/total/impact-and-recovered-amount?groupByYears=true`, this.httpOptions);
    else return this.http.get(`${this.API_URL}/securityincident/total/impact-and-recovered-amount?${query}&groupByYears=true`, this.httpOptions);
  }

  resetPassword (token: string, data: any) {
    return this.http.post(this.API_URL + '/auth/reset-password' + token, data).toPromise()
  }

}
