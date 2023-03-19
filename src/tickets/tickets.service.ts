import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  constructor(@InjectRepository(Ticket) private ticketRepository: Repository<Ticket>) {}

  create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    return this.ticketRepository.save(createTicketDto);
  }

  findAll(): Promise<Ticket[]> {
    return this.ticketRepository.find();
  }

  findOne(id: number): Promise<Ticket> {
    return this.ticketRepository.findOneBy({ id });
  }

  update(id: number, updateTicketDto: UpdateTicketDto): Promise<UpdateResult> {
    return this.ticketRepository.update(id, updateTicketDto);
  }

  async remove(id: number): Promise<void> {
    await this.ticketRepository.delete(id);
  }
}
