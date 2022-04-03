import { EntityRepository, Repository } from 'typeorm';
import { TransactionAccount } from '../domain/transaction-account.entity';

@EntityRepository(TransactionAccount)
export class TransactionAccountRepository extends Repository<TransactionAccount> {}
