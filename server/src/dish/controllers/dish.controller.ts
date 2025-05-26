import {
	Body,
	Controller,
	Param,
	Post,
	Put,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { DishService } from '../services/dish.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDishDto } from '../dtos/create-dish.dto';
import { UpdateDishDto } from '../dtos/update-dish.dto';

@Controller('dish')
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

	@Put(':uuid')
	@UseInterceptors(FileInterceptor('image'))
	async update(
		@Param('uuid') uuid: string,
		@Body() data: UpdateDishDto,
		@UploadedFile() file: Express.Multer.File,
	) {
		await this.service.update(uuid, data, file);
	}
}
