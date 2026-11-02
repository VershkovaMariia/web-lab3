// js/tasks/flat.js – власна реалізація Array.prototype.flat(depth)
(function () {
  "use strict";

  // Your custom Flat (за замовчуванням глибина 1, як і у вбудованого)
  const flat = (arr, depth = 1) => {
    const result = [];
    for (const item of arr) {
      if (Array.isArray(item) && depth > 0) {
        result.push(...flat(item, depth - 1));   // рекурсія на рівень глибше
      } else {
        result.push(item);
      }
    }
    return result;
  };

  const inner = [3, [4]];
  const nested = [1, [2, inner], [5]];
  const snapshot = JSON.stringify(nested);
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  console.assert(same(nested.flat(), flat(nested)), "Default depth does not match");
  console.assert(same(nested.flat(1), flat(nested, 1)), "Depth 1 does not match");
  console.assert(same(nested.flat(2), flat(nested, 2)), "Depth 2 does not match");
  console.assert(same(nested.flat(Infinity), flat(nested, Infinity)), "Depth Infinity does not match");
  console.assert(same(flat(nested, 0), nested) && flat(nested, 0) !== nested, "Depth 0 must give a shallow copy");
  console.assert(same(flat([]), []), "Empty array must give empty array");
  console.assert(same(flat([1, 2, 3]), [1, 2, 3]), "Flat array must stay the same");
  console.assert(nested[1][1] === inner, "Nested arrays must not be replaced");
  console.assert(JSON.stringify(nested) === snapshot, "Structure should not be mutated");

  console.log("custom flat: перевірки завершено");
})();
