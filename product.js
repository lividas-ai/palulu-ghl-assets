(() => {
  "use strict";

  const extras = {
    "redone-clay": { kicker: "REDONE · MATTE", finish: ["Matinis", "Matte"], hold: ["Stipri, lanksti", "Strong, workable"], best: ["Trumpiems ir vidutiniams plaukams", "Short to medium hair"] },
    "redone-blue": { kicker: "REDONE · SHINE", finish: ["Ryškus blizgesys", "High shine"], hold: ["Maksimali", "Maximum"], best: ["Glotnioms ir apibrėžtoms formoms", "Sleek, defined styles"] },
    "redone-powder": { kicker: "REDONE · VOLUME", finish: ["Matinis", "Matte"], hold: ["Stipri", "Strong"], best: ["Apimčiai, ypač ploniems plaukams", "Volume, especially fine hair"] },
    "redone-forming": { kicker: "REDONE · FLEX", finish: ["Natūraliai matinis", "Natural matte"], hold: ["Lanksti vidutinė", "Flexible medium"], best: ["Netvarkingoms ar garbanotoms formoms", "Messy or curly styles"] },
    "redone-keratin": { kicker: "REDONE · MATTE", finish: ["Matinis", "Matte"], hold: ["Stipri ilgalaikė", "Strong, long-lasting"], best: ["Moderniai tekstūrai", "Modern textured styles"] },
    "redone-spray": { kicker: "REDONE · FINISH", finish: ["Žvilgesys", "Shine"], hold: ["Itin stipri", "Ultra strong"], best: ["Baigiamajai kontrolei ir apimčiai", "Finishing control and volume"] },
    "redone-gel": { kicker: "REDONE · DEFINE", finish: ["Ryškus blizgesys", "High shine"], hold: ["Ilgalaikė", "Long-lasting"], best: ["Tikslioms formoms ir nepaklusniems plaukams", "Defined styles and flyaways"] },
    "redone-beard": { kicker: "REDONE · BEARD", finish: ["Švelnus žvilgesys", "Soft sheen"], hold: ["Be fiksacijos", "No hold"], best: ["Barzdai ir odai minkštinti", "Softening beard and skin"] },
  };

  const params = new URLSearchParams(location.search);
  const id = params.get("id") || "redone-clay";
  const product = (window.PaluluCatalog || []).find((item) => item.id === id) || (window.PaluluCatalog || []).find((item) => item.id === "redone-clay");
  if (!product) return;
  const meta = extras[product.id] || extras["redone-clay"];
  const languageIndex = () => document.documentElement.lang === "en" ? 1 : 0;
  const money = (value) => `${Number(value).toFixed(Number.isInteger(value) ? 0 : 2).replace(".", ",")} €`;

  const setBilingual = (selector, lt, en) => {
    const node = document.querySelector(selector);
    if (!node) return;
    node.dataset.lt = lt; node.dataset.en = en;
    node.textContent = document.documentElement.lang === "en" ? en : lt;
  };

  document.title = `Palulu Care — ${product.en}`;
  document.querySelector("[data-product-shot]").className = `product-shot ${product.shot}`;
  document.querySelectorAll("[data-buy-button]").forEach((button) => { button.dataset.product = product.id; });
  document.querySelector("[data-product-kicker]").textContent = meta.kicker;
  document.querySelector("[data-product-name]").textContent = product.en;
  setBilingual("[data-product-copy]", product.ltCopy, product.enCopy);
  setBilingual("[data-product-finish]", meta.finish[0], meta.finish[1]);
  setBilingual("[data-product-hold]", meta.hold[0], meta.hold[1]);
  setBilingual("[data-product-best]", meta.best[0], meta.best[1]);
  setBilingual("[data-guide-finish]", meta.finish[0], meta.finish[1]);
  setBilingual("[data-guide-hold]", meta.hold[0], meta.hold[1]);
  setBilingual("[data-guide-best]", meta.best[0], meta.best[1]);
  document.querySelector("[data-product-price]").textContent = money(product.price);
  document.querySelector("[data-once-price]").textContent = money(product.price);
  document.querySelector("[data-repeat-price]").textContent = money(product.price * .9);

  const related = (window.PaluluCatalog || [])
    .filter((item) => item.id.startsWith("redone-") && item.id !== product.id)
    .sort((a, b) => Number(b.tag !== product.tag) - Number(a.tag !== product.tag))
    .slice(0, 3);
  const relatedGrid = document.querySelector("[data-related-products]");
  if (relatedGrid) relatedGrid.innerHTML = related.map((item) => {
    const itemMeta = extras[item.id] || extras["redone-clay"];
    return `<article class="editorial-card"><small>${itemMeta.kicker.replace("REDONE · ", "")}</small><h3>${item.en}</h3><p data-lt="${item.ltCopy}" data-en="${item.enCopy}">${document.documentElement.lang === "en" ? item.enCopy : item.ltCopy}</p><a class="card-link" href="/produktas?id=${encodeURIComponent(item.id)}" data-lt="Peržiūrėti ↗" data-en="View product ↗">${document.documentElement.lang === "en" ? "View product ↗" : "Peržiūrėti ↗"}</a></article>`;
  }).join("");

  const radios = [...document.querySelectorAll('input[name="purchase"]')];
  const cadence = document.querySelector("[data-cadence]");
  const select = document.querySelector("[data-cadence-select]");
  const next = document.querySelector("[data-next-order]");
  const buy = document.querySelector("[data-buy-button]");

  function nextDate(weeks) {
    const date = new Date(); date.setDate(date.getDate() + Number(weeks) * 7);
    return {
      lt: new Intl.DateTimeFormat("lt-LT", { day: "numeric", month: "long", year: "numeric" }).format(date),
      en: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date),
    };
  }

  function renderPurchase() {
    const repeat = radios.find((radio) => radio.checked)?.value === "repeat";
    cadence.hidden = !repeat;
    next.hidden = !repeat;
    buy.classList.toggle("js-add", !repeat);
    buy.classList.toggle("js-subscribe-product", repeat);
    buy.dataset.interval = select.value;
    buy.dataset.product = product.id;
    const dates = nextDate(select.value);
    next.dataset.lt = `Kitas užsakymas: ${dates.lt}. Priminsime likus 3 dienoms.`;
    next.dataset.en = `Next order: ${dates.en}. We’ll remind you 3 days before.`;
    next.textContent = next.dataset[document.documentElement.lang === "en" ? "en" : "lt"];
    buy.dataset.lt = repeat ? `Prenumeruoti · ${money(product.price * .9)}` : `Pridėti į krepšelį · ${money(product.price)}`;
    buy.dataset.en = repeat ? `Subscribe · ${money(product.price * .9)}` : `Add to bag · ${money(product.price)}`;
    buy.textContent = buy.dataset[document.documentElement.lang === "en" ? "en" : "lt"];
  }

  radios.forEach((radio) => radio.addEventListener("change", renderPurchase));
  select.addEventListener("change", renderPurchase);
  document.addEventListener("click", (event) => { if (event.target.closest(".js-locale")) setTimeout(renderPurchase); });
  renderPurchase();
})();
