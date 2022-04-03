import { Placeholder } from '../../domain/placeholder.entity';
import { PlaceholderDTO } from '../dto/placeholder.dto';

/**
 * A Placeholder mapper object.
 */
export class PlaceholderMapper {
    static fromDTOtoEntity(entityDTO: PlaceholderDTO): Placeholder {
        if (!entityDTO) {
            return;
        }
        let entity = new Placeholder();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Placeholder): PlaceholderDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new PlaceholderDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
