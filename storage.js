// js/storage.js – робота з localStorage
(function (App) {
  "use strict";

  const KEY = "grades-journal";                      // приватна константа файлу

  // Запис має потрібну форму - Пошкоджені елементи відкидаються
  const isRecord = (r) =>
    r !== null && typeof r === "object" &&
    typeof r.id === "string" &&
    typeof r.student === "string" &&
    typeof r.discipline === "string" &&
    Number.isFinite(r.grade) &&
    typeof r.checked === "boolean";

  const load = () => {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      return Array.isArray(data) ? data.filter(isRecord) : [];
    } catch {
      return [];                                     // у сховищі пошкоджений JSON
    }
  };

  const save = (items) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (error) {
      console.warn("Не вдалося зберегти дані:", error.name);
    }
  };

  const clear = () => {
    try {
      localStorage.removeItem(KEY);
    } catch (error) {
      console.warn("Не вдалося очистити сховище:", error.name);
    }
  };

  App.storage = { load, save, clear };               // явний експорт у простір імен
})(window.App = window.App || {});
