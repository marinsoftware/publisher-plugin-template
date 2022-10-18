import { Test, TestingModule } from '@nestjs/testing';
import { CreateShibe } from './models/create-shibe.model';
import { ShibeController } from './shibe.controller';
import { ShibeService } from './shibe.service';

describe('ShibeController', () => {
  let controller: ShibeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShibeController],
      providers: [{
        provide: ShibeService,
        useValue: {
          findAll: jest.fn().mockResolvedValue([
            {
              name: 'Cat #1',
              breed: 'Bread #1',
              age: 4,
            },
            {
              name: 'Cat #2',
              breed: 'Breed #2',
              age: 3,
            },
            {
              name: 'Cat #3',
              breed: 'Breed #3',
              age: 2,
            },
          ]),
          create: jest.fn().mockResolvedValue(CreateShibe),
        },
      },],
    }).compile();

    controller = module.get<ShibeController>(ShibeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
