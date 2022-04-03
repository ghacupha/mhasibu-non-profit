import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAccountTransaction, AccountTransaction } from '../account-transaction.model';
import { AccountTransactionService } from '../service/account-transaction.service';

@Injectable({ providedIn: 'root' })
export class AccountTransactionRoutingResolveService implements Resolve<IAccountTransaction> {
  constructor(protected service: AccountTransactionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAccountTransaction> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((accountTransaction: HttpResponse<AccountTransaction>) => {
          if (accountTransaction.body) {
            return of(accountTransaction.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AccountTransaction());
  }
}
