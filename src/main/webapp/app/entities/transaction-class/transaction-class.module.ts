import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { TransactionClassComponent } from './list/transaction-class.component';
import { TransactionClassDetailComponent } from './detail/transaction-class-detail.component';
import { TransactionClassUpdateComponent } from './update/transaction-class-update.component';
import { TransactionClassDeleteDialogComponent } from './delete/transaction-class-delete-dialog.component';
import { TransactionClassRoutingModule } from './route/transaction-class-routing.module';

@NgModule({
  imports: [SharedModule, TransactionClassRoutingModule],
  declarations: [
    TransactionClassComponent,
    TransactionClassDetailComponent,
    TransactionClassUpdateComponent,
    TransactionClassDeleteDialogComponent,
  ],
  entryComponents: [TransactionClassDeleteDialogComponent],
})
export class TransactionClassModule {}
