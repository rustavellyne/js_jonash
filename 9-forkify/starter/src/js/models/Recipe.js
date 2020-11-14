import axios from 'axios';
import { proxy } from '../config';

export default class Recipe {
  constructor (id) {
    this.id = id
  }

  async getRecipe () {
    try {
      const res = await axios(`${proxy}/get?rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch(e) {
      // statements
      console.log(e);
    }
  }

  calcTime () {
    const numIngr = this.ingredients.length;
    const periods = Math.ceil(numIngr / 3);
    this.time = periods * 15;
  }

  calcServings () {
    this.serving = 4;
  }

  parseIngredients () {
    const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitShorts = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitShorts, 'kg', 'g'];

    const newIngridients = this.ingredients.map(el => {
      let ingredient = el.toLowerCase();
      unitLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, units[i]);
      })

      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex( el2 => unitShorts.includes(el2));
      let objIng;
      if (unitIndex > -1) {
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          //eval is evil, just like example of work
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' '),
        }
      } else if (parseInt(arrIng[0], 10)) {
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' '),
        }
      } else if (unitIndex === -1) {
        objIng = {
          count: 1,
          unit: '',
          ingredient, 
        }
      }

      return objIng;
    });

    this.ingredients = newIngridients;
  }
}