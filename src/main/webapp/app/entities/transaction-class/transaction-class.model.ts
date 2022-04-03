import { IPlaceholder } from 'app/entities/placeholder/placeholder.model';

export interface ITransactionClass {
  id?: number;
  transactionClass?: string;
  notes?: string | null;
  placeholders?: IPlaceholder[] | null;
}

export class TransactionClass implements ITransactionClass {
  constructor(
    public id?: number,
    public transactionClass?: string,
    public notes?: string | null,
    public placeholders?: IPlaceholder[] | null
  ) {}
}

export function getTransactionClassIdentifier(transactionClass: ITransactionClass): number | undefined {
  return transactionClass.id;
}
