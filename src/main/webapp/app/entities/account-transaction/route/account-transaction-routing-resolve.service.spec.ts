jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAccountTransaction, AccountTransaction } from '../account-transaction.model';
import { AccountTransactionService } from '../service/account-transaction.service';

import { AccountTransactionRoutingResolveService } from './account-transaction-routing-resolve.service';

describe('Service Tests', () => {
  describe('AccountTransaction routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AccountTransactionRoutingResolveService;
    let service: AccountTransactionService;
    let resultAccountTransaction: IAccountTransaction | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AccountTransactionRoutingResolveService);
      service = TestBed.inject(AccountTransactionService);
      resultAccountTransaction = undefined;
    });

    describe('resolve', () => {
      it('should return IAccountTransaction returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAccountTransaction = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAccountTransaction).toEqual({ id: 123 });
      });

      it('should return new IAccountTransaction if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAccountTransaction = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAccountTransaction).toEqual(new AccountTransaction());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAccountTransaction = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAccountTransaction).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
