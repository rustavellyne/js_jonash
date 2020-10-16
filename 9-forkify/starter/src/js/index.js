import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader } from  './views/base';
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
		searchView.clearInput();
		searchView.clearResults();
    renderLoader(elements.searchRes);
		/** 4) search for recipes */
    try {
      await state.search.getResults();

      /** 5) render results on UI */
      clearLoader();
    searchView.renderResults(state.search.result);
    } catch(e) {
      // statements
      console.log(e);
    }
		

	}
};

elements.searchForm.addEventListener('click', e => {
	e.preventDefault();
	controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');
  if (!id) {
    return false;
  }
  try {
    state.recipe = new Recipe(id);
    await state.recipe.getRecipe();
    state.recipe.calcTime();
    state.recipe.calcServings();
  } catch(e) {
    // statements
    console.log(e);
  }
  
};

window.addEventListener('hashChange', controlRecipe);
window.addEventListener('load', controlRecipe);