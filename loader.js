(() => {
  const map = {"/home":"home.js","/shop":"shop.js","/product":"product.js","/membership":"membership.js","/account":"account.js","/gift":"gift.js"};
  let seg = location.pathname.replace(/\/+$/, "");
  seg = "/" + (seg.split("/").pop() || "home");
  const file = map[seg];
  if (file) {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/gh/lividas-ai/palulu-ghl-assets@main/" + file;
    document.body.appendChild(s);
  }
})();
