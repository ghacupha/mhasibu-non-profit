import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITransactionClass, TransactionClass } from '../transaction-class.model';

import { TransactionClassService } from './transaction-class.service';

describe('Service Tests', () => {
  describe('TransactionClass Service', () => {
    let service: TransactionClassService;
    let httpMock: HttpTestingController;
    let elemDefault: ITransactionClass;
    let expectedResult: ITransactionClass | ITransactionClass[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TransactionClassService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        transactionClass: 'AAAAAAA',
        notes: 'AAAAAAA',
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

      it('should create a TransactionClass', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new TransactionClass()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a TransactionClass', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            transactionClass: 'BBBBBB',
            notes: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a TransactionClass', () => {
        const patchObject = Object.assign(
          {
            notes: 'BBBBBB',
          },
          new TransactionClass()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of TransactionClass', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            transactionClass: 'BBBBBB',
            notes: 'BBBBBB',
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

      it('should delete a TransactionClass', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTransactionClassToCollectionIfMissing', () => {
        it('should add a TransactionClass to an empty array', () => {
          const transactionClass: ITransactionClass = { id: 123 };
          expectedResult = service.addTransactionClassToCollectionIfMissing([], transactionClass);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(transactionClass);
        });

        it('should not add a TransactionClass to an array that contains it', () => {
          const transactionClass: ITransactionClass = { id: 123 };
          const transactionClassCollection: ITransactionClass[] = [
            {
              ...transactionClass,
            },
            { id: 456 },
          ];
          expectedResult = service.addTransactionClassToCollectionIfMissing(transactionClassCollection, transactionClass);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a TransactionClass to an array that doesn't contain it", () => {
          const transactionClass: ITransactionClass = { id: 123 };
          const transactionClassCollection: ITransactionClass[] = [{ id: 456 }];
          expectedResult = service.addTransactionClassToCollectionIfMissing(transactionClassCollection, transactionClass);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(transactionClass);
        });

        it('should add only unique TransactionClass to an array', () => {
          const transactionClassArray: ITransactionClass[] = [{ id: 123 }, { id: 456 }, { id: 39767 }];
          const transactionClassCollection: ITransactionClass[] = [{ id: 123 }];
          expectedResult = service.addTransactionClassToCollectionIfMissing(transactionClassCollection, ...transactionClassArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const transactionClass: ITransactionClass = { id: 123 };
          const transactionClass2: ITransactionClass = { id: 456 };
          expectedResult = service.addTransactionClassToCollectionIfMissing([], transactionClass, transactionClass2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(transactionClass);
          expect(expectedResult).toContain(transactionClass2);
        });

        it('should accept null and undefined values', () => {
          const transactionClass: ITransactionClass = { id: 123 };
          expectedResult = service.addTransactionClassToCollectionIfMissing([], null, transactionClass, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(transactionClass);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
