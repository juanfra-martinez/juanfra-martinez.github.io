import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ICoins } from './i-coins';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  coins: ICoins[] = [];

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    const content = await this.http
      .get<any>('https://jfmartinez-api.vercel.app/prices')
      .toPromise();
    if (!content) {
      return;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const price_el = doc.getElementsByClassName('td-price');
    const item_el = doc.getElementsByClassName('tw-w-12');
    const results = [];
    let counter = 1;
    for (let i = 0; i <= 99; i++) {
      results.push({
        item: item_el[i].textContent?.trim(),
        price: price_el[i + counter].textContent?.trim(),
      });
      counter++;
    }
    console.log(results);
  }
}
