import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { TransactionSignatureDTO } from '../src/service/dto/transaction-signature.dto';
import { TransactionSignatureService } from '../src/service/transaction-signature.service';

describe('TransactionSignature Controller', () => {
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
            .overrideProvider(TransactionSignatureService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all transaction-signatures ', async () => {
        const getEntities: TransactionSignatureDTO[] = (
            await request(app.getHttpServer()).get('/api/transaction-signatures').expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET transaction-signatures by id', async () => {
        const getEntity: TransactionSignatureDTO = (
            await request(app.getHttpServer())
                .get('/api/transaction-signatures/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create transaction-signatures', async () => {
        const createdEntity: TransactionSignatureDTO = (
            await request(app.getHttpServer()).post('/api/transaction-signatures').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update transaction-signatures', async () => {
        const updatedEntity: TransactionSignatureDTO = (
            await request(app.getHttpServer()).put('/api/transaction-signatures').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update transaction-signatures from id', async () => {
        const updatedEntity: TransactionSignatureDTO = (
            await request(app.getHttpServer())
                .put('/api/transaction-signatures/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE transaction-signatures', async () => {
        const deletedEntity: TransactionSignatureDTO = (
            await request(app.getHttpServer())
                .delete('/api/transaction-signatures/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
