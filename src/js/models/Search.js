import axios from 'axios'; //as it appears in the dependencies
import {key, proxy} from '../config';
export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {

  try {
      const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`) //axios works on all browsers unlike fetch
      this.result = res.data.recipes;
      //console.log(this.result);
  } catch (error) {
      alert(error);
    }

  }
}

;
