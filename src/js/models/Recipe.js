import axios from 'axios';
import {
  key,
  proxy
} from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
      alert('Something went tits up :(')
    }
  }

  calcTime() {
    //assuming that we need 15 mins for every 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitsShort, 'kg','g'];

    const newIngredients = this.ingredients.map(el => {
      //1) Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      //2) Remove parentheses
      //the below is a regular expression statement. read up on those!
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      //3) Parse ingredients into count, unit and ingredient

      //test if there is a unit in the string
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
      //let and const are block scoped and have to be declared outside of the blocks if you want to reuse them. they can be mutated from within blocks

      let objIng;

      if (unitIndex > -1) {
        //There is a unit in the ingredient(array element)

        const arrCount = arrIng.slice(0, unitIndex);
        //example 4 1/2 cups, arrCount is [4, 1/2] --next bit -->eval ("4+1/2") ---> 4.5
        // 4 cups, arrCount is [4]

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        }

      } else if (parseInt(arrIng[0], 10)) {
        //There is NO unit but 1st element is a number
        objIng = {
          count: (parseInt(arrIng[0], 10)),
          unit: '',
          ingredient: arrIng.slice(1).join(' ') //ingredient:ingredient as of ES6
        }
      } else if (unitIndex === -1) {
        //There is no unit in the ingredient(array element) and no number in the first position
        objIng = {
          count: 1,
          unit: '',
          ingredient //ingredient:ingredient as of ES6
        }
      }

      return objIng; //map functions require a return keyword in order to fill the second array
    });
    this.ingredients = newIngredients
  }

  updateServings (type) {
    //servings
    const newServings = type === 'dec' ? this.servings -1 : this.servings + 1;


    //Ingredients
    this.ingredients.forEach(ing => {
      ing.count *= (newServings / this.servings) //ing.count = ing.count * (newServings / this.servings)

    });

    this.servings = newServings;
  }
}
