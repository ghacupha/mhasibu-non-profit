import { TransactionSignature } from '../../domain/transaction-signature.entity';
import { TransactionSignatureDTO } from '../dto/transaction-signature.dto';

/**
 * A TransactionSignature mapper object.
 */
export class TransactionSignatureMapper {
    static fromDTOtoEntity(entityDTO: TransactionSignatureDTO): TransactionSignature {
        if (!entityDTO) {
            return;
        }
        let entity = new TransactionSignature();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: TransactionSignature): TransactionSignatureDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new TransactionSignatureDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
