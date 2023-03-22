import { Ticket } from "src/tickets/entities/ticket.entity";
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'comments'})
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    body: string;

    @ManyToOne(type => Ticket, ticket => ticket.comments, { onDelete: 'CASCADE' })
    ticket: Ticket;
}
