import { HttpException } from "@nestjs/common";
import { CommentsService } from "src/comments/comments.service";
import { PrioritiesService } from "src/priorities/priorities.service";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { IsNull, Repository, UpdateResult } from "typeorm";
import { CreateTicketDto } from "../dto/create-ticket.dto";
import { UpdateTicketDto } from "../dto/update-ticket.dto";
import { Ticket } from "../entities/ticket.entity";
import { TicketRoleStrategyInterface } from "./ticket-role.strategy";

export class TicketRoleTechnicianStrategy implements TicketRoleStrategyInterface {
    constructor(
        private ticketRepository: Repository<Ticket>,
        private usersService: UsersService,
        private commentsService: CommentsService,
        private prioritiesService: PrioritiesService,
        private user: User
    ) {}

    async isUserAllowed(ticketId: number): Promise<boolean> {
        return !!(await this.ticketRepository.findOne({
            where: [{id: ticketId, technician: {id: this.user.id}}, {id: ticketId, technician: IsNull()}],
        }));
    }

    async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
        if (!createTicketDto.customerId) throw new HttpException("customerId is required", 400);

        let customer = await this.usersService.findOne(createTicketDto.customerId);
        delete createTicketDto.customerId;
        delete createTicketDto.technicianId;

        let priority = null;
        if (createTicketDto.priorityId) {
            priority = await this.prioritiesService.findOne(createTicketDto.priorityId);
            delete createTicketDto.priorityId;
        }

        let ticket =  await this.ticketRepository.save({ ...createTicketDto, customer: customer, technician: this.user, priority: priority, status: "New" });

        if (createTicketDto.comment) this.commentsService.create({ticketId: ticket.id, body: createTicketDto.comment});
        return ticket;
    }

    async findAll(): Promise<Ticket[]> {
        return this.ticketRepository.find({ 
            where: [{technician: {id: this.user.id}}, {technician: IsNull()}], 
            relations: ["customer", "technician", "priority"],
            order: {created_at: "DESC"}  
        });
    }

    async findOne(id: number): Promise<Ticket> {
        return this.ticketRepository.findOne({ 
            where: [{id: id, technician: {id: this.user.id}}, {id: id, technician: IsNull()}], 
            relations: ["customer", "technician", "priority", "comments"] 
        });
    }

    async update(id: number, updateTicketDto: UpdateTicketDto): Promise<UpdateResult> {
        const allowed = await this.ticketRepository.findOne({
            where: [{id: id, technician: {id: this.user.id}}, {id: id, technician: IsNull()}],
        });

        if (!allowed) throw new HttpException("You are not allowed to update this ticket", 403);

        let ticket = {technician: null, priority: null};
    
        delete updateTicketDto.customerId;
        delete updateTicketDto.technicianId;

        ticket.technician = await this.usersService.findOne(this.user.id);

        if (updateTicketDto.priorityId) ticket.priority = await this.prioritiesService.findOne(updateTicketDto.priorityId);
        delete updateTicketDto.priorityId;

        if (!ticket.technician) delete ticket.technician;
        if (!ticket.priority) delete ticket.priority;

        return this.ticketRepository.update(id, {...updateTicketDto, ...ticket});
    }

    async remove(id: number): Promise<void> {
        await this.ticketRepository.delete(id);
    }
    
}