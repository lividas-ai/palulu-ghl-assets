(() => {
  "use strict";

  const filters = [...document.querySelectorAll("[data-shop-filter]")];
  const products = [...document.querySelectorAll("[data-shop-category]")];
  const empty = document.querySelector("[data-shop-empty]");

  function selectFilter(category) {
    let visible = 0;
    filters.forEach((button) => {
      const active = button.dataset.shopFilter === category;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    products.forEach((card) => {
      const show = category === "all" || card.dataset.shopCategory === category;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (empty) empty.hidden = visible !== 0;
  }

  document.addEventListener("click", (event) => {
    const filter = event.target.closest("[data-shop-filter]");
    if (!filter) return;
    selectFilter(filter.dataset.shopFilter);
  });

  const requested = new URLSearchParams(location.search).get("category");
  selectFilter(filters.some((button) => button.dataset.shopFilter === requested) ? requested : "all");
})();
