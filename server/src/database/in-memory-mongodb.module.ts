import { DynamicModule, Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Module({})
export class InMemoryMongoDBModule implements OnModuleDestroy {
  private readonly logger = new Logger(InMemoryMongoDBModule.name);

  private static readonly PROVIDE_KEY = 'MONGODB_MEMORY_SERVER';
  private static mongodb: MongoMemoryServer;

  static async forRootAsync(): Promise<DynamicModule> {
    this.mongodb = await MongoMemoryServer.create();
    const uri = this.mongodb.getUri();

    return {
      module: InMemoryMongoDBModule,
      imports: [MongooseModule.forRoot(uri)],
      providers: [
        {
          provide: this.PROVIDE_KEY,
          useValue: this.mongodb,
        },
      ],
      exports: [this.PROVIDE_KEY],
    };
  }

  async onModuleDestroy() {
    if (InMemoryMongoDBModule.mongodb) {
      await InMemoryMongoDBModule.mongodb.stop();
      this.logger.log('MongoDB memory server stopped');
    }
  }
}
