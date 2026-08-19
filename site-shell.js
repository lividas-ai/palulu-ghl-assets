(() => {
  "use strict";

  let seg = location.pathname.replace(/\/+$/, "");
  seg = "/" + (seg.split("/").pop() || "home");
  const current = seg === "/product" ? "/shop" : seg;
  const active = (href) => current === href ? ' aria-current="page"' : "";

  const header = `
    <a class="promo-bar" href="/gift"><span data-lt="Reikia dovanos, kuri atrodo gerai?" data-en="Need a good-looking gift?">Reikia dovanos, kuri atrodo gerai?</span></a>
    <header class="site-header">
      <a class="wordmark" href="/home" aria-label="Palulu pradžia" data-lt-aria-label="Palulu pradžia" data-en-aria-label="Palulu home">
        <i>PALULU</i><span>BARBER · VILNIUS</span>
      </a>
      <button class="mobile-tool js-theme" type="button" aria-label="Įjungti šviesią temą" aria-pressed="false">☼</button>
      <button class="mobile-tool js-locale" type="button" aria-label="Change language to English">EN</button>
      <button class="menu-button js-menu" type="button" aria-expanded="false"><span data-lt="Meniu" data-en="Menu">Meniu</span><i></i></button>
      <nav class="site-nav" aria-label="Pagrindinė navigacija" data-lt-aria-label="Pagrindinė navigacija" data-en-aria-label="Primary navigation">
        <a href="/home"${active("/home")} data-lt="Pradžia" data-en="Home">Pradžia</a>
        <a href="/services"${active("/services")} data-lt="Paslaugos" data-en="Services">Paslaugos</a>
        <a href="/gift"${active("/gift")} data-lt="Dovanų kuponai" data-en="Gift Cards">Dovanų kuponai</a>
        <a href="/shop"${active("/shop")} data-lt="Parduotuvė" data-en="Shop">Parduotuvė</a>
        <a href="/barbers"${active("/barbers")} data-lt="Meistrai" data-en="Barbers">Meistrai</a>
      </nav>
      <div class="header-tools">
        <button class="round-tool js-theme" type="button" aria-label="Įjungti šviesią temą" aria-pressed="false">☼</button>
        <button class="round-tool js-locale" type="button" aria-label="Change language to English">EN</button>
        <button class="cart-button js-cart" type="button"><span data-lt="Krepšelis" data-en="Bag">Krepšelis</span><b class="js-cart-count">0</b></button>
        <a class="header-phone" href="tel:+37066192040" aria-label="Skambinti Palulu telefonu +370 661 92040" data-lt-aria-label="Skambinti Palulu telefonu +370 661 92040" data-en-aria-label="Call Palulu on +370 661 92040">+370 661 92040</a>
        <button class="book-button js-book" type="button" data-lt="Registruotis vizitui" data-en="Book a visit">Registruotis vizitui</button>
      </div>
    </header>`;

  const footer = `
    <footer class="commerce-footer ss-footer">
      <div class="ss-x" aria-hidden="true"></div>
      <div class="footer-grid">
        <div>
          <a class="wordmark footer-mark" href="/home"><i>PALULU</i><span>BARBER · VILNIUS</span></a>
          <p class="ss-footer-blurb" data-lt="Palulu — vyrų kirpimas Naujamiestyje. Ateik, atsisėsk, išeik aštresnis." data-en="Palulu is a men’s cut in Naujamiestis. Come in, sit down, leave sharper.">Palulu — vyrų kirpimas Naujamiestyje. Ateik, atsisėsk, išeik aštresnis.</p>
        </div>
        <div><b data-lt="Įmonė" data-en="Company">Įmonė</b><a href="/services" data-lt="Paslaugos" data-en="Services">Paslaugos</a><a href="/barbers" data-lt="Meistrai" data-en="Barbers">Meistrai</a><a href="/visit" data-lt="Kontaktai" data-en="Contact">Kontaktai</a></div>
        <div><b data-lt="Parduotuvė" data-en="Shop">Parduotuvė</b><a href="/shop" data-lt="Visi produktai" data-en="All products">Visi produktai</a><a href="/gift" data-lt="Dovanų kuponai" data-en="Gift Cards">Dovanų kuponai</a><a href="/visit" data-lt="Kontaktai" data-en="Contact">Kontaktai</a></div>
      </div>
      <div class="footer-bottom"><span>© <span data-year></span> PALULU · VILNIUS</span><span>Smolensko g. 19 · 09:00—21:00</span></div>
    </footer>`;

  document.querySelectorAll("[data-site-header]").forEach((node) => { node.outerHTML = header; });
  document.querySelectorAll("[data-site-footer]").forEach((node) => { node.outerHTML = footer; });

  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (y > lastY + 6 && y > 100) document.body.classList.add("header-hide");
    else if (y < lastY - 2) document.body.classList.remove("header-hide");
    if (y < 40) document.body.classList.remove("header-hide");
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
})();
