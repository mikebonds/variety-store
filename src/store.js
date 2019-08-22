import { create, save, getStore } from './helpers';
import Record from './record';

class Store {
	constructor (namespace) {
		if (typeof namespace !== 'string' ) {
			console.error('VarietyStore namespace must be a string.');
			return;
		}

		if (namespace.length <= 0) {
			console.error('Empty string given as VarietyStore namespace.');
		}

		this.namespace = namespace;
	}

	save (key, data, expires) {
		const storeData = create(data, expires);
		save(this.namespace, key, storeData);

		return new Record(this, key, storeData);
	}

	delete (key) {
		const store = getStore(this.namespace);
		delete store[key];
	}

	find (key, matcher) {
		const store = getStore(this.namespace);
		const col = store[key];
		const proxyMatcher = (rec) => {
			return matcher(rec.data);
		};

		if (col) {
			const data = col.items.find(proxyMatcher);

			if (data) {
				return new Record(this, key, data, false);
			}
		}

		return false;
	}
}

export default Store;