(() => {
  "use strict";

  const slides = [...document.querySelectorAll(".hero-slides img")];
  if (slides.length > 1) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let index = 0;
    const show = (next) => {
      slides.forEach((img, i) => img.classList.toggle("is-active", i === next));
    };
    if (!reduced.matches) {
      window.setInterval(() => {
        index = (index + 1) % slides.length;
        show(index);
      }, 5200);
    }
  }

  const reviewTrack = document.querySelector("[data-review-track]");
  if (reviewTrack) {
    const originals = [...reviewTrack.children];
    originals.forEach((card) => reviewTrack.appendChild(card.cloneNode(true)));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!reduced.matches && originals.length) {
      let index = 0;
      const gap = () => {
        const styles = getComputedStyle(reviewTrack);
        return Number.parseFloat(styles.columnGap || styles.gap) || 0;
      };
      const cardWidth = () => {
        const card = reviewTrack.querySelector(".ss-review-card");
        return card ? card.getBoundingClientRect().width + gap() : 0;
      };
      window.setInterval(() => {
        index += 1;
        reviewTrack.style.transition = "transform .55s ease";
        reviewTrack.style.transform = `translateX(${-index * cardWidth()}px)`;
        if (index >= originals.length) {
          window.setTimeout(() => {
            reviewTrack.style.transition = "none";
            reviewTrack.style.transform = "translateX(0)";
            index = 0;
          }, 560);
        }
      }, 2000);
    }
  }

  const track = document.querySelector("#home-product-track");
  const previous = document.querySelector("[data-collection-prev]");
  const next = document.querySelector("[data-collection-next]");
  if (!track || !previous || !next) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pointerId = null;
  let startX = 0;
  let startScroll = 0;
  let dragged = false;
  let suppressClick = false;

  const cardStep = () => {
    const card = track.querySelector(".collection-gate");
    if (!card) return track.clientWidth * .8;
    const styles = getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const updateControls = () => {
    const limit = Math.max(0, track.scrollWidth - track.clientWidth);
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= limit - 2;
  };

  const move = (direction) => {
    track.scrollBy({
      left: cardStep() * direction,
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  };

  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  track.addEventListener("scroll", updateControls, { passive: true });
  window.addEventListener("resize", updateControls, { passive: true });

  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScroll = track.scrollLeft;
    dragged = false;
    track.setPointerCapture(pointerId);
  });

  track.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) return;
    const distance = event.clientX - startX;
    if (!dragged && Math.abs(distance) > 6) {
      dragged = true;
      track.classList.add("is-dragging");
    }
    if (!dragged) return;
    event.preventDefault();
    track.scrollLeft = startScroll - distance;
  });

  const releasePointer = (event) => {
    if (pointerId !== event.pointerId) return;
    if (track.hasPointerCapture(pointerId)) track.releasePointerCapture(pointerId);
    pointerId = null;
    if (!dragged) return;
    suppressClick = true;
    track.classList.remove("is-dragging");
    window.setTimeout(() => { suppressClick = false; }, 0);
    updateControls();
  };

  track.addEventListener("pointerup", releasePointer);
  track.addEventListener("pointercancel", releasePointer);
  track.addEventListener("click", (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  updateControls();
})();
