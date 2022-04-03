jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TransactionAccountTypeService } from '../service/transaction-account-type.service';
import { ITransactionAccountType, TransactionAccountType } from '../transaction-account-type.model';
import { IPlaceholder } from 'app/entities/placeholder/placeholder.model';
import { PlaceholderService } from 'app/entities/placeholder/service/placeholder.service';

import { TransactionAccountTypeUpdateComponent } from './transaction-account-type-update.component';

describe('Component Tests', () => {
  describe('TransactionAccountType Management Update Component', () => {
    let comp: TransactionAccountTypeUpdateComponent;
    let fixture: ComponentFixture<TransactionAccountTypeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let transactionAccountTypeService: TransactionAccountTypeService;
    let placeholderService: PlaceholderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TransactionAccountTypeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TransactionAccountTypeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TransactionAccountTypeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      transactionAccountTypeService = TestBed.inject(TransactionAccountTypeService);
      placeholderService = TestBed.inject(PlaceholderService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Placeholder query and add missing value', () => {
        const transactionAccountType: ITransactionAccountType = { id: 456 };
        const placeholders: IPlaceholder[] = [{ id: 20957 }];
        transactionAccountType.placeholders = placeholders;

        const placeholderCollection: IPlaceholder[] = [{ id: 54945 }];
        spyOn(placeholderService, 'query').and.returnValue(of(new HttpResponse({ body: placeholderCollection })));
        const additionalPlaceholders = [...placeholders];
        const expectedCollection: IPlaceholder[] = [...additionalPlaceholders, ...placeholderCollection];
        spyOn(placeholderService, 'addPlaceholderToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ transactionAccountType });
        comp.ngOnInit();

        expect(placeholderService.query).toHaveBeenCalled();
        expect(placeholderService.addPlaceholderToCollectionIfMissing).toHaveBeenCalledWith(
          placeholderCollection,
          ...additionalPlaceholders
        );
        expect(comp.placeholdersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const transactionAccountType: ITransactionAccountType = { id: 456 };
        const placeholders: IPlaceholder = { id: 72176 };
        transactionAccountType.placeholders = [placeholders];

        activatedRoute.data = of({ transactionAccountType });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(transactionAccountType));
        expect(comp.placeholdersSharedCollection).toContain(placeholders);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const transactionAccountType = { id: 123 };
        spyOn(transactionAccountTypeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ transactionAccountType });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: transactionAccountType }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(transactionAccountTypeService.update).toHaveBeenCalledWith(transactionAccountType);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const transactionAccountType = new TransactionAccountType();
        spyOn(transactionAccountTypeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ transactionAccountType });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: transactionAccountType }));
        saveSubject.complete();

        // THEN
        expect(transactionAccountTypeService.create).toHaveBeenCalledWith(transactionAccountType);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const transactionAccountType = { id: 123 };
        spyOn(transactionAccountTypeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ transactionAccountType });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(transactionAccountTypeService.update).toHaveBeenCalledWith(transactionAccountType);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPlaceholderById', () => {
        it('Should return tracked Placeholder primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPlaceholderById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedPlaceholder', () => {
        it('Should return option if no Placeholder is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedPlaceholder(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Placeholder for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedPlaceholder(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Placeholder is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedPlaceholder(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
