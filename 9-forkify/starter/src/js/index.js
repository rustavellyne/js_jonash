import Search from './models/Search';
import { elements } from  './views/base';
import * as searchView from './views/SearchView';
/**
 * Global state of the app
 * - Search object
 * - Current recipe list object
 * - Shopping list object
 * - Liked recipes 
 */
const state = {};

const controlSearch = async () => {
	/** 1) get query from view*/
	const query = searchView.getInput();


	if (query) {
		/** 2) New search object and add to state */
		state.search = new Search(query);

		/** 3) Prepare UI for results */

		/** 4) search for recipes */
		await state.search.getResults();

		/** 5) render results on UI */
		console.log(state.search.result)

	}
};

elements.searchForm.addEventListener('click', e => {
	e.preventDefault();
	controlSearch();
});
