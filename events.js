// js/events.js – обробники подій, валідація форми, debounce
(function (App) {
  "use strict";

  const $ = (id) => document.getElementById(id);

  // debounce: обробник виконується лише після паузи в викликах
  const debounce = (fn, delay) => {
    let timerId;                                       // спільна для всіх викликів обгортки
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => fn(...args), delay);
    };
  };

  const newId = () =>
    crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  const normalize = (text) => text.trim().replace(/\s+/g, " ");

  //валідація (validity + setCustomValidity) 
  const describe = (field) => {
    const { validity } = field;
    if (validity.valueMissing) return "Поле обов’язкове для заповнення";
    if (validity.badInput) return "Введіть число";
    if (validity.tooShort) return `Мінімум символів: ${field.minLength}`;
    if (validity.patternMismatch) return "Дозволені літери, пробіл, апостроф і дефіс";
    if (validity.rangeUnderflow) return `Оцінка не менша за ${field.min}`;
    if (validity.rangeOverflow) return `Оцінка не більша за ${field.max}`;
    if (validity.stepMismatch) return "Оцінка має бути цілим числом";
    return "";
  };

  // Перевіряє одне поле, показує повідомлення поруч і ставить aria-invalid. true – поле коректне
  const check = (field, errorNode) => {
    field.setCustomValidity("");                       // скидаємо попереднє власне повідомлення
    let message = describe(field);
    if (!message && field.type === "text" && field.value.trim().length < field.minLength) {
      message = `Мінімум символів: ${field.minLength}`; // рядок із самих пробілів
    }
    field.setCustomValidity(message);
    errorNode.textContent = message;
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
    return message === "";
  };

  const errorFor = (field) => $(`error-${field.name}`);

  //зміни стану
  const commit = (state) => {
    const { filters, items } = state;
    if (filters.discipline !== "all" && !items.some((r) => r.discipline === filters.discipline)) {
      filters.discipline = "all";                      // обраної дисципліни більше немає
    }
    App.storage.save(items);                           // запис після кожної зміни
    App.render.all(state);
  };

  const onSubmit = (state) => (event) => {
    event.preventDefault();                            // сторінка не перезавантажується
    const form = event.currentTarget;
    const fields = ["student", "discipline", "grade"].map((name) => form.elements[name]);
    const results = fields.map((f) => check(f, errorFor(f))); // перевіряємо всі поля одразу
    const firstInvalid = fields.find((_, i) => !results[i]);
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    const [student, discipline, grade] = fields;
    state.items.push({
      id: newId(),
      student: normalize(student.value),
      discipline: normalize(discipline.value),
      grade: Number(grade.value),
      checked: false,
    });
    commit(state);
    form.reset();
    student.focus();
  };

  // делегування: один обробник click на контейнері списку 
  const onListClick = (state) => (event) => {
    const control = event.target.closest("[data-action]");
    if (!control) return;
    const row = control.closest(".record");
    if (!row) return;
    const item = state.items.find((r) => r.id === row.dataset.id);
    if (!item) return;

    if (control.matches('[data-action="toggle"]')) {
      item.checked = control.checked;
      commit(state);
      document.querySelector(`.record[data-id="${item.id}"] .record__check`)?.focus();
    } else if (control.matches('[data-action="delete"]')) {
      state.items = state.items.filter((r) => r.id !== item.id);
      if (state.editingId === item.id) state.editingId = null;
      commit(state);
    } else if (control.matches('[data-action="edit"]')) {
      state.editingId = item.id;
      App.render.all(state);
      document.querySelector(".record__input")?.focus();
    } else if (control.matches('[data-action="cancel"]')) {
      state.editingId = null;
      App.render.all(state);
    } else if (control.matches('[data-action="save"]')) {
      const input = row.querySelector(".record__input");
      if (!check(input, row.querySelector(".record__error"))) {
        input.focus();
        return;
      }
      item.grade = Number(input.value);
      state.editingId = null;
      commit(state);
    }
  };

  //підключення
  const bind = (state) => {
    const form = $("add-form");
    form.addEventListener("submit", onSubmit(state));
    form.addEventListener("input", (event) => {        // повторна перевірка під час виправлення
      if (event.target.matches('[aria-invalid="true"]')) check(event.target, errorFor(event.target));
    });

    $("list").addEventListener("click", onListClick(state));

    // селекти фільтрів і сортування – один обробник на панелі (атрибут data-filter)
    $("toolbar").addEventListener("change", (event) => {
      if (!event.target.matches("select[data-filter]")) return;
      state.filters[event.target.dataset.filter] = event.target.value;
      state.editingId = null;
      App.render.all(state);
    });

    // пошук: debounce 300 мс
    $("search").addEventListener("input", debounce((event) => {
      state.filters.query = event.target.value;
      state.editingId = null;
      App.render.all(state);
    }, 300));

    $("clear").addEventListener("click", () => {
      if (!confirm("Видалити всі записи й очистити сховище?")) return;
      App.storage.clear();
      state.items = [];
      state.editingId = null;
      state.filters.discipline = "all";
      App.render.all(state);
    });
  };

  App.events = { bind, debounce };
})(window.App = window.App || {});
