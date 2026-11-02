// js/strict-on.js – СТРОГИЙ режим (директива всередині IIFE).
// js/strict-off.js містить той самий код без директиви.
(function () {
  "use strict";

  const out = document.getElementById("out-on");
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

  // ---- помилки розбору: рядок компілюється під час виконання, тож виняток можна перехопити ----
  check("інструкція with", () => new Function('"use strict"; with (Math) return PI;')());
  check("літерал 010", () => new Function('"use strict"; return 010;')());
  check("однакові параметри", () => new Function("a", "a", '"use strict"; return a;')(1, 2));
})();
