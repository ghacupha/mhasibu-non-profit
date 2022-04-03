import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionClassController } from '../web/rest/transaction-class.controller';
import { TransactionClassRepository } from '../repository/transaction-class.repository';
import { TransactionClassService } from '../service/transaction-class.service';

@Module({
    imports: [TypeOrmModule.forFeature([TransactionClassRepository])],
    controllers: [TransactionClassController],
    providers: [TransactionClassService],
    exports: [TransactionClassService],
})
export class TransactionClassModule {}
