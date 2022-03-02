import { inject, TestBed } from '@angular/core/testing';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(
    'should get coins',
    inject(
      [HttpTestingController, DataService],
      (httpMock: HttpTestingController, dataService: DataService) => {
        const mockCoins = [
          { item: 'BTC', price: '$43.825,66' },
          { item: 'ETH', price: '$2.943,58' }
        ];

        dataService.getData().subscribe((event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Response:
              expect(event.body).toEqual(mockCoins);
          }
        });

        const mockReq = httpMock.expectOne(dataService.url);

        expect(mockReq.cancelled).toBeFalsy();
        expect(mockReq.request.responseType).toEqual('json');
        mockReq.flush(mockCoins);

        httpMock.verify();
      }
    )
  );
});
