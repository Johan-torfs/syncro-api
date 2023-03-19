import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsModule } from './tickets/tickets.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { RolesModule } from './roles/roles.module';
import { CommentsModule } from './comments/comments.module';
import { PrioritiesModule } from './priorities/priorities.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MySqlConfigService } from './typeorm/mysql-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: MySqlConfigService,
      inject: [MySqlConfigService]
    }),
    TicketsModule,
    RolesModule,
    CommentsModule,
    PrioritiesModule,
    UsersModule,
    AssetsModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
