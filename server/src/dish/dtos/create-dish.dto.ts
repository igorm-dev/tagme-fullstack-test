import { IsEnum, IsString } from 'class-validator';
import { DishCategory } from '../enums/category.enum';

export class CreateDishDto {
	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsEnum(DishCategory)
	category: DishCategory;

	@IsString()
	price: number;
}
