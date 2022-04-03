import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PlaceholderDTO } from '../service/dto/placeholder.dto';
import { PlaceholderMapper } from '../service/mapper/placeholder.mapper';
import { PlaceholderRepository } from '../repository/placeholder.repository';

const relationshipNames = [];

@Injectable()
export class PlaceholderService {
    logger = new Logger('PlaceholderService');

    constructor(@InjectRepository(PlaceholderRepository) private placeholderRepository: PlaceholderRepository) {}

    async findById(id: number): Promise<PlaceholderDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.placeholderRepository.findOne(id, options);
        return PlaceholderMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<PlaceholderDTO>): Promise<PlaceholderDTO | undefined> {
        const result = await this.placeholderRepository.findOne(options);
        return PlaceholderMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<PlaceholderDTO>): Promise<[PlaceholderDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.placeholderRepository.findAndCount(options);
        const placeholderDTO: PlaceholderDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((placeholder) => placeholderDTO.push(PlaceholderMapper.fromEntityToDTO(placeholder)));
            resultList[0] = placeholderDTO;
        }
        return resultList;
    }

    async save(placeholderDTO: PlaceholderDTO, creator?: string): Promise<PlaceholderDTO | undefined> {
        const entity = PlaceholderMapper.fromDTOtoEntity(placeholderDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.placeholderRepository.save(entity);
        return PlaceholderMapper.fromEntityToDTO(result);
    }

    async update(placeholderDTO: PlaceholderDTO, updater?: string): Promise<PlaceholderDTO | undefined> {
        const entity = PlaceholderMapper.fromDTOtoEntity(placeholderDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.placeholderRepository.save(entity);
        return PlaceholderMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.placeholderRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
