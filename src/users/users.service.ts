import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from 'src/auth/dto/user-login.dto';
import { UserRegisterDto } from 'src/auth/dto/user-register.dto';
import { RolesService } from 'src/roles/roles.service';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>, private rolesService: RolesService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.roleId) createUserDto.roleId = 1;

    let role = await this.rolesService.findOne(createUserDto.roleId);
    delete createUserDto.roleId; 

    return this.register({...createUserDto, role: role});
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({relations: ["role"]});
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ 
      where: { id: id },
      relations: ["role"] 
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    if (!updateUserDto.roleId) updateUserDto.roleId = 1;

    let role = await this.rolesService.findOne(updateUserDto.roleId);
    delete updateUserDto.roleId;

    return this.userRepository.update(id, {...updateUserDto, role: role});
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async register(userRegisterDto: UserRegisterDto): Promise<User> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(userRegisterDto.password, saltOrRounds);
    userRegisterDto.password = hashedPassword;

    return this.userRepository.save(userRegisterDto);
  }

  async findOneValidate(userLoginDto: UserLoginDto): Promise<User> {
    return this.userRepository.findOne({ 
      where: { email: userLoginDto.email },
      relations: ["role"] 
    });
  }

  async matchRoles(roles: string[], userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ["role"] 
    });
    
    if (!user || !user.role) return false;
    
    for (const role of roles) {
      if (role === user.role.name) return true;
    };

    return false;
  }
}
