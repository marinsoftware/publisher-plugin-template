import { IPublisher } from "../oauth/interfaces/publisher.interface";

export const SrePublisherListJson = [
  {
    "publisher": "GENERIC",
    "publisherDefinition": "APPLE",
    "authenticationType": "OAUTH2",
    // "publisherId": 2, 
    // "publisherDefinitionId": 110,
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
