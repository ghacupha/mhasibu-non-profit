import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITransactionSignature } from '../transaction-signature.model';
import { TransactionSignatureService } from '../service/transaction-signature.service';

@Component({
  templateUrl: './transaction-signature-delete-dialog.component.html',
})
export class TransactionSignatureDeleteDialogComponent {
  transactionSignature?: ITransactionSignature;

  constructor(protected transactionSignatureService: TransactionSignatureService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.transactionSignatureService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
