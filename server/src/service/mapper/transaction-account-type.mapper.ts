import { TransactionAccountType } from '../../domain/transaction-account-type.entity';
import { TransactionAccountTypeDTO } from '../dto/transaction-account-type.dto';

/**
 * A TransactionAccountType mapper object.
 */
export class TransactionAccountTypeMapper {
    static fromDTOtoEntity(entityDTO: TransactionAccountTypeDTO): TransactionAccountType {
        if (!entityDTO) {
            return;
        }
        let entity = new TransactionAccountType();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: TransactionAccountType): TransactionAccountTypeDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new TransactionAccountTypeDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
