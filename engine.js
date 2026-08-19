(() => {
  "use strict";

  const LIVE_BOOKING = "https://www.treatwell.lt/salonas/palulu-barber-shop/";
  const STORAGE_KEY = "palulu-premium-v1";
  const concept = document.body.dataset.concept || "palulu";

  const services = [
    { id: "brow", categoryLt: "Antakiai", categoryEn: "Brows", lt: "Antakių korekcija", en: "Eyebrow shaping", duration: 15, price: 10, staff: ["mehmet", "gokmen", "ismail"], tags: ["face"] },
    { id: "beard", categoryLt: "Barzda", categoryEn: "Beard", lt: "Barzdos formavimas", en: "Beard shaping", duration: 30, price: 25, staff: ["mehmet", "gokmen", "ismail"], tags: ["beard"] },
    { id: "beard-shave", categoryLt: "Barzda", categoryEn: "Beard", lt: "Barzdos skutimas peiliu", en: "Straight-razor beard shave", duration: 30, price: 25, staff: ["mehmet", "gokmen", "ismail"], tags: ["beard"] },
    { id: "beard-new", categoryLt: "Barzda", categoryEn: "Beard", lt: "Barzdos formavimas · naujiems klientams", en: "Beard shaping · new clients", duration: 40, price: 20, staff: ["gokmen"], tags: ["beard"] },
    { id: "wash-dry", categoryLt: "Džiovinimas", categoryEn: "Drying", lt: "Galvos plovimas ir išdžiovinimas", en: "Hair wash and blow-dry", duration: 15, price: 15, staff: ["mehmet", "gokmen", "ismail"], tags: ["hair"] },
    { id: "perm", categoryLt: "Cheminis sušukavimas", categoryEn: "Perming", lt: "Cheminis plaukų garbanojimas", en: "Hair perm", duration: 210, price: 150, staff: ["mehmet"], tags: ["hair"] },
    { id: "child", categoryLt: "Vaikų kirpimas", categoryEn: "Children’s cuts", lt: "Vaikų kirpimas iki 10 metų", en: "Children’s haircut (under 10)", duration: 30, price: 20, staff: ["mehmet", "gokmen", "ismail"], tags: ["hair"] },
    { id: "child-new", categoryLt: "Vaikų kirpimas", categoryEn: "Children’s cuts", lt: "Vaikų kirpimas · naujiems klientams", en: "Children’s haircut · new clients", duration: 45, price: 20, staff: ["gokmen"], tags: ["hair"] },
    { id: "beard-colour", categoryLt: "Dažymas", categoryEn: "Colour", lt: "Barzdos dažymas", en: "Beard colouring", duration: 45, price: 35, staff: ["mehmet", "gokmen", "ismail"], tags: ["beard"] },
    { id: "hair-colour", categoryLt: "Dažymas", categoryEn: "Colour", lt: "Plaukų dažymas", en: "Hair colouring", duration: 180, price: 100, staff: ["mehmet", "gokmen"], tags: ["hair"] },
    { id: "highlights", categoryLt: "Dažymas", categoryEn: "Colour", lt: "Plaukų dažymas sruogelėmis", en: "Highlights", duration: 180, price: 150, staff: ["mehmet", "gokmen"], tags: ["hair"] },
    { id: "grey-colour", categoryLt: "Dažymas", categoryEn: "Colour", lt: "Žilų plaukų dažymas", en: "Grey hair colouring", duration: 45, price: 40, staff: ["mehmet", "gokmen", "ismail"], tags: ["hair"] },
    { id: "cut-beard", categoryLt: "Vyrų kirpimas", categoryEn: "Men’s cuts", lt: "Plaukų kirpimas ir barzdos modeliavimas", en: "Haircut and beard shaping", duration: 60, price: 40, staff: ["mehmet", "gokmen", "ismail"], tags: ["hair", "beard"] },
    { id: "cut", categoryLt: "Vyrų kirpimas", categoryEn: "Men’s cuts", lt: "Vyrų kirpimas", en: "Men’s haircut", duration: 30, price: 25, staff: ["mehmet", "gokmen", "ismail"], tags: ["hair"] },
    { id: "cut-wax", categoryLt: "Vyrų kirpimas", categoryEn: "Men’s cuts", lt: "Vyrų kirpimas ir vaško procedūra veidui", en: "Men’s haircut and facial waxing", duration: 30, price: 25, staff: ["mehmet", "gokmen", "ismail"], tags: ["hair", "face"] },
    { id: "facial", categoryLt: "Veido procedūros", categoryEn: "Facials", lt: "Veido procedūra vyrams", en: "Men’s facial", duration: 30, priceMin: 20, price: 25, staff: ["mehmet", "gokmen", "ismail"], tags: ["face"] },
    { id: "head-massage", categoryLt: "Masažai", categoryEn: "Massage", lt: "Galvos, kaklo ir pečių masažas su BaByliss PRO 4ARTISTS VibeFX masažuokliu", en: "Head, neck and shoulder massage with a BaByliss PRO 4ARTISTS VibeFX massager", duration: 15, price: 10, staff: ["mehmet", "gokmen", "ismail"], tags: ["hair"] },
    { id: "groom-styling", categoryLt: "Sušukavimas", categoryEn: "Styling", lt: "Jaunojo sušukavimas", en: "Groom styling", duration: 90, price: 65, staff: ["mehmet", "gokmen", "ismail"], tags: ["hair"] },
  ];
  const staff = [
    { id: "mehmet", name: "Mehmet", metaLt: "4,9 · 189 atsiliepimai", metaEn: "4.9 · 189 reviews" },
    { id: "gokmen", name: "Gokmen", metaLt: "4,9 · 14 atsiliepimų", metaEn: "4.9 · 14 reviews" },
    { id: "ismail", name: "Ismail", metaLt: "Plaukai · veidas · masažas", metaEn: "Hair · face · massage" },
  ];
  window.PaluluServices = services;
  window.PaluluStaff = staff;

  const products = [
    { id: "redone-clay", lt: "RedOne Creative Clay Wax", en: "RedOne Creative Clay Wax", price: 15, shot: "shot-redone-clay", tag: "hair", ltCopy: "Matinis, beveik neblizgus užbaigimas ir stipri, lanksti fiksacija natūraliai tekstūrai bei apimčiai.", enCopy: "A matte, low-shine finish with strong, workable hold for natural texture and volume." },
    { id: "redone-blue", lt: "RedOne Aqua Hair Wax Blue / Spider Web", en: "RedOne Aqua Hair Wax Blue / Spider Web", price: 13, shot: "shot-redone-blue", tag: "hair", ltCopy: "Ryškus blizgesys ir maksimali fiksacija glotnioms, tikslioms ar smailioms šukuosenoms. Bubblegum kvapas.", enCopy: "High shine and maximum hold for sleek, defined or spiked styles, with a bubblegum scent." },
    { id: "redone-powder", lt: "RedOne Hair Volume Powder", en: "RedOne Hair Volume Powder", price: 14, shot: "shot-redone-powder", tag: "hair", ltCopy: "Matinis užbaigimas ir stipri fiksacija tekstūrai bei natūraliai apimčiai, ypač ploniems plaukams.", enCopy: "A matte finish with strong hold for texture and natural volume, especially for fine hair." },
    { id: "redone-forming", lt: "RedOne Forming Cream Creative", en: "RedOne Forming Cream Creative", price: 15, shot: "shot-redone-forming", tag: "hair", ltCopy: "Natūraliai matinis užbaigimas ir lanksti vidutinė fiksacija netvarkingoms ar garbanotoms šukuosenoms.", enCopy: "A natural matte finish with flexible medium hold for messy or curly styles." },
    { id: "redone-keratin", lt: "RedOne Matte Hair Wax Keratin", en: "RedOne Matte Hair Wax Keratin", price: 13, shot: "shot-redone-keratin", tag: "hair", ltCopy: "Matinis užbaigimas ir stipri ilgalaikė fiksacija modernioms tekstūrinėms šukuosenoms.", enCopy: "A matte finish with strong, long-lasting hold for modern textured styles." },
    { id: "redone-spray", lt: "RedOne Hair Spray 05 Ultra Hold", en: "RedOne Hair Spray 05 Ultra Hold", price: 15, shot: "shot-redone-spray", tag: "hair", ltCopy: "Greitai džiūstantis purškiklis su žvilgesiu, itin stipria fiksacija ir visos dienos kontrole.", enCopy: "A fast-drying finishing spray with shine, ultra-strong hold and all-day control." },
    { id: "redone-gel", lt: "RedOne Hair Gel Silver Keratin", en: "RedOne Hair Gel Silver Keratin", price: 14, shot: "shot-redone-gel", tag: "hair", ltCopy: "Ryškus žvilgesys ir ilgalaikė fiksacija tikslioms formoms bei nepaklusniems plaukams suvaldyti.", enCopy: "High shine and lasting hold for sharply defined styles and taming flyaways." },
    { id: "redone-beard", lt: "RedOne Beard Oil Sweet Almond", en: "RedOne Beard Oil Sweet Almond", price: 16, shot: "shot-redone-beard", tag: "beard", ltCopy: "Švelnus žvilgesys be fiksacijos — barzdai ir odai drėkinti, minkštinti bei prižiūrėti.", enCopy: "A soft sheen with no hold, made to moisturise, soften and care for beard and skin." },
    /* Legacy IDs keep the two alternative visual directions functional. */
    { id: "clay", lt: "Texture Clay", en: "Texture Clay", price: 24, shot: "shot-clay", tag: "hair", ltCopy: "Matinis užbaigimas ir tvirta, koreguojama fiksacija.", enCopy: "Matte finish with strong, workable hold." },
    { id: "spray", lt: "Sea Salt Spray", en: "Sea Salt Spray", price: 21, shot: "shot-spray", tag: "hair", ltCopy: "Lengva tekstūra, apimtis ir natūralus judesys.", enCopy: "Light texture, volume and natural movement." },
    { id: "powder", lt: "Volume Powder", en: "Volume Powder", price: 18, shot: "shot-powder", tag: "hair", ltCopy: "Lengva apimtis ir matinis plaukų užbaigimas.", enCopy: "Lightweight volume with a matte finish." },
    { id: "shampoo", lt: "Daily Shampoo", en: "Daily Shampoo", price: 19, shot: "shot-shampoo", tag: "hair", ltCopy: "Švelnus kasdienis plaukų ir galvos odos valymas.", enCopy: "Gentle daily cleansing for hair and scalp." },
    { id: "oil", lt: "Beard Oil", en: "Beard Oil", price: 22, shot: "shot-oil", tag: "beard", ltCopy: "Lengvas aliejus minkštesnei barzdai ir odos komfortui.", enCopy: "Lightweight oil for a softer beard and comfortable skin." },
    { id: "balm", lt: "Beard Balm", en: "Beard Balm", price: 21, shot: "shot-balm", tag: "beard", ltCopy: "Kompaktiška kasdienė priežiūra ir lengva barzdos kontrolė.", enCopy: "Everyday beard care with light control." },
    { id: "hair-set", lt: "Hair Styling Duo", en: "Hair Styling Duo", price: 39, shot: "shot-hair-set", tag: "hair", ltCopy: "Formavimo duetas kasdienei plaukų rutinai.", enCopy: "A styling duo for an everyday hair routine." },
    { id: "beard-set", lt: "Beard Ritual Set", en: "Beard Ritual Set", price: 39, shot: "shot-beard-set", tag: "beard", ltCopy: "Barzdos priežiūros rinkinys kasdieniam ritualui.", enCopy: "A beard-care set for an everyday ritual." },
  ];
  window.PaluluCatalog = products;

  const copy = {
    lt: {
      close: "Uždaryti", brand: "PALULU", booking: "Rezervuoti laiką", cart: "Krepšelis",
      live: "Dabartinė registracija per Treatwell", back: "Atgal", next: "Toliau", add: "Pridėti",
      step: "Žingsnis", services: "Pasirink paslaugą", serviceHelp: "Pasirink paslaugą pagal norimą rezultatą.",
      staff: "Pasirink meistrą", any: "Bet kuris meistras", firstAvailable: "Greičiausias laikas",
      timing: "Pasirink laiką", timingHelp: "Pasirink patogią datą ir laiką.",
      noTime: "Nerandu tinkamo laiko", waitlist: "Prisijungti prie laukiančiųjų eilės", available: "LAISVA",
      details: "Tavo kontaktai", detailsHelp: "Įvesk kontaktus rezervacijai patvirtinti.",
      name: "Vardas", phone: "Telefonas", email: "El. paštas", reference: "Norimo rezultato nuotrauka (nebūtina)",
      summary: "Aiški kaina prieš patvirtinimą", upsell: "Užbaik priežiūros ritualą", upsellHelp: "Prie vizito pridėk rekomenduojamą priežiūros produktą.",
      skip: "Be produkto", deposit: "Avansas", depositCopy: "10 € šiandien · likusi suma salone.",
      confirm: "Patvirtinti rezervaciją", success: "Laikas rezervuotas.",
      successCopy: "Rezervacijos patvirtinimą gausi nurodytais kontaktais.",
      openLive: "Peržiūrėti registraciją Treatwell", finish: "Uždaryti", waitSuccess: "Prisijungei prie laukiančiųjų eilės.",
      resume: "Tęsti neužbaigtą rezervaciją", resumeSub: "Tavo pasirinkimai išsaugoti šiame įrenginyje.",
      empty: "Krepšelis dar tuščias.", emptySub: "Atrask Palulu priežiūros kolekciją.",
      subtotal: "Tarpinė suma", checkout: "Tęsti atsiskaitymą", pickup: "Atsiėmimas salone", delivery: "Pristatymas Lietuvoje",
      checkoutTitle: "Atsiskaitymas", checkoutHelp: "Patikrink užsakymą ir pasirink gavimo būdą.",
      address: "Pristatymo adresas", pay: "Patvirtinti mokėjimą", paid: "Užsakymas priimtas.",
      paidCopy: "Patvirtinimą išsiuntėme nurodytu el. paštu.", continue: "Tęsti naršymą",
      quick: "Produkto peržiūra", careLabel: "PALULU CARE", productNote: "Profesionali priežiūra plaukams ir barzdai.",
      added: "Pridėta į krepšelį", subscribed: "Papildymas pridėtas", gift: "Dovanų kuponas", giftCopy: "Pasirink kupono vertę ir pridėk jį į krepšelį.",
      repeat: "KARTOTI IR SUTAUPYTI 10 %", every: "kas", weeks: "savaites", nextOrder: "Kitas užsakymas", fullProduct: "Visas produkto puslapis",
      required: "Užpildyk visus privalomus laukus.", dateRequired: "Pasirink datą ir laiką.", menu: "Meniu",
    },
    en: {
      close: "Close", brand: "PALULU", booking: "Book an appointment", cart: "Bag",
      live: "Current booking on Treatwell", back: "Back", next: "Continue", add: "Add",
      step: "Step", services: "Choose a service", serviceHelp: "Choose a service for your desired result.",
      staff: "Choose a professional", any: "Any professional", firstAvailable: "Earliest time",
      timing: "Choose a time", timingHelp: "Choose a convenient date and time.",
      noTime: "I can’t find a suitable time", waitlist: "Join the waitlist", available: "AVAILABLE",
      details: "Your details", detailsHelp: "Enter your details to confirm the booking.",
      name: "Name", phone: "Phone", email: "Email", reference: "Reference photo (optional)",
      summary: "Clear price before confirmation", upsell: "Complete the ritual", upsellHelp: "Add a recommended care product to your visit.",
      skip: "No product", deposit: "Deposit", depositCopy: "€10 today · the balance at the shop.",
      confirm: "Confirm appointment", success: "Your appointment is reserved.",
      successCopy: "You’ll receive confirmation using the details provided.",
      openLive: "View booking on Treatwell", finish: "Close", waitSuccess: "You joined the waitlist.",
      resume: "Continue unfinished booking", resumeSub: "Your choices are saved on this device.",
      empty: "Your bag is empty.", emptySub: "Explore the Palulu care collection.",
      subtotal: "Subtotal", checkout: "Continue to checkout", pickup: "Collection in store", delivery: "Delivery in Lithuania",
      checkoutTitle: "Checkout", checkoutHelp: "Review your order and choose fulfilment.",
      address: "Delivery address", pay: "Confirm payment", paid: "Order received.",
      paidCopy: "We sent confirmation to the email provided.", continue: "Continue browsing",
      quick: "Product view", careLabel: "PALULU CARE", productNote: "Professional hair and beard care.",
      added: "Added to bag", subscribed: "Replenishment added", gift: "Gift card", giftCopy: "Choose a gift-card value and add it to your bag.",
      repeat: "REPEAT & SAVE 10%", every: "every", weeks: "weeks", nextOrder: "Next order", fullProduct: "Full product page",
      required: "Complete all required fields.", dateRequired: "Choose a date and time.", menu: "Menu",
    },
  };

  const fresh = () => ({
    locale: "lt",
    cart: [],
    booking: { step: 0, serviceId: null, staffId: null, date: null, time: null, customer: { name: "", phone: "", email: "" }, productId: null, status: "draft" },
    theme: document.body.dataset.defaultTheme || "light",
  });

  let state;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    state = { ...fresh(), ...stored, theme: stored.themes?.[concept] || fresh().theme };
  }
  catch { state = fresh(); }
  state.booking = { ...fresh().booking, ...(state.booking || {}) };
  state.booking.customer = { ...fresh().booking.customer, ...(state.booking.customer || {}) };
  if (!Array.isArray(state.cart)) state.cart = [];
  if (!Array.isArray(state.replenishments)) state.replenishments = [];
  state.cart = state.cart.map((item) => ({ ...item, mode: item.mode || "once", intervalWeeks: Number(item.intervalWeeks) || null, key: item.key || `${item.id}|${item.mode || "once"}|${Number(item.intervalWeeks) || 0}` }));

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const tr = (key) => copy[state.locale][key];
  const service = () => services.find((item) => item.id === state.booking.serviceId);
  const product = (id) => products.find((item) => item.id === id);
  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { /* Keep the interface functional when browser storage is unavailable. */ }
  };
  const money = (value) => `${Number(value).toFixed(Number.isInteger(Number(value)) ? 0 : 2).replace(".", ",")} €`;
  const serviceMoney = (item, selectedStaff = null) => {
    if (!item) return money(0);
    if (item.id === "facial" && selectedStaff && selectedStaff !== "any") return money(selectedStaff === "gokmen" ? 20 : 25);
    return item.priceMin ? `${item.priceMin}–${item.price} €` : money(item.price);
  };
  const durationLabel = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (state.locale === "lt") return `${hours} val.${mins ? ` ${mins} min` : ""}`;
    return `${hours} hr${hours > 1 ? "s" : ""}${mins ? ` ${mins} min` : ""}`;
  };
  const esc = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" })[char]);
  const linePrice = (item, p = product(item.id)) => item.mode === "repeat" ? Number(p?.price || item.price || 0) * .9 : Number(p?.price || item.price || 0);
  const cartKey = (id, mode = "once", intervalWeeks = 0) => `${id}|${mode}|${Number(intervalWeeks) || 0}`;
  const nextDate = (weeks) => { const date = new Date(); date.setDate(date.getDate() + Number(weeks) * 7); return date.toISOString().slice(0, 10); };
  const readableDate = (value) => new Intl.DateTimeFormat(state.locale === "lt" ? "lt-LT" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));

  function renewalSummary() {
    const recurring = state.cart.filter((item) => item.mode === "repeat");
    if (!recurring.length) return "";
    const title = state.locale === "lt" ? "Kiti papildymai" : "Next replenishments";
    const note = state.locale === "lt" ? "Po pirmojo užsakymo kiekvienas papildymas kartojamas atskirai:" : "After the first order, each replenishment recurs separately:";
    return `<div class="checkout-renewals"><small>${title}</small><p>${note}</p>${recurring.map((item) => {
      const p = product(item.id);
      const amount = linePrice(item, p) * item.qty;
      return `<div><span><b>${esc(p?.[state.locale] || item.id)} × ${item.qty}</b><em>${tr("every")} ${item.intervalWeeks} ${tr("weeks")} · ${readableDate(nextDate(item.intervalWeeks))}</em></span><strong>${money(amount)}</strong></div>`;
    }).join("")}</div>`;
  }

  document.body.insertAdjacentHTML("beforeend", `
    <div class="site-overlay" id="siteOverlay" hidden></div>
    <aside class="site-panel booking-panel" id="bookingPanel" hidden aria-modal="true" role="dialog" aria-label="${tr("booking")}"></aside>
    <aside class="site-panel cart-panel" id="cartPanel" hidden aria-modal="true" role="dialog" aria-label="${tr("cart")}"></aside>
    <aside class="site-panel detail-panel" id="detailPanel" hidden aria-modal="true" role="dialog"></aside>
    <div class="resume-card" id="resumeCard" hidden></div>
    <div class="site-toast" id="siteToast" role="status" aria-live="polite"></div>
    <nav class="mobile-action-bar" aria-label="Greitieji veiksmai" data-lt-aria-label="Greitieji veiksmai" data-en-aria-label="Quick actions">
      <button type="button" class="mobile-shop js-cart"><span>${state.locale === "lt" ? "Krepšelis" : "Bag"}</span><b class="js-cart-count">0</b></button>
      <button type="button" class="mobile-book js-book">${tr("booking")}</button>
    </nav>
  `);

  const overlay = $("#siteOverlay");
  const panels = [$("#bookingPanel"), $("#cartPanel"), $("#detailPanel")];

  function openPanel(panel) {
    panels.forEach((item) => { if (item !== panel) { item.hidden = true; item.classList.remove("is-open"); } });
    overlay.hidden = false;
    panel.hidden = false;
    requestAnimationFrame(() => { overlay.classList.add("is-open"); panel.classList.add("is-open"); });
    document.body.classList.add("panel-open");
    setTimeout(() => $("button, input, select", panel)?.focus(), 180);
  }

  function closePanels() {
    overlay.classList.remove("is-open");
    panels.forEach((panel) => panel.classList.remove("is-open"));
    document.body.classList.remove("panel-open");
    setTimeout(() => { overlay.hidden = true; panels.forEach((panel) => { panel.hidden = true; }); }, 280);
    renderResume();
  }

  function panelHead(title, eyebrow = tr("brand")) {
    return `<header class="panel-head"><div><span>${eyebrow}</span><h2>${title}</h2></div><button class="panel-close" type="button" data-close aria-label="${tr("close")}">×</button></header>`;
  }

  function setLocale(locale) {
    state.locale = locale;
    document.documentElement.lang = locale;
    $$('[data-lt][data-en]').forEach((node) => { node.textContent = node.dataset[locale]; });
    $$('[data-lt-placeholder][data-en-placeholder]').forEach((node) => { node.placeholder = node.dataset[`${locale}Placeholder`]; });
    $$('[data-lt-alt][data-en-alt]').forEach((node) => { node.alt = node.dataset[`${locale}Alt`]; });
    $$('[data-lt-aria-label][data-en-aria-label]').forEach((node) => { node.setAttribute("aria-label", node.dataset[`${locale}AriaLabel`]); });
    $$(".js-locale").forEach((button) => {
      button.textContent = locale === "lt" ? "EN" : "LT";
      button.setAttribute("aria-label", locale === "lt" ? "Change language to English" : "Pakeisti kalbą į lietuvių");
    });
    $$(".mobile-book").forEach((button) => { button.textContent = tr("booking"); });
    $$(".mobile-shop span").forEach((node) => { node.textContent = tr("cart"); });
    save();
    renderCartCount();
    renderResume();
    setTheme(state.theme);
  }

  function setTheme(theme) {
    state.theme = theme;
    state.themes = { ...(state.themes || {}), [concept]: theme };
    document.documentElement.dataset.theme = theme;
    const switchLabel = state.locale === "lt"
      ? (theme === "dark" ? "Įjungti šviesią temą" : "Įjungti tamsią temą")
      : (theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    $$(".js-theme").forEach((button) => {
      button.textContent = theme === "dark" ? "☼" : "☾";
      button.setAttribute("aria-label", switchLabel);
      button.setAttribute("title", switchLabel);
      button.setAttribute("aria-pressed", String(theme === "light"));
    });
    const themeMeta = $('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#090807" : "#eee7db");
    save();
  }

  function renderResume() {
    const card = $("#resumeCard");
    const active = state.booking.step > 0 && state.booking.step < 5 && state.booking.status === "draft";
    card.hidden = !active;
    if (!active) return;
    card.innerHTML = `<button type="button" class="resume-main js-resume"><span><b>${tr("resume")}</b><small>${tr("resumeSub")}</small></span><i>→</i></button><button class="resume-dismiss" data-resume-dismiss aria-label="${tr("close")}">×</button>`;
  }

  function renderCartCount() {
    const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
    $$(".js-cart-count").forEach((node) => { node.textContent = count; node.hidden = count === 0; });
  }

  function toast(message) {
    const node = $("#siteToast");
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("show"), 2200);
  }

  const dateOptions = () => {
    const fmt = new Intl.DateTimeFormat(state.locale === "lt" ? "lt-LT" : "en-GB", { weekday: "short", day: "numeric", month: "short" });
    return [1, 2, 3, 4].map((offset) => {
      const date = new Date(); date.setDate(date.getDate() + offset);
      return { id: date.toISOString().slice(0, 10), label: fmt.format(date).replace(".", "") };
    });
  };

  const slots = ["09:30", "11:00", "13:30", "16:00", "18:30", "20:00"];

  function bookingBody() {
    const b = state.booking;
    const lang = state.locale;
    const progress = b.step < 5 ? `<div class="step-progress" aria-label="${tr("step")} ${b.step + 1}">${[0,1,2,3,4].map((step) => `<i class="${step <= b.step ? "active" : ""}"></i>`).join("")}</div>` : "";
    let body = "";

    if (b.step === 0) {
      const availableServices = b.staffId && b.staffId !== "any" ? services.filter((item) => item.staff.includes(b.staffId)) : services;
      body = `<div class="panel-copy"><h3>${tr("services")}</h3><p>${tr("serviceHelp")}</p></div><div class="choice-list service-choice-list">${availableServices.map((item) => `
        <button type="button" class="choice-card ${b.serviceId === item.id ? "selected" : ""}" data-book-service="${item.id}">
          <span><b>${item[lang]}</b><small>${item[`category${lang === "lt" ? "Lt" : "En"}`]} · ${durationLabel(item.duration)}</small></span><strong>${serviceMoney(item, b.staffId)}</strong>
        </button>`).join("")}</div>`;
    }
    if (b.step === 1) {
      const eligible = staff.filter((item) => service()?.staff.includes(item.id));
      const staffChoices = eligible.length > 1 ? [{ id: "any", name: tr("any"), metaLt: tr("firstAvailable"), metaEn: tr("firstAvailable") }, ...eligible] : eligible;
      body = `<div class="panel-copy"><h3>${tr("staff")}</h3><p>${service()?.[lang]} · ${durationLabel(service()?.duration)} · ${serviceMoney(service(), b.staffId)}</p></div><div class="staff-grid">${staffChoices.map((item) => `<button type="button" class="staff-card ${b.staffId === item.id ? "selected" : ""}" data-book-staff="${item.id}"><i>${item.id === "any" ? "✦" : item.name[0]}</i><span><b>${item.name}</b><small>${lang === "lt" ? item.metaLt : item.metaEn}</small></span></button>`).join("")}</div>`;
    }
    if (b.step === 2) {
      body = `<div class="panel-copy"><h3>${tr("timing")}</h3><p>${tr("timingHelp")}</p></div><div class="date-strip">${dateOptions().map((item) => `<button type="button" class="date-chip ${b.date === item.id ? "selected" : ""}" data-book-date="${item.id}">${item.label}</button>`).join("")}</div><div class="slot-grid">${slots.map((time, index) => `<button type="button" class="slot-chip ${b.time === time ? "selected" : ""} ${index === 4 ? "slot-popular" : ""}" data-book-time="${time}"><b>${time}</b><small>${tr("available")}</small></button>`).join("")}</div><button class="text-action" type="button" data-waitlist>${tr("noTime")} →</button>`;
    }
    if (b.step === 3) {
      body = `<div class="panel-copy"><h3>${tr("details")}</h3><p>${tr("detailsHelp")}</p></div><form class="customer-form" id="bookingDetails"><label><span>${tr("name")} *</span><input name="name" autocomplete="name" value="${esc(b.customer.name)}" required></label><label><span>${tr("phone")} *</span><input name="phone" type="tel" autocomplete="tel" value="${esc(b.customer.phone)}" required></label><label><span>${tr("email")} *</span><input name="email" type="email" autocomplete="email" value="${esc(b.customer.email)}" required></label><label><span>${tr("reference")}</span><input name="reference" type="file" accept="image/*"></label></form><div class="price-lock"><span>${tr("summary")}</span><b>${service()?.[lang]} · ${serviceMoney(service(), b.staffId)}</b></div>`;
    }
    if (b.step === 4) {
      const recommended = products.find((item) => service()?.tags.includes(item.tag)) || products[0];
      body = `<div class="panel-copy"><h3>${tr("upsell")}</h3><p>${tr("upsellHelp")}</p></div><button type="button" class="booking-product ${b.productId === recommended.id ? "selected" : ""}" data-book-product="${recommended.id}"><div class="product-shot ${recommended.shot}"></div><span><small>${tr("careLabel")}</small><b>${recommended[lang]}</b><em>${recommended[`${lang}Copy`]}</em></span><strong>+${money(recommended.price)}</strong></button><button type="button" class="skip-product ${!b.productId ? "selected" : ""}" data-book-product="">${tr("skip")}</button><div class="deposit-card"><span><small>${tr("deposit")}</small><b>10 €</b></span><p>${tr("depositCopy")}</p></div>`;
    }
    if (b.step === 5) {
      const wait = b.status === "waitlisted";
      body = `<div class="success-state"><div class="success-mark">✓</div><span>${tr("brand")}</span><h3>${wait ? tr("waitSuccess") : tr("success")}</h3><p>${tr("successCopy")}</p>${!wait ? `<div class="success-ticket"><span>${service()?.[lang]}</span><b>${b.date || "—"} · ${b.time || "—"}</b><strong>${serviceMoney(service(), b.staffId)}</strong></div>` : ""}<a class="button button-primary" href="${LIVE_BOOKING}" target="_blank" rel="noopener">${tr("openLive")} ↗</a><button class="button button-ghost" type="button" data-book-finish>${tr("finish")}</button></div>`;
    }

    const controls = b.step < 5 ? `<footer class="panel-actions">${b.step > 0 ? `<button class="button button-ghost" type="button" data-book-prev>${tr("back")}</button>` : `<a class="button button-ghost live-booking" href="${LIVE_BOOKING}" target="_blank" rel="noopener">Treatwell ↗</a>`}<button class="button button-primary" type="button" data-book-next>${b.step === 4 ? tr("confirm") : tr("next")}</button></footer>` : "";
    return `${panelHead(tr("booking"))}${progress}<div class="panel-scroll">${body}</div>${controls}`;
  }

  function renderBooking(open = true) {
    const panel = $("#bookingPanel");
    panel.innerHTML = bookingBody();
    if (open) openPanel(panel);
  }

  function bookingNext() {
    const b = state.booking;
    if (b.step === 0 && !b.serviceId) return toast(tr("required"));
    if (b.step === 1 && !b.staffId) return toast(tr("required"));
    if (b.step === 2 && (!b.date || !b.time)) return toast(tr("dateRequired"));
    if (b.step === 3) {
      const form = $("#bookingDetails");
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      b.customer = { name: data.get("name"), phone: data.get("phone"), email: data.get("email") };
    }
    if (b.step === 4) {
      if (b.productId) addToCart(b.productId, false);
      b.status = "confirmed";
    }
    b.step += 1;
    save();
    renderBooking(false);
  }

  function startBooking(serviceId = null, staffId = null) {
    if (state.booking.status !== "draft" || state.booking.step >= 5) state.booking = fresh().booking;
    if (serviceId) { state.booking.serviceId = serviceId; state.booking.step = 1; }
    if (staffId) state.booking.staffId = staffId;
    save(); renderBooking();
  }

  function addToCart(id, show = true, options = {}) {
    const mode = options.mode || "once";
    const intervalWeeks = mode === "repeat" ? Number(options.intervalWeeks) || 6 : null;
    const key = cartKey(id, mode, intervalWeeks);
    const item = state.cart.find((entry) => entry.key === key);
    if (item) item.qty += 1; else state.cart.push({ id, qty: 1, mode, intervalWeeks, key });
    save(); renderCartCount();
    if (show) toast(mode === "repeat" ? tr("subscribed") : tr("added"));
  }

  function cartBody() {
    const lang = state.locale;
    const total = state.cart.reduce((sum, item) => sum + linePrice(item) * item.qty, 0);
    const items = state.cart.length ? `<div class="cart-items">${state.cart.map((item) => {
      const p = product(item.id) || { id: item.id, lt: item.lt || tr("gift"), en: item.en || "Gift card", price: item.price, shot: "shot-gift" };
      const repeat = item.mode === "repeat";
      return `<article class="cart-item"><div class="product-shot ${p.shot}"></div><div><small>${repeat ? tr("repeat") : (p.id.startsWith("gift") ? tr("gift") : tr("careLabel"))}</small><b>${p[lang]}</b><span>${money(linePrice(item, p))}${repeat ? ` · ${tr("every")} ${item.intervalWeeks} ${tr("weeks")}` : ""}</span><div class="quantity"><button data-cart-minus="${esc(item.key)}" aria-label="Minus">−</button><strong>${item.qty}</strong><button data-cart-plus="${esc(item.key)}" aria-label="Plus">+</button></div></div><button class="cart-remove" data-cart-remove="${esc(item.key)}" aria-label="${tr("close")}">×</button></article>`;
    }).join("")}</div><div class="cart-total"><span>${tr("subtotal")}</span><b>${money(total)}</b></div><button class="button button-primary full" type="button" data-checkout>${tr("checkout")}</button><p class="cart-note">${tr("productNote")}</p>` : `<div class="empty-state"><i>◌</i><h3>${tr("empty")}</h3><p>${tr("emptySub")}</p><button class="button button-primary" data-close>${tr("continue")}</button></div>`;
    return `${panelHead(tr("cart"), "PALULU EDIT")}<div class="panel-scroll">${items}</div>`;
  }

  function renderCart(open = true) { const panel = $("#cartPanel"); panel.innerHTML = cartBody(); if (open) openPanel(panel); }

  function quickView(id) {
    const p = product(id); if (!p) return;
    const lang = state.locale;
    const panel = $("#detailPanel");
    const fullPage = concept === "nocturne" ? `<a class="button button-ghost full" href="/product?id=${encodeURIComponent(p.id)}">${tr("fullProduct")} ↗</a>` : "";
    panel.innerHTML = `${panelHead(tr("quick"), "PALULU EDIT")}<div class="panel-scroll product-detail"><div class="product-shot ${p.shot}"></div><span>${tr("careLabel")}</span><h3>${p[lang]}</h3><b>${money(p.price)}</b><p>${p[`${lang}Copy`]}</p><p class="product-note">${tr("productNote")}</p><button class="button button-primary full" data-detail-add="${p.id}">${tr("add")} · ${money(p.price)}</button><button class="button button-ghost full" data-detail-subscribe="${p.id}" data-interval="6">${tr("repeat")} · ${money(p.price * .9)} · ${tr("every")} 6 ${tr("weeks")}</button>${fullPage}</div>`;
    openPanel(panel);
  }

  function giftView() {
    const panel = $("#detailPanel");
    panel.innerHTML = `${panelHead(tr("gift"), "PALULU GIFT")}<div class="panel-scroll gift-detail"><div class="gift-visual"><span>PALULU</span><b>GIFT / 19</b></div><h3>${tr("gift")}</h3><p>${tr("giftCopy")}</p><div class="gift-values">${[25,50,100].map((value) => `<button type="button" data-gift-value="${value}">${value} €</button>`).join("")}</div><p class="product-note">${tr("productNote")}</p></div>`;
    openPanel(panel);
  }

  function checkoutView() {
    const total = state.cart.reduce((sum, item) => sum + linePrice(item) * item.qty, 0);
    const panel = $("#detailPanel");
    const todayLabel = state.locale === "lt" ? "Suma šiandien · su pirmuoju papildymu" : "Total today · first replenishment included";
    panel.innerHTML = `${panelHead(tr("checkoutTitle"), tr("brand"))}<div class="panel-scroll checkout-view"><p>${tr("checkoutHelp")}</p><form class="customer-form" id="checkoutForm"><label><span>${tr("name")} *</span><input name="name" autocomplete="name" required></label><label><span>${tr("email")} *</span><input name="email" type="email" autocomplete="email" required></label><fieldset><legend>${state.locale === "lt" ? "Gavimo būdas" : "Fulfilment"}</legend><label class="radio-line"><input type="radio" name="fulfilment" value="pickup" checked><span>${tr("pickup")}</span></label><label class="radio-line"><input type="radio" name="fulfilment" value="delivery"><span>${tr("delivery")}</span></label></fieldset><label class="address-field" hidden><span>${tr("address")} *</span><input name="address"></label><div class="checkout-total"><span>${todayLabel}</span><b>${money(total)}</b></div>${renewalSummary()}<button class="button button-primary full" type="submit">${tr("pay")}</button></form></div>`;
    openPanel(panel);
  }

  function paidView(form) {
    const data = new FormData(form);
    const fulfilment = data.get("fulfilment") === "delivery" ? "delivery" : "pickup";
    const address = fulfilment === "delivery" ? String(data.get("address") || "").trim() : "";
    const recurring = state.cart.filter((item) => item.mode === "repeat");
    recurring.forEach((item) => {
      const p = product(item.id); if (!p) return;
      const subscriptionKey = cartKey(item.id, "repeat", item.intervalWeeks);
      const existing = state.replenishments.find((entry) => entry.subscriptionKey === subscriptionKey || (!entry.subscriptionKey && entry.productId === item.id && Number(entry.intervalWeeks) === Number(item.intervalWeeks)));
      const record = { subscriptionKey, productId: item.id, lt: p.lt, en: p.en, price: linePrice(item, p), quantity: item.qty, intervalWeeks: item.intervalWeeks, fulfilment, address, nextOrderDate: nextDate(item.intervalWeeks), status: "active", createdAt: new Date().toISOString() };
      if (existing) Object.assign(existing, record); else state.replenishments.push(record);
    });
    save();
    const panel = $("#detailPanel");
    const fulfilmentCopy = fulfilment === "delivery" ? `${tr("delivery")}${address ? ` · ${esc(address)}` : ""}` : tr("pickup");
    panel.innerHTML = `${panelHead(tr("checkoutTitle"), tr("brand"))}<div class="panel-scroll success-state"><div class="success-mark">✓</div><h3>${tr("paid")}</h3><p>${tr("paidCopy")}</p><div class="success-ticket"><span>PALULU / ORDER</span><b>#PL-${String(Date.now()).slice(-5)}</b><strong>${fulfilmentCopy}</strong></div>${renewalSummary()}<button class="button button-primary" data-checkout-finish>${tr("continue")}</button></div>`;
    openPanel(panel);
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button, a"); if (!target) return;
    if (target.matches("[data-close]")) { event.preventDefault(); closePanels(); }
    if (target.matches(".js-book")) { event.preventDefault(); startBooking(target.dataset.service || null, target.dataset.staff || null); }
    if (target.matches(".js-resume")) { event.preventDefault(); renderBooking(); }
    if (target.matches("[data-resume-dismiss]")) { state.booking = fresh().booking; save(); renderResume(); }
    if (target.matches(".js-cart")) { event.preventDefault(); renderCart(); }
    if (target.matches(".js-locale")) setLocale(state.locale === "lt" ? "en" : "lt");
    if (target.matches(".js-theme")) setTheme(state.theme === "dark" ? "light" : "dark");
    if (target.matches(".js-menu")) { document.body.classList.toggle("nav-open"); target.setAttribute("aria-expanded", document.body.classList.contains("nav-open")); }
    if (target.matches(".site-nav a")) document.body.classList.remove("nav-open");
    if (target.matches("[data-book-service]")) {
      state.booking.serviceId = target.dataset.bookService;
      const chosen = service();
      if (state.booking.staffId && state.booking.staffId !== "any" && !chosen?.staff.includes(state.booking.staffId)) state.booking.staffId = null;
      save(); renderBooking(false);
    }
    if (target.matches("[data-book-staff]")) { state.booking.staffId = target.dataset.bookStaff; save(); renderBooking(false); }
    if (target.matches("[data-book-date]")) { state.booking.date = target.dataset.bookDate; state.booking.time = null; save(); renderBooking(false); }
    if (target.matches("[data-book-time]")) { state.booking.time = target.dataset.bookTime; save(); renderBooking(false); }
    if (target.matches("[data-book-product]")) { state.booking.productId = target.dataset.bookProduct || null; save(); renderBooking(false); }
    if (target.matches("[data-book-next]")) bookingNext();
    if (target.matches("[data-book-prev]")) { state.booking.step = Math.max(0, state.booking.step - 1); save(); renderBooking(false); }
    if (target.matches("[data-waitlist]")) { state.booking.status = "waitlisted"; state.booking.step = 5; save(); renderBooking(false); }
    if (target.matches("[data-book-finish]")) { state.booking = fresh().booking; save(); closePanels(); }
    if (target.matches(".js-product")) { event.preventDefault(); quickView(target.dataset.product); }
    if (target.matches(".js-add")) { event.preventDefault(); addToCart(target.dataset.product); }
    if (target.matches(".js-subscribe-product")) { event.preventDefault(); addToCart(target.dataset.product, true, { mode: "repeat", intervalWeeks: target.dataset.interval || 6 }); }
    if (target.matches("[data-detail-add]")) { addToCart(target.dataset.detailAdd); renderCart(); }
    if (target.matches("[data-detail-subscribe]")) { addToCart(target.dataset.detailSubscribe, true, { mode: "repeat", intervalWeeks: target.dataset.interval || 6 }); renderCart(); }
    if (target.matches("[data-cart-plus]")) { const item = state.cart.find((entry) => entry.key === target.dataset.cartPlus); if (item) item.qty += 1; save(); renderCart(false); renderCartCount(); }
    if (target.matches("[data-cart-minus]")) { const item = state.cart.find((entry) => entry.key === target.dataset.cartMinus); if (item) item.qty -= 1; state.cart = state.cart.filter((entry) => entry.qty > 0); save(); renderCart(false); renderCartCount(); }
    if (target.matches("[data-cart-remove]")) { state.cart = state.cart.filter((entry) => entry.key !== target.dataset.cartRemove); save(); renderCart(false); renderCartCount(); }
    if (target.matches("[data-checkout]")) checkoutView();
    if (target.matches(".js-gift")) { event.preventDefault(); giftView(); }
    if (target.matches("[data-gift-value]")) { const value = Number(target.dataset.giftValue); const id = `gift-${value}`; const key = cartKey(id); const item = state.cart.find((entry) => entry.key === key); if (item) item.qty += 1; else state.cart.push({ id, key, qty: 1, mode: "once", intervalWeeks: null, price: value, lt: `${value} € dovanų kuponas`, en: `€${value} gift card` }); save(); renderCartCount(); renderCart(); }
    if (target.matches("[data-checkout-finish]")) { state.cart = []; save(); renderCartCount(); closePanels(); }
  });

  document.addEventListener("change", (event) => {
    if (event.target.name === "fulfilment") {
      const address = $(".address-field");
      const input = $("input", address);
      const delivery = event.target.value === "delivery";
      address.hidden = !delivery; input.required = delivery;
    }
  });

  document.addEventListener("submit", (event) => {
    event.preventDefault();
    if (event.target.id === "checkoutForm") { if (event.target.reportValidity()) paidView(event.target); }
  });

  overlay.addEventListener("click", closePanels);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closePanels(); });

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("in-view"); }), { threshold: 0.12 });
  $$(".reveal").forEach((node) => observer.observe(node));
  $$("[data-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });
  setLocale(state.locale);
  setTheme(state.theme);
  renderCartCount();
})();
