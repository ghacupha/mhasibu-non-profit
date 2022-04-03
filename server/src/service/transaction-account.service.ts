import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { TransactionAccountDTO } from '../service/dto/transaction-account.dto';
import { TransactionAccountMapper } from '../service/mapper/transaction-account.mapper';
import { TransactionAccountRepository } from '../repository/transaction-account.repository';

const relationshipNames = [];
relationshipNames.push('transactionAccountType');
relationshipNames.push('placeholders');

@Injectable()
export class TransactionAccountService {
    logger = new Logger('TransactionAccountService');

    constructor(
        @InjectRepository(TransactionAccountRepository)
        private transactionAccountRepository: TransactionAccountRepository,
    ) {}

    async findById(id: number): Promise<TransactionAccountDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.transactionAccountRepository.findOne(id, options);
        return TransactionAccountMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<TransactionAccountDTO>): Promise<TransactionAccountDTO | undefined> {
        const result = await this.transactionAccountRepository.findOne(options);
        return TransactionAccountMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<TransactionAccountDTO>): Promise<[TransactionAccountDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.transactionAccountRepository.findAndCount(options);
        const transactionAccountDTO: TransactionAccountDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((transactionAccount) =>
                transactionAccountDTO.push(TransactionAccountMapper.fromEntityToDTO(transactionAccount)),
            );
            resultList[0] = transactionAccountDTO;
        }
        return resultList;
    }

    async save(
        transactionAccountDTO: TransactionAccountDTO,
        creator?: string,
    ): Promise<TransactionAccountDTO | undefined> {
        const entity = TransactionAccountMapper.fromDTOtoEntity(transactionAccountDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.transactionAccountRepository.save(entity);
        return TransactionAccountMapper.fromEntityToDTO(result);
    }

    async update(
        transactionAccountDTO: TransactionAccountDTO,
        updater?: string,
    ): Promise<TransactionAccountDTO | undefined> {
        const entity = TransactionAccountMapper.fromDTOtoEntity(transactionAccountDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.transactionAccountRepository.save(entity);
        return TransactionAccountMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.transactionAccountRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
