import { Injectable } from '@nestjs/common';
import { CloudinaryFolder } from 'src/cloudinary/cloudinary.enum';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { SharpService } from 'src/sharp/sharp.service';
import { CreateDishDto } from '../dtos/create-dish.dto';
import { DishRepository } from '../repositories/dish.repository';

@Injectable()
export class DishService {
	constructor(
		private readonly repo: DishRepository,
		private readonly sharpService: SharpService,
		private readonly cloudinaryService: CloudinaryService,
	) {}

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
}
