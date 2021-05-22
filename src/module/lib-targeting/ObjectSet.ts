import { TokenTarget } from "./TokenTarget";

/**
 * Set of objects.  Requires a .toString() overload to distinguish objects.
 * Credit: https://stackoverflow.com/users/177222/ashleysbrain
 * taken from https://stackoverflow.com/questions/5657219/set-of-objects-in-javascript
 */
export class ObjectSet {

//   items = {};
  items:TokenTarget[];
  item_count = 0;

  constructor() {
      this.items = [];
      this.item_count = 0;
  }

  contains(x) {
      return this.items.hasOwnProperty(x.toString());
  }

  add(x) {
      if (!this.contains(x)) {
          this.items[x.toString()] = x;
          this.item_count++;
      }

      return this;
  }

  delete(x) {
      if (this.contains(x)) {
          delete this.items[x.toString()];
          this.item_count--;
      }

      return this;
  }

  clear() {
      this.items = [];
      this.item_count = 0;

      return this;
  }

  isEmpty() {
      return this.item_count === 0;
  }

  count() {
      return this.item_count;
  }

  values() {
      var i, ret:TokenTarget[] = [];

      for (i in this.items) {
          if (this.items.hasOwnProperty(i))
              ret.push(this.items[i]);
      }

      return ret;
  }
}
