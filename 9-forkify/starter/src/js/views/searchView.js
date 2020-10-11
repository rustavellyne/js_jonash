import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
	elements.searchInput.value = '';
};

export const clearResults = () => {
	elements.searchResultList.innerHtml = '';
};

const renderRecipe = recipe => {
	const template = `
		<li>
            <a class="results__link results__link--active" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name sdasd">${recipe.title}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
	`;

	elements.searchResultList.insertAdjacentHTML('beforeend', template);
}

export const renderResults = recipes => {
	console.log(recipes)
	recipes.forEach(renderRecipe);
}