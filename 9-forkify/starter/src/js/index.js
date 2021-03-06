import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import { elements, renderLoader, clearLoader } from  './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

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
    recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
  } catch(e) {
    // statements
    console.log(e);
  }
  
};

window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);
window.addEventListener('load', () => {
  state.likes = new Likes();

  state.likes.readStorage();

  likesView.toggleLikeMenu(state.likes.getNumberLikes());

  state.likes.likes.forEach(like => likesView.renderLike(like))
});



/*
 * list controller
 */

const controlList = () => {
  if (!state.list) {
    state.list = new List();
  }

  // add each ingridient to list
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}

elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // handle delete btn
  if (e.target.matches('.shopping_delete, .shopping_delete *')) {
    // Delete from state
    state.list.deleteItem(id);

    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

/*
 * LIke controller
*/
const controlLike = () => {
  if (!state.likes) {
    state.likes = new Likes();
  }
  const currentId = state.recipe.id;

  if (!state.likes.isLiked(currentId)) {
    const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.img);
    likesView.toggleLikeBtn(true);
    likesView.renderLike(newLike);
  } else {
    likesView.toggleLikeBtn(false);
    state.likes.deleteLike(currentId);
    likesView.deleteLike(currentId);
  }
  likesView.toggleLikeMenu(state.likes.getNumberLikes());
}


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
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // LIke controller
    controlLike();
  }
});

