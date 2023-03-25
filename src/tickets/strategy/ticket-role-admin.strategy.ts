import { HttpException } from "@nestjs/common";
import { CommentsService } from "src/comments/comments.service";
import { PrioritiesService } from "src/priorities/priorities.service";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { MoreThanOrEqual, Repository, UpdateResult } from "typeorm";
import { CreateTicketDto } from "../dto/create-ticket.dto";
import { UpdateStatusDto } from "../dto/update-status.dto";
import { UpdateTicketDto } from "../dto/update-ticket.dto";
import { Ticket } from "../entities/ticket.entity";
import { TicketRoleStrategyInterface } from "./ticket-role.strategy";

export class TicketRoleAdminStrategy implements TicketRoleStrategyInterface {
    constructor(
        private ticketRepository: Repository<Ticket>,
        private usersService: UsersService,
        private commentsService: CommentsService,
        private prioritiesService: PrioritiesService
    ) {}

    async isUserAllowed(ticketId: number): Promise<boolean> {
        return true;
    }

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
        return this.ticketRepository.find({ 
            relations: ["customer", "technician", "priority"], 
            order: {created_at: "DESC"} 
        });
    }

    async findAllFromDate(date: Date): Promise<Ticket[]> {
        return this.ticketRepository.find({ 
            where: { created_at: MoreThanOrEqual(date) },
            relations: ["customer", "technician", "priority"], 
            order: {created_at: "DESC"} 
        });
    }

    async findOne(id: number): Promise<Ticket> {
        return this.ticketRepository.findOne({ 
            where: { id: id },
            relations: ["customer", "technician", "priority", "comments"]
        });
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

    async updateStatus(id: number, statusDto: UpdateStatusDto): Promise<UpdateResult> {
        if (statusDto.status.toLocaleLowerCase() == "resolved") 
            return await this.ticketRepository.update(id, { status: statusDto.status, resolved_date: new Date() });
        return await this.ticketRepository.update(id, { status: statusDto.status });
    }
    
}