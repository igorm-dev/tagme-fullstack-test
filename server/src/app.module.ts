import { Module } from '@nestjs/common';
import { EnvConfigModule } from './env-config/env-config.module';
import { InMemoryMongoDBModule } from './database/in-memory-mongodb.module';
import { DishModule } from './dish/dish.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
	imports: [
		EnvConfigModule,
		InMemoryMongoDBModule.forRootAsync(),
		DishModule,
		CloudinaryModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
