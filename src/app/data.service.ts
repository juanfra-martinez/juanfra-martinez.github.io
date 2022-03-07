import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface IWebContent {
  body: string
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  async getContent() {
    const content: IWebContent = await firstValueFrom(
      this.http.get<any>('https://jfmartinez-api.vercel.app/prices')
    );

    if (!content) {
      throw Error('No se ha podido adquirir el contenido')
    }

    return this.getPrices(content);
  }

  private getPrices(content: IWebContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content.body, 'text/html');
    const price_el = doc.querySelectorAll('td.td-price');
    const item_el = doc.querySelectorAll('a.tw-w-12');
    return { item_el, price_el };
  }
}
