import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Post()
    create(@Body() createMessageDto: CreateMessageDto) {
        return this.messagesService.create(createMessageDto);
    }

    @Get()
    findAll() {
        return this.messagesService.findAll();
    }

    @Get('project/:projectId')
    findByProject(@Param('projectId') projectId: string) {
        return this.messagesService.findByProject(+projectId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.messagesService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.messagesService.remove(+id);
    }
}