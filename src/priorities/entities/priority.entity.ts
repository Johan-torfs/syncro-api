import { Ticket } from "src/tickets/entities/ticket.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'priotities'})
export class Priority {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    color: string;

    @OneToMany(type => Ticket, ticket => ticket.priority, { onDelete: 'SET NULL' })
    tickets: Ticket[];
}
