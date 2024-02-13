import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import {
  CreateMessageDto,
  IMessageSearchFilter,
  UpdateMessageDto,
} from './message.dtos';

@Controller('workspace/:workspaceId/message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(
    @Body() payload: CreateMessageDto,
    @Param('workspaceId') workspaceId: string,
  ) {
    payload.workspaceId = workspaceId;
    return this.messageService.create(payload);
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get('search')
  search(
    @Param('workspaceId') workspaceId: string,
    @Query()
    filter?: IMessageSearchFilter,
  ) {
    return this.messageService.search(workspaceId, filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateMessageDto) {
    return this.messageService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }

  @Post(':id/like')
  like(@Param('id') id: string) {
    return this.messageService.like(id);
  }
}
