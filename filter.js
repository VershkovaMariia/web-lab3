// js/tasks/filter.js – власна реалізація Array.prototype.filter
(function () {
  "use strict";

  // Your custom Filter
  const filter = (arr, fn) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      if (fn(arr[i], i, arr)) {
        result.push(arr[i]);
      }
    }
    return result;
  };

  const arr = [1, 2, 3, 4, 5, 6];
  const isEven = (value) => value % 2 === 0;
  const snapshot = JSON.stringify(arr);

  const filter01 = arr.filter(isEven);
  const filter02 = filter(arr, isEven);

  console.assert(JSON.stringify(filter01) === JSON.stringify(filter02), "Filter01 does not match Filter02");
  console.assert(JSON.stringify(filter(arr, () => false)) === "[]", "No match must give empty array");
  const all = filter(arr, () => true);
  console.assert(JSON.stringify(all) === snapshot && all !== arr, "All match must give a copy, not the same array");
  console.assert(JSON.stringify(filter([], isEven)) === "[]", "Empty array must give empty array");
  console.assert(
    JSON.stringify(filter(arr, (_, i) => i < 2)) === JSON.stringify([1, 2]),
    "Index must be passed to the callback"
  );
  console.assert(JSON.stringify(arr) === snapshot, "Array should not be mutated");

  console.log("custom filter: перевірки завершено");
})();
