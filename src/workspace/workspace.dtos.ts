import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class CreateWorkspaceDto {
  @IsString()
  name: string;

  @IsObjectId({
    message: 'Invalid user id',
  })
  @IsString()
  userId: string;
}

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {}
