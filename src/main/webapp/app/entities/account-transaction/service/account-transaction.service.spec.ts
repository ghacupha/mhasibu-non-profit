import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAccountTransaction, AccountTransaction } from '../account-transaction.model';

import { AccountTransactionService } from './account-transaction.service';

describe('Service Tests', () => {
  describe('AccountTransaction Service', () => {
    let service: AccountTransactionService;
    let httpMock: HttpTestingController;
    let elemDefault: IAccountTransaction;
    let expectedResult: IAccountTransaction | IAccountTransaction[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AccountTransactionService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        transactionNumber: 'AAAAAAA',
        transactionDate: currentDate,
        particulars: 'AAAAAAA',
        notes: 'AAAAAAA',
        transactionAmount: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            transactionDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a AccountTransaction', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            transactionDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            transactionDate: currentDate,
          },
          returnedFromService
        );

        service.create(new AccountTransaction()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a AccountTransaction', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            transactionNumber: 'BBBBBB',
            transactionDate: currentDate.format(DATE_TIME_FORMAT),
            particulars: 'BBBBBB',
            notes: 'BBBBBB',
            transactionAmount: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            transactionDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a AccountTransaction', () => {
        const patchObject = Object.assign(
          {
            transactionDate: currentDate.format(DATE_TIME_FORMAT),
            transactionAmount: 1,
          },
          new AccountTransaction()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            transactionDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of AccountTransaction', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            transactionNumber: 'BBBBBB',
            transactionDate: currentDate.format(DATE_TIME_FORMAT),
            particulars: 'BBBBBB',
            notes: 'BBBBBB',
            transactionAmount: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            transactionDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a AccountTransaction', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAccountTransactionToCollectionIfMissing', () => {
        it('should add a AccountTransaction to an empty array', () => {
          const accountTransaction: IAccountTransaction = { id: 123 };
          expectedResult = service.addAccountTransactionToCollectionIfMissing([], accountTransaction);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(accountTransaction);
        });

        it('should not add a AccountTransaction to an array that contains it', () => {
          const accountTransaction: IAccountTransaction = { id: 123 };
          const accountTransactionCollection: IAccountTransaction[] = [
            {
              ...accountTransaction,
            },
            { id: 456 },
          ];
          expectedResult = service.addAccountTransactionToCollectionIfMissing(accountTransactionCollection, accountTransaction);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a AccountTransaction to an array that doesn't contain it", () => {
          const accountTransaction: IAccountTransaction = { id: 123 };
          const accountTransactionCollection: IAccountTransaction[] = [{ id: 456 }];
          expectedResult = service.addAccountTransactionToCollectionIfMissing(accountTransactionCollection, accountTransaction);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(accountTransaction);
        });

        it('should add only unique AccountTransaction to an array', () => {
          const accountTransactionArray: IAccountTransaction[] = [{ id: 123 }, { id: 456 }, { id: 96577 }];
          const accountTransactionCollection: IAccountTransaction[] = [{ id: 123 }];
          expectedResult = service.addAccountTransactionToCollectionIfMissing(accountTransactionCollection, ...accountTransactionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const accountTransaction: IAccountTransaction = { id: 123 };
          const accountTransaction2: IAccountTransaction = { id: 456 };
          expectedResult = service.addAccountTransactionToCollectionIfMissing([], accountTransaction, accountTransaction2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(accountTransaction);
          expect(expectedResult).toContain(accountTransaction2);
        });

        it('should accept null and undefined values', () => {
          const accountTransaction: IAccountTransaction = { id: 123 };
          expectedResult = service.addAccountTransactionToCollectionIfMissing([], null, accountTransaction, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(accountTransaction);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
