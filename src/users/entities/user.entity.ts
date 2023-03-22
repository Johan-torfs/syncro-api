import { Asset } from 'src/assets/entities/asset.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    firstname: string;

    @Column({ nullable: true })
    lastname: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    zip: string;

    @ManyToOne(type => Role, role => role.users)
    role: Role;

    @OneToMany(type => Asset, asset => asset.customer, { onDelete: 'SET NULL' })
    assets: Asset[];

    @OneToMany(type => Ticket, ticket => ticket.customer, { onDelete: 'SET NULL' })
    tickets: Ticket[];

    @OneToMany(type => Ticket, ticket => ticket.technician, { onDelete: 'SET NULL' })
    assigned_tickets: Ticket[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}