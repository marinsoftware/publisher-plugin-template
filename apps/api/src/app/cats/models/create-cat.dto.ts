import { ApiProperty } from "@nestjs/swagger";

export class CreateCatDto {
    @ApiProperty({ example:  '12343', description: 'The cat id' })
  id: string;
  @ApiProperty({ example:  'https://cdn2.thecatapi.com/images/251.jpg', description: 'The picture url' })
  url?: string;
}
