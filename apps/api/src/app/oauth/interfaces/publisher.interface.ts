export interface ILinkingParamValList
{
    fieldName: string,
    fieldValueType: string,
    localizedText: string,
    localizedTextKey: string,
    required: boolean
}

export interface IPublisher
{
    publisher: string;
    publisherDefinition: string;
    authenticationType: string;
    linkingParamValList: ILinkingParamValList[];
    publisherId: number;
    publisherDefinitionId: number;
}
