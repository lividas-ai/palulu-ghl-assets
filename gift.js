(() => {
  "use strict";

  let amount = 50;
  const display = document.querySelector("[data-gift-display]");
  const picks = [...document.querySelectorAll("[data-gift-pick]")];
  const form = document.querySelector("#giftForm");

  const render = () => {
    if (display) display.textContent = `${amount} €`;
    picks.forEach((button) => {
      button.classList.toggle("is-on", Number(button.dataset.giftPick) === amount);
    });
  };

  document.addEventListener("click", (event) => {
    const step = event.target.closest("[data-gift-step]");
    if (step) {
      amount = Math.min(200, Math.max(25, amount + Number(step.dataset.giftStep)));
      render();
    }
    const pick = event.target.closest("[data-gift-pick]");
    if (pick) {
      amount = Number(pick.dataset.giftPick);
      render();
    }
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("data-gift-value", String(amount));
    document.body.appendChild(button);
    button.click();
    button.remove();
  });

  render();
})();
