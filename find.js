// js/tasks/find.js – власна реалізація Array.prototype.find
(function () {
  "use strict";

  // Your custom Find
  const find = (arr, fn) => {
    for (let i = 0; i < arr.length; i++) {
      if (fn(arr[i], i, arr)) {
        return arr[i];          // перший збіг – і одразу виходимо
      }
    }
    return undefined;           // збігу немає
  };

  const users = [
    { id: 1, name: "Іван" },
    { id: 2, name: "Олена" },
    { id: 3, name: "Олена" },
  ];
  const isOlena = (user) => user.name === "Олена";
  const snapshot = JSON.stringify(users);

  const find01 = users.find(isOlena);
  const find02 = find(users, isOlena);

  console.assert(find01 === find02, "Find01 does not match Find02");
  console.assert(find02.id === 2, "Must return the FIRST matching element");
  console.assert(find02 === users[1], "Must return the element itself, not a copy");
  console.assert(find(users, (u) => u.id === 99) === undefined, "No match must give undefined");
  console.assert(users.find((u) => u.id === 99) === find(users, (u) => u.id === 99), "No match differs from built-in");
  console.assert(find([], isOlena) === undefined, "Empty array must give undefined");
  console.assert(JSON.stringify(users) === snapshot, "Array should not be mutated");

  console.log("custom find: перевірки завершено");
})();
