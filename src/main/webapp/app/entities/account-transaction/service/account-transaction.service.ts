import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAccountTransaction, getAccountTransactionIdentifier } from '../account-transaction.model';

export type EntityResponseType = HttpResponse<IAccountTransaction>;
export type EntityArrayResponseType = HttpResponse<IAccountTransaction[]>;

@Injectable({ providedIn: 'root' })
export class AccountTransactionService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/account-transactions');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(accountTransaction: IAccountTransaction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accountTransaction);
    return this.http
      .post<IAccountTransaction>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(accountTransaction: IAccountTransaction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accountTransaction);
    return this.http
      .put<IAccountTransaction>(`${this.resourceUrl}/${getAccountTransactionIdentifier(accountTransaction) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(accountTransaction: IAccountTransaction): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accountTransaction);
    return this.http
      .patch<IAccountTransaction>(`${this.resourceUrl}/${getAccountTransactionIdentifier(accountTransaction) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAccountTransaction>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAccountTransaction[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAccountTransactionToCollectionIfMissing(
    accountTransactionCollection: IAccountTransaction[],
    ...accountTransactionsToCheck: (IAccountTransaction | null | undefined)[]
  ): IAccountTransaction[] {
    const accountTransactions: IAccountTransaction[] = accountTransactionsToCheck.filter(isPresent);
    if (accountTransactions.length > 0) {
      const accountTransactionCollectionIdentifiers = accountTransactionCollection.map(
        accountTransactionItem => getAccountTransactionIdentifier(accountTransactionItem)!
      );
      const accountTransactionsToAdd = accountTransactions.filter(accountTransactionItem => {
        const accountTransactionIdentifier = getAccountTransactionIdentifier(accountTransactionItem);
        if (accountTransactionIdentifier == null || accountTransactionCollectionIdentifiers.includes(accountTransactionIdentifier)) {
          return false;
        }
        accountTransactionCollectionIdentifiers.push(accountTransactionIdentifier);
        return true;
      });
      return [...accountTransactionsToAdd, ...accountTransactionCollection];
    }
    return accountTransactionCollection;
  }

  protected convertDateFromClient(accountTransaction: IAccountTransaction): IAccountTransaction {
    return Object.assign({}, accountTransaction, {
      transactionDate: accountTransaction.transactionDate?.isValid() ? accountTransaction.transactionDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.transactionDate = res.body.transactionDate ? dayjs(res.body.transactionDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((accountTransaction: IAccountTransaction) => {
        accountTransaction.transactionDate = accountTransaction.transactionDate ? dayjs(accountTransaction.transactionDate) : undefined;
      });
    }
    return res;
  }
}
