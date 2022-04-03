import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITransactionAccountType, TransactionAccountType } from '../transaction-account-type.model';

import { TransactionAccountTypeService } from './transaction-account-type.service';

describe('Service Tests', () => {
  describe('TransactionAccountType Service', () => {
    let service: TransactionAccountTypeService;
    let httpMock: HttpTestingController;
    let elemDefault: ITransactionAccountType;
    let expectedResult: ITransactionAccountType | ITransactionAccountType[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TransactionAccountTypeService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        accountType: 'AAAAAAA',
        description: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a TransactionAccountType', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new TransactionAccountType()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a TransactionAccountType', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            accountType: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a TransactionAccountType', () => {
        const patchObject = Object.assign(
          {
            accountType: 'BBBBBB',
            description: 'BBBBBB',
          },
          new TransactionAccountType()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of TransactionAccountType', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            accountType: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a TransactionAccountType', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTransactionAccountTypeToCollectionIfMissing', () => {
        it('should add a TransactionAccountType to an empty array', () => {
          const transactionAccountType: ITransactionAccountType = { id: 123 };
          expectedResult = service.addTransactionAccountTypeToCollectionIfMissing([], transactionAccountType);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(transactionAccountType);
        });

        it('should not add a TransactionAccountType to an array that contains it', () => {
          const transactionAccountType: ITransactionAccountType = { id: 123 };
          const transactionAccountTypeCollection: ITransactionAccountType[] = [
            {
              ...transactionAccountType,
            },
            { id: 456 },
          ];
          expectedResult = service.addTransactionAccountTypeToCollectionIfMissing(transactionAccountTypeCollection, transactionAccountType);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a TransactionAccountType to an array that doesn't contain it", () => {
          const transactionAccountType: ITransactionAccountType = { id: 123 };
          const transactionAccountTypeCollection: ITransactionAccountType[] = [{ id: 456 }];
          expectedResult = service.addTransactionAccountTypeToCollectionIfMissing(transactionAccountTypeCollection, transactionAccountType);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(transactionAccountType);
        });

        it('should add only unique TransactionAccountType to an array', () => {
          const transactionAccountTypeArray: ITransactionAccountType[] = [{ id: 123 }, { id: 456 }, { id: 91612 }];
          const transactionAccountTypeCollection: ITransactionAccountType[] = [{ id: 123 }];
          expectedResult = service.addTransactionAccountTypeToCollectionIfMissing(
            transactionAccountTypeCollection,
            ...transactionAccountTypeArray
          );
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const transactionAccountType: ITransactionAccountType = { id: 123 };
          const transactionAccountType2: ITransactionAccountType = { id: 456 };
          expectedResult = service.addTransactionAccountTypeToCollectionIfMissing([], transactionAccountType, transactionAccountType2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(transactionAccountType);
          expect(expectedResult).toContain(transactionAccountType2);
        });

        it('should accept null and undefined values', () => {
          const transactionAccountType: ITransactionAccountType = { id: 123 };
          expectedResult = service.addTransactionAccountTypeToCollectionIfMissing([], null, transactionAccountType, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(transactionAccountType);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
