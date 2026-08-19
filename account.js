(() => {
  "use strict";

  const CLUB_KEY = "palulu-club-v1";
  const ENGINE_KEY = "palulu-premium-v1";
  const dashboard = document.querySelector("[data-account-dashboard]");
  const status = document.querySelector("[data-account-status]");
  const dialog = document.querySelector("#accountDialog");
  const dialogBody = document.querySelector("[data-account-dialog-body]");
  const names = { cut: ["Tikslus kirpimas", "Precision Cut"], ritual: ["Pilnas ritualas", "Full Ritual"], sharp: ["Visada tvarkingas", "Always Sharp"] };
  const clubServices = { cut: "cut", ritual: "cut-beard", sharp: "cut" };
  let pending = null;

  const langIndex = () => document.documentElement.lang === "en" ? 1 : 0;
  const t = (lt, en) => langIndex() ? en : lt;
  const read = (key) => { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const date = (value) => {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "—";
    return new Intl.DateTimeFormat(langIndex() ? "en-GB" : "lt-LT", { day: "numeric", month: "long", year: "numeric" }).format(parsed);
  };
  const isoAfterWeeks = (weeks, from = new Date()) => { const d = new Date(from); d.setDate(d.getDate() + Number(weeks) * 7); return d.toISOString().slice(0, 10); };
  const nextCalendarMonth = () => {
    const d = new Date(); const day = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() + 1);
    d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
    return d.toISOString().slice(0, 10);
  };
  const productName = (item) => item[langIndex() ? "en" : "lt"] || item.name || item.id;
  const money = (value) => `${Number(value).toFixed(2).replace(".", ",")} €`;
  const esc = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" })[char]);

  function stateLabel(value) {
    const labels = {
      active: ["Aktyvi", "Active"],
      paused: ["Pristabdyta", "Paused"],
      skipped: ["Kitas užsakymas praleistas", "Next order skipped"],
      cancelled: ["Atšaukta", "Cancelled"],
      unknown: ["Nežinoma būsena", "Unknown state"],
    };
    return (labels[value] || labels.unknown)[langIndex()];
  }

  function clubTiming(club) {
    if (club.status === "active") return `${t("Kitas ciklas", "Next cycle")}: <b>${date(club.renewalDate)}</b>`;
    if (club.status === "paused") return `${t("Kitas ciklas", "Next cycle")}: <b>${t("pristabdytas iki atnaujinimo", "paused until resumed")}</b>`;
    if (club.status === "cancelled") return `${t("Atšaukimo data", "Access ends")}: <b>${date(club.accessUntil || club.renewalDate)}</b><br>${t("Naujas ciklas", "New cycle")}: <b>${t("neplanuojamas", "not scheduled")}</b>`;
    return `${t("Būsena", "State")}: <b>${t("reikia peržiūrėti", "needs review")}</b>`;
  }

  function clubActions(club) {
    const book = `<button class="js-book" data-service="${clubServices[club.planId] || "cut"}">${t("Rezervuoti įskaitytą vizitą", "Book included visit")}</button>`;
    if (club.status === "active") return `${book}<button data-club-action="pause">${t("Pristabdyti", "Pause")}</button><button data-club-action="cancel">${t("Atšaukti atnaujinimą", "Cancel renewal")}</button>`;
    if (club.status === "paused") return `<button data-club-action="resume">${t("Atnaujinti", "Resume")}</button><button data-club-action="cancel">${t("Atšaukti atnaujinimą", "Cancel renewal")}</button>`;
    if (club.status === "cancelled") return `<a class="link-button" href="/home">${t("Grįžti į pradžią", "Back to home")}</a>`;
    return "";
  }

  function repeatTiming(item) {
    if (item.status === "active" || item.status === "skipped") return `${t("Kitas užsakymas", "Next order")}: <b>${date(item.nextOrderDate)}</b>`;
    if (item.status === "paused") return `${t("Kitas užsakymas", "Next order")}: <b>${t("pristabdytas iki atnaujinimo", "paused until resumed")}</b>`;
    if (item.status === "cancelled") return `${t("Kitas užsakymas", "Next order")}: <b>${t("neplanuojamas", "not scheduled")}</b>`;
    return `${t("Kitas užsakymas", "Next order")}: <b>${t("būsena nežinoma", "state unknown")}</b>`;
  }

  function repeatActions(item, index) {
    if (item.status === "active") return `<button data-repeat-action="pause" data-index="${index}">${t("Pristabdyti", "Pause")}</button><button data-repeat-action="skip" data-index="${index}">${t("Praleisti kitą", "Skip next")}</button><button data-repeat-action="cadence" data-index="${index}">${t("Keisti dažnį", "Change cadence")}</button><button data-repeat-action="cancel" data-index="${index}">${t("Atšaukti", "Cancel")}</button>`;
    if (item.status === "paused") return `<button data-repeat-action="resume" data-index="${index}">${t("Atnaujinti", "Resume")}</button><button data-repeat-action="cancel" data-index="${index}">${t("Atšaukti", "Cancel")}</button>`;
    if (item.status === "skipped") return `<button data-repeat-action="resume" data-index="${index}">${t("Tęsti grafiką", "Continue schedule")}</button><button data-repeat-action="cadence" data-index="${index}">${t("Keisti dažnį", "Change cadence")}</button><button data-repeat-action="cancel" data-index="${index}">${t("Atšaukti", "Cancel")}</button>`;
    if (item.status === "cancelled") return `<a class="link-button" href="/product?id=${encodeURIComponent(item.productId || "redone-clay")}">${t("Sukurti naują papildymą", "Start a new replenishment")}</a>`;
    return "";
  }

  function fulfilment(item) {
    if (item.fulfilment === "delivery") return `${t("Pristatymas", "Delivery")}${item.address ? ` · ${esc(item.address)}` : ""}`;
    if (item.fulfilment === "pickup") return t("Atsiėmimas salone", "Collection in store");
    return t("Gavimo būdas nepasirinktas", "Fulfilment not selected");
  }

  function render() {
    const club = read(CLUB_KEY);
    const engine = read(ENGINE_KEY) || {};
    const replenishments = Array.isArray(engine.replenishments) ? engine.replenishments : [];
    const blocks = [];

    if (club) {
      blocks.push(`<article class="account-card"><span class="status-pill">${stateLabel(club.status)}</span><h3>${names[club.planId]?.[langIndex()] || "Palulu Club"}</h3><p>${clubTiming(club)}<br>${t("Turimi kreditai", "Available credits")}: <b>${club.availableCredits ?? 0}</b><br>${t("Meistras", "Barber")}: <b>${club.preferredBarber === "any" ? t("Bet kuris", "Any") : club.preferredBarber}</b></p><div class="account-actions">${clubActions(club)}</div></article>`);
    }

    if (replenishments.length) {
      replenishments.forEach((item, index) => blocks.push(`<article class="account-card"><span class="status-pill">${stateLabel(item.status)}</span><h3>${esc(productName(item))}</h3><p>${t("Kiekis", "Quantity")}: <b>${Number(item.quantity) || 1}</b><br>${t("Dažnis", "Cadence")}: <b>${t(`kas ${item.intervalWeeks} savaites`, `every ${item.intervalWeeks} weeks`)}</b><br>${repeatTiming(item)}<br>${t("Gavimo būdas", "Fulfilment")}: <b>${fulfilment(item)}</b><br>${t("Ciklo suma", "Cycle total")}: <b>${money(Number(item.price) * (Number(item.quantity) || 1))}</b></p><div class="account-actions">${repeatActions(item, index)}</div></article>`));
    } else {
      blocks.push(`<article class="account-card is-empty"><div><h3>${t("Papildymo dar nėra.", "No replenishment yet.")}</h3><p>${t("Produkto puslapyje pasirink „Kartoti ir sutaupyti“, tada užbaik atsiskaitymą.", "Choose Repeat & Save on a product page, then complete checkout.")}</p><a class="link-button is-primary" href="/product?id=redone-clay">${t("Rinktis produktą", "Choose a product")}</a></div></article>`);
    }
    dashboard.innerHTML = blocks.join("");
  }

  function announce(lt, en) { status.textContent = t(lt, en); }

  function confirmCopy(kind, action, index) {
    if (kind === "club") {
      const club = read(CLUB_KEY) || {};
      if (action === "pause") return [t("Pristabdyti vizitų planą?", "Pause the visit plan?"), t("Naujas ciklas nebus planuojamas, kol planas nebus atnaujintas.", "No new cycle will be scheduled until the plan is resumed.")];
      if (action === "resume") return [t("Atnaujinti vizitų planą?", "Resume the visit plan?"), t(`Kitas ciklas bus ${date(nextCalendarMonth())}.`, `The next cycle will be ${date(nextCalendarMonth())}.`)];
      return [t("Atšaukti plano atnaujinimą?", "Cancel plan renewal?"), t(`Naujas ciklas nebus kuriamas. ${club.availableCredits ?? 0} kreditai liks matomi iki ${date(club.renewalDate)}.`, `No new cycle will be created. ${club.availableCredits ?? 0} credits remain visible until ${date(club.renewalDate)}.`)];
    }
    const engine = read(ENGINE_KEY) || {}; const item = (engine.replenishments || [])[index] || {};
    if (action === "pause") return [t("Pristabdyti papildymą?", "Pause replenishment?"), t("Kitas užsakymas nebus planuojamas, kol papildymas nebus atnaujintas.", "The next order will not be scheduled until replenishment is resumed.")];
    if (action === "resume") return [t("Atnaujinti papildymą?", "Resume replenishment?"), t(`Kita data bus ${date(isoAfterWeeks(item.intervalWeeks || 6))}.`, `The next date will be ${date(isoAfterWeeks(item.intervalWeeks || 6))}.`)];
    if (action === "skip") return [t("Praleisti kitą užsakymą?", "Skip the next order?"), t(`Kita data persikels į ${date(isoAfterWeeks(item.intervalWeeks || 6, new Date(item.nextOrderDate)))}.`, `The next date will move to ${date(isoAfterWeeks(item.intervalWeeks || 6, new Date(item.nextOrderDate)))}.`)];
    if (action === "cadence") {
      const values = [4, 6, 8]; const next = values[(values.indexOf(Number(item.intervalWeeks)) + 1) % values.length];
      return [t("Pakeisti papildymo dažnį?", "Change replenishment cadence?"), t(`Dažnis pasikeis į kas ${next} savaites, o kita data bus ${date(isoAfterWeeks(next))}.`, `Cadence will change to every ${next} weeks, with the next date on ${date(isoAfterWeeks(next))}.`)];
    }
    return [t("Atšaukti papildymą?", "Cancel replenishment?"), t("Daugiau užsakymų nebus planuojama. Jau užbaigtas užsakymas nesikeis.", "No further orders will be scheduled. The completed order is unchanged.")];
  }

  function openConfirmation(kind, action, index = null) {
    pending = { kind, action, index };
    const [heading, copy] = confirmCopy(kind, action, index);
    dialogBody.innerHTML = `<span class="eyebrow">${t("PALULU · PASKYROS VALDYMAS", "PALULU · ACCOUNT CONTROL")}</span><h2>${heading}</h2><p>${copy}</p><button class="button button-primary full" type="button" data-account-confirm>${t("Patvirtinti veiksmą", "Confirm action")}</button><button class="button button-ghost full" type="button" data-account-dialog-close>${t("Grįžti", "Go back")}</button>`;
    dialog.showModal();
  }

  function applyPending() {
    if (!pending) return;
    if (pending.kind === "club") {
      const club = read(CLUB_KEY); if (!club) return;
      if (pending.action === "resume") { club.status = "active"; club.renewalDate = nextCalendarMonth(); delete club.accessUntil; }
      if (pending.action === "pause") club.status = "paused";
      if (pending.action === "cancel") { club.status = "cancelled"; club.accessUntil = club.renewalDate; club.cancelledAt = new Date().toISOString(); }
      write(CLUB_KEY, club);
      announce("Vizitų plano būsena atnaujinta.", "Visit-plan status updated.");
    } else {
      const engine = read(ENGINE_KEY) || {}; const list = engine.replenishments || []; const item = list[Number(pending.index)]; if (!item) return;
      const action = pending.action;
      if (action === "resume") { item.status = "active"; item.nextOrderDate = isoAfterWeeks(item.intervalWeeks || 6); }
      if (action === "pause") item.status = "paused";
      if (action === "cancel") { item.status = "cancelled"; item.cancelledAt = new Date().toISOString(); }
      if (action === "skip") { item.nextOrderDate = isoAfterWeeks(item.intervalWeeks || 6, new Date(item.nextOrderDate)); item.status = "skipped"; }
      if (action === "cadence") { const values = [4, 6, 8]; item.intervalWeeks = values[(values.indexOf(Number(item.intervalWeeks)) + 1) % values.length]; item.nextOrderDate = isoAfterWeeks(item.intervalWeeks); item.status = "active"; }
      engine.replenishments = list; write(ENGINE_KEY, engine);
      announce("Produkto papildymo būsena atnaujinta.", "Replenishment status updated.");
    }
    pending = null; dialog.close(); render();
  }

  document.addEventListener("click", (event) => {
    const clubAction = event.target.closest("[data-club-action]");
    if (clubAction) openConfirmation("club", clubAction.dataset.clubAction);
    const repeatAction = event.target.closest("[data-repeat-action]");
    if (repeatAction) openConfirmation("repeat", repeatAction.dataset.repeatAction, Number(repeatAction.dataset.index));
    if (event.target.closest("[data-account-confirm]")) applyPending();
    if (event.target.closest("[data-account-dialog-close]")) { pending = null; dialog.close(); }
    if (event.target.closest(".js-locale")) setTimeout(render);
  });

  render();
})();
