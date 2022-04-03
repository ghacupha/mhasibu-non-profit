import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { TransactionAccountDTO } from '../src/service/dto/transaction-account.dto';
import { TransactionAccountService } from '../src/service/transaction-account.service';

describe('TransactionAccount Controller', () => {
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
            .overrideProvider(TransactionAccountService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all transaction-accounts ', async () => {
        const getEntities: TransactionAccountDTO[] = (
            await request(app.getHttpServer()).get('/api/transaction-accounts').expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET transaction-accounts by id', async () => {
        const getEntity: TransactionAccountDTO = (
            await request(app.getHttpServer())
                .get('/api/transaction-accounts/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create transaction-accounts', async () => {
        const createdEntity: TransactionAccountDTO = (
            await request(app.getHttpServer()).post('/api/transaction-accounts').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update transaction-accounts', async () => {
        const updatedEntity: TransactionAccountDTO = (
            await request(app.getHttpServer()).put('/api/transaction-accounts').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update transaction-accounts from id', async () => {
        const updatedEntity: TransactionAccountDTO = (
            await request(app.getHttpServer())
                .put('/api/transaction-accounts/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE transaction-accounts', async () => {
        const deletedEntity: TransactionAccountDTO = (
            await request(app.getHttpServer())
                .delete('/api/transaction-accounts/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
