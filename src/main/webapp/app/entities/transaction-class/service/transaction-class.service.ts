import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITransactionClass, getTransactionClassIdentifier } from '../transaction-class.model';

export type EntityResponseType = HttpResponse<ITransactionClass>;
export type EntityArrayResponseType = HttpResponse<ITransactionClass[]>;

@Injectable({ providedIn: 'root' })
export class TransactionClassService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/transaction-classes');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(transactionClass: ITransactionClass): Observable<EntityResponseType> {
    return this.http.post<ITransactionClass>(this.resourceUrl, transactionClass, { observe: 'response' });
  }

  update(transactionClass: ITransactionClass): Observable<EntityResponseType> {
    return this.http.put<ITransactionClass>(
      `${this.resourceUrl}/${getTransactionClassIdentifier(transactionClass) as number}`,
      transactionClass,
      { observe: 'response' }
    );
  }

  partialUpdate(transactionClass: ITransactionClass): Observable<EntityResponseType> {
    return this.http.patch<ITransactionClass>(
      `${this.resourceUrl}/${getTransactionClassIdentifier(transactionClass) as number}`,
      transactionClass,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITransactionClass>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITransactionClass[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTransactionClassToCollectionIfMissing(
    transactionClassCollection: ITransactionClass[],
    ...transactionClassesToCheck: (ITransactionClass | null | undefined)[]
  ): ITransactionClass[] {
    const transactionClasses: ITransactionClass[] = transactionClassesToCheck.filter(isPresent);
    if (transactionClasses.length > 0) {
      const transactionClassCollectionIdentifiers = transactionClassCollection.map(
        transactionClassItem => getTransactionClassIdentifier(transactionClassItem)!
      );
      const transactionClassesToAdd = transactionClasses.filter(transactionClassItem => {
        const transactionClassIdentifier = getTransactionClassIdentifier(transactionClassItem);
        if (transactionClassIdentifier == null || transactionClassCollectionIdentifiers.includes(transactionClassIdentifier)) {
          return false;
        }
        transactionClassCollectionIdentifiers.push(transactionClassIdentifier);
        return true;
      });
      return [...transactionClassesToAdd, ...transactionClassCollection];
    }
    return transactionClassCollection;
  }
}
