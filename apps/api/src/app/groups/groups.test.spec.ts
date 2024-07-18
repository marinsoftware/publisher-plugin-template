import { Test, TestingModule } from '@nestjs/testing';
import { AdGroupsController } from './ad-groups.controller';
import { PublisherApiService } from '../services/publisher_api.service';
import { WalmartAdGroup } from "../models/walmart-objects";
import { MarinSingleObj } from "../models/marin-object.interface";
import { transformMarinAdgroup, transformPublisherAdGroup } from "../transformers/object-transformer";
import { AdGroupModule } from './ad-group.module';


describe('AdGroupsController', () => {
  let groupController: AdGroupsController;
  let walmartService: PublisherApiService;
  let advertiserId: number;
  let campaignId: number;
  let walmartAdGroupObj, groupSingleObj;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
		AdGroupModule,
	]
    })
    .compile();

    groupController = app.get<AdGroupsController>(AdGroupsController);
    walmartService = app.get<PublisherApiService>(PublisherApiService);
    advertiserId = 1;
    campaignId = 1;
    walmartAdGroupObj = <WalmartAdGroup> {
		id: 1,
		campaignId: 1,
		name: "string",
		displayStatus: "Active",
		status: "ACTIVE",
		defaultBidAmount: {"amount": "500"}
    }
	groupSingleObj = <MarinSingleObj> {
		"parentId": "string",
		"id": "string",
		"status": "ACTIVE",
		"name": "string",
		"properties": [{ "name": "string", "value": "string" }]
	}
  });

  describe('Groups', () => {
    it('controller to be defined', () => {
      expect(groupController).toBeDefined();
    });

    it ('method get to be defined', () =>{
      expect(groupController.get).toBeDefined();
    });

    it ('method create to be defined', () =>{
      expect(groupController.create).toBeDefined();
    });

    it ('method edit to be defined', () =>{
      expect(groupController.edit).toBeDefined();
    });

    // it ('method delete to be defined', () =>{
    //   expect(groupController.delete).toBeDefined();
    // });

	
    it('successfully transform apple group object list', () => {
		let response = transformPublisherAdGroup([walmartAdGroupObj], 0);
		expect(response).toBeInstanceOf(Array)
		expect(response[0]).toHaveProperty('name');
		expect(response[0]).toHaveProperty('properties');

		walmartAdGroupObj.displayStatus = 'paused'
		response = transformPublisherAdGroup([walmartAdGroupObj], 0);
		expect(response).toBeInstanceOf(Array)
		expect(response[0]).toHaveProperty('name');
		expect(response[0]).toHaveProperty('properties');

		walmartAdGroupObj.displayStatus = 'running'
		response = transformPublisherAdGroup([walmartAdGroupObj], 0);
		expect(response).toBeInstanceOf(Array)
		expect(response[0]).toHaveProperty('name');
		expect(response[0]).toHaveProperty('properties');

		walmartAdGroupObj.displayStatus = 'deleted'
		response = transformPublisherAdGroup([walmartAdGroupObj], 0);
		expect(response).toBeInstanceOf(Array)
		expect(response[0]).toHaveProperty('name');
		expect(response[0]).toHaveProperty('properties');
    });

	it('successfully transform publisher adGroup put object', () => {
		walmartAdGroupObj.status = "PAUSED";
		let response = transformMarinAdgroup([walmartAdGroupObj], 'put');
		expect(response).toBeInstanceOf(Array)
		expect(response[0]).toHaveProperty('id');
		expect(response[0]).toHaveProperty('status');

		walmartAdGroupObj.status = "ACTIVE";
		response = transformMarinAdgroup([walmartAdGroupObj], 'put');
		expect(response).toBeInstanceOf(Array)
		expect(response[0]).toHaveProperty('id');
		expect(response[0]).toHaveProperty('status');
    });

	it('successfully transform apple group post object', () => {
		let response = transformMarinAdgroup([walmartAdGroupObj], 'post');
		expect(response).toBeInstanceOf(Array)
		// expect(response[0]).toHaveProperty('status');
		expect(response[0]).toHaveProperty('name');

		walmartAdGroupObj.status = "DELETED";
		response = transformMarinAdgroup([walmartAdGroupObj], 'post');
		
		expect(response).toBeInstanceOf(Array)
		// expect(response[0]).toHaveProperty('status');
		expect(response[0]).toHaveProperty('name');

		walmartAdGroupObj.status = "PAUSED";
		response = transformMarinAdgroup([walmartAdGroupObj], 'post');
		expect(response).toBeInstanceOf(Array)
		// expect(response[0]).toHaveProperty('status');
		expect(response[0]).toHaveProperty('name');

    });

	// it('successfully create adGroup objects post', done => {
	// 	jest.spyOn(walmartService, 'makeApiCall').mockImplementation(
	// 		() => { return of([walmartAdGroupObj]) }
	// 	);
	// 	walmartService.createObjects('adGroup', [walmartAdGroupObj])
	// 	.subscribe(
	// 			(res) => {
	// 				expect(res).toBeInstanceOf(Array)
	// 			done();
	// 			}
	// 	);
    // });

    // it('adGroup post response translation on success', done => {
	// 	const response: Observable<any> = of([{"code": 'success', "details": "dummy details", "adGroupId":"123"}]);
	// 	walmartService.responseTranslation(response, [groupSingleObj], 'adGroup')
	// 	.subscribe(
	// 		(res) => {
	// 			expect(res).toHaveProperty('requestResult', 'SUCCESS');
	// 			done();
	// 		}
	// 	);
    // });

    // it('adGroup post response translation on failure', done => {
	// 	const response: Observable<any> = of([{"code": 'failure', "details": "dummy details", "adGroupId":"123"}]);
	// 	walmartService.responseTranslation(response, [groupSingleObj], 'adGroup')
	// 	.subscribe(
	// 		(res) => {
	// 			expect(res).toHaveProperty('requestResult', 'Error');
	// 			done();
	// 		}
	// 	);
    // });

    // it('adGroup post response translation on partial success', done => {
	// 	const response: Observable<any> = of([{"code": 'failure', "details": "dummy details", "adGroupId":"123"}, {"code": 'success', "details": "dummy details", "adGroupId":"1234"}]);
	// 	walmartService.responseTranslation(response, [groupSingleObj, groupSingleObj], 'adGroup')
	// 	.subscribe(
	// 		(res) => {
	// 			expect(res).toHaveProperty('requestResult', 'PARTIAL-SUCCESS');
	// 			done();
	// 		}
	// 	);
    // });

    // it('successfully transform walmart adGroup delete object', () => {
	// 	groupSingleObj.status = "DELETED";
	// 	const response = transformMarinAdgroup([groupSingleObj], 'put');
	// 	expect(response).toBeInstanceOf(Array)
	// 	expect(response[0]).toHaveProperty('adGroupId');
	// 	expect(response[0]).toHaveProperty('name');
    // });

  });
});
