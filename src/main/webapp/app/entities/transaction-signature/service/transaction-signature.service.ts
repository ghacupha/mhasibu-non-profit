import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

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
    const copy = this.convertDateFromClient(transactionSignature);
    return this.http
      .post<ITransactionSignature>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(transactionSignature: ITransactionSignature): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transactionSignature);
    return this.http
      .put<ITransactionSignature>(`${this.resourceUrl}/${getTransactionSignatureIdentifier(transactionSignature) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(transactionSignature: ITransactionSignature): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transactionSignature);
    return this.http
      .patch<ITransactionSignature>(`${this.resourceUrl}/${getTransactionSignatureIdentifier(transactionSignature) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITransactionSignature>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITransactionSignature[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
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

  protected convertDateFromClient(transactionSignature: ITransactionSignature): ITransactionSignature {
    return Object.assign({}, transactionSignature, {
      transactionTimeStamp: transactionSignature.transactionTimeStamp?.isValid()
        ? transactionSignature.transactionTimeStamp.toJSON()
        : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.transactionTimeStamp = res.body.transactionTimeStamp ? dayjs(res.body.transactionTimeStamp) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((transactionSignature: ITransactionSignature) => {
        transactionSignature.transactionTimeStamp = transactionSignature.transactionTimeStamp
          ? dayjs(transactionSignature.transactionTimeStamp)
          : undefined;
      });
    }
    return res;
  }
}
