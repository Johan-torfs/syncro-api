import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsService } from 'src/comments/comments.service';
import { PrioritiesService } from 'src/priorities/priorities.service';
import { UsersService } from 'src/users/users.service';
import { UpdateResult } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  constructor(@InjectRepository(Ticket) private ticketRepository: Repository<Ticket>, private usersService: UsersService, private prioritiesService: PrioritiesService, private commentsService: CommentsService) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    if (!createTicketDto.customerId) throw new HttpException("customerId is required", 400);

    let customer = await this.usersService.findOne(createTicketDto.customerId);
    delete createTicketDto.customerId;


    let technician = null;
    if (createTicketDto.technicianId) {
      technician = await this.usersService.findOne(createTicketDto.technicianId);
      delete createTicketDto.technicianId; 
    }

    let priority = null;
    if (createTicketDto.priorityId) {
      priority = await this.prioritiesService.findOne(createTicketDto.priorityId);
      delete createTicketDto.priorityId;
    }

    let ticket =  await this.ticketRepository.save({ ...createTicketDto, customer: customer, technician: technician, priority: priority, status: "New" });

    if (createTicketDto.comment) this.commentsService.create({ticketId: ticket.id, body: createTicketDto.comment});
    return ticket;
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketRepository.find({ relations: ["customer", "technician", "priority"] });
  }

  async findOne(id: number): Promise<Ticket> {
    return this.ticketRepository.findOne({ where: { id: id }, relations: ["customer", "technician", "priority", "comments"] });
  }

  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<UpdateResult> {
    let ticket = {customer: null, technician: null, priority: null};
    
    if (updateTicketDto.customerId) ticket.customer = await this.usersService.findOne(updateTicketDto.customerId);
    delete updateTicketDto.customerId;

    if (updateTicketDto.technicianId) ticket.technician = await this.usersService.findOne(updateTicketDto.technicianId);
    delete updateTicketDto.technicianId;

    if (updateTicketDto.priorityId) ticket.priority = await this.prioritiesService.findOne(updateTicketDto.priorityId);
    delete updateTicketDto.priorityId;

    if (!ticket.customer) delete ticket.customer;
    if (!ticket.technician) delete ticket.technician;
    if (!ticket.priority) delete ticket.priority;

    return this.ticketRepository.update(id, {...updateTicketDto, ...ticket});
  }

  async remove(id: number): Promise<void> {
    await this.ticketRepository.delete(id);
  }
}
