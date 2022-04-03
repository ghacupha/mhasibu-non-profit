import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { AccountTransactionDTO } from '../src/service/dto/account-transaction.dto';
import { AccountTransactionService } from '../src/service/account-transaction.service';

describe('AccountTransaction Controller', () => {
    let app: INestApplication;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };
    const entityMock: any = {
        id: 'entityId',
    };

    const serviceMock = {
        findById: (): any => entityMock,
        findAndCount: (): any => [entityMock, 0],
        save: (): any => entityMock,
        update: (): any => entityMock,
        deleteById: (): any => entityMock,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardMock)
            .overrideGuard(RolesGuard)
            .useValue(rolesGuardMock)
            .overrideProvider(AccountTransactionService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all account-transactions ', async () => {
        const getEntities: AccountTransactionDTO[] = (
            await request(app.getHttpServer()).get('/api/account-transactions').expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET account-transactions by id', async () => {
        const getEntity: AccountTransactionDTO = (
            await request(app.getHttpServer())
                .get('/api/account-transactions/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create account-transactions', async () => {
        const createdEntity: AccountTransactionDTO = (
            await request(app.getHttpServer()).post('/api/account-transactions').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update account-transactions', async () => {
        const updatedEntity: AccountTransactionDTO = (
            await request(app.getHttpServer()).put('/api/account-transactions').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update account-transactions from id', async () => {
        const updatedEntity: AccountTransactionDTO = (
            await request(app.getHttpServer())
                .put('/api/account-transactions/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE account-transactions', async () => {
        const deletedEntity: AccountTransactionDTO = (
            await request(app.getHttpServer())
                .delete('/api/account-transactions/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
