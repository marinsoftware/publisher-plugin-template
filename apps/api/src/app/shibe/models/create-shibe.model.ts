import { ApiProperty } from '@nestjs/swagger';

export class CreateShibe {
  @ApiProperty({ example: 'Dodge', description: 'The shibe dog name' })
  name: string;
  @ApiProperty({ example: 'http://localhost.com/image.jpg', description: 'The dog image url' })
  url: string;
}
