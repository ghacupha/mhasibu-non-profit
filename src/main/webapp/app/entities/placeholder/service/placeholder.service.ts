import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPlaceholder, getPlaceholderIdentifier } from '../placeholder.model';

export type EntityResponseType = HttpResponse<IPlaceholder>;
export type EntityArrayResponseType = HttpResponse<IPlaceholder[]>;

@Injectable({ providedIn: 'root' })
export class PlaceholderService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/placeholders');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(placeholder: IPlaceholder): Observable<EntityResponseType> {
    return this.http.post<IPlaceholder>(this.resourceUrl, placeholder, { observe: 'response' });
  }

  update(placeholder: IPlaceholder): Observable<EntityResponseType> {
    return this.http.put<IPlaceholder>(`${this.resourceUrl}/${getPlaceholderIdentifier(placeholder) as number}`, placeholder, {
      observe: 'response',
    });
  }

  partialUpdate(placeholder: IPlaceholder): Observable<EntityResponseType> {
    return this.http.patch<IPlaceholder>(`${this.resourceUrl}/${getPlaceholderIdentifier(placeholder) as number}`, placeholder, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPlaceholder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPlaceholder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPlaceholderToCollectionIfMissing(
    placeholderCollection: IPlaceholder[],
    ...placeholdersToCheck: (IPlaceholder | null | undefined)[]
  ): IPlaceholder[] {
    const placeholders: IPlaceholder[] = placeholdersToCheck.filter(isPresent);
    if (placeholders.length > 0) {
      const placeholderCollectionIdentifiers = placeholderCollection.map(placeholderItem => getPlaceholderIdentifier(placeholderItem)!);
      const placeholdersToAdd = placeholders.filter(placeholderItem => {
        const placeholderIdentifier = getPlaceholderIdentifier(placeholderItem);
        if (placeholderIdentifier == null || placeholderCollectionIdentifiers.includes(placeholderIdentifier)) {
          return false;
        }
        placeholderCollectionIdentifiers.push(placeholderIdentifier);
        return true;
      });
      return [...placeholdersToAdd, ...placeholderCollection];
    }
    return placeholderCollection;
  }
}
