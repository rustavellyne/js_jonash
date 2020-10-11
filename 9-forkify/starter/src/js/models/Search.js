import axios from 'axios';

export default class Search {
	constructor(query) {
		this.query = query;
		this.result = null;
		this.error = false;
	}
	async getResults(query) {
		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
			this.result = res.data.recipes;
			this.error = false;
		} catch(e) {
			this.error = true;
		}
	}
}

/**
* const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
*/
