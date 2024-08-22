import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})

export class SendingService {
  private Url: string;

  constructor(public http: HttpClient,) {
    this.Url = environment.url
  }

  deposerAnnexe(data) {
    return this.http.post(this.Url + 'sending/deposerAnnexe', data)
  }
  
}
