import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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
    const content = await firstValueFrom(
      this.http.get<any>('https://jfmartinez-api.vercel.app/prices')
    );

    if (!content) {
      return;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(content.body, 'text/html');
    const price_el = doc.getElementsByClassName('td-price');
    const item_el = doc.getElementsByClassName('tw-w-12');
    this.coins = [];
    let counter = 1;
    for (let i = 0; i <= 99; i++) {
      this.coins.push({
        item: item_el[i].textContent?.trim(),
        price: price_el[i + counter].textContent?.trim(),
      });
      counter++;
    }
    console.log(this.coins);
  }
}
