export class DishDto {
	uuid: string;
	title: string;
	description: string;
	imageUrl: string;
	createdAt: Date;
	updatedAt: Date;

	constructor(params: {
		uuid: string;
		title: string;
		description: string;
		imageUrl: string;
		createdAt: Date;
		updatedAt: Date;
	}) {
		this.uuid = params.uuid;
		this.title = params.title;
		this.description = params.description;
		this.imageUrl = params.imageUrl;
		this.createdAt = params.createdAt;
		this.updatedAt = params.updatedAt;
	}
}
