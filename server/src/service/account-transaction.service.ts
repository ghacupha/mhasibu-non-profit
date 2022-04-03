import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { AccountTransactionDTO } from '../service/dto/account-transaction.dto';
import { AccountTransactionMapper } from '../service/mapper/account-transaction.mapper';
import { AccountTransactionRepository } from '../repository/account-transaction.repository';

const relationshipNames = [];
relationshipNames.push('debitAccount');
relationshipNames.push('creditAccount');
relationshipNames.push('transactionClass');
relationshipNames.push('placeholders');

@Injectable()
export class AccountTransactionService {
    logger = new Logger('AccountTransactionService');

    constructor(
        @InjectRepository(AccountTransactionRepository)
        private accountTransactionRepository: AccountTransactionRepository,
    ) {}

    async findById(id: number): Promise<AccountTransactionDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.accountTransactionRepository.findOne(id, options);
        return AccountTransactionMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<AccountTransactionDTO>): Promise<AccountTransactionDTO | undefined> {
        const result = await this.accountTransactionRepository.findOne(options);
        return AccountTransactionMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<AccountTransactionDTO>): Promise<[AccountTransactionDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.accountTransactionRepository.findAndCount(options);
        const accountTransactionDTO: AccountTransactionDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((accountTransaction) =>
                accountTransactionDTO.push(AccountTransactionMapper.fromEntityToDTO(accountTransaction)),
            );
            resultList[0] = accountTransactionDTO;
        }
        return resultList;
    }

    async save(
        accountTransactionDTO: AccountTransactionDTO,
        creator?: string,
    ): Promise<AccountTransactionDTO | undefined> {
        const entity = AccountTransactionMapper.fromDTOtoEntity(accountTransactionDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.accountTransactionRepository.save(entity);
        return AccountTransactionMapper.fromEntityToDTO(result);
    }

    async update(
        accountTransactionDTO: AccountTransactionDTO,
        updater?: string,
    ): Promise<AccountTransactionDTO | undefined> {
        const entity = AccountTransactionMapper.fromDTOtoEntity(accountTransactionDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.accountTransactionRepository.save(entity);
        return AccountTransactionMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.accountTransactionRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
