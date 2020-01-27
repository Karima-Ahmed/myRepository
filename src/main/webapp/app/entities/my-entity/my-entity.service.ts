import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IMyEntity } from 'app/shared/model/my-entity.model';

type EntityResponseType = HttpResponse<IMyEntity>;
type EntityArrayResponseType = HttpResponse<IMyEntity[]>;

@Injectable({ providedIn: 'root' })
export class MyEntityService {
  public resourceUrl = SERVER_API_URL + 'api/my-entities';

  constructor(protected http: HttpClient) {}

  create(myEntity: IMyEntity): Observable<EntityResponseType> {
    return this.http.post<IMyEntity>(this.resourceUrl, myEntity, { observe: 'response' });
  }

  update(myEntity: IMyEntity): Observable<EntityResponseType> {
    return this.http.put<IMyEntity>(this.resourceUrl, myEntity, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMyEntity>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMyEntity[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
