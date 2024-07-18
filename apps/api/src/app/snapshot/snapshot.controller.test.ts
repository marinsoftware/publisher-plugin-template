import { Test } from '@nestjs/testing';
import { BadRequest, ReportType, SnapshotService } from './snapshot.service';
import { HttpModule } from '@nestjs/axios';
import { PublisherApiService } from "../services/publisher_api.service";
import { SnapshotController } from './snapshot.controller';
import { ControllersService } from '../services/controllers.service';
import { MailerModule } from '@nestjs-modules/mailer';
import config from './../../../config.helper';


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

  // describe('validateArguments', () => {
    // test('should throw an error when date argument is not in valid format', () => {
    //   const date = "2022/11/01";
    //   expect(snapshotController.validateGetArguments(date, ReportType.GROUP).message).toEqual(BadRequest.INVALID_DATE_FORMAT);
    // });

    // test('should throw an error when date argument value is not within the last 90 days', () => {
    //   const date = "2022-07-01";
    //   expect(snapshotController.validateGetArguments(date, ReportType.GROUP).message).toEqual(BadRequest.INVALID_DATE_VALUE);
    // });

    // test('should throw an error when report type argument value is not a valid report type', () => {
    //   const date = "2022-11-01";
    //   const invalidReportType = "ADWORD";
    //   expect(snapshotController.validateGetArguments(date, invalidReportType).message).toEqual(BadRequest.INVALID_DATE_VALUE);
    // });
  // })
