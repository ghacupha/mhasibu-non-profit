import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AccountTransactionComponent } from '../list/account-transaction.component';
import { AccountTransactionDetailComponent } from '../detail/account-transaction-detail.component';
import { AccountTransactionUpdateComponent } from '../update/account-transaction-update.component';
import { AccountTransactionRoutingResolveService } from './account-transaction-routing-resolve.service';

const accountTransactionRoute: Routes = [
  {
    path: '',
    component: AccountTransactionComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccountTransactionDetailComponent,
    resolve: {
      accountTransaction: AccountTransactionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccountTransactionUpdateComponent,
    resolve: {
      accountTransaction: AccountTransactionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AccountTransactionUpdateComponent,
    resolve: {
      accountTransaction: AccountTransactionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountTransactionRoute)],
  exports: [RouterModule],
})
export class AccountTransactionRoutingModule {}
