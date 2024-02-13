import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  workspaceId: string;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}

export interface IMessageSearchFilter {
  content?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
  startLike?: string;
  endLike?: string;
}
