import { Module } from '@nestjs/common';
import { EnvConfigModule } from './env-config/env-config.module';
import { InMemoryMongoDBModule } from './database/in-memory-mongodb.module';

@Module({
	imports: [EnvConfigModule, InMemoryMongoDBModule.forRootAsync()],
	controllers: [],
	providers: [],
})
export class AppModule {}
