import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITransactionClass, TransactionClass } from '../transaction-class.model';
import { TransactionClassService } from '../service/transaction-class.service';

@Injectable({ providedIn: 'root' })
export class TransactionClassRoutingResolveService implements Resolve<ITransactionClass> {
  constructor(protected service: TransactionClassService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITransactionClass> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((transactionClass: HttpResponse<TransactionClass>) => {
          if (transactionClass.body) {
            return of(transactionClass.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TransactionClass());
  }
}
