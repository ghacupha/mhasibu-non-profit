import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ITransactionSignature, TransactionSignature } from '../transaction-signature.model';
import { TransactionSignatureService } from '../service/transaction-signature.service';
import { IPlaceholder } from 'app/entities/placeholder/placeholder.model';
import { PlaceholderService } from 'app/entities/placeholder/service/placeholder.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-transaction-signature-update',
  templateUrl: './transaction-signature-update.component.html',
})
export class TransactionSignatureUpdateComponent implements OnInit {
  isSaving = false;

  placeholdersSharedCollection: IPlaceholder[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    description: [null, [Validators.required]],
    moduleAffected: [],
    transactionTimeStamp: [],
    placeholders: [],
    user: [],
  });

  constructor(
    protected transactionSignatureService: TransactionSignatureService,
    protected placeholderService: PlaceholderService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transactionSignature }) => {
      if (transactionSignature.id === undefined) {
        const today = dayjs().startOf('day');
        transactionSignature.transactionTimeStamp = today;
      }

      this.updateForm(transactionSignature);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const transactionSignature = this.createFromForm();
    if (transactionSignature.id !== undefined) {
      this.subscribeToSaveResponse(this.transactionSignatureService.update(transactionSignature));
    } else {
      this.subscribeToSaveResponse(this.transactionSignatureService.create(transactionSignature));
    }
  }

  trackPlaceholderById(index: number, item: IPlaceholder): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): number {
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransactionSignature>>): void {
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

  protected updateForm(transactionSignature: ITransactionSignature): void {
    this.editForm.patchValue({
      id: transactionSignature.id,
      description: transactionSignature.description,
      moduleAffected: transactionSignature.moduleAffected,
      transactionTimeStamp: transactionSignature.transactionTimeStamp
        ? transactionSignature.transactionTimeStamp.format(DATE_TIME_FORMAT)
        : null,
      placeholders: transactionSignature.placeholders,
      user: transactionSignature.user,
    });

    this.placeholdersSharedCollection = this.placeholderService.addPlaceholderToCollectionIfMissing(
      this.placeholdersSharedCollection,
      ...(transactionSignature.placeholders ?? [])
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, transactionSignature.user);
  }

  protected loadRelationshipsOptions(): void {
    this.placeholderService
      .query()
      .pipe(map((res: HttpResponse<IPlaceholder[]>) => res.body ?? []))
      .pipe(
        map((placeholders: IPlaceholder[]) =>
          this.placeholderService.addPlaceholderToCollectionIfMissing(placeholders, ...(this.editForm.get('placeholders')!.value ?? []))
        )
      )
      .subscribe((placeholders: IPlaceholder[]) => (this.placeholdersSharedCollection = placeholders));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): ITransactionSignature {
    return {
      ...new TransactionSignature(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      moduleAffected: this.editForm.get(['moduleAffected'])!.value,
      transactionTimeStamp: this.editForm.get(['transactionTimeStamp'])!.value
        ? dayjs(this.editForm.get(['transactionTimeStamp'])!.value, DATE_TIME_FORMAT)
        : undefined,
      placeholders: this.editForm.get(['placeholders'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
