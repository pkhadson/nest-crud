import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CreateMessageDto,
  IMessageSearchFilter,
  UpdateMessageDto,
} from './message.dtos';
import * as constants from './message.constants';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { FilterQuery, Model } from 'mongoose';
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

  search(workspaceId: string, filter: IMessageSearchFilter) {
    const { content, startDate, endDate, limit, offset, startLike, endLike } =
      filter || {};

    const filterQuery: FilterQuery<Message> = {};

    if (content) filterQuery.content = { $regex: content, $options: 'i' };
    if (startDate) filterQuery.createdAt = { $gte: new Date(startDate) };
    if (endDate)
      filterQuery.createdAt = {
        ...filterQuery.createdAt,
        $lte: new Date(endDate),
      };
    if (startLike || endDate) filterQuery.likes = {};
    if (startLike) filterQuery.likes.$gte = startLike;
    if (endLike) filterQuery.likes.$lte = endLike;

    return this.messageModel
      .find(filterQuery)
      .limit(limit || 100)
      .skip(offset || 0);
  }

  like(id: string) {
    return this.messageModel.findByIdAndUpdate(id, { $inc: { likes: 1 } });
  }
}
