import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './structure/users/users.module';
import { ClientsModule } from './structure/clients/clients.module';
import { FreelancersModule } from './structure/freelancers/freelancers.module';
import { SkillsModule } from './structure/skills/skills.module';
import { FreelancerSkillsModule } from './structure/freelancer-skills/freelancer-skills.module';
import { ProjectsModule } from './structure/projects/projects.module';
import { MilestonesModule } from './structure/milestones/milestones.module';
import { InvoicesModule } from './structure/invoices/invoices.module';
import { FilesModule } from './structure/files/files.module';
import { MessagesModule } from './structure/messages/messages.module';
import { BidsModule } from './structure/bids/bids.module';
import { DatabaseModule } from './database/database.module';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 5, // 5 requests per minute
    }]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    FreelancersModule,
    SkillsModule,
    FreelancerSkillsModule,
    ProjectsModule,
    MilestonesModule,
    InvoicesModule,
    FilesModule,
    MessagesModule,
    BidsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }