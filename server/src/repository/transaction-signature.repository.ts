import { EntityRepository, Repository } from 'typeorm';
import { TransactionSignature } from '../domain/transaction-signature.entity';

@EntityRepository(TransactionSignature)
export class TransactionSignatureRepository extends Repository<TransactionSignature> {}
