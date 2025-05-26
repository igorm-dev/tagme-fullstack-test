import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { DishCategory } from '../enums/category.enum';
import { Type } from 'class-transformer';

export class UpdateDishDto {
	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsEnum(DishCategory)
	category: DishCategory;

	@Type(() => Number)
	@IsNumber()
	price: number;

	@Type(() => Boolean)
	@IsBoolean()
	isAvailable: boolean;
}
