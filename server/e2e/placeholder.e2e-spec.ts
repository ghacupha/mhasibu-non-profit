import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { PlaceholderDTO } from '../src/service/dto/placeholder.dto';
import { PlaceholderService } from '../src/service/placeholder.service';

describe('Placeholder Controller', () => {
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
            .overrideProvider(PlaceholderService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all placeholders ', async () => {
        const getEntities: PlaceholderDTO[] = (await request(app.getHttpServer()).get('/api/placeholders').expect(200))
            .body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET placeholders by id', async () => {
        const getEntity: PlaceholderDTO = (
            await request(app.getHttpServer())
                .get('/api/placeholders/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create placeholders', async () => {
        const createdEntity: PlaceholderDTO = (
            await request(app.getHttpServer()).post('/api/placeholders').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update placeholders', async () => {
        const updatedEntity: PlaceholderDTO = (
            await request(app.getHttpServer()).put('/api/placeholders').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update placeholders from id', async () => {
        const updatedEntity: PlaceholderDTO = (
            await request(app.getHttpServer())
                .put('/api/placeholders/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE placeholders', async () => {
        const deletedEntity: PlaceholderDTO = (
            await request(app.getHttpServer())
                .delete('/api/placeholders/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
