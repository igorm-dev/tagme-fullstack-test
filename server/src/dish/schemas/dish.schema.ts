import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DishCategory } from '../enums/category.enum';

@Schema({ collection: 'dishes', timestamps: true })
export class DishSchema {
	static readonly UUID_PREFIX = 'dish';

	@Prop({ name: 'uuid', unique: true, isRequired: true })
	uuid: string;

	@Prop({ name: 'title', isRequired: true })
	title: string;

	@Prop({ name: 'description', isRequired: true })
	description: string;

	@Prop({ name: 'image_url', isRequired: true })
	imageUrl: string;

	@Prop({ name: 'price', isRequired: true })
	price: number;

	@Prop({ name: 'category', isRequired: true })
	category: DishCategory;

	@Prop({ name: 'is_available', isRequired: true })
	isAvailable: boolean;

	@Prop()
	createdAt: Date;

	@Prop()
	updatedAt: Date;
}

export type DishSchemaDocument = HydratedDocument<DishSchema>;

export const DishSchemaFactory = SchemaFactory.createForClass(DishSchema);
