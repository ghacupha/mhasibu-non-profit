import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth.module';
import { ormConfig } from './orm.config';
import { config } from './config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PlaceholderModule } from './module/placeholder.module';
import { TransactionSignatureModule } from './module/transaction-signature.module';
import { TransactionAccountTypeModule } from './module/transaction-account-type.module';
import { TransactionAccountModule } from './module/transaction-account.module';
import { TransactionClassModule } from './module/transaction-class.module';
import { AccountTransactionModule } from './module/account-transaction.module';
// jhipster-needle-add-entity-module-to-main-import - JHipster will import entity modules here, do not remove
// jhipster-needle-add-controller-module-to-main-import - JHipster will import controller modules here, do not remove
// jhipster-needle-add-service-module-to-main-import - JHipster will import service modules here, do not remove

@Module({
    imports: [
        TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
        ServeStaticModule.forRoot({
            rootPath: config.getClientPath(),
        }),
        AuthModule,
        PlaceholderModule,
        TransactionSignatureModule,
        TransactionAccountTypeModule,
        TransactionAccountModule,
        TransactionClassModule,
        AccountTransactionModule,
        // jhipster-needle-add-entity-module-to-main - JHipster will add entity modules here, do not remove
    ],
    controllers: [
        // jhipster-needle-add-controller-module-to-main - JHipster will add controller modules here, do not remove
    ],
    providers: [
        // jhipster-needle-add-service-module-to-main - JHipster will add service modules here, do not remove
    ],
})
export class AppModule {}
