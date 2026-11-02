// js/tasks/deepClone.js – власна реалізація глибокого копіювання
(function () {
  "use strict";

  // Your custom deepClone: об'єкти, масиви, Date, Map, Set, циклічні посилання
  const deepClone = (value, seen = new WeakMap()) => {
    if (value === null || typeof value !== "object") return value;  // примітиви й функції – як є
    if (seen.has(value)) return seen.get(value);                    // цикл: повертаємо вже створену копію

    if (value instanceof Date) return new Date(value.getTime());

    if (value instanceof Map) {
      const copy = new Map();
      seen.set(value, copy);
      value.forEach((v, k) => copy.set(deepClone(k, seen), deepClone(v, seen)));
      return copy;
    }
    if (value instanceof Set) {
      const copy = new Set();
      seen.set(value, copy);
      value.forEach((v) => copy.add(deepClone(v, seen)));
      return copy;
    }

    const copy = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
    seen.set(value, copy);                                          // реєструємо ДО рекурсії
    for (const key of Object.keys(value)) {
      copy[key] = deepClone(value[key], seen);
    }
    return copy;
  };

  const source = {
    title: "Журнал",
    tags: ["a", "b"],
    nested: { level: { x: 1 } },
    list: [{ id: 1 }, { id: 2 }],
    created: new Date(2026, 0, 1),
    scores: new Map([["math", [90, 80]]]),
    missing: undefined,
  };
  const snapshot = JSON.stringify(source);

  const clone = deepClone(source);

  // 1. Збіг рядкових подань і різні посилання
  console.assert(JSON.stringify(clone) === JSON.stringify(source), "Clone does not match source");
  console.assert(clone !== source, "clone !== source");
  console.assert(clone.nested !== source.nested, "clone.nested !== source.nested");
  console.assert(clone.nested.level !== source.nested.level, "clone.nested.level !== source.nested.level");
  console.assert(clone.tags !== source.tags && clone.list[0] !== source.list[0], "Arrays/objects must be copied");

  // 2. Зміна копії не впливає на оригінал
  clone.nested.level.x = 99;
  clone.tags.push("c");
  clone.list[0].id = 100;
  console.assert(source.nested.level.x === 1, "Changing clone changed source (object)");
  console.assert(source.tags.length === 2, "Changing clone changed source (array)");
  console.assert(JSON.stringify(source) === snapshot, "Source should not be mutated");

  // 3. Значення, яких JSON.stringify не розрізняє: Date, Map, undefined
  console.assert(clone.created instanceof Date && clone.created !== source.created, "Date must be a new Date");
  console.assert(clone.created.getTime() === source.created.getTime(), "Date value must be equal");
  console.assert(clone.scores instanceof Map && clone.scores !== source.scores, "Map must be a new Map");
  console.assert(clone.scores.get("math") !== source.scores.get("math"), "Map values must be copied");
  console.assert(JSON.stringify(clone.scores.get("math")) === "[90,80]", "Map content must be equal");
  console.assert(Object.hasOwn(clone, "missing") && clone.missing === undefined, "undefined property must be kept");

  // Для порівняння: копія через JSON ці значення втрачає
  const viaJson = JSON.parse(JSON.stringify(source));
  console.assert(typeof viaJson.created === "string", "JSON turns Date into a string");
  console.assert(!("missing" in viaJson), "JSON drops undefined properties");

  // 4. Циклічне посилання
  const loop = { name: "loop" };
  loop.self = loop;
  const loopCopy = deepClone(loop);
  console.assert(loopCopy !== loop && loopCopy.name === "loop", "Cycle: must create a new object");
  console.assert(loopCopy.self === loopCopy, "Cycle: the copy must point to itself, not to the original");
  let jsonError = "no error";
  try { JSON.stringify(loop); } catch (error) { jsonError = error.name; }
  console.assert(jsonError === "TypeError", "JSON.stringify must fail on a cycle");

  // 5. Примітиви та порівняння зі structuredClone (якщо він є)
  console.assert(deepClone(5) === 5 && deepClone(null) === null && deepClone("s") === "s", "Primitives must stay as is");
  if (typeof structuredClone === "function") {
    const sc = structuredClone(source);
    console.assert(JSON.stringify(sc) === JSON.stringify(deepClone(source)), "Differs from structuredClone");
    console.assert(sc.created instanceof Date && sc.scores instanceof Map, "structuredClone keeps Date and Map");
  }

  console.log("custom deepClone: перевірки завершено");
})();
