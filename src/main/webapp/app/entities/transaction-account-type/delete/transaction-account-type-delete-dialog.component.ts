import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITransactionAccountType } from '../transaction-account-type.model';
import { TransactionAccountTypeService } from '../service/transaction-account-type.service';

@Component({
  templateUrl: './transaction-account-type-delete-dialog.component.html',
})
export class TransactionAccountTypeDeleteDialogComponent {
  transactionAccountType?: ITransactionAccountType;

  constructor(protected transactionAccountTypeService: TransactionAccountTypeService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.transactionAccountTypeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
