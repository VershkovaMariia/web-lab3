// js/render.js – формування розмітки (лише createElement, append і textContent, без innerHTML)
(function (App) {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const option = (text, value) => {
    const node = el("option", "", text);
    node.value = value;
    return node;
  };

  // Кнопка дії; дію читає делегований обробник із data-action
  const button = (action, label, item, modifier = "") => {
    const node = el("button", `btn ${modifier}`.trim(), label);
    node.type = "button";
    node.dataset.action = action;
    node.setAttribute("aria-label", `${label}: ${item.student}, ${item.discipline}`);
    return node;
  };

  // Один рядок журналу. Ідентифікатор – в data-id
  const createRecord = (item, editing) => {
    const row = el("li", item.checked ? "record record--checked" : "record");
    row.dataset.id = item.id;

    const check = el("input", "record__check");
    check.type = "checkbox";
    check.checked = item.checked;
    check.dataset.action = "toggle";
    check.setAttribute("aria-label", `Відмітити: ${item.student}, ${item.discipline}`);

    const main = el("div", "record__main");
    main.append(
      el("span", "record__student", item.student),
      el("span", "record__discipline", item.discipline)
    );

    const actions = el("div", "record__actions");
    row.append(check, main);

    if (editing) {
      const input = el("input", "field__input record__input");
      input.type = "number";
      input.min = "0";
      input.max = "100";
      input.step = "1";
      input.required = true;
      input.value = String(item.grade);
      input.setAttribute("aria-label", `Нова оцінка: ${item.student}`);
      actions.append(button("save", "Зберегти", item, "btn--primary"), button("cancel", "Скасувати", item));
      const error = el("p", "field__error record__error");
      error.setAttribute("aria-live", "polite");
      row.append(input, actions, error);
    } else {
      actions.append(button("edit", "Редагувати", item), button("delete", "Видалити", item, "btn--danger"));
      row.append(el("span", "record__grade", String(item.grade)), actions);
    }
    return row;
  };

  // Які записи показувати: sort – на копії масиву, потім filter за умовами
  const visible = ({ items, filters }) => {
    const query = filters.query.trim().toLowerCase();
    const sorters = {
      surname: (a, b) => a.student.localeCompare(b.student, "uk"),
      "grade-desc": (a, b) => b.grade - a.grade,
      "grade-asc": (a, b) => a.grade - b.grade,
    };
    return [...items]
      .sort(sorters[filters.sort] ?? sorters.surname)
      .filter((r) =>
        (filters.discipline === "all" || r.discipline === filters.discipline) &&
        (filters.status === "all" || (filters.status === "checked") === r.checked) &&
        r.student.toLowerCase().includes(query)
      );
  };

  // Список дисциплін для фільтра та підказок у формі
  const options = (state) => {
    const disciplines = [...new Set(state.items.map((r) => r.discipline))]
      .sort((a, b) => a.localeCompare(b, "uk"));
    const select = $("filter-discipline");
    select.replaceChildren(option("Усі дисципліни", "all"), ...disciplines.map((d) => option(d, d)));
    select.value = state.filters.discipline;
    $("disciplines").replaceChildren(...disciplines.map((d) => option("", d)));
  };

  const list = (state) => {
    const rows = visible(state);
    $("list").replaceChildren(...rows.map((item) => createRecord(item, item.id === state.editingId)));
    const empty = $("empty");
    empty.hidden = rows.length > 0;
    empty.textContent = state.items.length === 0
      ? "Записів ще немає. Додайте перший результат у формі вище."
      : "За вибраними умовами записів немає.";
    return rows;
  };

  // Підсумкові показники
  const summary = (state, rows) => {
    const sum = rows.reduce((acc, r) => acc + r.grade, 0);
    $("stat-total").textContent = state.items.length;
    $("stat-shown").textContent = rows.length;
    $("stat-checked").textContent = state.items.filter((r) => r.checked).length;
    $("stat-average").textContent = rows.length ? (sum / rows.length).toFixed(2) : "—";
  };

  const all = (state) => {
    options(state);
    summary(state, list(state));
  };

  App.render = { all, visible };
})(window.App = window.App || {});
