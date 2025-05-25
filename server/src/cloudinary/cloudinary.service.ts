import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnvironmentConfig } from 'src/env-config/env-config.interface';

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService implements OnModuleInit {
	private readonly logger = new Logger(CloudinaryService.name);

	constructor(
		private readonly configService: ConfigService<IEnvironmentConfig>,
	) {}

	onModuleInit() {
		cloudinary.config({
			cloud_name: this.configService.get('CLDY_CLOUD_NAME'),
			api_key: this.configService.get('CLDY_API_KEY'),
			api_secret: this.configService.get('CLDY_API_SECRET'),
		});
	}

	async uploadImage(
		file: Express.Multer.File,
		folder: string,
	): Promise<UploadApiResponse> {
		if (!file || !file.buffer) {
			throw new BadRequestException('File buffer is missing');
		}

		try {
			const TIMEOUT = 5_000;

			const uploadPromise = this.createUploadPromise(
				file.buffer as Buffer<ArrayBufferLike>,
				folder,
			);

			const timeoutPromise = new Promise<never>((_, reject) =>
				setTimeout(
					() => reject(new InternalServerErrorException('Upload timed out')),
					TIMEOUT,
				),
			);

			return await Promise.race([uploadPromise, timeoutPromise]);
		} catch (err) {
			this.logger.error(
				`Error uploading file to Cloudinary: ${err}`,
				err.stack,
				this.uploadImage.name,
			);

			throw new InternalServerErrorException('Error while uploading image');
		}
	}

	private async createUploadPromise(
		buffer: Buffer<ArrayBufferLike>,
		folder: string,
	) {
		return new Promise<UploadApiResponse>((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{ folder },
				(error, result) => {
					if (error) {
						this.logger.error(
							`Upload image error during stream processing`,
							error,
						);
						return reject(new InternalServerErrorException(error));
					}

					resolve(result as UploadApiResponse);
				},
			);

			const readable = new Readable();
			readable.push(buffer);
			readable.push(null);

			readable.on('error', (streamError) => {
				this.logger.error('Readable stream error', streamError);
				reject(new BadRequestException('Stream error during upload'));
			});

			readable.pipe(stream);
		});
	}
}
