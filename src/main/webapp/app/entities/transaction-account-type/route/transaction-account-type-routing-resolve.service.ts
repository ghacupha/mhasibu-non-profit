import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITransactionAccountType, TransactionAccountType } from '../transaction-account-type.model';
import { TransactionAccountTypeService } from '../service/transaction-account-type.service';

@Injectable({ providedIn: 'root' })
export class TransactionAccountTypeRoutingResolveService implements Resolve<ITransactionAccountType> {
  constructor(protected service: TransactionAccountTypeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITransactionAccountType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((transactionAccountType: HttpResponse<TransactionAccountType>) => {
          if (transactionAccountType.body) {
            return of(transactionAccountType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TransactionAccountType());
  }
}
