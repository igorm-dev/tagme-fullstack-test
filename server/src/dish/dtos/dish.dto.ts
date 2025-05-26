import { DishCategory } from '../enums/category.enum';

export class DishDto {
	uuid: string;
	title: string;
	description: string;
	price: number;
	category: DishCategory;
	imageUrl: string;
	createdAt: Date;
	updatedAt: Date;

	constructor(params: {
		uuid: string;
		title: string;
		description: string;
		price: number;
		category: DishCategory;
		imageUrl: string;
		createdAt: Date;
		updatedAt: Date;
	}) {
		this.uuid = params.uuid;
		this.title = params.title;
		this.description = params.description;
		this.price = params.price;
		this.category = params.category;
		this.imageUrl = params.imageUrl;
		this.createdAt = params.createdAt;
		this.updatedAt = params.updatedAt;
	}
}
