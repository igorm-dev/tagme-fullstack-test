import { v4 as uuidv4 } from 'uuid';

export function generateUUID(prefix?: string) {
	const uuid = uuidv4();

	if (prefix) {
		return `${prefix}-${uuid}`;
	}

	return uuid;
}
