import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
export type ShibeDocument = Shibe & Document;

@Schema()
export class Shibe {
    @ApiProperty({ example: 'Dodge', description: 'The shibe dog name' })
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    @ApiProperty({ example: 'http://image.jpg', description: 'The shibe image url' })
    url: string;
    @ApiProperty({ example: '12343', description: 'The shibe id' })
    @Prop()
    id: string;
}

export const ShibeSchema = SchemaFactory.createForClass(Shibe);