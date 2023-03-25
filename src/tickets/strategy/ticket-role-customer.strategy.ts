import { HttpException, UseGuards } from "@nestjs/common";
import { CommentsService } from "src/comments/comments.service";
import { PrioritiesService } from "src/priorities/priorities.service";
import { User } from "src/users/entities/user.entity";
import { MoreThanOrEqual, Repository, UpdateResult } from "typeorm";
import { CreateTicketDto } from "../dto/create-ticket.dto";
import { UpdateStatusDto } from "../dto/update-status.dto";
import { UpdateTicketDto } from "../dto/update-ticket.dto";
import { Ticket } from "../entities/ticket.entity";
import { TicketRoleStrategyInterface } from "./ticket-role.strategy";

export class TicketRoleCustomerStrategy implements TicketRoleStrategyInterface {
    constructor(
        private ticketRepository: Repository<Ticket>,
        private commentsService: CommentsService,
        private prioritiesService: PrioritiesService,
        private user: User
    ) {}

    async isUserAllowed(ticketId: number): Promise<boolean> {
        return !!(await this.ticketRepository.findOne({
            where: {id: ticketId, customer: {id: this.user.id}},
        }));
    }

    async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
        delete createTicketDto.customerId;
        delete createTicketDto.technicianId;

        let priority = null;
        if (createTicketDto.priorityId) {
            priority = await this.prioritiesService.findOne(createTicketDto.priorityId);
            delete createTicketDto.priorityId;
        }

        let ticket =  await this.ticketRepository.save({ ...createTicketDto, customer: this.user, priority: priority, status: "New" });

        if (createTicketDto.comment) this.commentsService.create({ticketId: ticket.id, body: createTicketDto.comment});
        return ticket;
    }

    async findAll(): Promise<Ticket[]> {
        return this.ticketRepository.find({ 
            where: {customer: {id: this.user.id}}, 
            relations: ["customer", "technician", "priority"], 
            order: {created_at: "DESC"} 
        });
    }

    async findAllFromDate(date: Date): Promise<Ticket[]> {
        return this.ticketRepository.find({ 
            where: {customer: {id: this.user.id}, created_at: MoreThanOrEqual(date)}, 
            relations: ["customer", "technician", "priority"], 
            order: {created_at: "DESC"} 
        });
    }

    async findOne(id: number): Promise<Ticket> {
        return this.ticketRepository.findOne({ 
            where: {id: id, customer: {id: this.user.id}}, 
            relations: ["customer", "technician", "priority", "comments"] 
        });
    }

    async update(id: number, updateTicketDto: UpdateTicketDto): Promise<UpdateResult> {
        throw new HttpException("You are not allowed to update this ticket", 403);
    }

    async remove(id: number): Promise<void> {
        await this.ticketRepository.delete(id);
    }

    async updateStatus(id: number, statusDto: UpdateStatusDto): Promise<UpdateResult> {
        throw new HttpException("You are not allowed to update this ticket", 403);
    }
    
}