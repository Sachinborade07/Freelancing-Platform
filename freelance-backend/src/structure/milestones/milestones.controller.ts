import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Controller('milestones')
export class MilestonesController {
    constructor(private readonly milestonesService: MilestonesService) { }

    @Post()
    create(@Body() createMilestoneDto: CreateMilestoneDto) {
        return this.milestonesService.create(createMilestoneDto);
    }

    @Get()
    findAll() {
        return this.milestonesService.findAll();
    }

    @Get('project/:projectId')
    findByProject(@Param('projectId') projectId: string) {
        return this.milestonesService.findByProject(+projectId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.milestonesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMilestoneDto: UpdateMilestoneDto) {
        return this.milestonesService.update(+id, updateMilestoneDto);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.milestonesService.updateStatus(+id, status);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.milestonesService.remove(+id);
    }
}