// js/strict-off.js – НЕСТРОГИЙ режим: у файлі й у рядках new Function немає "use strict".
// Решта коду збігається зі js/strict-on.js.
(function () {
  const out = document.getElementById("out-off");
  const log = (line) => {
    console.log(line);
    out.append(line + "\n");
  };

  const check = (label, fn) => {
    try {
      log(`${label} → ${fn()}`);
    } catch (error) {
      log(`${label} → ${error.name}: ${error.message}`);
    }
  };

  // ---- помилки виконання ----
  check("неоголошена змінна", () => { undeclared = 1; return undeclared; });
  check("this у функції", function () { return String(this); });
  const frozen = Object.freeze({ a: 1 });
  check("запис у заморожений об’єкт", () => { frozen.a = 2; return frozen.a; });
  check("нова властивість у замороженому", () => { frozen.b = 2; return frozen.b; });
  check("delete неконфігурованої властивості", () => delete Object.prototype);

  // ---- ті самі конструкції, що в строгому режимі дають SyntaxError ----
  check("інструкція with", () => new Function("with (Math) return PI;")());
  check("літерал 010", () => new Function("return 010;")());
  check("однакові параметри", () => new Function("a", "a", "return a;")(1, 2));
})();
