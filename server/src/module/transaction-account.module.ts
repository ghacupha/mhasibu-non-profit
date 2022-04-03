import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionAccountController } from '../web/rest/transaction-account.controller';
import { TransactionAccountRepository } from '../repository/transaction-account.repository';
import { TransactionAccountService } from '../service/transaction-account.service';

@Module({
    imports: [TypeOrmModule.forFeature([TransactionAccountRepository])],
    controllers: [TransactionAccountController],
    providers: [TransactionAccountService],
    exports: [TransactionAccountService],
})
export class TransactionAccountModule {}
