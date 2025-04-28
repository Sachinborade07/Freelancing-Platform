import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FreelancersService } from './freelancers.service';
import { CreateFreelancerDto } from './dto/freelancer.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('freelancers')
@UseGuards(JwtAuthGuard)
export class FreelancersController {
    constructor(private readonly freelancersService: FreelancersService) { }

    @Post()
    create(@Body() createFreelancerDto: CreateFreelancerDto) {
        return this.freelancersService.create(createFreelancerDto);
    }

    @Get()
    findAll() {
        return this.freelancersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.freelancersService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFreelancerDto: CreateFreelancerDto) {
        return this.freelancersService.update(+id, updateFreelancerDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.freelancersService.remove(+id);
    }
}