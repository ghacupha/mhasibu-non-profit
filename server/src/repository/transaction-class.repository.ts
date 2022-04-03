import { EntityRepository, Repository } from 'typeorm';
import { TransactionClass } from '../domain/transaction-class.entity';

@EntityRepository(TransactionClass)
export class TransactionClassRepository extends Repository<TransactionClass> {}
