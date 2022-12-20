import { ICatBreed } from './cat-breeds.interface';
import { ICategory } from './category.interface';

export interface ICat {
  breeds?: ICatBreed[];
  categories?: ICategory[];
  id: string;
  url?: string;
  width?: number;
  height?: number;
}
