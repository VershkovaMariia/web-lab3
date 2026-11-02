// js/main.js – точка входу; підключається останнім, коли всі частини App уже створено
(function (App) {
  "use strict";

  const state = {
    items: App.storage.load(),
    filters: { query: "", discipline: "all", status: "all", sort: "surname" },
    editingId: null,
  };

  App.render.all(state);
  App.events.bind(state);
})(window.App);
