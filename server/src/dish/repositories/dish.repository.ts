import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DishSchema, DishSchemaDocument } from '../schemas/dish.schema';
import { Model } from 'mongoose';
import { generateUUID } from 'src/utils/util';

@Injectable()
export class DishRepository {
	private readonly logger = new Logger(DishRepository.name);

	constructor(
		@InjectModel(DishSchema.name)
		private readonly model: Model<DishSchemaDocument>,
	) {}

	async create(
		data: Omit<DishSchema, 'uuid' | 'createdAt' | 'updatedAt'>,
	): Promise<void> {
		try {
			const uuid = generateUUID(DishSchema.UUID_PREFIX);

			await new this.model({
				...data,
				uuid,
			}).save();
		} catch (err) {
			this.logger.error(
				`Error creating dish: ${err}`,
				err.stack,
				this.create.name,
			);

			throw new InternalServerErrorException(err);
		}
	}

	async update(
		uuid: string,
		data: Omit<DishSchema, 'uuid' | 'createdAt' | 'updatedAt'>,
	) {
		try {
			await this.model.findOneAndUpdate({ uuid }, { ...data });
		} catch (err) {
			this.logger.error(
				`Error updating dish: ${err}`,
				err.stack,
				this.update.name,
			);

			throw new InternalServerErrorException(err);
		}
	}

	async findPaginated(
		page: number,
		limit: number,
	): Promise<{ data: DishSchemaDocument[]; total: number }> {
		try {
			const offset = ((page || 1) - 1) * limit;

			const [data, total] = await Promise.all([
				this.model.find().skip(offset).limit(limit).exec(),
				this.model.countDocuments(),
			]);

			return { data, total };
		} catch (err) {
			this.logger.error(
				`Error finding paginated dishes: ${err}`,
				err.stack,
				this.findPaginated.name,
			);

			throw new InternalServerErrorException(err);
		}
	}

	async findByUuid(
		uuid: string,
	): Promise<DishSchemaDocument | null | undefined> {
		try {
			return await this.model.findOne({ uuid });
		} catch (err) {
			this.logger.error(
				`Error finding dish by uuid: ${err}`,
				err.stack,
				this.findByUuid.name,
			);

			throw new InternalServerErrorException(err);
		}
	}

	async delete(uuid: string): Promise<void> {
		try {
			await this.model.findOneAndDelete({ uuid });
		} catch (err) {
			this.logger.error(
				`Error deleting dish: ${err}`,
				err.stack,
				this.delete.name,
			);

			throw new InternalServerErrorException(err);
		}
	}
}
