import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class UpdatingService {

  private Url: string;



  constructor(public http: HttpClient,) {
    this.Url = environment.url
  }

  update(data) {
    return this.http.post(this.Url + 'updating/update', data)
  }
}