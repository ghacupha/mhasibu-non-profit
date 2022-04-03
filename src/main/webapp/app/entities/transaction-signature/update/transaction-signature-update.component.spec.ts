jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TransactionSignatureService } from '../service/transaction-signature.service';
import { ITransactionSignature, TransactionSignature } from '../transaction-signature.model';
import { IPlaceholder } from 'app/entities/placeholder/placeholder.model';
import { PlaceholderService } from 'app/entities/placeholder/service/placeholder.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { TransactionSignatureUpdateComponent } from './transaction-signature-update.component';

describe('Component Tests', () => {
  describe('TransactionSignature Management Update Component', () => {
    let comp: TransactionSignatureUpdateComponent;
    let fixture: ComponentFixture<TransactionSignatureUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let transactionSignatureService: TransactionSignatureService;
    let placeholderService: PlaceholderService;
    let userService: UserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TransactionSignatureUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TransactionSignatureUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TransactionSignatureUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      transactionSignatureService = TestBed.inject(TransactionSignatureService);
      placeholderService = TestBed.inject(PlaceholderService);
      userService = TestBed.inject(UserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Placeholder query and add missing value', () => {
        const transactionSignature: ITransactionSignature = { id: 456 };
        const placeholders: IPlaceholder[] = [{ id: 55340 }];
        transactionSignature.placeholders = placeholders;

        const placeholderCollection: IPlaceholder[] = [{ id: 81121 }];
        spyOn(placeholderService, 'query').and.returnValue(of(new HttpResponse({ body: placeholderCollection })));
        const additionalPlaceholders = [...placeholders];
        const expectedCollection: IPlaceholder[] = [...additionalPlaceholders, ...placeholderCollection];
        spyOn(placeholderService, 'addPlaceholderToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ transactionSignature });
        comp.ngOnInit();

        expect(placeholderService.query).toHaveBeenCalled();
        expect(placeholderService.addPlaceholderToCollectionIfMissing).toHaveBeenCalledWith(
          placeholderCollection,
          ...additionalPlaceholders
        );
        expect(comp.placeholdersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call User query and add missing value', () => {
        const transactionSignature: ITransactionSignature = { id: 456 };
        const user: IUser = { id: 27699 };
        transactionSignature.user = user;

        const userCollection: IUser[] = [{ id: 87926 }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ transactionSignature });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const transactionSignature: ITransactionSignature = { id: 456 };
        const placeholders: IPlaceholder = { id: 47792 };
        transactionSignature.placeholders = [placeholders];
        const user: IUser = { id: 47918 };
        transactionSignature.user = user;

        activatedRoute.data = of({ transactionSignature });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(transactionSignature));
        expect(comp.placeholdersSharedCollection).toContain(placeholders);
        expect(comp.usersSharedCollection).toContain(user);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const transactionSignature = { id: 123 };
        spyOn(transactionSignatureService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ transactionSignature });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: transactionSignature }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(transactionSignatureService.update).toHaveBeenCalledWith(transactionSignature);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const transactionSignature = new TransactionSignature();
        spyOn(transactionSignatureService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ transactionSignature });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: transactionSignature }));
        saveSubject.complete();

        // THEN
        expect(transactionSignatureService.create).toHaveBeenCalledWith(transactionSignature);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const transactionSignature = { id: 123 };
        spyOn(transactionSignatureService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ transactionSignature });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(transactionSignatureService.update).toHaveBeenCalledWith(transactionSignature);
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

      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
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
