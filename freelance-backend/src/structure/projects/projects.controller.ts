import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/query-project.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post()
    create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectsService.create(createProjectDto);
    }

    @Get()
    findAll(@Query() query: ProjectQueryDto) {
        return this.projectsService.findAll(query);
    }

    @Get('clients/:clientId')
    @UseGuards(AuthGuard('jwt'))
    async findByClient(
        @Param('clientId') clientId: string,
        @Req() request: Request
    ) {
        return this.projectsService.findByClient(+clientId);
    }

    @Get('freelancers/:freelancerId')
    findByFreelancer(@Param('freelancerId') freelancerId: string) {
        return this.projectsService.findByFreelancer(+freelancerId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectsService.findOne(+id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateProjectDto: UpdateProjectDto
    ) {
        return this.projectsService.update(+id, updateProjectDto);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.projectsService.updateStatus(+id, status);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectsService.remove(+id);
    }
}