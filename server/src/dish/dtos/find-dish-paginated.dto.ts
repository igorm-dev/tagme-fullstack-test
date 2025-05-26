import { DishDto } from './dish.dto';

export class FindDishPaginatedDto {
	page: number;
	limit: number;
}

export class FindDishPaginatedResponse {
	data: DishDto[];
	total: number;
	limit: number;
	page: number;
}
