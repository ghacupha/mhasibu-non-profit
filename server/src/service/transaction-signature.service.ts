import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { TransactionSignatureDTO } from '../service/dto/transaction-signature.dto';
import { TransactionSignatureMapper } from '../service/mapper/transaction-signature.mapper';
import { TransactionSignatureRepository } from '../repository/transaction-signature.repository';

const relationshipNames = [];
relationshipNames.push('placeholders');
relationshipNames.push('user');

@Injectable()
export class TransactionSignatureService {
    logger = new Logger('TransactionSignatureService');

    constructor(
        @InjectRepository(TransactionSignatureRepository)
        private transactionSignatureRepository: TransactionSignatureRepository,
    ) {}

    async findById(id: number): Promise<TransactionSignatureDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.transactionSignatureRepository.findOne(id, options);
        return TransactionSignatureMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<TransactionSignatureDTO>): Promise<TransactionSignatureDTO | undefined> {
        const result = await this.transactionSignatureRepository.findOne(options);
        return TransactionSignatureMapper.fromEntityToDTO(result);
    }

    async findAndCount(
        options: FindManyOptions<TransactionSignatureDTO>,
    ): Promise<[TransactionSignatureDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.transactionSignatureRepository.findAndCount(options);
        const transactionSignatureDTO: TransactionSignatureDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((transactionSignature) =>
                transactionSignatureDTO.push(TransactionSignatureMapper.fromEntityToDTO(transactionSignature)),
            );
            resultList[0] = transactionSignatureDTO;
        }
        return resultList;
    }

    async save(
        transactionSignatureDTO: TransactionSignatureDTO,
        creator?: string,
    ): Promise<TransactionSignatureDTO | undefined> {
        const entity = TransactionSignatureMapper.fromDTOtoEntity(transactionSignatureDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.transactionSignatureRepository.save(entity);
        return TransactionSignatureMapper.fromEntityToDTO(result);
    }

    async update(
        transactionSignatureDTO: TransactionSignatureDTO,
        updater?: string,
    ): Promise<TransactionSignatureDTO | undefined> {
        const entity = TransactionSignatureMapper.fromDTOtoEntity(transactionSignatureDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.transactionSignatureRepository.save(entity);
        return TransactionSignatureMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.transactionSignatureRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
