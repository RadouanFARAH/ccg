import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ReceivingService {

  private Url: string;

  constructor(public http: HttpClient,) {
    this.Url = environment.url
  }
  genererAnnexe(data) {
    return this.http.post(this.Url + 'receiving/genererAnnexe', data)
  }
}
