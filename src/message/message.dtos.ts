import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  workspaceId: string;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
