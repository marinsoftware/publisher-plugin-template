import { Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateShibe } from './models/create-shibe.model';
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';
import { Shibe, ShibeDocument } from './schemas/shibe.schema';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class ShibeService implements OnModuleInit {
  apiUrl: string;
  shibes: Shibe[];
  constructor(
    private httpService: HttpService,
    @InjectModel(Shibe.name) private readonly shibeModel: Model<ShibeDocument>,
   
  ) {
    this.apiUrl = 'http://shibe.online/api/shibes';
  }
  async onModuleInit() {
    // when model is initalised
    //check if database has shibes, if not populate it with 100 shibes
    const shibesInDatabase = await this.shibeModel.count({});
    const config: Config = {
      dictionaries: [names],
    };
    if (shibesInDatabase < 20) {
      this.httpService
        .get<string[]>(`${this.apiUrl}?count=10`)
        .pipe(map((response) => response.data))
        .subscribe((urls: string[]) => {
          const shibes = urls.map((url: string) => {
            return {
              name: uniqueNamesGenerator(config),
              url,
            };
          });
          console.log(...shibes);
        this.shibeModel.create(...shibes)
        });
    }
  }
  async create(createShibeDto: CreateShibe): Promise<Shibe> {
    const createdShibe = await this.shibeModel.create(createShibeDto);
    return createdShibe;
  }

  async findAll(): Promise<Shibe[]> {
    return this.shibeModel.find({}).exec();
  }

  async findOne(id: string): Promise<Shibe> {
    return this.shibeModel.findOne({ _id: id }).exec();
  }

  async delete(id: string) {
    const deletedShibe = await this.shibeModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedShibe;
  }
}
