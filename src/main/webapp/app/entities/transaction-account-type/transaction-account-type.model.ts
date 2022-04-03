import { IPlaceholder } from 'app/entities/placeholder/placeholder.model';

export interface ITransactionAccountType {
  id?: number;
  accountType?: string;
  description?: string | null;
  placeholders?: IPlaceholder[] | null;
}

export class TransactionAccountType implements ITransactionAccountType {
  constructor(
    public id?: number,
    public accountType?: string,
    public description?: string | null,
    public placeholders?: IPlaceholder[] | null
  ) {}
}

export function getTransactionAccountTypeIdentifier(transactionAccountType: ITransactionAccountType): number | undefined {
  return transactionAccountType.id;
}
