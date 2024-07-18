import { Test, TestingModule } from '@nestjs/testing';
import { CampaignController } from './campaign.controller';
import { MarinSingleObj } from "../models/marin-object.interface";
import { transformMarinCampaign, transformWalmartCampaign } from '../transformers/object-transformer';
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

		it('successfully transform apple campaign list object', () => {
			const response = transformWalmartCampaign([campaignSingleObjDummy]);
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('name');
			expect(response[0]).toHaveProperty('parentId');
			expect(response[0]).toHaveProperty('id');
    	});

		it('successfully transform apple campaign paused object', () => {
			campaignSingleObjDummy.displayStatus = 'PAUSED'
			const response = transformWalmartCampaign([campaignSingleObjDummy]);
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('name');
			expect(response[0]).toHaveProperty('parentId');
			expect(response[0]).toHaveProperty('id');
    	});

		it('successfully transform apple campaign deleted object', () => {
			campaignSingleObjDummy.displayStatus = 'DELETED'
			const response = transformWalmartCampaign([campaignSingleObjDummy]);
			console.log("response : ", response)
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('name');
			expect(response[0]).toHaveProperty('parentId');
			expect(response[0]).toHaveProperty('id');
    	});

		it('successfully transform apple campaign running object', () => {
			campaignSingleObjDummy.displayStatus = 'RUNNING'
			const response = transformWalmartCampaign([campaignSingleObjDummy]);
			console.log("response : ", response)
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('name');
			expect(response[0]).toHaveProperty('parentId');
			expect(response[0]).toHaveProperty('id');
    	});

		it('successfully transform apple campaign put object', () => {
			campaignSingleObjDummy.status = 'ACTIVE'
			let response = transformMarinCampaign([campaignSingleObjDummy], 'put');
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('id');
			expect(response[0]).toHaveProperty('name');

			campaignSingleObjDummy.status = 'PAUSED'
			response = transformMarinCampaign([campaignSingleObjDummy], 'put');
			console.log("response : ", response)
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('id');
			expect(response[0]).toHaveProperty('name');

    	});

		it('successfully transform apple campaign post object', () => {
			let response = transformMarinCampaign([campaignSingleObjDummy], 'post');
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('name');
			expect(response[0]).toHaveProperty('startTime');

			campaignSingleObjDummy.status = 'PAUSED'
			campaignSingleObjDummy.properties[0].name = 'start_date'
			response = transformMarinCampaign([campaignSingleObjDummy], 'post');
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('startTime');

			campaignSingleObjDummy.properties[0].name = 'end_date'
			campaignSingleObjDummy.status = 'DELETED'
			response = transformMarinCampaign([campaignSingleObjDummy], 'post');
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('endTime');

			campaignSingleObjDummy.properties[0].name = 'total_budget'
			campaignSingleObjDummy.status = 'ACTIVE'
			response = transformMarinCampaign([campaignSingleObjDummy], 'post');
			expect(response).toBeInstanceOf(Array)
			expect(response[0].budgetAmount).toHaveProperty('amount');
			

			campaignSingleObjDummy.properties[0].name = 'daily_budget'
			response = transformMarinCampaign([campaignSingleObjDummy], 'post');
			expect(response).toBeInstanceOf(Array)
			expect(response[0].dailyBudgetAmount).toHaveProperty('amount');

			campaignSingleObjDummy.properties[0].name = 'publisher_campaign_type'
			response = transformMarinCampaign([campaignSingleObjDummy], 'post');
			expect(response).toBeInstanceOf(Array)
			expect(response[0]).toHaveProperty('adChannelType');
    	});

	});
});
