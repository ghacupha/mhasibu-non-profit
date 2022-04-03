import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAccountTransaction, AccountTransaction } from '../account-transaction.model';
import { AccountTransactionService } from '../service/account-transaction.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ITransactionAccount } from 'app/entities/transaction-account/transaction-account.model';
import { TransactionAccountService } from 'app/entities/transaction-account/service/transaction-account.service';
import { ITransactionClass } from 'app/entities/transaction-class/transaction-class.model';
import { TransactionClassService } from 'app/entities/transaction-class/service/transaction-class.service';
import { IPlaceholder } from 'app/entities/placeholder/placeholder.model';
import { PlaceholderService } from 'app/entities/placeholder/service/placeholder.service';

@Component({
  selector: 'jhi-account-transaction-update',
  templateUrl: './account-transaction-update.component.html',
})
export class AccountTransactionUpdateComponent implements OnInit {
  isSaving = false;

  transactionAccountsSharedCollection: ITransactionAccount[] = [];
  transactionClassesSharedCollection: ITransactionClass[] = [];
  placeholdersSharedCollection: IPlaceholder[] = [];

  editForm = this.fb.group({
    id: [],
    transactionNumber: [],
    transactionDate: [],
    particulars: [],
    notes: [],
    transactionAmount: [null, [Validators.required, Validators.min(0)]],
    debitAccount: [null, Validators.required],
    creditAccount: [null, Validators.required],
    transactionClass: [],
    placeholders: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected accountTransactionService: AccountTransactionService,
    protected transactionAccountService: TransactionAccountService,
    protected transactionClassService: TransactionClassService,
    protected placeholderService: PlaceholderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountTransaction }) => {
      if (accountTransaction.id === undefined) {
        const today = dayjs().startOf('day');
        accountTransaction.transactionDate = today;
      }

      this.updateForm(accountTransaction);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('mhasibuNonProfitApp.error', { message: err.message })
        ),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const accountTransaction = this.createFromForm();
    if (accountTransaction.id !== undefined) {
      this.subscribeToSaveResponse(this.accountTransactionService.update(accountTransaction));
    } else {
      this.subscribeToSaveResponse(this.accountTransactionService.create(accountTransaction));
    }
  }

  trackTransactionAccountById(index: number, item: ITransactionAccount): number {
    return item.id!;
  }

  trackTransactionClassById(index: number, item: ITransactionClass): number {
    return item.id!;
  }

  trackPlaceholderById(index: number, item: IPlaceholder): number {
    return item.id!;
  }

  getSelectedPlaceholder(option: IPlaceholder, selectedVals?: IPlaceholder[]): IPlaceholder {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccountTransaction>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(accountTransaction: IAccountTransaction): void {
    this.editForm.patchValue({
      id: accountTransaction.id,
      transactionNumber: accountTransaction.transactionNumber,
      transactionDate: accountTransaction.transactionDate ? accountTransaction.transactionDate.format(DATE_TIME_FORMAT) : null,
      particulars: accountTransaction.particulars,
      notes: accountTransaction.notes,
      transactionAmount: accountTransaction.transactionAmount,
      debitAccount: accountTransaction.debitAccount,
      creditAccount: accountTransaction.creditAccount,
      transactionClass: accountTransaction.transactionClass,
      placeholders: accountTransaction.placeholders,
    });

    this.transactionAccountsSharedCollection = this.transactionAccountService.addTransactionAccountToCollectionIfMissing(
      this.transactionAccountsSharedCollection,
      accountTransaction.debitAccount,
      accountTransaction.creditAccount
    );
    this.transactionClassesSharedCollection = this.transactionClassService.addTransactionClassToCollectionIfMissing(
      this.transactionClassesSharedCollection,
      accountTransaction.transactionClass
    );
    this.placeholdersSharedCollection = this.placeholderService.addPlaceholderToCollectionIfMissing(
      this.placeholdersSharedCollection,
      ...(accountTransaction.placeholders ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.transactionAccountService
      .query()
      .pipe(map((res: HttpResponse<ITransactionAccount[]>) => res.body ?? []))
      .pipe(
        map((transactionAccounts: ITransactionAccount[]) =>
          this.transactionAccountService.addTransactionAccountToCollectionIfMissing(
            transactionAccounts,
            this.editForm.get('debitAccount')!.value,
            this.editForm.get('creditAccount')!.value
          )
        )
      )
      .subscribe((transactionAccounts: ITransactionAccount[]) => (this.transactionAccountsSharedCollection = transactionAccounts));

    this.transactionClassService
      .query()
      .pipe(map((res: HttpResponse<ITransactionClass[]>) => res.body ?? []))
      .pipe(
        map((transactionClasses: ITransactionClass[]) =>
          this.transactionClassService.addTransactionClassToCollectionIfMissing(
            transactionClasses,
            this.editForm.get('transactionClass')!.value
          )
        )
      )
      .subscribe((transactionClasses: ITransactionClass[]) => (this.transactionClassesSharedCollection = transactionClasses));

    this.placeholderService
      .query()
      .pipe(map((res: HttpResponse<IPlaceholder[]>) => res.body ?? []))
      .pipe(
        map((placeholders: IPlaceholder[]) =>
          this.placeholderService.addPlaceholderToCollectionIfMissing(placeholders, ...(this.editForm.get('placeholders')!.value ?? []))
        )
      )
      .subscribe((placeholders: IPlaceholder[]) => (this.placeholdersSharedCollection = placeholders));
  }

  protected createFromForm(): IAccountTransaction {
    return {
      ...new AccountTransaction(),
      id: this.editForm.get(['id'])!.value,
      transactionNumber: this.editForm.get(['transactionNumber'])!.value,
      transactionDate: this.editForm.get(['transactionDate'])!.value
        ? dayjs(this.editForm.get(['transactionDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      particulars: this.editForm.get(['particulars'])!.value,
      notes: this.editForm.get(['notes'])!.value,
      transactionAmount: this.editForm.get(['transactionAmount'])!.value,
      debitAccount: this.editForm.get(['debitAccount'])!.value,
      creditAccount: this.editForm.get(['creditAccount'])!.value,
      transactionClass: this.editForm.get(['transactionClass'])!.value,
      placeholders: this.editForm.get(['placeholders'])!.value,
    };
  }
}
