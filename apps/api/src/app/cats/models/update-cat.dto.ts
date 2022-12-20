import { ICatBreed } from './cat-breeds.interface';
import { ApiProperty } from '@nestjs/swagger';
import { ICat } from './cat.interface';
import { ICategory } from './category.interface';

export class UpdateCatDto implements ICat {
  @ApiProperty({
    example: [
      {
        weight: { imperial: '7 - 16', metric: '3 - 7' },
        id: 'abob',
        name: 'American Bobtail',
        cfa_url: 'http://cfa.org/Breeds/BreedsAB/AmericanBobtail.aspx',
        vetstreet_url: 'http://www.vetstreet.com/cats/american-bobtail',
        vcahospitals_url: 'https://vcahospitals.com/know-your-pet/cat-breeds/american-bobtail',
        temperament: 'Intelligent, Interactive, Lively, Playful, Sensitive',
        origin: 'United States',
        country_codes: 'US',
        country_code: 'US',
        description:
          'American Bobtails are loving and incredibly intelligent cats possessing a distinctive wild appearance. They are extremely interactive cats that bond with their human family with great devotion.',
        life_span: '11 - 15',
        indoor: 0,
        lap: 1,
        alt_names: '',
        adaptability: 5,
        affection_level: 5,
        child_friendly: 4,
        dog_friendly: 5,
        energy_level: 3,
        grooming: 1,
        health_issues: 1,
        intelligence: 5,
        shedding_level: 3,
        social_needs: 3,
        stranger_friendly: 3,
        vocalisation: 3,
        experimental: 0,
        hairless: 0,
        natural: 0,
        rare: 0,
        rex: 0,
        suppressed_tail: 1,
        short_legs: 0,
        wikipedia_url: 'https://en.wikipedia.org/wiki/American_Bobtail',
        hypoallergenic: 0,
        reference_image_id: 'hBXicehMA',
      },
    ],
    description: 'The breed of the Cat',
  })
  breeds?: ICatBreed[];
  @ApiProperty({ example: [{ id: 5, name: 'boxes' }], description: 'The category of the cat' })
  categories?: ICategory[];
  @ApiProperty({ example: '12343', description: 'The cat id' })
  id: string;
  @ApiProperty({ example: 'https://cdn2.thecatapi.com/images/251.jpg', description: 'The picture url' })
  url?: string;
  @ApiProperty({ example: 2832, description: 'The width of the cat' })
  width?: number;
  @ApiProperty({ example: 2128, description: 'The height of the cat' })
  height?: number;
}
