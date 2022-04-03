import * as dayjs from 'dayjs';
import { ITransactionAccount } from 'app/entities/transaction-account/transaction-account.model';
import { ITransactionClass } from 'app/entities/transaction-class/transaction-class.model';
import { IPlaceholder } from 'app/entities/placeholder/placeholder.model';

export interface IAccountTransaction {
  id?: number;
  transactionNumber?: string | null;
  transactionDate?: dayjs.Dayjs | null;
  particulars?: string | null;
  notes?: string | null;
  transactionAmount?: number;
  debitAccount?: ITransactionAccount;
  creditAccount?: ITransactionAccount;
  transactionClass?: ITransactionClass | null;
  placeholders?: IPlaceholder[] | null;
}

export class AccountTransaction implements IAccountTransaction {
  constructor(
    public id?: number,
    public transactionNumber?: string | null,
    public transactionDate?: dayjs.Dayjs | null,
    public particulars?: string | null,
    public notes?: string | null,
    public transactionAmount?: number,
    public debitAccount?: ITransactionAccount,
    public creditAccount?: ITransactionAccount,
    public transactionClass?: ITransactionClass | null,
    public placeholders?: IPlaceholder[] | null
  ) {}
}

export function getAccountTransactionIdentifier(accountTransaction: IAccountTransaction): number | undefined {
  return accountTransaction.id;
}
