import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { DataService } from '../data.service';
import { ICrypto } from './i-crypto';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  myControl = new FormControl();
  filteredOptions: Observable<ICrypto[]> | undefined;
  cryptos: ICrypto[] = [];
  conversion: number = 0;
  units_to_convert = 1;
  dollars = 0;

  private current_crypto_price = 0;
  private timer: any;

  constructor(private dataService: DataService) {}

  async ngOnInit() {
    const { item_el, price_el } = await this.dataService.getContent();

    this.initCryptos(item_el, price_el);
    this.startTimer();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.cryptos.slice())),
      map(name => {
        if (name.length < this.cryptos.length) {
          const crypto_dollars =  this.convertToNumber(name[0].price!)
          this.current_crypto_price = crypto_dollars;
        }

        return name
      }),
    );
  }

  displayFn(crypto: ICrypto): string {
    return crypto && crypto.name ? crypto.name : '';
  }

  onUnitsChange(event: any) {
    setTimeout(() => {
      const units = event.target.valueAsNumber;
      this.dollars = +(units * this.current_crypto_price).toFixed(3);
    },1);
  }

  private _filter(name: string): ICrypto[] {
    const filterValue = name.toLowerCase();

    return this.cryptos.filter(crypto => crypto.name?.toLowerCase().includes(filterValue));
  }

  private startTimer() {
    this.timer = setInterval(async () => {
      const { item_el, price_el } = await this.dataService.getContent();
      this.updateCrypto(item_el, price_el);
    }, 1000 * 30);
  }

  private initCryptos(item_el: NodeListOf<Element>, price_el: NodeListOf<Element>) {
    this.cryptos = [];
    let counter = 1;
    for (let i = 0; i <= 99; i++) {
      this.addCrypto(item_el, i, price_el, counter);
      counter++;
    }
  }

  private addCrypto(item_el: NodeListOf<Element>, i: number, price_el: NodeListOf<Element>, counter: number) {
    this.cryptos.push({
      name: item_el[i].textContent?.trim(),
      price: price_el[i + counter].textContent?.trim(),
    });
  }

  private updateCrypto(item_el: NodeListOf<Element>, price_el: NodeListOf<Element>) {
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

  private convertToNumber(value: string) {
    const value_num = +value.replace('$','').replace('.','').replace(',','.');
    const value_num_variant = +value.replace('$','').replace('.','');
    return isNaN(value_num) ? value_num_variant : value_num;
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
