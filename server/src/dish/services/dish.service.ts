import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryFolder } from 'src/cloudinary/cloudinary.enum';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { SharpService } from 'src/sharp/sharp.service';
import { CreateDishDto } from '../dtos/create-dish.dto';
import { DishRepository } from '../repositories/dish.repository';
import { UpdateDishDto } from '../dtos/update-dish.dto';
import { DishSchema } from '../schemas/dish.schema';
import {
	FindDishPaginatedDto,
	FindDishPaginatedResponse,
} from '../dtos/find-dish-paginated.dto';
import { DishDto } from '../dtos/dish.dto';

@Injectable()
export class DishService {
	constructor(
		private readonly repo: DishRepository,
		private readonly sharpService: SharpService,
		private readonly cloudinaryService: CloudinaryService,
	) {}

	async findByUUID(uuid: string) {
		const foundedDish = await this.repo.findByUuid(uuid);

		if (!foundedDish) {
			throw new BadRequestException(`Dish with uuid ${uuid} not found`);
		}

		return foundedDish;
	}

	async findByPagination(
		data: FindDishPaginatedDto,
	): Promise<FindDishPaginatedResponse> {
		const { dishes, total } = await this.repo.findPaginated(
			data.page,
			data.limit,
		);

		const mapped = dishes.map(
			(dish) =>
				new DishDto({
					uuid: dish.uuid,
					title: dish.title,
					description: dish.description,
					category: dish.category,
					price: dish.price,
					imageUrl: dish.imageUrl,
					createdAt: dish.createdAt,
					updatedAt: dish.updatedAt,
				}),
		);

		return {
			data: mapped,
			total,
			limit: data.limit,
			page: data.page,
		};
	}

	async create(data: CreateDishDto, file: Express.Multer.File): Promise<void> {
		const resizedImage = await this.sharpService.resizeImageToSquare(file);

		const { secure_url } = await this.cloudinaryService.uploadImage(
			resizedImage.buffer,
			CloudinaryFolder.DISHES,
		);

		await this.repo.create({
			category: data.category,
			description: data.description,
			price: data.price,
			title: data.title,
			imageUrl: secure_url,
		});
	}

	async update(
		uuid: string,
		data: UpdateDishDto,
		file?: Express.Multer.File,
	): Promise<void> {
		const foundedDish = await this.repo.findByUuid(uuid);

		if (!foundedDish) {
			throw new BadRequestException(`Dish with uuid ${uuid} not found`);
		}

		const dish: Omit<DishSchema, 'uuid' | 'createdAt' | 'updatedAt'> = {
			...data,
			imageUrl: foundedDish.imageUrl,
		};

		if (file && file.buffer) {
			// TODO: Delete old image from Cloudinary (not implemented yet)
			const resizedImage = await this.sharpService.resizeImageToSquare(file);
			const { secure_url } = await this.cloudinaryService.uploadImage(
				resizedImage.buffer,
				CloudinaryFolder.DISHES,
			);

			dish.imageUrl = secure_url;
		}

		await this.repo.update(uuid, dish);
	}

	async delete(uuid: string): Promise<void> {
		await this.repo.delete(uuid);
	}
}
