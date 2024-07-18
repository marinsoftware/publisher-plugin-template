import { Test } from '@nestjs/testing';
import { SnapshotService } from './snapshot.service';
import { HttpModule } from '@nestjs/axios';
import { PublisherApiService } from "../services/publisher_api.service";
import { SnapshotController } from './snapshot.controller';
import { ControllersService } from '../services/controllers.service';

jest.setTimeout(20000);

describe('SnapshotService', () => {
  let snapshotService: SnapshotService;
  let httpModule: HttpModule;
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

    snapshotService = moduleRef.get<SnapshotService>(SnapshotService);
    httpModule = moduleRef.get<HttpModule>(HttpModule);
    publisherApiService = moduleRef.get<PublisherApiService>(PublisherApiService);
    snapshotController = moduleRef.get<SnapshotController>(SnapshotController);
  });

  xdescribe('processReportByReportType', () => {
    test('in process', done => {
      const report = `"date","campaignId","adGroupId","itemId","numAdsShown","numAdsClicks","adSpend"\n"2022-10-29","245281","770831546","11047090","100","10","2"`;
      // const result: MarinSingleObj[] = [
      //   { 
      //       parentId: "1",
      //       id: "12",
      //       status: "",
      //       name: "",
      //       properties: [
      //           {
      //               name: "sku",
      //               value: "11047090"
      //           }
      //       ]
      //   }
      // ];
      // const result = [
      //   {
      //     reportDate: "2022-10-29",
      //     campaignid: "245281",
      //     adgroupid: "770831546",
      //     criterionid: "11047090",
      //     imps: "100",
      //     clicks: "10",
      //     cost: "2"
      //   }
      // ];
      // const result = { '1-11047090': '12' };
      const result = [
        {
          reportDate: "2022-10-29",
          campaignid: "245281",
          adgroupid: "770831546",
          criterionid: "12",
          imps: "100",
          clicks: "10",
          cost: "2"
        }
      ];

      // snapshotService.processReportByReportType(report, ReportType.ADITEM, 12345)
      //   .subscribe(data => {
      //     expect(data).toEqual(result);
      //     done();
      //   });
    });
  })
});

// Reports/Walmart Snapshot API

// Should take 3 query params: accountId, date, report type

// Report type must be one of 3 types: platform (adgroup with device), keyword, adItem

// platform must specific have specific report metric fields

// keyword must specific have specific report metric fields

// adItem must specific have specific report metric fields
