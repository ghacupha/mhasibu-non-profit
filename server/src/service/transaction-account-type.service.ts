import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { TransactionAccountTypeDTO } from '../service/dto/transaction-account-type.dto';
import { TransactionAccountTypeMapper } from '../service/mapper/transaction-account-type.mapper';
import { TransactionAccountTypeRepository } from '../repository/transaction-account-type.repository';

const relationshipNames = [];
relationshipNames.push('placeholders');

@Injectable()
export class TransactionAccountTypeService {
    logger = new Logger('TransactionAccountTypeService');

    constructor(
        @InjectRepository(TransactionAccountTypeRepository)
        private transactionAccountTypeRepository: TransactionAccountTypeRepository,
    ) {}

    async findById(id: number): Promise<TransactionAccountTypeDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.transactionAccountTypeRepository.findOne(id, options);
        return TransactionAccountTypeMapper.fromEntityToDTO(result);
    }

    async findByFields(
        options: FindOneOptions<TransactionAccountTypeDTO>,
    ): Promise<TransactionAccountTypeDTO | undefined> {
        const result = await this.transactionAccountTypeRepository.findOne(options);
        return TransactionAccountTypeMapper.fromEntityToDTO(result);
    }

    async findAndCount(
        options: FindManyOptions<TransactionAccountTypeDTO>,
    ): Promise<[TransactionAccountTypeDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.transactionAccountTypeRepository.findAndCount(options);
        const transactionAccountTypeDTO: TransactionAccountTypeDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((transactionAccountType) =>
                transactionAccountTypeDTO.push(TransactionAccountTypeMapper.fromEntityToDTO(transactionAccountType)),
            );
            resultList[0] = transactionAccountTypeDTO;
        }
        return resultList;
    }

    async save(
        transactionAccountTypeDTO: TransactionAccountTypeDTO,
        creator?: string,
    ): Promise<TransactionAccountTypeDTO | undefined> {
        const entity = TransactionAccountTypeMapper.fromDTOtoEntity(transactionAccountTypeDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.transactionAccountTypeRepository.save(entity);
        return TransactionAccountTypeMapper.fromEntityToDTO(result);
    }

    async update(
        transactionAccountTypeDTO: TransactionAccountTypeDTO,
        updater?: string,
    ): Promise<TransactionAccountTypeDTO | undefined> {
        const entity = TransactionAccountTypeMapper.fromDTOtoEntity(transactionAccountTypeDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.transactionAccountTypeRepository.save(entity);
        return TransactionAccountTypeMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.transactionAccountTypeRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
