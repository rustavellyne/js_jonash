import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import { elements, renderLoader, clearLoader } from  './views/base';
import * as searchView from './views/SearchView';
import * as recipeView from './views/recipeView';
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
  renderLoader(elements.recipe);
  if(state.search) {
    searchView.highlightSelected(id);
  }
  
  recipeView.clearRecipe();
  try {
    state.recipe = new Recipe(id);
    window.r = state.recipe;
    await state.recipe.getRecipe();
    state.recipe.parseIngredients();
    state.recipe.calcTime();
    state.recipe.calcServings();

    // render recipe
    clearLoader();
    recipeView.renderRecipe(state.recipe);
  } catch(e) {
    // statements
    console.log(e);
  }
  
};

window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);

// handling recipe buttons clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if(state.recipe.serving > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingIngredients(state.recipe);
    }
    
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingIngredients(state.recipe);
  }
});

