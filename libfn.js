const fn = (function() {
  'use strict';

  return {

    /**
     * Initialize an array of increasing values
     *
     * @param {Number} start (Optional) - Initial value. Default 0.
     * @param {Number} end - End value, plus 1.
     * @param {Function(Number)} map (Optional)
     *          Mapping function returning values to populate the array
     */
    arange (...args) {
      let start;
      let end;
      let fn;

      // Process arguments
      if (typeof(args[1]) === 'number') {
        start = args.shift();
        end = args.shift();
      } else {
        start = 0;
        end = args.shift();
      }

      if (typeof(args[0]) === 'function') {
        fn = args.shift();
      }

      // Value to return
      const ret = new Array(end - start);

      if (fn === undefined) {
        for (let i = 0, val = start; val < end; i++, val++) {
          ret[i] = val;
        }
      }
      else {
        for (let i = 0, val = start; val < end; i++, val++) {
          ret[i] = fn(val, i);
        }
      }

      return ret;
    },

    /**
     * Determines whether all elements of an iterable satisfy a condition
     * @param {Iterable|Arraylike} iterable
     * @param {Function} fn (Optional) - Test function. Defaults to boolean cast.
     */
    all (iterable, fn) {
      if (fn) {
        for (let i of this.iterator(iterable)) {
          if (!fn(i)) {
            return false;
          }
        }
        return true;
      }
      else {
        for (let i of this.iterator(iterable)) {
          if (!i) {
            return false;
          }
        }
        return true;
      }
    },

    /**
     * Determines whether any elements of an iterable satisfy a condition
     * @param {Iterable|Arraylike} iterable
     * @param {Function} fn (Optional) - Test function. Defaults to boolean cast.
     */
    any (iterable, fn) {
      if (fn) {
        for (let i of this.iterator(iterable)) {
          if (fn(i)) {
            return true;
          }
        }
        return false;
      }
      else {
        for (let i of this.iterator(iterable)) {
          if (i) {
            return true;
          }
        }
        return false;
      }
    },

    * concat (...iterables) {
      for (let iterable of iterables) {
        for (let item of iterable) {
          yield item;
        }
      }
    },

    first (iterable) {
      // Iterator protocol
      if (Symbol.iterator in iterable) {
        // It is not a bug that this for loop returns immediately.
        // It's a lazy way to get the first element of the iterator
        //noinspection LoopStatementThatDoesntLoopJS
        for (let x of iterable) {
          return Optional.of(x);
        }
        return Optional.ofNull();
      }
      // Array-like objects
      else if (0 in iterable) {
        return Optional.of(iterable[0]);
      }
      else {
        throw new TypeError(`Object ${iterable} is not iterable`);
      }
    },

    /**
     * Ensure an object is iterable.
     * Some objects are "array-like" in that they have numerical keys and a
     * "length" property, but they lack the Array methods.
     * @param {Iterable|Arraylike} iterable
     */
    iterator (iterable) {
      if (Symbol.iterator in iterable) {
        return iterable;
      } else if ('length' in iterable) {
        return (function *() {
          for (let i = 0; i < iterable.length; i++) {
            yield iterable[i];
          }
        })();
      } else {
        throw new TypeError(`${iterable} is not iterable`);
      }
    },

    /**
     * Locate an item in an array or other iterable
     * @param {Iterable|Arraylike} iterable
     * @param {anything} item
     * @param {Function(anything) -> Boolean>} fn
     *            (Optional) - Equality function to override the === operator.
     * @return {Integer|Boolean} The item's index, or false if not present
     */
    indexOf (iterable, item, fn) {
      // User-provided equality test
      if (fn !== undefined) {
        let i = 0;
        for (let x of this.iterator(iterable)) {
          if (fn(item)) {
            return i;
          } else {
            i++;
          }
        }
        return false;
      }
      // NaN's cannot be compared with the equality operator
      else if (isNaN(item)) {
        let i = 0;
        for (let x of this.iterator(iterable)) {
          if (isNaN(item)) {
            return i;
          } else {
            i++;
          }
        }
        return false;
      }
      // Use native array implementation if possible
      else if ('indexOf' in iterable) {
        const index = iterable.indexOf(item);
        if (index < 0) {
          return false;
        } else {
          return index;
        }
      }
      // Fallback to direct item equality test
      else {
        let i = 0;
        for (let x of this.iterator(iterable)) {
          if (item === x) {
            return i;
          }
          else {
            i++;
          }
        }
        return false;
      }
    },

    * imap (iterable, mapFn) {
      let i = 0;
      for (let x of this.iterator(iterable)) {
        yield mapFn(x, i, iterable);
        i++;
      }
    },

    /**
     * Create an iterator that continuously increases in value.
     * Parameters are identical to arange(), but instead of returning an array,
     * a generator is returned instead.
     */
    * irange (...args) {
      let start;
      let end;
      let fn;

      if (typeof(args[1]) === 'number') {
        start = args.shift();
        end = args.shift();
      } else {
        start = 0;
        end = args.shift();
      }

      if (typeof(args[0]) === 'function') {
        fn = args.shift();
      }

      if (fn === undefined) {
        for (let i = 0, val = start; val < end; i++, val++) {
          yield val;
        }
      }
      else {
        for (let i = 0, val = start; val < end; i++, val++) {
          yield fn(val, i);
        }
      }
    },

    * ifilter (iterable, filterFn) {
      let i = 0;
      for (let x of this.iterable(iterable)) {
        if (filterFn(x, i)) {
          yield x;
        }
        i++;
      }
      else {
        throw new TypeError(`Object ${iterable} is not iterable`);
      }
    },

    forEach (iterable, fn) {
      //noinspection JSUnusedLocalSymbols
      for (let unused of this.map(iterable, fn)) {
        // no op
      }
    },

    /**
     * Climb an object's prototype chain, starting with the object's direct
     * prototype.
     */
    * getPrototypes (object) {
      for (let prototype = Object.getPrototypeOf(object);
           prototype !== null;
           prototype = Object.getPrototypeOf(prototype)) {
        yield prototype;
      }
    },

    last (iterable) {
      // Arrays and array-like objects
      if ('length' in iterable) {
        return Optional.ofNullable(iterable[iterable.length - 1]);
      }
      // Generators and custom iterators
      else if (Symbol.iterator in iterable) {
        let x;
        for (x of iterable) {}
        return Optional.ofNullable(x);
      }
      else {
        throw new TypeError(`Object ${iterable} is not iterable`);
      }
    },

    /**
     * Sort a set of items from `iterable` into buckets based on a key returned
     * by mapping function `keyFn`
     *
     * @param iterable (Iterable)            The items to sort
     * @param keyFn (Function<item> -> key)  A mapping function returning which
     *                                       bucket to place the item into
     * @return (Map<key, Array<item>>)       The sorted elements
     */
    partition (iterable, keyFn) {
      const ret = new Map();
      for (let x of iterable) {
        const key = keyFn(x);
        if (ret.has(key)) {
          ret.get(key).push(x);
        }
        else {
          ret.set(key, [x]);
        }
      }
      return ret;
    },


    /**
     * Equivalence comparison for sets
     */
    setsAreEqual (set1, set2) {
      // Same reference (trivial)
      if (set1 === set2) {
        return true;
      }

      // Same size and same items
      else if (set1.size === set2.size) {
        for (let item of set1) {
          if (!set2.has(item)) {
            return false;
          }
        }
        return true;
      }
      else {
        return false;
      }
    },

    /**
     * Combine multiple iterables, yielding an array for each value
     */
    * zip (...iterables) {
      const iterators = iterables.map(iterable => iterable[Symbol.iterator]());

      //noinspection JSUnresolvedVariable (IteratorItem::done)
      for (let iterations = iterators.map(itr => itr.next());
           !this.all(iterations, iteration => iteration.done);
           iterations = iterators.map(itr => itr.next())) {
        yield iterations.map(iteration => iteration.value);
      }
    }

  };
})();

if (typeof(module) === 'object') {
  module.exports = fn;
}
