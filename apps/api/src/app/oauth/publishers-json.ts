import { IPublisher } from "../oauth/interfaces/publisher.interface";

export const PublisherListJson = [
  {
    "publisher": "PUBGATEWAY",
    "publisherDefinition": "APPLE_PUBGATEWAY",
    "authenticationType": "OAUTH2",
    "publisherId": 15, 
    "publisherDefinitionId": 137,
    "linkingParamValList": [
      {
        'fieldName': 'accountName',
        'fieldValueType': 'String',
        'localizedText': 'Account Name',
        'localizedTextKey': 'ACCOUNT_NAME_LABEL',
        'required': false,
      },
      {
        'fieldName': 'accountId',
        'fieldValueType': 'String',
        'localizedText': 'Account Id',
        'localizedTextKey': 'ACCOUNT_ID',
        'required': true,
      },
    ]
  }
] as IPublisher[];
