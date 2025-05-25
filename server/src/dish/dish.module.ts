import { Module } from '@nestjs/common';
import { DishService } from './services/dish.service';
import { DishRepository } from './repositories/dish.repository';
import { DishController } from './controllers/dish.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DishSchema, DishSchemaFactory } from './schemas/dish.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: DishSchema.name,
				schema: DishSchemaFactory,
			},
		]),
	],
	controllers: [DishController],
	providers: [DishService, DishRepository],
	exports: [],
})
export class DishModule {}
