// js/tasks/map.js – власна реалізація Array.prototype.map
(function () {
  "use strict";

  // Your custom Map
  const map = (arr, fn) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      result.push(fn(arr[i], i, arr)); // як і вбудований: значення, індекс, масив
    }
    return result;
  };

  const arr = [1, 2, 3, 4];
  const double = (value) => value * 2;
  const snapshot = JSON.stringify(arr);

  const map01 = arr.map(double);   // вбудований map
  const map02 = map(arr, double);  // власна реалізація

  console.assert(JSON.stringify(map01) === JSON.stringify(map02), "Map01 does not match Map02");
  console.assert(map02.length === arr.length, "Result must have the same length");
  console.assert(map02 !== arr, "Result must be a new array");
  console.assert(JSON.stringify(map([], double)) === "[]", "Empty array must give empty array");
  console.assert(
    JSON.stringify(map(arr, (_, i) => i)) === JSON.stringify([0, 1, 2, 3]),
    "Index must be passed to the callback"
  );
  console.assert(JSON.stringify(arr) === snapshot, "Array should not be mutated");

  console.log("custom map: перевірки завершено");
})();
