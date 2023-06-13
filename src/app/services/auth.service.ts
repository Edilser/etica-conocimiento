import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL = environment.api_url;
  httpHeaders;
  constructor(private http: HttpClient,
    private apiService: ApiService) {    
    this.httpHeaders = new HttpHeaders({"Accept": "application/json", "Content-Type": "application/json"}); 
   }

  login(username, password) {
    return new Promise(resolve => {
        this.http.post(`${this.API_URL}/auth/login`, {
            email: username,
            password: password
        })
          .subscribe(response => {
              this.apiService.setHttpOptions(response['token'], 'Bearer');
              //!TODO request and saves user data
              resolve(response)
          }, error => {
              resolve(false);
              console.log(error);
          });
    });
  }
  register(user) {
    return this.http.post(`${this.API_URL}/auth/register`, user, this.httpHeaders);
  }
  sendEmailToForgetPassword(data) {
    return this.http.post(`${this.API_URL}/auth/forgot-password`, data, this.httpHeaders)
  }
}
