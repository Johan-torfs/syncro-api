import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Asset } from "src/assets/entities/asset.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Priority } from "src/priorities/entities/priority.entity";
import { Role } from "src/roles/entities/role.entity";
import { Ticket } from "src/tickets/entities/ticket.entity";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class MySqlConfigService implements TypeOrmOptionsFactory {

    constructor(private configService: ConfigService) { }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.configService.get<string>('DATABASE_HOST'),
            port: this.configService.get<number>('DATABASE_PORT'),
            username: this.configService.get<string>('DATABASE_USERNAME'),
            password: this.configService.get<string>('DATABASE_PASSWORD'),
            database: this.configService.get<string>('DATABASE_NAME'),
            entities: [Ticket, User, Asset, Role, Comment, Priority],
            synchronize: true,
        };
    }
}