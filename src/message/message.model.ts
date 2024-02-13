import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Workspace } from 'src/workspace/workspace.model';

export type MessageDocument = HydratedDocument<Message>;

@Schema({
  timestamps: true,
})
export class Message {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Workspace.name,
    required: true,
  })
  workspaceId: string;

  @Prop({
    default: 0,
  })
  likes: number;

  @Prop({
    required: true,
  })
  content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
