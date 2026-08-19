(async () => {
  const CDN = window.PALULU_CDN || "https://cdn.jsdelivr.net/gh/lividas-ai/palulu-ghl-assets@main";
  const META = {"home":{"cls":["ss-home"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":"home.js"},"shop":{"cls":["shop-page"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":"shop.js"},"produktas":{"cls":["inner-page","product-page"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":"product.js"},"services":{"cls":["inner-page"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":null},"barbers":{"cls":["inner-page"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":null},"membership":{"cls":["inner-page","membership-page"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":"membership.js"},"account":{"cls":["inner-page"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":"account.js"},"visit":{"cls":["inner-page"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":null},"gift":{"cls":["inner-page"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":"gift.js"}};
  const IDS = {"home":"h1WYQ6D1LxPTDTJme0C7","shop":"5ZndT1S3JPyq7s1IxYAD","produktas":"rKrahjFeLfPKpyLxVwUW","services":"AFxz4DFqtdHMxTXG9CMv","barbers":"C9R3TR8uc4j51j2pwjgX","membership":"NLhHN0Dit1ILwETBJqiJ","account":"os6foiEO1aKexm5Kz8EP","gift":"VAsFk43mF5vHzzFki8x1","visit":"Pj2hlyWGPkl9fJx5Dcvi"};
  const ID2SEG = Object.fromEntries(Object.entries(IDS).map(([s, i]) => [i, s]));
  let seg = location.pathname.replace(/\/+$/, "").split("/").pop() || "home";
  let isPreview = false;
  if (ID2SEG[seg]) { isPreview = true; seg = ID2SEG[seg]; }
  if (!META[seg]) seg = "home";
  const meta = META[seg];
  const h = document.documentElement;
  h.setAttribute("lang", "lt");
  if (!h.getAttribute("data-theme")) h.setAttribute("data-theme", "light");
  const b = document.body;
  meta.cls.forEach((c) => b.classList.add(c));
  Object.entries(meta.attrs).forEach(([k, v]) => b.setAttribute(k, v));
  let mount = document.querySelector("[data-palulu-mount]");
  let hasStatic = !!document.querySelector("[data-site-header], main, .site-header");
  const STATIC_PAGES = ["home", "shop"];
  if (hasStatic && !STATIC_PAGES.includes(seg)) {
    // Puslapis klonuotas nuo statinio (pvz., Home) - isvalome svetima turini
    document
      .querySelectorAll("[data-site-header], [data-site-footer], .promo-bar, .site-header, .commerce-footer, main")
      .forEach((el) => el.remove());
    ["ss-home", "shop-page", "inner-page", "product-page", "membership-page"].forEach((c) =>
      b.classList.remove(c)
    );
    hasStatic = false;
  }
  if (!mount && !hasStatic) {
    mount = document.createElement("div");
    mount.setAttribute("data-palulu-mount", "");
    document.body.appendChild(mount);
  }
  if (mount) {
    try {
      const res = await fetch(CDN + "/pages/" + seg + ".html");
      mount.innerHTML = await res.text();
    } catch (e) {
      mount.innerHTML = "<p style='padding:2rem'>Nepavyko uzkrauti turinio.</p>";
      return;
    }
  }
  for (const f of ["site-shell.js", "engine.js", meta.js].filter(Boolean)) {
    await new Promise((done) => {
      const s = document.createElement("script");
      s.src = CDN + "/" + f;
      s.async = false;
      s.onload = done;
      s.onerror = done;
      document.body.appendChild(s);
    });
  }
  if (isPreview) {
    // Preview rezime vidines nuorodas nukreipiame i atitinkamus preview URL
    const rewrite = () => {
      document.querySelectorAll('a[href^="/"]:not([data-pv])').forEach((a) => {
        const href = a.getAttribute("href");
        const target = (href.replace(/^\/+/, "").split("?")[0].split("/")[0]) || "home";
        if (IDS[target]) {
          const q = href.includes("?") ? "?" + href.split("?")[1] : "";
          a.setAttribute("href", "/preview/" + IDS[target] + q);
          a.setAttribute("data-pv", "1");
        }
      });
    };
    rewrite();
    new MutationObserver(rewrite).observe(document.body, { childList: true, subtree: true });
  }
})();
