import { ApiProperty } from '@nestjs/swagger';
import { ICategory } from '../models/category.interface';
import { ICat } from '../models/cat.interface';
import { CatBreed } from './cat-breed.entity';
import { ICatBreed } from '../models/cat-breeds.interface';

export class Cat implements ICat {
  @ApiProperty({
    type: CatBreed,
    description: 'The breed of the Cat',
    isArray: true,
  })
  breeds?: ICatBreed[];
  @ApiProperty({
    example: [{ id: 5, name: 'boxes' }],
    description: 'The category of the cat',
  })
  categories?: ICategory[];
  @ApiProperty({ example: '12343', description: 'The cat id' })
  id: string;
  @ApiProperty({
    example: 'https://cdn2.thecatapi.com/images/251.jpg',
    description: 'The picture url',
  })
  url?: string;
  @ApiProperty({ example: 2832, description: 'The width of the cat' })
  width?: number;
  @ApiProperty({ example: 2128, description: 'The height of the cat' })
  height?: number;
}

