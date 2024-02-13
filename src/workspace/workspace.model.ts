import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/user.model';

export type WorkspaceDocument = HydratedDocument<Workspace>;

@Schema()
export class Workspace {
  @Prop()
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  userId: number;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
