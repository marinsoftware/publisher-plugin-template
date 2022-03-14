import { ApiProperty } from "@nestjs/swagger";
import { CatWeight } from "../interfaces/cat-weight.interface";

export class CatBreed implements CatBreed {
    @ApiProperty({
        description: 'The cat weight',
        example : '',
      })
    weight: CatWeight;
    @ApiProperty({
        description: 'The cat id',
        example : '',
      })
    id: string;
    @ApiProperty({
        description: 'The cat breed name',
        example : '',
      })
    name: string;
    @ApiProperty({
        description: 'The cfa_url',
        example : '',
      })
    cfa_url: string;
    @ApiProperty({
        description: 'The vetstreet_url',
        example : '',
      })
    vetstreet_url: string;
    @ApiProperty({
        description: 'The vcahospitals_url',
        example : '',
      })
    vcahospitals_url: string;
    temperament: string;
    origin: string;
    country_codes: string;
    country_code: string;
    description: string;
    life_span: string;
    indoor: number;
    lap: number;
    alt_names: string;
    adaptability: number;
    affection_level: number;
    child_friendly: number;
    dog_friendly: number;
    energy_level: number;
    grooming: number;
    health_issues: number;
    intelligence: number;
    shedding_level: number;
    social_needs: number;
    stranger_friendly: number;
    vocalisation: number;
    experimental: number;
    hairless: number;
    natural: number;
    rare: number;
    rex: number;
    suppressed_tail: number;
    short_legs: number;
    wikipedia_url: string;
    hypoallergenic: number;
    reference_image_id: string;
    
  }