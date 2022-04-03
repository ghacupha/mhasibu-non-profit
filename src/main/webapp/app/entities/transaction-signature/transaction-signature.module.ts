import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { TransactionSignatureComponent } from './list/transaction-signature.component';
import { TransactionSignatureDetailComponent } from './detail/transaction-signature-detail.component';
import { TransactionSignatureUpdateComponent } from './update/transaction-signature-update.component';
import { TransactionSignatureDeleteDialogComponent } from './delete/transaction-signature-delete-dialog.component';
import { TransactionSignatureRoutingModule } from './route/transaction-signature-routing.module';

@NgModule({
  imports: [SharedModule, TransactionSignatureRoutingModule],
  declarations: [
    TransactionSignatureComponent,
    TransactionSignatureDetailComponent,
    TransactionSignatureUpdateComponent,
    TransactionSignatureDeleteDialogComponent,
  ],
  entryComponents: [TransactionSignatureDeleteDialogComponent],
})
export class TransactionSignatureModule {}
