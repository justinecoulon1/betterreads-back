import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DBHOST ?? 'localhost',
        port: parseInt(process.env.DBPORT ?? '5432'),
        username: process.env.DBUSER ?? 'postgres',
        password: process.env.DBPASSWORD ?? 'Test1234=',
        database: process.env.DBNAME ?? 'TFE',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
      });

      return dataSource.initialize();
    },
  },
];

@Module({
  providers: databaseProviders,
  exports: databaseProviders,
})
export class DatabaseModule {}
