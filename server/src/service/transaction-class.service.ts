import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { TransactionClassDTO } from '../service/dto/transaction-class.dto';
import { TransactionClassMapper } from '../service/mapper/transaction-class.mapper';
import { TransactionClassRepository } from '../repository/transaction-class.repository';

const relationshipNames = [];
relationshipNames.push('placeholders');

@Injectable()
export class TransactionClassService {
    logger = new Logger('TransactionClassService');

    constructor(
        @InjectRepository(TransactionClassRepository) private transactionClassRepository: TransactionClassRepository,
    ) {}

    async findById(id: number): Promise<TransactionClassDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.transactionClassRepository.findOne(id, options);
        return TransactionClassMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<TransactionClassDTO>): Promise<TransactionClassDTO | undefined> {
        const result = await this.transactionClassRepository.findOne(options);
        return TransactionClassMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<TransactionClassDTO>): Promise<[TransactionClassDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.transactionClassRepository.findAndCount(options);
        const transactionClassDTO: TransactionClassDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((transactionClass) =>
                transactionClassDTO.push(TransactionClassMapper.fromEntityToDTO(transactionClass)),
            );
            resultList[0] = transactionClassDTO;
        }
        return resultList;
    }

    async save(transactionClassDTO: TransactionClassDTO, creator?: string): Promise<TransactionClassDTO | undefined> {
        const entity = TransactionClassMapper.fromDTOtoEntity(transactionClassDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.transactionClassRepository.save(entity);
        return TransactionClassMapper.fromEntityToDTO(result);
    }

    async update(transactionClassDTO: TransactionClassDTO, updater?: string): Promise<TransactionClassDTO | undefined> {
        const entity = TransactionClassMapper.fromDTOtoEntity(transactionClassDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.transactionClassRepository.save(entity);
        return TransactionClassMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.transactionClassRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
