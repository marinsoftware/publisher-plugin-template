import { Test, TestingModule } from '@nestjs/testing';
import { ShibeService } from './shibe.service';

describe('ShibeService', () => {
  let service: ShibeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShibeService],
    }).compile();

    service = module.get<ShibeService>(ShibeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
