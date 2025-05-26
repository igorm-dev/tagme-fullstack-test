import { IsEnum, IsNumber, IsString } from 'class-validator';
import { DishCategory } from '../enums/category.enum';

export class UpdateDishDto {
	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsEnum(DishCategory)
	category: DishCategory;

	@IsNumber()
	price: number;
}
