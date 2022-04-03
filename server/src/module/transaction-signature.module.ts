import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionSignatureController } from '../web/rest/transaction-signature.controller';
import { TransactionSignatureRepository } from '../repository/transaction-signature.repository';
import { TransactionSignatureService } from '../service/transaction-signature.service';

@Module({
    imports: [TypeOrmModule.forFeature([TransactionSignatureRepository])],
    controllers: [TransactionSignatureController],
    providers: [TransactionSignatureService],
    exports: [TransactionSignatureService],
})
export class TransactionSignatureModule {}
