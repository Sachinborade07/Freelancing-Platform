import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FreelancerSkillsService } from './freelancer-skills.service';
import { CreateFreelancerSkillDto } from './dto/freelancer-skills.dto';


@Controller('freelancer-skills')
export class FreelancerSkillsController {
    constructor(private readonly freelancerSkillsService: FreelancerSkillsService) { }

    @Post()
    create(@Body() createFreelancerSkillDto: CreateFreelancerSkillDto) {
        return this.freelancerSkillsService.create(createFreelancerSkillDto);
    }

    @Get()
    findAll() {
        return this.freelancerSkillsService.findAll();
    }

    @Get('freelancer/:freelancerId')
    findByFreelancer(@Param('freelancerId') freelancerId: string) {
        return this.freelancerSkillsService.findByFreelancer(+freelancerId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.freelancerSkillsService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateFreelancerSkillDto: CreateFreelancerSkillDto,
    ) {
        return this.freelancerSkillsService.update(+id, updateFreelancerSkillDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.freelancerSkillsService.remove(+id);
    }
}