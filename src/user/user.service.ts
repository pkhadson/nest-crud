import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './user.dtos';
import * as constants from './user.constants';
import mongoose, { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {
    this.getUserWorkspaces('65cbcbf74e034f8a6476e0ce').then((a) =>
      console.log(JSON.stringify(a, null, 2)),
    );
  }

  /**
   * @param payload - user data
   * @returns - created user
   * @description - creates a new user
   * @example - create({ name: 'User', login: 'user1', password: 'password' })
   */
  async create(payload: CreateUserDto) {
    if (await this.checkUser(payload.login))
      throw new BadRequestException(constants.LOGIN_ALREADY_EXISTS);

    return await this.userModel.create(payload);
  }

  /**
   * TODO: Create a lock for this method to prevent concurrent requests
   * @param login - user login
   * @returns - true if user exists, false otherwise
   * @description - checks if user with given login exists
   * @example - checkUser('user1')
   */
  checkUser(login: string) {
    return this.userModel.exists({ login });
  }

  async getUserWorkspaces(userId: string) {
    /* It can be implemented with populate method or aggregation */
    /* but following the requirements, it should be implemented with aggregation */
    const [user] = await this.userModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'workspaces',
          localField: '_id',
          foreignField: 'userId',
          as: 'workspaces',
        },
      },
      {
        $unwind: '$workspaces', // Deconstruct the workspaces array
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'workspaces._id',
          foreignField: 'workspaceId',
          as: 'workspaces.messages',
        },
      },
      {
        $group: {
          _id: '$_id', // Group by the original user document _id
          root: { $first: '$$ROOT' }, // Use $$ROOT to preserve the original document
          workspaces: { $push: '$workspaces' }, // Reconstruct the workspaces array with messages
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$root', { workspaces: '$workspaces' }], // Merge the reconstructed workspaces array back into the original document
          },
        },
      },
    ]);

    return user;
  }

  existsById(userId: string) {
    return this.userModel.exists({ _id: new mongoose.Types.ObjectId(userId) });
  }
}
