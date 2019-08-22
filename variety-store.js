const STORE_KEY = 'VarietyStore';

const getStore = () => {
	const store = localStorage.getItem(STORE_KEY);
	let parsedStore = {};

	if (store) {
		parsedStore = JSON.parse(store);
	}

	return parsedStore;
};

const save = (key, data) => {
	const store = getStore();
	const col = store[key];

	if (col) {
		col.track += 1;
		data.cid = col.track;
		col.items.push(data);
	} else {
		data.cid = 1;
		store[key] = {
			items: [data],
			track: 1,
		};
	}

	localStorage.setItem(STORE_KEY, JSON.stringify(store));
};

const update = (key, record, data) => {
	const store = getStore();
	const col = store[key];
	const index = col.items.indexOf(col.items.filter(rec => rec.cid === record.cid));

	data.cid = record.cid;

	col.items.splice(index, 1, data);

	localStorage.setItem(STORE_KEY, JSON.stringify(store));
};

const isObject = (data) => {
	return typeof data === 'object' && data instanceof Array === false;
};

const create = (data = {}, expires = 0) => {
	const storeData = { data };

	storeData.expires = expires;
	storeData.date = new Date();

	return storeData;
};

const hasExpired = (data) => {
	if (isObject(data)) {
		return false;
	}

	if (!data.expires) {
		return false;
	}

	const days = Math.floor((Math.abs(new Date() - data.date) / 1000) / 86400);

	return data.expires === days && days !== 0;
};

class VarietyStoreRecord {
	constructor (key, data, isNew = true) {
		this.isNew = isNew;
		this.data = data.data;
		this.record = data;
		this.key = key;
	}

	update (data, expires) {
		update(this.key, this.record, create(data || this.data, expires || data.expires));
	}

	delete () {
		const store = getStore();
		const col = store[this.key];
		const index = col.items.indexOf(col.items.filter(rec => rec.cid === this.record.cid));

		col.items.splice(index, 1);
		localStorage.setItem(STORE_KEY, JSON.stringify(store));

		return {};
	}

	hasExpired () {
		return hasExpired(this.data);
	}
}

class VarietyStore {
	static save (key, data, expires) {
		const storeData = create(data, expires);
		save(key, storeData);

		return new VarietyStoreRecord(key, storeData);
	}

	static delete (key) {
		const store = getStore();
		delete store[key];
	}

	static find (key, matcher) {
		const store = getStore();
		const col = store[key];
		const proxyMatcher = (rec) => {
			return matcher(rec.data);
		};

		if (col) {
			const data = col.items.find(proxyMatcher);

			if (data) {
				return new VarietyStoreRecord(key, data, false);
			}
		}

		return false;
	}
}

export default VarietyStore;
