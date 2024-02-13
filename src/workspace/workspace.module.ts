import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Workspace, WorkspaceSchema } from './workspace.model';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: Workspace.name,
        schema: WorkspaceSchema,
      },
    ]),
  ],
})
export class WorkspaceModule {}
