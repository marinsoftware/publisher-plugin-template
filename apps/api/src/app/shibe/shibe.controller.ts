import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ShibeService } from './shibe.service';
import { CreateShibe } from './models/create-shibe.model';
import { Shibe } from './schemas/shibe.schema';
import { ApiResponse } from '@nestjs/swagger';


@Controller('shibe')
export class ShibeController {
  constructor(private readonly shibeService: ShibeService) {}

  @Post()
  create(@Body() createShibeDto: CreateShibe) {
    return this.shibeService.create(createShibeDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Shibe,
    isArray: true,
  })
  findAll() {
    return this.shibeService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Shibe,
    isArray: false,
  })
  findOne(@Param('id') id: string) {
    return this.shibeService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shibeService.delete(id);
  }
}
