import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IMyEntity, MyEntity } from 'app/shared/model/my-entity.model';
import { MyEntityService } from './my-entity.service';
import { MyEntityComponent } from './my-entity.component';
import { MyEntityDetailComponent } from './my-entity-detail.component';
import { MyEntityUpdateComponent } from './my-entity-update.component';

@Injectable({ providedIn: 'root' })
export class MyEntityResolve implements Resolve<IMyEntity> {
  constructor(private service: MyEntityService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMyEntity> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((myEntity: HttpResponse<MyEntity>) => {
          if (myEntity.body) {
            return of(myEntity.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new MyEntity());
  }
}

export const myEntityRoute: Routes = [
  {
    path: '',
    component: MyEntityComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'mayApp.myEntity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: MyEntityDetailComponent,
    resolve: {
      myEntity: MyEntityResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'mayApp.myEntity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: MyEntityUpdateComponent,
    resolve: {
      myEntity: MyEntityResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'mayApp.myEntity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: MyEntityUpdateComponent,
    resolve: {
      myEntity: MyEntityResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'mayApp.myEntity.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
