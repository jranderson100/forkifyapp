import uniqid from 'uniqid';

export default class List {
  constructor() {
    this.items = [];
  }
  addItem(count, unit, ingredient) {
    const item = {
      //count = count; etc
      id: uniqid(),
      count,
      unit,
      ingredient
    }
    this.items.push(item);
    return item;
  }

  deleteItem(id){
    const index = this.items.findIndex(el => el.id === id);
    //pass in start index and how many index you want to remove
    //splice
    //slice returns a new array, doesnt mutate the original array

    //[2, 4, 8] splice(1, 1); -> return 4, original array is mutated to [2, 8]
    //[2, 4, 8] slice(1, 1); -> return 4, original array is mutated to [2, 4, 8]

    this.items.splice(index, 1);
  }

  updateCount(id, newCount) {
    this.items.find(el => el.id === id).count = newCount;
  }

}
