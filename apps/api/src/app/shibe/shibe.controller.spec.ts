import { Test, TestingModule } from '@nestjs/testing';
import { ShibeController } from './shibe.controller';
import { ShibeService } from './shibe.service';

describe('ShibeController', () => {
  let controller: ShibeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShibeController],
      providers: [ShibeService],
    }).compile();

    controller = module.get<ShibeController>(ShibeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
