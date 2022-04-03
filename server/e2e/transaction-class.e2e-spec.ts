import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { TransactionClassDTO } from '../src/service/dto/transaction-class.dto';
import { TransactionClassService } from '../src/service/transaction-class.service';

describe('TransactionClass Controller', () => {
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
            .overrideProvider(TransactionClassService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all transaction-classes ', async () => {
        const getEntities: TransactionClassDTO[] = (
            await request(app.getHttpServer()).get('/api/transaction-classes').expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET transaction-classes by id', async () => {
        const getEntity: TransactionClassDTO = (
            await request(app.getHttpServer())
                .get('/api/transaction-classes/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create transaction-classes', async () => {
        const createdEntity: TransactionClassDTO = (
            await request(app.getHttpServer()).post('/api/transaction-classes').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update transaction-classes', async () => {
        const updatedEntity: TransactionClassDTO = (
            await request(app.getHttpServer()).put('/api/transaction-classes').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update transaction-classes from id', async () => {
        const updatedEntity: TransactionClassDTO = (
            await request(app.getHttpServer())
                .put('/api/transaction-classes/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE transaction-classes', async () => {
        const deletedEntity: TransactionClassDTO = (
            await request(app.getHttpServer())
                .delete('/api/transaction-classes/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
