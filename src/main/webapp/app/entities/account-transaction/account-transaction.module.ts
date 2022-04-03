import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { AccountTransactionComponent } from './list/account-transaction.component';
import { AccountTransactionDetailComponent } from './detail/account-transaction-detail.component';
import { AccountTransactionUpdateComponent } from './update/account-transaction-update.component';
import { AccountTransactionDeleteDialogComponent } from './delete/account-transaction-delete-dialog.component';
import { AccountTransactionRoutingModule } from './route/account-transaction-routing.module';

@NgModule({
  imports: [SharedModule, AccountTransactionRoutingModule],
  declarations: [
    AccountTransactionComponent,
    AccountTransactionDetailComponent,
    AccountTransactionUpdateComponent,
    AccountTransactionDeleteDialogComponent,
  ],
  entryComponents: [AccountTransactionDeleteDialogComponent],
})
export class AccountTransactionModule {}
