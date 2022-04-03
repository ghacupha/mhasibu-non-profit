import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TransactionClassComponent } from '../list/transaction-class.component';
import { TransactionClassDetailComponent } from '../detail/transaction-class-detail.component';
import { TransactionClassUpdateComponent } from '../update/transaction-class-update.component';
import { TransactionClassRoutingResolveService } from './transaction-class-routing-resolve.service';

const transactionClassRoute: Routes = [
  {
    path: '',
    component: TransactionClassComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TransactionClassDetailComponent,
    resolve: {
      transactionClass: TransactionClassRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TransactionClassUpdateComponent,
    resolve: {
      transactionClass: TransactionClassRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TransactionClassUpdateComponent,
    resolve: {
      transactionClass: TransactionClassRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(transactionClassRoute)],
  exports: [RouterModule],
})
export class TransactionClassRoutingModule {}
