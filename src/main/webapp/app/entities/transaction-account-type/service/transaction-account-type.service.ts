import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITransactionAccountType, getTransactionAccountTypeIdentifier } from '../transaction-account-type.model';

export type EntityResponseType = HttpResponse<ITransactionAccountType>;
export type EntityArrayResponseType = HttpResponse<ITransactionAccountType[]>;

@Injectable({ providedIn: 'root' })
export class TransactionAccountTypeService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/transaction-account-types');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(transactionAccountType: ITransactionAccountType): Observable<EntityResponseType> {
    return this.http.post<ITransactionAccountType>(this.resourceUrl, transactionAccountType, { observe: 'response' });
  }

  update(transactionAccountType: ITransactionAccountType): Observable<EntityResponseType> {
    return this.http.put<ITransactionAccountType>(
      `${this.resourceUrl}/${getTransactionAccountTypeIdentifier(transactionAccountType) as number}`,
      transactionAccountType,
      { observe: 'response' }
    );
  }

  partialUpdate(transactionAccountType: ITransactionAccountType): Observable<EntityResponseType> {
    return this.http.patch<ITransactionAccountType>(
      `${this.resourceUrl}/${getTransactionAccountTypeIdentifier(transactionAccountType) as number}`,
      transactionAccountType,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITransactionAccountType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITransactionAccountType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTransactionAccountTypeToCollectionIfMissing(
    transactionAccountTypeCollection: ITransactionAccountType[],
    ...transactionAccountTypesToCheck: (ITransactionAccountType | null | undefined)[]
  ): ITransactionAccountType[] {
    const transactionAccountTypes: ITransactionAccountType[] = transactionAccountTypesToCheck.filter(isPresent);
    if (transactionAccountTypes.length > 0) {
      const transactionAccountTypeCollectionIdentifiers = transactionAccountTypeCollection.map(
        transactionAccountTypeItem => getTransactionAccountTypeIdentifier(transactionAccountTypeItem)!
      );
      const transactionAccountTypesToAdd = transactionAccountTypes.filter(transactionAccountTypeItem => {
        const transactionAccountTypeIdentifier = getTransactionAccountTypeIdentifier(transactionAccountTypeItem);
        if (
          transactionAccountTypeIdentifier == null ||
          transactionAccountTypeCollectionIdentifiers.includes(transactionAccountTypeIdentifier)
        ) {
          return false;
        }
        transactionAccountTypeCollectionIdentifiers.push(transactionAccountTypeIdentifier);
        return true;
      });
      return [...transactionAccountTypesToAdd, ...transactionAccountTypeCollection];
    }
    return transactionAccountTypeCollection;
  }
}
