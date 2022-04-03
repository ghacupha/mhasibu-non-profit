import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionAccountTypeController } from '../web/rest/transaction-account-type.controller';
import { TransactionAccountTypeRepository } from '../repository/transaction-account-type.repository';
import { TransactionAccountTypeService } from '../service/transaction-account-type.service';

@Module({
    imports: [TypeOrmModule.forFeature([TransactionAccountTypeRepository])],
    controllers: [TransactionAccountTypeController],
    providers: [TransactionAccountTypeService],
    exports: [TransactionAccountTypeService],
})
export class TransactionAccountTypeModule {}
