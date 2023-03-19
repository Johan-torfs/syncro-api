import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './tickets/entities/ticket.entity';
import { User } from './users/entities/user.entity';
import { Asset } from './assets/entities/asset.entity';
import { TicketsModule } from './tickets/tickets.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { RolesModule } from './roles/roles.module';
import { CommentsModule } from './comments/comments.module';
import { PrioritiesModule } from './priorities/priorities.module';
import { Role } from './roles/entities/role.entity';
import { Priority } from './priorities/entities/priority.entity';
import { Comment } from './comments/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 33060, //3306 is default
      username: 'homestead',
      password: 'secret',
      database: 'syncro',
      entities: [Ticket, User, Asset, Role, Comment, Priority],
      synchronize: true,
    }),
    TicketsModule,
    RolesModule,
    CommentsModule,
    PrioritiesModule,
    UsersModule,
    AssetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
