import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class RefreshingService {

  private Url: string;

  constructor(public http: HttpClient,) {
    this.Url = environment.url
  }

  actualiser(data) {
    return this.http.post(this.Url + 'refreshing/actualiser', data)
  }

}
