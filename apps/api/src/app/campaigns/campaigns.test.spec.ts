import { Test, TestingModule } from '@nestjs/testing';
import { CampaignController } from './campaign.controller';
import { MarinSingleObj } from "../models/marin-object.interface";
import { transformMarinCampaign, transformPublisherCampaign } from '../transformers/object-transformer';
import { CampaignModule } from './campaign.module';


describe('Campaign Service', () => {
  let campaignController: CampaignController;
  let campaignSingleObjDummy;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
		CampaignModule,
	 ]
    })
    .compile();

    campaignController = app.get<CampaignController>(CampaignController);		
		campaignSingleObjDummy = <MarinSingleObj>{
			"parentId": "1",
			"id": "1",
			"status": "ACTIVE",
			"name": "dummy",
			"orgId": 12,
			"displayStatus": "ACTIVE",
			"properties": [
				{ "name": "start_date", "value": "2023-08-10" },
			]
		}
  });

  describe('Campaign', () => {
		it('controller to be defined', () => {
			expect(campaignController).toBeDefined();
		});

		it ('method get to be defined', () =>{
			expect(campaignController.get).toBeDefined();
		});

		it ('method create to be defined', () =>{
			expect(campaignController.create).toBeDefined();
		});

		it ('method edit to be defined', () =>{
			expect(campaignController.edit).toBeDefined();
		});

	});
});
