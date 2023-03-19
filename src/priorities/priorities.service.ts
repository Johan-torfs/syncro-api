import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreatePriorityDto } from './dto/create-priority.dto';
import { UpdatePriorityDto } from './dto/update-priority.dto';
import { Priority } from './entities/priority.entity';

@Injectable()
export class PrioritiesService {
  constructor(@InjectRepository(Priority) private piorityRepository: Repository<Priority>) {}

  create(createPriorityDto: CreatePriorityDto): Promise<Priority> {
    return this.piorityRepository.save(createPriorityDto);
  }

  findAll(): Promise<Priority[]> {
    return this.piorityRepository.find();
  }

  findOne(id: number): Promise<Priority> {
    return this.piorityRepository.findOneBy({ id });
  }

  update(id: number, updatePriorityDto: UpdatePriorityDto): Promise<UpdateResult> {
    return this.piorityRepository.update(id, updatePriorityDto);
  }

  async remove(id: number): Promise<void> {
    await this.piorityRepository.delete(id);
  }
}
