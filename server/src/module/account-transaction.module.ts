import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTransactionController } from '../web/rest/account-transaction.controller';
import { AccountTransactionRepository } from '../repository/account-transaction.repository';
import { AccountTransactionService } from '../service/account-transaction.service';

@Module({
    imports: [TypeOrmModule.forFeature([AccountTransactionRepository])],
    controllers: [AccountTransactionController],
    providers: [AccountTransactionService],
    exports: [AccountTransactionService],
})
export class AccountTransactionModule {}
