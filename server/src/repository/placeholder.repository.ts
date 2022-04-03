import { EntityRepository, Repository } from 'typeorm';
import { Placeholder } from '../domain/placeholder.entity';

@EntityRepository(Placeholder)
export class PlaceholderRepository extends Repository<Placeholder> {}
