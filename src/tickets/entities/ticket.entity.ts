import { Comment } from 'src/comments/entities/comment.entity';
import { Priority } from 'src/priorities/entities/priority.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity({name: 'tickets'})
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    number?: number;

    @Column()
    subject: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ nullable: true })
    due_date?: Date;

    @Column({ nullable: true })
    start_date?: Date;

    @Column({ nullable: true })
    end_date?: Date;

    @Column({ nullable: true })
    resoved_date?: Date;

    @Column()
    status: string;

    @ManyToOne(type => User, technician => technician.tickets, { onDelete: 'SET NULL' })
    technician?: User;

    @ManyToOne(type => User, customer => customer.tickets, { onDelete: 'SET NULL' })
    customer: User;

    @ManyToOne(type => Priority, priority => priority.tickets, { onDelete: 'SET NULL' })
    priority?: Priority;

    @OneToMany(type => Comment, comment => comment.ticket, { onDelete: 'CASCADE' })
    comments?: Comment[];
}
