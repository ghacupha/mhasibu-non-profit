import { TransactionClass } from '../../domain/transaction-class.entity';
import { TransactionClassDTO } from '../dto/transaction-class.dto';

/**
 * A TransactionClass mapper object.
 */
export class TransactionClassMapper {
    static fromDTOtoEntity(entityDTO: TransactionClassDTO): TransactionClass {
        if (!entityDTO) {
            return;
        }
        let entity = new TransactionClass();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: TransactionClass): TransactionClassDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new TransactionClassDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
