import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITransactionAccountType } from '../transaction-account-type.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-transaction-account-type-detail',
  templateUrl: './transaction-account-type-detail.component.html',
})
export class TransactionAccountTypeDetailComponent implements OnInit {
  transactionAccountType: ITransactionAccountType | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transactionAccountType }) => {
      this.transactionAccountType = transactionAccountType;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
