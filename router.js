(async () => {
  const CDN = "https://cdn.jsdelivr.net/gh/lividas-ai/palulu-ghl-assets@main";
  const META = {"home":{"cls":["ss-home"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":"home.js"},"shop":{"cls":["shop-page"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":"shop.js"},"produktas":{"cls":["inner-page","product-page"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":"product.js"},"services":{"cls":["inner-page"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":null},"barbers":{"cls":["inner-page"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":null},"membership":{"cls":["inner-page","membership-page"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":"membership.js"},"account":{"cls":["inner-page"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":"account.js"},"visit":{"cls":["inner-page"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":null},"gift":{"cls":["inner-page"],"attrs":{"data-concept":"nocturne","data-default-theme":"light"},"js":"gift.js"}};
  let seg = location.pathname.replace(/\/+$/, "").split("/").pop() || "home";
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
})();
