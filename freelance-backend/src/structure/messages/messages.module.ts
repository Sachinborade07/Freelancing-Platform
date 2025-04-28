import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { Project } from 'src/entities/project.entity';
import { Users } from 'src/entities/users.entity';
import { File } from 'src/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Project, Users, File]),
  ],
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService]
})
export class MessagesModule { }
