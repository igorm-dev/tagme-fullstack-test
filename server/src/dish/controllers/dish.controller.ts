import {
	Body,
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { DishService } from '../services/dish.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDishDto } from '../dtos/create-dish.dto';

@Controller()
export class DishController {
	constructor(private readonly service: DishService) {}

	@Post()
	@UseInterceptors(FileInterceptor('image'))
	async create(
		@Body() data: CreateDishDto,
		@UploadedFile() file: Express.Multer.File,
	) {
		await this.service.create(data, file);
	}
}
