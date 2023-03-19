import { Asset } from 'src/assets/entities/asset.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    zip: string;

    @ManyToOne(type => Role, role => role.users)
    role: Role;

    @OneToMany(type => Asset, asset => asset.customer)
    assets: Asset[];

    @OneToMany(type => Ticket, ticket => ticket.customer)
    tickets: Ticket[];

    @OneToMany(type => Ticket, ticket => ticket.technician)
    assigned_tickets: Ticket[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}