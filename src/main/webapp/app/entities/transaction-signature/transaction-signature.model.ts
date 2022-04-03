import * as dayjs from 'dayjs';
import { IPlaceholder } from 'app/entities/placeholder/placeholder.model';
import { IUser } from 'app/entities/user/user.model';

export interface ITransactionSignature {
  id?: number;
  description?: string;
  moduleAffected?: string | null;
  transactionTimeStamp?: dayjs.Dayjs | null;
  placeholders?: IPlaceholder[] | null;
  user?: IUser | null;
}

export class TransactionSignature implements ITransactionSignature {
  constructor(
    public id?: number,
    public description?: string,
    public moduleAffected?: string | null,
    public transactionTimeStamp?: dayjs.Dayjs | null,
    public placeholders?: IPlaceholder[] | null,
    public user?: IUser | null
  ) {}
}

export function getTransactionSignatureIdentifier(transactionSignature: ITransactionSignature): number | undefined {
  return transactionSignature.id;
}
