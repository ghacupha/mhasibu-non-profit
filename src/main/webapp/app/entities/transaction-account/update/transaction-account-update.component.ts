import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITransactionAccount, TransactionAccount } from '../transaction-account.model';
import { TransactionAccountService } from '../service/transaction-account.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ITransactionAccountType } from 'app/entities/transaction-account-type/transaction-account-type.model';
import { TransactionAccountTypeService } from 'app/entities/transaction-account-type/service/transaction-account-type.service';
import { IPlaceholder } from 'app/entities/placeholder/placeholder.model';
import { PlaceholderService } from 'app/entities/placeholder/service/placeholder.service';

@Component({
  selector: 'jhi-transaction-account-update',
  templateUrl: './transaction-account-update.component.html',
})
export class TransactionAccountUpdateComponent implements OnInit {
  isSaving = false;

  transactionAccountTypesSharedCollection: ITransactionAccountType[] = [];
  placeholdersSharedCollection: IPlaceholder[] = [];

  editForm = this.fb.group({
    id: [],
    accountName: [null, [Validators.required]],
    description: [],
    notes: [],
    transactionAccountType: [null, Validators.required],
    placeholders: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected transactionAccountService: TransactionAccountService,
    protected transactionAccountTypeService: TransactionAccountTypeService,
    protected placeholderService: PlaceholderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transactionAccount }) => {
      this.updateForm(transactionAccount);

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
    const transactionAccount = this.createFromForm();
    if (transactionAccount.id !== undefined) {
      this.subscribeToSaveResponse(this.transactionAccountService.update(transactionAccount));
    } else {
      this.subscribeToSaveResponse(this.transactionAccountService.create(transactionAccount));
    }
  }

  trackTransactionAccountTypeById(index: number, item: ITransactionAccountType): number {
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransactionAccount>>): void {
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

  protected updateForm(transactionAccount: ITransactionAccount): void {
    this.editForm.patchValue({
      id: transactionAccount.id,
      accountName: transactionAccount.accountName,
      description: transactionAccount.description,
      notes: transactionAccount.notes,
      transactionAccountType: transactionAccount.transactionAccountType,
      placeholders: transactionAccount.placeholders,
    });

    this.transactionAccountTypesSharedCollection = this.transactionAccountTypeService.addTransactionAccountTypeToCollectionIfMissing(
      this.transactionAccountTypesSharedCollection,
      transactionAccount.transactionAccountType
    );
    this.placeholdersSharedCollection = this.placeholderService.addPlaceholderToCollectionIfMissing(
      this.placeholdersSharedCollection,
      ...(transactionAccount.placeholders ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.transactionAccountTypeService
      .query()
      .pipe(map((res: HttpResponse<ITransactionAccountType[]>) => res.body ?? []))
      .pipe(
        map((transactionAccountTypes: ITransactionAccountType[]) =>
          this.transactionAccountTypeService.addTransactionAccountTypeToCollectionIfMissing(
            transactionAccountTypes,
            this.editForm.get('transactionAccountType')!.value
          )
        )
      )
      .subscribe(
        (transactionAccountTypes: ITransactionAccountType[]) => (this.transactionAccountTypesSharedCollection = transactionAccountTypes)
      );

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

  protected createFromForm(): ITransactionAccount {
    return {
      ...new TransactionAccount(),
      id: this.editForm.get(['id'])!.value,
      accountName: this.editForm.get(['accountName'])!.value,
      description: this.editForm.get(['description'])!.value,
      notes: this.editForm.get(['notes'])!.value,
      transactionAccountType: this.editForm.get(['transactionAccountType'])!.value,
      placeholders: this.editForm.get(['placeholders'])!.value,
    };
  }
}
