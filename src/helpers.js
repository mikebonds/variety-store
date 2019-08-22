const getStore = (namespace) => {
	const store = localStorage.getItem(namespace);
	let parsedStore = {};

	if (store) {
		parsedStore = JSON.parse(store);
	}

	return parsedStore;
};

const save = (namespace, key, data) => {
	const store = getStore(namespace);
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

	localStorage.setItem(namespace, JSON.stringify(store));
};

const update = (namespace, key, record, data) => {
	const store = getStore(namespace);
	const col = store[key];
	const index = col.items.indexOf(col.items.filter(rec => rec.cid === record.cid));

	data.cid = record.cid;

	col.items.splice(index, 1, data);

	localStorage.setItem(namespace, JSON.stringify(store));
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
