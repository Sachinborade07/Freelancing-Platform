import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from 'src/auth/decorator/user.decorator';


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

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateMessageDto: UpdateMessageDto,
        @User('userId') userId: number,
    ) {
        return this.messagesService.update(+id, updateMessageDto, userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(
        @Param('id') id: string,
        @User('userId') userId: number,
    ) {
        return this.messagesService.remove(+id, userId);
    }
}
