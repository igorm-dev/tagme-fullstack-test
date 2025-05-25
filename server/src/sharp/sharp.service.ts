/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class SharpService {
	constructor() {}

	async resizeImageToSquare(
		file: Express.Multer.File,
	): Promise<Express.Multer.File> {
		try {
			if (!file || !file.buffer) {
				throw new Error('No file provided or file buffer is empty');
			}

			const image = sharp(file.buffer);
			const metadata = await image.metadata();

			const width: number =
				typeof metadata.width === 'number' ? metadata.width : 0;
			const height: number =
				typeof metadata.height === 'number' ? metadata.height : 0;

			const size = Math.max(width, height);

			const buffer = await image
				.resize({
					width: size,
					height: size,
					fit: 'cover',
					position: 'center',
				})
				.toBuffer();

			return {
				...file,
				size: buffer.length,
				buffer,
			};
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error('Error resizing image:', err.message);
			} else {
				console.error('Error resizing image:', err);
			}
			throw new Error('Error processing image');
		}
	}
}
