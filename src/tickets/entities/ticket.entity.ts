import { Comment } from 'src/comments/entities/comment.entity';
import { Priority } from 'src/priorities/entities/priority.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity({name: 'tickets'})
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    number: number;

    @Column()
    subject: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    due_date: Date;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;

    @Column()
    resoved_date: Date;

    @Column()
    status: string;

    @ManyToOne(type => User, technician => technician.tickets)
    technician: User;

    @ManyToOne(type => User, customer => customer.tickets)
    customer: User;

    @ManyToOne(type => Priority, priority => priority.tickets)
    priority: Priority;

    @OneToMany(type => Comment, comment => comment.ticket)
    comments: Comment[];
}
