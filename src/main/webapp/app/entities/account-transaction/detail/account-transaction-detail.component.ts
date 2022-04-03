import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAccountTransaction } from '../account-transaction.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-account-transaction-detail',
  templateUrl: './account-transaction-detail.component.html',
})
export class AccountTransactionDetailComponent implements OnInit {
  accountTransaction: IAccountTransaction | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountTransaction }) => {
      this.accountTransaction = accountTransaction;
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
