import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private Url: string;
  constructor(public http: HttpClient) {
    this.Url = environment.ldapurl
  }
  login(data) {
    return this.http.post(this.Url + 'user/login', data)
  }
  getToken() {
    return localStorage.getItem('token');
  }
}
