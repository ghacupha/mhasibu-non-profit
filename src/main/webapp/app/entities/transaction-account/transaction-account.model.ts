import { ITransactionAccountType } from 'app/entities/transaction-account-type/transaction-account-type.model';
import { IPlaceholder } from 'app/entities/placeholder/placeholder.model';

export interface ITransactionAccount {
  id?: number;
  accountName?: string;
  description?: string | null;
  notes?: string | null;
  transactionAccountType?: ITransactionAccountType;
  placeholders?: IPlaceholder[] | null;
  parentAccount?: ITransactionAccount | null;
}

export class TransactionAccount implements ITransactionAccount {
  constructor(
    public id?: number,
    public accountName?: string,
    public description?: string | null,
    public notes?: string | null,
    public transactionAccountType?: ITransactionAccountType,
    public placeholders?: IPlaceholder[] | null,
    public parentAccount?: ITransactionAccount | null
  ) {}
}

export function getTransactionAccountIdentifier(transactionAccount: ITransactionAccount): number | undefined {
  return transactionAccount.id;
}
