import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './user.dtos';
import * as constants from './user.constants';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel) {}

  /**
   * @param payload - user data
   * @returns - created user
   * @description - creates a new user
   * @example - createUser({ name: 'User', login: 'user1', password: 'password' })
   */
  async createUser(payload: CreateUserDto) {
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
  checkUser(login: string): Promise<boolean> {
    return this.userModel.exists({ login });
  }

  getUserWorkspaces(userId: string) {
    throw new Error('Method not implemented.');
  }
}
