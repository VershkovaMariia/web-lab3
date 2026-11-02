// js/tasks/reduce.js – власна реалізація Array.prototype.reduce
(function () {
  "use strict";

  // Your custom Reduce (початкове значення необов'язкове, як у вбудованого методу)
  const reduce = (arr, fn, ...rest) => {
    let i = 0;
    let accumulator;
    if (rest.length > 0) {
      accumulator = rest[0];                 // початкове значення передано (навіть undefined)
    } else {
      if (arr.length === 0) {
        throw new TypeError("Reduce of empty array with no initial value");
      }
      accumulator = arr[0];                  // без початкового значення беремо перший елемент
      i = 1;
    }
    for (; i < arr.length; i++) {
      accumulator = fn(accumulator, arr[i], i, arr);
    }
    return accumulator;
  };

  const errorName = (action) => {
    try { action(); return "no error"; } catch (error) { return error.name; }
  };

  const arr = [1, 2, 3, 4];
  const sum = (accumulator, val) => accumulator + val;
  const snapshot = JSON.stringify(arr);

  const sum01 = arr.reduce(sum, 0);       // вбудований reduce
  const sum02 = reduce(arr, sum, 0);      // власна реалізація

  console.assert(sum01 === sum02, "Sum01 does not match Sum02");
  console.assert(arr.reduce(sum) === reduce(arr, sum), "Without initial value does not match");
  console.assert(reduce([], sum, 100) === [].reduce(sum, 100), "Empty array must return the initial value");
  console.assert(
    errorName(() => reduce([], sum)) === "TypeError" && errorName(() => [].reduce(sum)) === "TypeError",
    "Empty array without initial value must throw TypeError"
  );

  let calls = 0;
  const single = reduce([42], (accumulator, val) => { calls++; return accumulator + val; });
  console.assert(single === 42 && calls === 0, "One element without initial value: callback is not called");

  const words = ["a", "b", "a"];
  const count = (acc, w) => ({ ...acc, [w]: (acc[w] ?? 0) + 1 });
  console.assert(
    JSON.stringify(reduce(words, count, {})) === JSON.stringify(words.reduce(count, {})),
    "Object accumulator does not match"
  );
  console.assert(JSON.stringify(arr) === snapshot, "Array should not be mutated");

  console.log("custom reduce: перевірки завершено");
})();
