import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ICrypto } from './i-crypto';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  cryptos: ICrypto[] = [];

  private timer: any;

  constructor(private dataService: DataService) {}

  async ngOnInit() {
    const { item_el, price_el } = await this.dataService.getContent();
    this.initCryptos(item_el, price_el);
    this.startTimer();
  }

  private startTimer() {
    this.timer = setInterval(async () => {
      const { item_el, price_el } = await this.dataService.getContent();
      this.updateCrypto(item_el, price_el);
    }, 1000 * 30);
  }

  private initCryptos(item_el: HTMLCollectionOf<Element>, price_el: HTMLCollectionOf<Element>) {
    this.cryptos = [];
    let counter = 1;
    for (let i = 0; i <= 99; i++) {
      this.addCrypto(item_el, i, price_el, counter);
      counter++;
    }
  }

  private addCrypto(item_el: HTMLCollectionOf<Element>, i: number, price_el: HTMLCollectionOf<Element>, counter: number) {
    this.cryptos.push({
      name: item_el[i].textContent?.trim(),
      price: price_el[i + counter].textContent?.trim(),
    });
  }

  private updateCrypto(item_el: HTMLCollectionOf<Element>, price_el: HTMLCollectionOf<Element>) {
    const currencies = Array.from(item_el)
    let counter = 1
    currencies.map( currency => {
      const item = this.cryptos.find(x => x.name === currency.textContent?.trim())
      const idx = currencies.indexOf(currency)
      if (item){
        item.price = price_el[idx + counter].textContent?.trim()
      } else {
        this.addCrypto(item_el, idx, price_el, counter)
      }

      counter++
    })
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
