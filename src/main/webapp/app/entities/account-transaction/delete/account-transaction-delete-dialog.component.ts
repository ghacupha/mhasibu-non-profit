import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccountTransaction } from '../account-transaction.model';
import { AccountTransactionService } from '../service/account-transaction.service';

@Component({
  templateUrl: './account-transaction-delete-dialog.component.html',
})
export class AccountTransactionDeleteDialogComponent {
  accountTransaction?: IAccountTransaction;

  constructor(protected accountTransactionService: AccountTransactionService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.accountTransactionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
