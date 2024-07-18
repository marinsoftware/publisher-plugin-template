import { ApiProperty } from "@nestjs/swagger";

export class CreateOAuthUrlDto {
  @ApiProperty({ example:  'Active'})
  state?: string;
  @ApiProperty({ example:  'APPLE'})
  publisher: string;
  @ApiProperty({ example:  '{pk: 1, cl: [1, 2, 3]}'})
  clientID?: any;
  @ApiProperty({ example:  'https://cdn2.redirect-uri.com'})
  redirect_uri: string;
}

export class PublisherAccountsDto {
  @ApiProperty({ example:  'https://cdn2.redirect-uri.com'})
  responseUrl?: string;
  @ApiProperty({ example:  'APPLE'})
  publisher: string;
  @ApiProperty({ example:  '{pk: 1, cl: [1, 2, 3]}'})
  clientID?: any;
  @ApiProperty({ example:  'https://cdn2.redirect-uri.com'})
  redirect_uri: string;
  @ApiProperty({ example:  'accountName'})
  accountName?: string;
  @ApiProperty({ example:  'accountID'})
  accountID: string;
  @ApiProperty({ example:  'code'})
  code: string;
}