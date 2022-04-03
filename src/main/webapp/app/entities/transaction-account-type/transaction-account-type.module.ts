import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { TransactionAccountTypeComponent } from './list/transaction-account-type.component';
import { TransactionAccountTypeDetailComponent } from './detail/transaction-account-type-detail.component';
import { TransactionAccountTypeUpdateComponent } from './update/transaction-account-type-update.component';
import { TransactionAccountTypeDeleteDialogComponent } from './delete/transaction-account-type-delete-dialog.component';
import { TransactionAccountTypeRoutingModule } from './route/transaction-account-type-routing.module';

@NgModule({
  imports: [SharedModule, TransactionAccountTypeRoutingModule],
  declarations: [
    TransactionAccountTypeComponent,
    TransactionAccountTypeDetailComponent,
    TransactionAccountTypeUpdateComponent,
    TransactionAccountTypeDeleteDialogComponent,
  ],
  entryComponents: [TransactionAccountTypeDeleteDialogComponent],
})
export class TransactionAccountTypeModule {}
