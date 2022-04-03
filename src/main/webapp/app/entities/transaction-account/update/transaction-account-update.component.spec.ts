jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TransactionAccountService } from '../service/transaction-account.service';
import { ITransactionAccount, TransactionAccount } from '../transaction-account.model';
import { ITransactionAccountType } from 'app/entities/transaction-account-type/transaction-account-type.model';
import { TransactionAccountTypeService } from 'app/entities/transaction-account-type/service/transaction-account-type.service';
import { IPlaceholder } from 'app/entities/placeholder/placeholder.model';
import { PlaceholderService } from 'app/entities/placeholder/service/placeholder.service';

import { TransactionAccountUpdateComponent } from './transaction-account-update.component';

describe('Component Tests', () => {
  describe('TransactionAccount Management Update Component', () => {
    let comp: TransactionAccountUpdateComponent;
    let fixture: ComponentFixture<TransactionAccountUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let transactionAccountService: TransactionAccountService;
    let transactionAccountTypeService: TransactionAccountTypeService;
    let placeholderService: PlaceholderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TransactionAccountUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TransactionAccountUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TransactionAccountUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      transactionAccountService = TestBed.inject(TransactionAccountService);
      transactionAccountTypeService = TestBed.inject(TransactionAccountTypeService);
      placeholderService = TestBed.inject(PlaceholderService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call TransactionAccountType query and add missing value', () => {
        const transactionAccount: ITransactionAccount = { id: 456 };
        const transactionAccountType: ITransactionAccountType = { id: 38848 };
        transactionAccount.transactionAccountType = transactionAccountType;

        const transactionAccountTypeCollection: ITransactionAccountType[] = [{ id: 67770 }];
        spyOn(transactionAccountTypeService, 'query').and.returnValue(of(new HttpResponse({ body: transactionAccountTypeCollection })));
        const additionalTransactionAccountTypes = [transactionAccountType];
        const expectedCollection: ITransactionAccountType[] = [...additionalTransactionAccountTypes, ...transactionAccountTypeCollection];
        spyOn(transactionAccountTypeService, 'addTransactionAccountTypeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ transactionAccount });
        comp.ngOnInit();

        expect(transactionAccountTypeService.query).toHaveBeenCalled();
        expect(transactionAccountTypeService.addTransactionAccountTypeToCollectionIfMissing).toHaveBeenCalledWith(
          transactionAccountTypeCollection,
          ...additionalTransactionAccountTypes
        );
        expect(comp.transactionAccountTypesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Placeholder query and add missing value', () => {
        const transactionAccount: ITransactionAccount = { id: 456 };
        const placeholders: IPlaceholder[] = [{ id: 15365 }];
        transactionAccount.placeholders = placeholders;

        const placeholderCollection: IPlaceholder[] = [{ id: 55158 }];
        spyOn(placeholderService, 'query').and.returnValue(of(new HttpResponse({ body: placeholderCollection })));
        const additionalPlaceholders = [...placeholders];
        const expectedCollection: IPlaceholder[] = [...additionalPlaceholders, ...placeholderCollection];
        spyOn(placeholderService, 'addPlaceholderToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ transactionAccount });
        comp.ngOnInit();

        expect(placeholderService.query).toHaveBeenCalled();
        expect(placeholderService.addPlaceholderToCollectionIfMissing).toHaveBeenCalledWith(
          placeholderCollection,
          ...additionalPlaceholders
        );
        expect(comp.placeholdersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const transactionAccount: ITransactionAccount = { id: 456 };
        const transactionAccountType: ITransactionAccountType = { id: 21094 };
        transactionAccount.transactionAccountType = transactionAccountType;
        const placeholders: IPlaceholder = { id: 78093 };
        transactionAccount.placeholders = [placeholders];

        activatedRoute.data = of({ transactionAccount });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(transactionAccount));
        expect(comp.transactionAccountTypesSharedCollection).toContain(transactionAccountType);
        expect(comp.placeholdersSharedCollection).toContain(placeholders);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const transactionAccount = { id: 123 };
        spyOn(transactionAccountService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ transactionAccount });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: transactionAccount }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(transactionAccountService.update).toHaveBeenCalledWith(transactionAccount);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const transactionAccount = new TransactionAccount();
        spyOn(transactionAccountService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ transactionAccount });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: transactionAccount }));
        saveSubject.complete();

        // THEN
        expect(transactionAccountService.create).toHaveBeenCalledWith(transactionAccount);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const transactionAccount = { id: 123 };
        spyOn(transactionAccountService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ transactionAccount });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(transactionAccountService.update).toHaveBeenCalledWith(transactionAccount);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackTransactionAccountTypeById', () => {
        it('Should return tracked TransactionAccountType primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTransactionAccountTypeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

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
