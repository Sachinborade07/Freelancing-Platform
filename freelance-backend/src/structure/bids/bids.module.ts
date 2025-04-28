import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from 'src/entities/bid.entity';
import { Project } from 'src/entities/project.entity';
import { Freelancer } from 'src/entities/freelancer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bid, Project, Freelancer]),
  ],
  providers: [BidsService],
  controllers: [BidsController],
  exports: [BidsService]
})
export class BidsModule { }
