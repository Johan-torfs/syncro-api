import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor (@InjectRepository(Comment) private commentRepository: Repository<Comment>) {}
  
  create(createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentRepository.save(createCommentDto);
  }

  findAll(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  findOne(id: number): Promise<Comment> {
    return this.commentRepository.findOneBy({ id });
  }

  update(id: number, updateCommentDto: UpdateCommentDto): Promise<UpdateResult> {
    return this.commentRepository.update(id, updateCommentDto);
  }

  async remove(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
