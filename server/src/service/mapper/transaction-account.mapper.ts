import { TransactionAccount } from '../../domain/transaction-account.entity';
import { TransactionAccountDTO } from '../dto/transaction-account.dto';

/**
 * A TransactionAccount mapper object.
 */
export class TransactionAccountMapper {
    static fromDTOtoEntity(entityDTO: TransactionAccountDTO): TransactionAccount {
        if (!entityDTO) {
            return;
        }
        let entity = new TransactionAccount();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: TransactionAccount): TransactionAccountDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new TransactionAccountDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
