import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository, UpdateResult } from 'typeorm';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';

@Injectable()
export class AssetsService {
  constructor(@InjectRepository(Asset) private assetRepository: Repository<Asset>, private userService: UsersService ) {}

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    if (!createAssetDto.customerId) throw new HttpException("customerId is required", 400);

    let customer = await this.userService.findOne(createAssetDto.customerId);
    delete createAssetDto.customerId;

    return this.assetRepository.save({...createAssetDto, customer: customer});
  }

  async findAll(): Promise<Asset[]> {
    return this.assetRepository.find({relations: ["customer"]});
  }

  async findOne(id: number): Promise<Asset> {
    return this.assetRepository.findOne(
      {
        where: { id: id },
        relations: ["customer"]
      }
    );
  }

  async update(id: number, updateAssetDto: UpdateAssetDto): Promise<UpdateResult> {
    if (updateAssetDto.customerId) {
      let customer = await this.userService.findOne(updateAssetDto.customerId);
      delete updateAssetDto.customerId;

      return this.assetRepository.update(id, {...updateAssetDto, customer: customer});
    };

    return this.assetRepository.update(id, updateAssetDto);
  }

  async remove(id: number): Promise<void> {
    await this.assetRepository.delete(id);
  }
}
