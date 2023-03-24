import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketsService } from 'src/tickets/tickets.service';
import { Repository, UpdateResult } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor (@InjectRepository(Comment) private commentRepository: Repository<Comment>, @Inject(forwardRef(() => TicketsService)) private ticketsService: TicketsService) {}
  
  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    if (!createCommentDto.ticketId) 
      throw new HttpException("ticketId is required", 400);
    if (!(await this.ticketsService.isUserAllowed(createCommentDto.ticketId))) 
      throw new HttpException("You are not allowed to comment on this ticket", 403);

    let ticket = await this.ticketsService.findOne(createCommentDto.ticketId);
    delete createCommentDto.ticketId;

    return this.commentRepository.save({...createCommentDto, ticket: ticket});
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  async findOne(id: number): Promise<Comment> {
    return this.commentRepository.findOneBy({ id });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<UpdateResult> {
    return this.commentRepository.update(id, updateCommentDto);
  }

  async remove(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
