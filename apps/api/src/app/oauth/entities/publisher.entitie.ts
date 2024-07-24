import { ApiProperty } from '@nestjs/swagger';
import { IPublisher, ILinkingParamValList } from '../interfaces/publisher.interface';

export class Publisher implements IPublisher {
  @ApiProperty({
    description: 'Param Value List',
    isArray: true,
  })
  linkingParamValList: ILinkingParamValList[];

  @ApiProperty({
    example: 'GENERIC'
  })
  publisher: string;

  @ApiProperty({
    example: 'APPLE'
  })
  publisherDefinition: string;

  @ApiProperty({
    example: 'OAUTH2'
  })
  authenticationType: string;

  @ApiProperty({
    example: 'publisherId'
  })
  publisherId: number;

  @ApiProperty({
    example: 'publisherDefinitionId'
  })
  publisherDefinitionId: number;
}

