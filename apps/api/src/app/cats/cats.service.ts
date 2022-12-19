import { Injectable } from '@nestjs/common';
import { CatsJson } from './mock/cats-json';
import { CreateCatDto } from './models/create-cat.dto';
import { UpdateCatDto } from './models/update-cat.dto';
import { Cat } from './entities/cat.entity';
import { HealthCheckResponse, IHealthCheckService } from '../health/health.types';
import { HealthCheckService } from '../health/health.decorator';

@Injectable()
@HealthCheckService()
export class CatsService implements IHealthCheckService {
  cats: Cat[];
  constructor() {
    this.cats = CatsJson;
  }

  /**
   * Get the service name
   */
  public getServiceName(): string {
    return 'CatsService';
  }

  /**
   * Perform a health check
   */
  public async healthCheck(level: string): Promise<HealthCheckResponse> {
    if (level === 'L2') {
      return {
        healthy: true,
      }
    }
  }

  create(createCatDto: CreateCatDto) {
    this.cats.push(createCatDto);
    return this.cats.filter((cat) => cat.id === createCatDto.id);
  }

  getAll() {
  return  this.cats;
  }

  findCatById(id: string) {
    return this.cats.filter((cat) => cat.id === id);
  }

  update(id: string, updateCatDto: UpdateCatDto) {
 return this.cats.map((cat) => {
     if(cat.id === id) {
      return cat = updateCatDto;
     }
     return cat
   });
  }

  remove(id: string): Cat[] {
    const fitleredCats = this.cats.filter((cat) => cat.id !== id);
   return this.cats = fitleredCats;
  }
}
