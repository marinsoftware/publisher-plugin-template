import { ApiProperty } from '@nestjs/swagger';
import {  CatBreedI } from '../interfaces/cat-breeds.interface';
import { CatI } from '../interfaces/cat.interface';
import { Category } from '../interfaces/category.interface';
import { CatBreed } from './cat-breed.entity';

export class Cat implements CatI {
  @ApiProperty({
    type: CatBreed,
    description: 'The breed of the Cat',
    isArray: true,
  })
  breeds?: CatBreedI[];
  @ApiProperty({
    example: [{ id: 5, name: 'boxes' }],
    description: 'The category of the cat',
  })
  categories?: Category[];
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

