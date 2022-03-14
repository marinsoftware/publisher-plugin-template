import { CatBreedI } from "./cat-breeds.interface";
import { Category } from "./category.interface";

export interface CatI
{
    breeds?: CatBreedI[];
    categories?: Category[];
    id: string;
    url?: string;
    width?: number;
    height?: number;
  }