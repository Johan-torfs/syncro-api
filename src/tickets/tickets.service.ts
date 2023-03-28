import { HttpException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsService } from 'src/comments/comments.service';
import { PrioritiesService } from 'src/priorities/priorities.service';
import { UsersService } from 'src/users/users.service';
import { IsNull, UpdateResult } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { TicketRoleStrategyInterface } from './strategy/ticket-role.strategy';
import { TicketRoleAdminStrategy } from './strategy/ticket-role-admin.strategy';
import { TicketRoleTechnicianStrategy } from './strategy/ticket-role-technician.strategy';
import { TicketRoleCustomerStrategy } from './strategy/ticket-role-customer.strategy';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable({ scope: Scope.REQUEST })
export class TicketsService {
  constructor(@InjectRepository(Ticket) private ticketRepository: Repository<Ticket>, @Inject(REQUEST) private readonly request: Request, private usersService: UsersService, private prioritiesService: PrioritiesService, private commentsService: CommentsService) {}

  async isUserAllowed(ticketId: number) : Promise<boolean> {
    return (await this.getTicketRoleStrategy()).isUserAllowed(ticketId);
  }

  async getTicketRoleStrategy() : Promise<TicketRoleStrategyInterface> {
    const user = await this.usersService.findOne(this.request.user["userId"]);
    
    switch (user.role.name) {
      case "admin":
        return new TicketRoleAdminStrategy(this.ticketRepository, this.usersService, this.commentsService, this.prioritiesService);
      case "technician":
        return new TicketRoleTechnicianStrategy(this.ticketRepository, this.usersService, this.commentsService, this.prioritiesService, user);
      default:
        return new TicketRoleCustomerStrategy(this.ticketRepository, this.commentsService, this.prioritiesService, user);
    }
  }

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    return (await this.getTicketRoleStrategy()).create(createTicketDto);
  }

  async findAll(): Promise<Ticket[]> {
    return (await this.getTicketRoleStrategy()).findAll();
  }

  async findAllFromDate(date: string): Promise<Ticket[]> {
    let dateObj = new Date(+date.slice(0, 4), +date.slice(4, 6) - 1, +date.slice(6, 8) + 1);  
    
    return (await this.getTicketRoleStrategy()).findAllFromDate(dateObj);
  }

  async findOne(id: number): Promise<Ticket> {
    return (await this.getTicketRoleStrategy()).findOne(id);
  }

  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<UpdateResult> {
    return (await this.getTicketRoleStrategy()).update(id, updateTicketDto);
  }

  async remove(id: number): Promise<void> {
    await this.ticketRepository.delete(id);
  }

  async updateStatus(id: number, statusDto: UpdateStatusDto): Promise<UpdateResult> {
    if (!statusDto.status) throw new HttpException("status is required", 400);
    return (await this.getTicketRoleStrategy()).updateStatus(id, statusDto);
  }
}
