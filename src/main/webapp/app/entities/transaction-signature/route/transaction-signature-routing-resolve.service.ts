import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITransactionSignature, TransactionSignature } from '../transaction-signature.model';
import { TransactionSignatureService } from '../service/transaction-signature.service';

@Injectable({ providedIn: 'root' })
export class TransactionSignatureRoutingResolveService implements Resolve<ITransactionSignature> {
  constructor(protected service: TransactionSignatureService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITransactionSignature> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((transactionSignature: HttpResponse<TransactionSignature>) => {
          if (transactionSignature.body) {
            return of(transactionSignature.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TransactionSignature());
  }
}
