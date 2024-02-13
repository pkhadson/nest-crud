import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto, UpdateMessageDto } from './message.dtos';
import * as constants from './message.constants';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { Model } from 'mongoose';
import { Message } from './message.model';

@Injectable()
export class MessageService {
  constructor(
    @Inject('MessageModel') private readonly messageModel: Model<Message>,
    private workspaceService: WorkspaceService,
  ) {}

  async create(payload: CreateMessageDto) {
    if (!(await this.workspaceService.workspaceExists(payload.workspaceId)))
      throw new BadRequestException(constants.WORKSPACE_NOT_FOUND);

    return await this.messageModel.create(payload);
  }

  findAll() {
    return this.messageModel.find();
  }

  findOne(id: string) {
    return this.messageModel.findById(id);
  }

  update(id: string, payload: UpdateMessageDto) {
    return this.messageModel.findByIdAndUpdate(id, { $set: payload });
  }

  remove(id: string) {
    return this.messageModel.findByIdAndDelete(id);
  }
}
