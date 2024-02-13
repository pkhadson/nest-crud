import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './workspace.dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Workspace } from './workspace.model';
import { UserService } from 'src/user/user.service';
import * as constants from './workspace.constants';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel('Workspace') private readonly workspaceModel: Model<Workspace>,
    private userService: UserService,
  ) {}

  async create(payload: CreateWorkspaceDto) {
    if (!(await this.userService.existsById(payload.userId)))
      throw new BadRequestException(constants.USER_NOT_FOUND);
    return await this.workspaceModel.create(payload);
  }

  findAll() {
    return this.workspaceModel.find();
  }

  findOne(id: string) {
    return this.workspaceModel.findById(id);
  }

  async update(id: string, payload: UpdateWorkspaceDto) {
    console.log(payload);
    if (payload.userId && !(await this.userService.existsById(payload.userId)))
      throw new BadRequestException(constants.USER_NOT_FOUND);

    await this.workspaceModel.updateOne(
      {
        _id: new Types.ObjectId(id),
      },
      { $set: payload },
    );
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.workspaceModel.deleteOne({ _id: new Types.ObjectId(id) });
    return { deleted: true };
  }
}
