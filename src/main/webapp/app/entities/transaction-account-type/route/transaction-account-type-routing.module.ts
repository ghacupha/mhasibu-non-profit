import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TransactionAccountTypeComponent } from '../list/transaction-account-type.component';
import { TransactionAccountTypeDetailComponent } from '../detail/transaction-account-type-detail.component';
import { TransactionAccountTypeUpdateComponent } from '../update/transaction-account-type-update.component';
import { TransactionAccountTypeRoutingResolveService } from './transaction-account-type-routing-resolve.service';

const transactionAccountTypeRoute: Routes = [
  {
    path: '',
    component: TransactionAccountTypeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TransactionAccountTypeDetailComponent,
    resolve: {
      transactionAccountType: TransactionAccountTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TransactionAccountTypeUpdateComponent,
    resolve: {
      transactionAccountType: TransactionAccountTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TransactionAccountTypeUpdateComponent,
    resolve: {
      transactionAccountType: TransactionAccountTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(transactionAccountTypeRoute)],
  exports: [RouterModule],
})
export class TransactionAccountTypeRoutingModule {}
