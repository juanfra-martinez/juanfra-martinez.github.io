import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  url = 'https://www.coingecko.com/es';
  constructor(private http: HttpClient) { }

  getData() {
    const req = new HttpRequest('GET', this.url, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}
