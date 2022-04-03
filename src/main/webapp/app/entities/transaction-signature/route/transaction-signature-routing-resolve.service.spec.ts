jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITransactionSignature, TransactionSignature } from '../transaction-signature.model';
import { TransactionSignatureService } from '../service/transaction-signature.service';

import { TransactionSignatureRoutingResolveService } from './transaction-signature-routing-resolve.service';

describe('Service Tests', () => {
  describe('TransactionSignature routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TransactionSignatureRoutingResolveService;
    let service: TransactionSignatureService;
    let resultTransactionSignature: ITransactionSignature | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TransactionSignatureRoutingResolveService);
      service = TestBed.inject(TransactionSignatureService);
      resultTransactionSignature = undefined;
    });

    describe('resolve', () => {
      it('should return ITransactionSignature returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTransactionSignature = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTransactionSignature).toEqual({ id: 123 });
      });

      it('should return new ITransactionSignature if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTransactionSignature = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTransactionSignature).toEqual(new TransactionSignature());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTransactionSignature = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTransactionSignature).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
