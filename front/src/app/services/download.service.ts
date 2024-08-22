import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class DownloadService {
  url = environment.url
  constructor(private http: HttpClient) {}
  getSent(){
    return this.http.get(this.url+'sentFiles')
  }
  getRecieved(){
    return this.http.get(this.url+'recievedFiles')
  }
  download(filename): Observable<Blob> {
    return this.http.post(this.url+'download',{filename}, {
      responseType: 'blob'
    })
  }
}