import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITransactionClass } from '../transaction-class.model';
import { TransactionClassService } from '../service/transaction-class.service';

@Component({
  templateUrl: './transaction-class-delete-dialog.component.html',
})
export class TransactionClassDeleteDialogComponent {
  transactionClass?: ITransactionClass;

  constructor(protected transactionClassService: TransactionClassService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.transactionClassService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
