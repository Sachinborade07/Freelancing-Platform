import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('bids')
@UseGuards(JwtAuthGuard)
export class BidsController {
    constructor(private readonly bidsService: BidsService) { }

    @Post()
    create(@Body() createBidDto: CreateBidDto) {
        return this.bidsService.create(createBidDto);
    }

    @Get()
    findAll() {
        return this.bidsService.findAll();
    }

    @Get('project/:projectId')
    findByProject(@Param('projectId') projectId: string) {
        return this.bidsService.findByProject(+projectId);
    }

    @Get('freelancer/:freelancerId')
    findByFreelancer(@Param('freelancerId') freelancerId: string) {
        return this.bidsService.findByFreelancer(+freelancerId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bidsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBidDto: UpdateBidDto) {
        return this.bidsService.update(+id, updateBidDto);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.bidsService.updateStatus(+id, status);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bidsService.remove(+id);
    }
}