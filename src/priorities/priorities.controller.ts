import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PrioritiesService } from './priorities.service';
import { CreatePriorityDto } from './dto/create-priority.dto';
import { UpdatePriorityDto } from './dto/update-priority.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@ApiBearerAuth('defaultBearerAuth')
@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('priorities')
export class PrioritiesController {
  constructor(private readonly prioritiesService: PrioritiesService) {}

  @Post()
  @Roles(['admin'])
  create(@Body() createPriorityDto: CreatePriorityDto) {
    return this.prioritiesService.create(createPriorityDto);
  }

  @Get()
  findAll() {
    return this.prioritiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prioritiesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(['admin'])
  update(@Param('id') id: string, @Body() updatePriorityDto: UpdatePriorityDto) {
    return this.prioritiesService.update(+id, updatePriorityDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.prioritiesService.remove(+id);
  }
}
