import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { DataService } from '../data.service';
import { ICoins } from './i-coins';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  coins: ICoins[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    //this.populateCoins();
  }

  private populateCoins() {
    this.dataService.getData().subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request sent!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header received!');
          break;
        case HttpEventType.DownloadProgress:
          const kbLoaded = Math.round(event.loaded / 1024);
          console.log(`Download in progress! ${kbLoaded}Kb loaded`);
          break;
        case HttpEventType.Response:
          console.log('Done!', event.body);
          const parser = new DOMParser();
          const doc = parser.parseFromString(event.body, 'text/html');
          const price_el = doc.getElementsByClassName('td-price');
          const item_el = doc.getElementsByClassName('tw-w-12');
          let counter = 1
          for (let i = 0; i <= 99; i++) {
            this.coins.push({
              item: item_el[i].textContent?.trim(),
              price: price_el[i+counter].textContent?.trim()
            })
            counter++
          }
      }
    });
  }
}
