import { Module } from '@nestjs/common';
import { DishService } from './services/dish.service';
import { DishRepository } from './repositories/dish.repository';
import { DishController } from './controllers/dish.controller';

@Module({
	imports: [],
	controllers: [DishController],
	providers: [DishService, DishRepository],
	exports: [],
})
export class DishModule {}
