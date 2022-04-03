import { TypeOrmModuleOptions } from '@nestjs/typeorm';

function ormConfig(): TypeOrmModuleOptions {
    const commonConf = {
        SYNCRONIZE: true,
        ENTITIES: [__dirname + '/domain/*.entity{.ts,.js}'],
        MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
        CLI: {
            migrationsDir: 'src/migrations',
        },
        MIGRATIONS_RUN: true,
    };

    /*let ormconfig: TypeOrmModuleOptions = {
        name: 'default',
        type: 'sqlite',
        database: '../target/db/sqlite-dev-db.sql',
        logging: true,
        synchronize: true,
        entities: commonConf.ENTITIES,
        migrations: commonConf.MIGRATIONS,
        cli: commonConf.CLI,
        migrationsRun: commonConf.MIGRATIONS_RUN,
    };*/

    let ormconfig: TypeOrmModuleOptions = {
      name: 'default',
      type: 'postgres',
      database: process.env.DATABASE_DEV_ID, // mhasibuNPDev
      host: process.env.DATABASE_DEV_HOST, // local
      port: Number(process.env.DATABASE_DEV_PORT), // 5432
      username: process.env.PG_DATABASE_DEV_USER,
      password: process.env.PG_DATABASE_DEV_PASSWORD,
      logging: true,
      synchronize: commonConf.SYNCRONIZE,
      entities: commonConf.ENTITIES,
      migrations: commonConf.MIGRATIONS,
      cli: commonConf.CLI,
      migrationsRun: commonConf.MIGRATIONS_RUN,
    };

    if (process.env.BACKEND_ENV === 'prod') {
        ormconfig = {
            name: 'default',
            type: 'postgres',
            database: 'mhasibunonprofit',
            host: 'localhost',
            port: 5433,
            username: 'sa',
            password: 'yourStrong(!)Password',
            logging: false,
            synchronize: commonConf.SYNCRONIZE,
            entities: commonConf.ENTITIES,
            migrations: commonConf.MIGRATIONS,
            cli: commonConf.CLI,
            migrationsRun: commonConf.MIGRATIONS_RUN,
        };
    }

    if (process.env.BACKEND_ENV === 'test') {
        ormconfig = {
            name: 'default',
            type: 'sqlite',
            database: ':memory:',
            keepConnectionAlive: true,
            logging: true,
            synchronize: true,
            entities: commonConf.ENTITIES,
            migrations: commonConf.MIGRATIONS,
            cli: commonConf.CLI,
            migrationsRun: commonConf.MIGRATIONS_RUN,
        };
    }
    return ormconfig;
}

export { ormConfig };
