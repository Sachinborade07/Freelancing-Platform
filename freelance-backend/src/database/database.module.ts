import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: process.env.NODE_ENV === 'production'
                    ? [__dirname + '/../dist/**/*.entity{.js}']
                    : [__dirname + '/../src/**/*.entity{.ts}'],
                synchronize: true,
            })
        })
    ]
})
export class DatabaseModule { }
