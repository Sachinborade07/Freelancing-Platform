import { Module } from '@nestjs/common';
import { FreelancersService } from './freelancers.service';
import { FreelancersController } from './freelancers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Freelancer } from 'src/entities/freelancer.entity';
import { Users } from 'src/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Freelancer, Users]),
  ],
  providers: [FreelancersService],
  controllers: [FreelancersController],
  exports: [FreelancersService]
})
export class FreelancersModule { }
