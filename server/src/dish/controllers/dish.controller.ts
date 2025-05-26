import {
	Body,
	Controller,
	Delete,
	Get,
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
import { FindDishPaginatedDto, FindDishPaginatedResponse } from '../dtos/find-dish-paginated.dto';

@Controller('dish')
export class DishController {
	constructor(private readonly service: DishService) {}

	@Post()
	@UseInterceptors(FileInterceptor('image'))
	async create(@Body() data: CreateDishDto, @UploadedFile() file: Express.Multer.File) {
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

	@Get('paginated')
	async findByPagination(@Body() data: FindDishPaginatedDto): Promise<FindDishPaginatedResponse> {
		return await this.service.findByPagination(data);
	}

	@Get(':uuid')
	async findByUUID(@Param('uuid') uuid: string) {
		return await this.service.findByUUID(uuid);
	}

	@Delete(':uuid')
	async delete(@Param('uuid') uuid: string) {
		return await this.service.delete(uuid);
	}
}
