import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TransactionSignatureComponent } from '../list/transaction-signature.component';
import { TransactionSignatureDetailComponent } from '../detail/transaction-signature-detail.component';
import { TransactionSignatureUpdateComponent } from '../update/transaction-signature-update.component';
import { TransactionSignatureRoutingResolveService } from './transaction-signature-routing-resolve.service';

const transactionSignatureRoute: Routes = [
  {
    path: '',
    component: TransactionSignatureComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TransactionSignatureDetailComponent,
    resolve: {
      transactionSignature: TransactionSignatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TransactionSignatureUpdateComponent,
    resolve: {
      transactionSignature: TransactionSignatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TransactionSignatureUpdateComponent,
    resolve: {
      transactionSignature: TransactionSignatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(transactionSignatureRoute)],
  exports: [RouterModule],
})
export class TransactionSignatureRoutingModule {}
