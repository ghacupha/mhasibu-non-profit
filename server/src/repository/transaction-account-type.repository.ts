import { EntityRepository, Repository } from 'typeorm';
import { TransactionAccountType } from '../domain/transaction-account-type.entity';

@EntityRepository(TransactionAccountType)
export class TransactionAccountTypeRepository extends Repository<TransactionAccountType> {}
