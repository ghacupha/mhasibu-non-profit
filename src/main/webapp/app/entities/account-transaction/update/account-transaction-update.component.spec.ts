jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AccountTransactionService } from '../service/account-transaction.service';
import { IAccountTransaction, AccountTransaction } from '../account-transaction.model';
import { ITransactionAccount } from 'app/entities/transaction-account/transaction-account.model';
import { TransactionAccountService } from 'app/entities/transaction-account/service/transaction-account.service';
import { ITransactionClass } from 'app/entities/transaction-class/transaction-class.model';
import { TransactionClassService } from 'app/entities/transaction-class/service/transaction-class.service';
import { IPlaceholder } from 'app/entities/placeholder/placeholder.model';
import { PlaceholderService } from 'app/entities/placeholder/service/placeholder.service';

import { AccountTransactionUpdateComponent } from './account-transaction-update.component';

describe('Component Tests', () => {
  describe('AccountTransaction Management Update Component', () => {
    let comp: AccountTransactionUpdateComponent;
    let fixture: ComponentFixture<AccountTransactionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let accountTransactionService: AccountTransactionService;
    let transactionAccountService: TransactionAccountService;
    let transactionClassService: TransactionClassService;
    let placeholderService: PlaceholderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AccountTransactionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AccountTransactionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AccountTransactionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      accountTransactionService = TestBed.inject(AccountTransactionService);
      transactionAccountService = TestBed.inject(TransactionAccountService);
      transactionClassService = TestBed.inject(TransactionClassService);
      placeholderService = TestBed.inject(PlaceholderService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call TransactionAccount query and add missing value', () => {
        const accountTransaction: IAccountTransaction = { id: 456 };
        const debitAccount: ITransactionAccount = { id: 68032 };
        accountTransaction.debitAccount = debitAccount;
        const creditAccount: ITransactionAccount = { id: 3097 };
        accountTransaction.creditAccount = creditAccount;

        const transactionAccountCollection: ITransactionAccount[] = [{ id: 3441 }];
        spyOn(transactionAccountService, 'query').and.returnValue(of(new HttpResponse({ body: transactionAccountCollection })));
        const additionalTransactionAccounts = [debitAccount, creditAccount];
        const expectedCollection: ITransactionAccount[] = [...additionalTransactionAccounts, ...transactionAccountCollection];
        spyOn(transactionAccountService, 'addTransactionAccountToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ accountTransaction });
        comp.ngOnInit();

        expect(transactionAccountService.query).toHaveBeenCalled();
        expect(transactionAccountService.addTransactionAccountToCollectionIfMissing).toHaveBeenCalledWith(
          transactionAccountCollection,
          ...additionalTransactionAccounts
        );
        expect(comp.transactionAccountsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call TransactionClass query and add missing value', () => {
        const accountTransaction: IAccountTransaction = { id: 456 };
        const transactionClass: ITransactionClass = { id: 13388 };
        accountTransaction.transactionClass = transactionClass;

        const transactionClassCollection: ITransactionClass[] = [{ id: 39397 }];
        spyOn(transactionClassService, 'query').and.returnValue(of(new HttpResponse({ body: transactionClassCollection })));
        const additionalTransactionClasses = [transactionClass];
        const expectedCollection: ITransactionClass[] = [...additionalTransactionClasses, ...transactionClassCollection];
        spyOn(transactionClassService, 'addTransactionClassToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ accountTransaction });
        comp.ngOnInit();

        expect(transactionClassService.query).toHaveBeenCalled();
        expect(transactionClassService.addTransactionClassToCollectionIfMissing).toHaveBeenCalledWith(
          transactionClassCollection,
          ...additionalTransactionClasses
        );
        expect(comp.transactionClassesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Placeholder query and add missing value', () => {
        const accountTransaction: IAccountTransaction = { id: 456 };
        const placeholders: IPlaceholder[] = [{ id: 18426 }];
        accountTransaction.placeholders = placeholders;

        const placeholderCollection: IPlaceholder[] = [{ id: 5337 }];
        spyOn(placeholderService, 'query').and.returnValue(of(new HttpResponse({ body: placeholderCollection })));
        const additionalPlaceholders = [...placeholders];
        const expectedCollection: IPlaceholder[] = [...additionalPlaceholders, ...placeholderCollection];
        spyOn(placeholderService, 'addPlaceholderToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ accountTransaction });
        comp.ngOnInit();

        expect(placeholderService.query).toHaveBeenCalled();
        expect(placeholderService.addPlaceholderToCollectionIfMissing).toHaveBeenCalledWith(
          placeholderCollection,
          ...additionalPlaceholders
        );
        expect(comp.placeholdersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const accountTransaction: IAccountTransaction = { id: 456 };
        const debitAccount: ITransactionAccount = { id: 84037 };
        accountTransaction.debitAccount = debitAccount;
        const creditAccount: ITransactionAccount = { id: 16818 };
        accountTransaction.creditAccount = creditAccount;
        const transactionClass: ITransactionClass = { id: 917 };
        accountTransaction.transactionClass = transactionClass;
        const placeholders: IPlaceholder = { id: 63918 };
        accountTransaction.placeholders = [placeholders];

        activatedRoute.data = of({ accountTransaction });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(accountTransaction));
        expect(comp.transactionAccountsSharedCollection).toContain(debitAccount);
        expect(comp.transactionAccountsSharedCollection).toContain(creditAccount);
        expect(comp.transactionClassesSharedCollection).toContain(transactionClass);
        expect(comp.placeholdersSharedCollection).toContain(placeholders);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const accountTransaction = { id: 123 };
        spyOn(accountTransactionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ accountTransaction });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: accountTransaction }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(accountTransactionService.update).toHaveBeenCalledWith(accountTransaction);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const accountTransaction = new AccountTransaction();
        spyOn(accountTransactionService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ accountTransaction });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: accountTransaction }));
        saveSubject.complete();

        // THEN
        expect(accountTransactionService.create).toHaveBeenCalledWith(accountTransaction);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const accountTransaction = { id: 123 };
        spyOn(accountTransactionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ accountTransaction });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(accountTransactionService.update).toHaveBeenCalledWith(accountTransaction);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackTransactionAccountById', () => {
        it('Should return tracked TransactionAccount primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTransactionAccountById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackTransactionClassById', () => {
        it('Should return tracked TransactionClass primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTransactionClassById(0, entity);
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
