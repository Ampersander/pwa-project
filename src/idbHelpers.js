import { openDB } from 'idb';

const PRESENTATIONS = 'Presentations';

export function initDB() {
	return openDB('Poodle Slides', 1, {
		upgrade(db) {
			const presentations = db.createObjectStore(PRESENTATIONS, {
				keyPath: 'id',
			});

			presentations.createIndex('id', 'id');
			// presentations.createIndex('author', 'author');
		},
	});
}

// Presentations
export async function setPresentations(data = []) {
	const db = await initDB();
	const tx = db.transaction(PRESENTATIONS, 'readwrite');

	data.forEach(item => {
		tx.store.put(item);
	});

	await tx.done;
	return db.getAllFromIndex(PRESENTATIONS, 'id');
}

export async function setPresentation(data = {}) {
	const db = await initDB();
	const tx = db.transaction(PRESENTATIONS, 'readwrite');

	tx.store.put(data);
	await tx.done;
	return db.getFromIndex(PRESENTATIONS, 'id', data.id);
}

export async function getPresentations() {
	const db = await initDB();
	return db.getAllFromIndex(PRESENTATIONS, 'id');
}

export async function getPresentation(id) {
	const db = await initDB();
	return db.getFromIndex(PRESENTATIONS, 'id', id);
}

export async function unsetPresentation(id) {
	const db = await initDB();
	await db.delete(PRESENTATIONS, id);
}