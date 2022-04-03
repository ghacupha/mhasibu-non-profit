import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { TransactionAccountTypeDTO } from '../src/service/dto/transaction-account-type.dto';
import { TransactionAccountTypeService } from '../src/service/transaction-account-type.service';

describe('TransactionAccountType Controller', () => {
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
            .overrideProvider(TransactionAccountTypeService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all transaction-account-types ', async () => {
        const getEntities: TransactionAccountTypeDTO[] = (
            await request(app.getHttpServer()).get('/api/transaction-account-types').expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET transaction-account-types by id', async () => {
        const getEntity: TransactionAccountTypeDTO = (
            await request(app.getHttpServer())
                .get('/api/transaction-account-types/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create transaction-account-types', async () => {
        const createdEntity: TransactionAccountTypeDTO = (
            await request(app.getHttpServer()).post('/api/transaction-account-types').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update transaction-account-types', async () => {
        const updatedEntity: TransactionAccountTypeDTO = (
            await request(app.getHttpServer()).put('/api/transaction-account-types').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update transaction-account-types from id', async () => {
        const updatedEntity: TransactionAccountTypeDTO = (
            await request(app.getHttpServer())
                .put('/api/transaction-account-types/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE transaction-account-types', async () => {
        const deletedEntity: TransactionAccountTypeDTO = (
            await request(app.getHttpServer())
                .delete('/api/transaction-account-types/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
