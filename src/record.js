import { create, update, getStore, hasExpired } from './helpers';
 
class Record {
	constructor (key, data, store, isNew = true) {
		this.isNew = isNew;
		this.data = data.data;
		this.record = data;
        this.key = key;
        this.store = store;
	}

	update (data, expires) {
        const updated = create(data || this.data, expires || data.expires)
		update(this.store.namespace, this.key, this.record, updated);
	}

	delete () {
		const store = getStore(this.store.namespace);
		const col = store[this.key];
		const index = col.items.indexOf(col.items.filter(rec => rec.cid === this.record.cid));

		col.items.splice(index, 1);
		localStorage.setItem(this.store.namespace, JSON.stringify(store));

		return {};
	}

	hasExpired () {
		return hasExpired(this.data);
	}
}

export default Record;