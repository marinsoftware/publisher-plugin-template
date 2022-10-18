import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ShibeService } from './shibe.service';
import { ShibeModule } from './shibe.module';
import { getModelToken } from '@nestjs/mongoose';
import { Shibe } from './schemas/shibe.schema';

describe.skip('ShibeService', () => {
  let service: ShibeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShibeService,
        {
          provide: getModelToken(Shibe.name),
          useValue: jest.fn(),
        },
      ],
      imports: [HttpModule, ShibeModule],
    }).compile();

    service = module.get<ShibeService>(ShibeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
