import { Test } from '@nestjs/testing';
import { SnapshotService } from './snapshot.service';
import { HttpModule } from '@nestjs/axios';
import { PublisherApiService } from "../services/publisher_api.service";
import { SnapshotController } from './snapshot.controller';
import { ControllersService } from '../services/controllers.service';


describe('SnapshotController', () => {
  let publisherApiService: PublisherApiService;
  let snapshotController: SnapshotController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        HttpModule,
      ],
      controllers: [SnapshotController],
      providers: [PublisherApiService, SnapshotService, ControllersService],
    }).compile();

    publisherApiService = moduleRef.get<PublisherApiService>(PublisherApiService);
    snapshotController = moduleRef.get<SnapshotController>(SnapshotController);
  });
  xdescribe('SnapShot', () => {
    it('controller to be defined', () => {
      expect(snapshotController).toBeDefined();
    });
    it ('method get to be defined', () =>{
      expect(snapshotController.get).toBeDefined();
    });
  })
});

