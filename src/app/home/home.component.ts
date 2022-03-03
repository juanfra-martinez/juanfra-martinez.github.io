import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ICoins } from './i-coins';

interface IWebContent {
  body: string
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  coins: ICoins[] = [];

  private timer: any;

  constructor(private http: HttpClient) {}

  async ngOnInit() {

    const content = await this.getContent()
    const { item_el, price_el } = this.getPrices(content);
    this.initValues(item_el, price_el);

    this.startTimer();
  }

  private startTimer() {
    this.timer = setInterval(async () => {
      const content = await this.getContent();
      const { item_el, price_el } = this.getPrices(content);
      this.updateValue(item_el, price_el);
    }, 1000 * 30);
  }

  private initValues(item_el: HTMLCollectionOf<Element>, price_el: HTMLCollectionOf<Element>) {
    this.coins = [];
    let counter = 1;
    for (let i = 0; i <= 99; i++) {
      this.addCoin(item_el, i, price_el, counter);
      counter++;
    }
  }

  private addCoin(item_el: HTMLCollectionOf<Element>, i: number, price_el: HTMLCollectionOf<Element>, counter: number) {
    this.coins.push({
      item: item_el[i].textContent?.trim(),
      price: price_el[i + counter].textContent?.trim(),
    });
  }

  private updateValue(item_el: HTMLCollectionOf<Element>, price_el: HTMLCollectionOf<Element>) {
    const currencies = Array.from(item_el)
    let counter = 1
    currencies.map( currency => {
      const item = this.coins.find(x => x.item === currency.textContent?.trim())
      const idx = currencies.indexOf(currency)
      if (item){
        item.price = price_el[idx + counter].textContent?.trim()
      } else {
        this.addCoin(item_el, idx, price_el, counter)
      }

      counter++
    })
  }

  private getPrices(content: IWebContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content.body, 'text/html');
    const price_el = doc.getElementsByClassName('td-price');
    const item_el = doc.getElementsByClassName('tw-w-12');
    return { item_el, price_el };
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  private async getContent() {
    const content: IWebContent = await firstValueFrom(
      this.http.get<any>('https://jfmartinez-api.vercel.app/prices')
    );

    if (!content) {
      throw Error('No se ha podido adquirir el contenido')
    }

    return content
  }

}
