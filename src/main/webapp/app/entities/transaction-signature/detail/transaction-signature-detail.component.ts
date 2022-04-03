import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITransactionSignature } from '../transaction-signature.model';

@Component({
  selector: 'jhi-transaction-signature-detail',
  templateUrl: './transaction-signature-detail.component.html',
})
export class TransactionSignatureDetailComponent implements OnInit {
  transactionSignature: ITransactionSignature | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transactionSignature }) => {
      this.transactionSignature = transactionSignature;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
