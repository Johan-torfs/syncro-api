import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';

@Injectable()
export class AssetsService {
  constructor(@InjectRepository(Asset) private assetRepository: Repository<Asset> ) {}

  create(createAssetDto: CreateAssetDto): Promise<Asset> {
    return this.assetRepository.save(createAssetDto);
  }

  findAll(): Promise<Asset[]> {
    return this.assetRepository.find();
  }

  findOne(id: number): Promise<Asset> {
    return this.assetRepository.findOneBy({ id });
  }

  update(id: number, updateAssetDto: UpdateAssetDto): Promise<UpdateResult> {
    return this.assetRepository.update(id, updateAssetDto);
  }

  async remove(id: number): Promise<void> {
    await this.assetRepository.delete(id);
  }
}
