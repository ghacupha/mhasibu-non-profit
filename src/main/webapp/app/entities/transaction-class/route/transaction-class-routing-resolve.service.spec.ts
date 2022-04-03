jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITransactionClass, TransactionClass } from '../transaction-class.model';
import { TransactionClassService } from '../service/transaction-class.service';

import { TransactionClassRoutingResolveService } from './transaction-class-routing-resolve.service';

describe('Service Tests', () => {
  describe('TransactionClass routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TransactionClassRoutingResolveService;
    let service: TransactionClassService;
    let resultTransactionClass: ITransactionClass | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TransactionClassRoutingResolveService);
      service = TestBed.inject(TransactionClassService);
      resultTransactionClass = undefined;
    });

    describe('resolve', () => {
      it('should return ITransactionClass returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTransactionClass = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTransactionClass).toEqual({ id: 123 });
      });

      it('should return new ITransactionClass if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTransactionClass = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTransactionClass).toEqual(new TransactionClass());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTransactionClass = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTransactionClass).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
