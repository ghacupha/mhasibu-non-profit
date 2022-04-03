import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPlaceholder, Placeholder } from '../placeholder.model';
import { PlaceholderService } from '../service/placeholder.service';

@Component({
  selector: 'jhi-placeholder-update',
  templateUrl: './placeholder-update.component.html',
})
export class PlaceholderUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    description: [null, [Validators.required]],
  });

  constructor(protected placeholderService: PlaceholderService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ placeholder }) => {
      this.updateForm(placeholder);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const placeholder = this.createFromForm();
    if (placeholder.id !== undefined) {
      this.subscribeToSaveResponse(this.placeholderService.update(placeholder));
    } else {
      this.subscribeToSaveResponse(this.placeholderService.create(placeholder));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlaceholder>>): void {
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

  protected updateForm(placeholder: IPlaceholder): void {
    this.editForm.patchValue({
      id: placeholder.id,
      description: placeholder.description,
    });
  }

  protected createFromForm(): IPlaceholder {
    return {
      ...new Placeholder(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
