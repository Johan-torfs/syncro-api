import { User } from "src/users/entities/user.entity";
import { UpdateResult } from "typeorm";
import { CreateTicketDto } from "../dto/create-ticket.dto";
import { UpdateStatusDto } from "../dto/update-status.dto";
import { UpdateTicketDto } from "../dto/update-ticket.dto";
import { Ticket } from "../entities/ticket.entity";

export interface TicketRoleStrategyInterface {
    isUserAllowed(ticketId: number): Promise<boolean>;
    create(createTicketDto: CreateTicketDto): Promise<Ticket>;
    findAll(): Promise<Ticket[]>;
    findAllFromDate(date: Date): Promise<Ticket[]>;
    findOne(id: number): Promise<Ticket>;
    update(id: number, updateTicketDto: UpdateTicketDto): Promise<UpdateResult>;
    remove(id: number): Promise<void>;
    updateStatus(id: number, statusDto: UpdateStatusDto): Promise<UpdateResult>;
}