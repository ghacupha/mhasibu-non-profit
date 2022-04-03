import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITransactionSignature, TransactionSignature } from '../transaction-signature.model';

import { TransactionSignatureService } from './transaction-signature.service';

describe('Service Tests', () => {
  describe('TransactionSignature Service', () => {
    let service: TransactionSignatureService;
    let httpMock: HttpTestingController;
    let elemDefault: ITransactionSignature;
    let expectedResult: ITransactionSignature | ITransactionSignature[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TransactionSignatureService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        description: 'AAAAAAA',
        moduleAffected: 'AAAAAAA',
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

      it('should create a TransactionSignature', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new TransactionSignature()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a TransactionSignature', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            description: 'BBBBBB',
            moduleAffected: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a TransactionSignature', () => {
        const patchObject = Object.assign({}, new TransactionSignature());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of TransactionSignature', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            description: 'BBBBBB',
            moduleAffected: 'BBBBBB',
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

      it('should delete a TransactionSignature', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTransactionSignatureToCollectionIfMissing', () => {
        it('should add a TransactionSignature to an empty array', () => {
          const transactionSignature: ITransactionSignature = { id: 123 };
          expectedResult = service.addTransactionSignatureToCollectionIfMissing([], transactionSignature);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(transactionSignature);
        });

        it('should not add a TransactionSignature to an array that contains it', () => {
          const transactionSignature: ITransactionSignature = { id: 123 };
          const transactionSignatureCollection: ITransactionSignature[] = [
            {
              ...transactionSignature,
            },
            { id: 456 },
          ];
          expectedResult = service.addTransactionSignatureToCollectionIfMissing(transactionSignatureCollection, transactionSignature);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a TransactionSignature to an array that doesn't contain it", () => {
          const transactionSignature: ITransactionSignature = { id: 123 };
          const transactionSignatureCollection: ITransactionSignature[] = [{ id: 456 }];
          expectedResult = service.addTransactionSignatureToCollectionIfMissing(transactionSignatureCollection, transactionSignature);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(transactionSignature);
        });

        it('should add only unique TransactionSignature to an array', () => {
          const transactionSignatureArray: ITransactionSignature[] = [{ id: 123 }, { id: 456 }, { id: 33014 }];
          const transactionSignatureCollection: ITransactionSignature[] = [{ id: 123 }];
          expectedResult = service.addTransactionSignatureToCollectionIfMissing(
            transactionSignatureCollection,
            ...transactionSignatureArray
          );
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const transactionSignature: ITransactionSignature = { id: 123 };
          const transactionSignature2: ITransactionSignature = { id: 456 };
          expectedResult = service.addTransactionSignatureToCollectionIfMissing([], transactionSignature, transactionSignature2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(transactionSignature);
          expect(expectedResult).toContain(transactionSignature2);
        });

        it('should accept null and undefined values', () => {
          const transactionSignature: ITransactionSignature = { id: 123 };
          expectedResult = service.addTransactionSignatureToCollectionIfMissing([], null, transactionSignature, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(transactionSignature);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
