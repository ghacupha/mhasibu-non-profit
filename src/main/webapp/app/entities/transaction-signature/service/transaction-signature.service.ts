import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITransactionSignature, getTransactionSignatureIdentifier } from '../transaction-signature.model';

export type EntityResponseType = HttpResponse<ITransactionSignature>;
export type EntityArrayResponseType = HttpResponse<ITransactionSignature[]>;

@Injectable({ providedIn: 'root' })
export class TransactionSignatureService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/transaction-signatures');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(transactionSignature: ITransactionSignature): Observable<EntityResponseType> {
    return this.http.post<ITransactionSignature>(this.resourceUrl, transactionSignature, { observe: 'response' });
  }

  update(transactionSignature: ITransactionSignature): Observable<EntityResponseType> {
    return this.http.put<ITransactionSignature>(
      `${this.resourceUrl}/${getTransactionSignatureIdentifier(transactionSignature) as number}`,
      transactionSignature,
      { observe: 'response' }
    );
  }

  partialUpdate(transactionSignature: ITransactionSignature): Observable<EntityResponseType> {
    return this.http.patch<ITransactionSignature>(
      `${this.resourceUrl}/${getTransactionSignatureIdentifier(transactionSignature) as number}`,
      transactionSignature,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITransactionSignature>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITransactionSignature[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTransactionSignatureToCollectionIfMissing(
    transactionSignatureCollection: ITransactionSignature[],
    ...transactionSignaturesToCheck: (ITransactionSignature | null | undefined)[]
  ): ITransactionSignature[] {
    const transactionSignatures: ITransactionSignature[] = transactionSignaturesToCheck.filter(isPresent);
    if (transactionSignatures.length > 0) {
      const transactionSignatureCollectionIdentifiers = transactionSignatureCollection.map(
        transactionSignatureItem => getTransactionSignatureIdentifier(transactionSignatureItem)!
      );
      const transactionSignaturesToAdd = transactionSignatures.filter(transactionSignatureItem => {
        const transactionSignatureIdentifier = getTransactionSignatureIdentifier(transactionSignatureItem);
        if (transactionSignatureIdentifier == null || transactionSignatureCollectionIdentifiers.includes(transactionSignatureIdentifier)) {
          return false;
        }
        transactionSignatureCollectionIdentifiers.push(transactionSignatureIdentifier);
        return true;
      });
      return [...transactionSignaturesToAdd, ...transactionSignatureCollection];
    }
    return transactionSignatureCollection;
  }
}
