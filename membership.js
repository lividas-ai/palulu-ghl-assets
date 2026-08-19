(() => {
  "use strict";
  const STORAGE = "palulu-club-v1";
  const dialog = document.querySelector("#clubDialog");
  const body = document.querySelector("[data-club-body]");
  const plans = {
    cut: { lt: "Tikslus kirpimas", en: "Precision Cut", price: 24, credits: 1, serviceLt: "Vyrų kirpimas", serviceEn: "Men’s haircut" },
    ritual: { lt: "Pilnas ritualas", en: "Full Ritual", price: 38, credits: 1, serviceLt: "Kirpimas + barzdos modeliavimas", serviceEn: "Haircut + beard styling" },
    sharp: { lt: "Visada tvarkingas", en: "Always Sharp", price: 46, credits: 2, serviceLt: "Du vyrų kirpimai", serviceEn: "Two men’s haircuts" },
  };
  let selected = null;
  let draft = null;
  const lang = () => document.documentElement.lang === "en" ? "en" : "lt";
  const label = (lt, en) => lang() === "en" ? en : lt;
  const renewalDate = () => {
    const d = new Date();
    const day = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, lastDay));
    return d.toISOString().slice(0, 10);
  };

  function detailsView() {
    const plan = plans[selected];
    body.innerHTML = `<span class="eyebrow">1 / 2 · ${label("DUOMENYS", "DETAILS")}</span><h2>${plan[lang()]}</h2><p>${label("Įvesk duomenis narystei sukurti.", "Enter your details to create the membership.")}</p><form class="customer-form" data-club-details><label><span>${label("Vardas", "Name")} *</span><input name="name" required autocomplete="name"></label><label><span>${label("El. paštas", "Email")} *</span><input name="email" type="email" required autocomplete="email"></label><label><span>${label("Pageidaujamas meistras", "Preferred barber")}</span><select name="barber"><option value="any">${label("Bet kuris meistras", "Any barber")}</option><option>Mehmet</option><option>Gokmen</option><option>Ismail</option></select></label><button class="button button-primary full" type="submit">${label("Peržiūrėti santrauką", "Review summary")}</button></form>`;
  }

  function summaryView() {
    const plan = plans[selected];
    body.innerHTML = `<span class="eyebrow">2 / 2 · ${label("SANTRAUKA", "SUMMARY")}</span><h2>${label("Patikrink pasirinkimą.", "Review your choice.")}</h2><div class="club-summary"><div><span>${label("Planas", "Plan")}</span><b>${plan[lang()]}</b></div><div><span>${label("Paslauga", "Service")}</span><b>${plan[`service${lang() === "en" ? "En" : "Lt"}`]}</b></div><div><span>${label("Mėnesio kaina", "Monthly price")}</span><b>${plan.price} € / ${label("mėn.", "mo")}</b></div><div><span>${label("Meistras", "Barber")}</span><b>${draft.barber === "any" ? label("Bet kuris", "Any") : draft.barber}</b></div></div><button class="button button-primary full" type="button" data-club-confirm>${label("Patvirtinti narystę", "Confirm membership")}</button><button class="button button-ghost full" type="button" data-club-back>${label("Grįžti", "Back")}</button>`;
  }

  function successView() {
    const plan = plans[selected];
    const membership = { planId: selected, status: "active", renewalDate: renewalDate(), preferredBarber: draft.barber, availableCredits: plan.credits, rolloverCredits: 0, name: draft.name, email: draft.email, createdAt: new Date().toISOString() };
    localStorage.setItem(STORAGE, JSON.stringify(membership));
    body.innerHTML = `<div class="success-state"><div class="success-mark">✓</div><span>PALULU CLUB</span><h2>${label("Planas aktyvus.", "Your plan is active.")}</h2><p>${label("Planas išsaugotas šiame įrenginyje.", "Your plan is saved on this device.")}</p><a class="button button-primary" href="/home">${label("Grįžti į pradžią", "Back to home")} ↗</a><button class="button button-ghost" type="button" data-club-close>${label("Uždaryti", "Close")}</button></div>`;
  }

  document.addEventListener("click", (event) => {
    const planButton = event.target.closest(".js-club-plan");
    if (planButton) { selected = planButton.dataset.plan; draft = null; detailsView(); dialog.showModal(); }
    if (event.target.closest("[data-club-close]")) dialog.close();
    if (event.target.closest("[data-club-back]")) detailsView();
    if (event.target.closest("[data-club-confirm]")) successView();
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-club-details]");
    if (!form) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    draft = { name: data.get("name"), email: data.get("email"), barber: data.get("barber") };
    summaryView();
  });
})();
