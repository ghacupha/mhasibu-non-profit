import { AccountTransaction } from '../../domain/account-transaction.entity';
import { AccountTransactionDTO } from '../dto/account-transaction.dto';

/**
 * A AccountTransaction mapper object.
 */
export class AccountTransactionMapper {
    static fromDTOtoEntity(entityDTO: AccountTransactionDTO): AccountTransaction {
        if (!entityDTO) {
            return;
        }
        let entity = new AccountTransaction();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: AccountTransaction): AccountTransactionDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new AccountTransactionDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
