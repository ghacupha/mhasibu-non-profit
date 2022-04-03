import { EntityRepository, Repository } from 'typeorm';
import { AccountTransaction } from '../domain/account-transaction.entity';

@EntityRepository(AccountTransaction)
export class AccountTransactionRepository extends Repository<AccountTransaction> {}
