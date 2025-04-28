import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/entities/client.entity';
import { UsersModule } from '../users/users.module';
import { Users } from 'src/entities/users.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Users]), UsersModule
  ],
  providers: [ClientsService],
  controllers: [ClientsController],
  exports: [ClientsService]
})
export class ClientsModule { }
