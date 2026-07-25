(() => {
  document.documentElement.classList.add("uwp-js");

  const HOVER_CLOSE_DELAY = 220; // ms; bridges diagonal travel to a fly-out
  const EDGE_GAP = 12; // px kept between a fly-out and the viewport edge
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const desktop = window.matchMedia("(min-width: 56.01rem)");

  // Mobile disclosure toggle for the whole primary-navigation panel.
  for (const toggle of document.querySelectorAll("[data-uwp-nav-toggle]")) {
    const controlledId = toggle.getAttribute("aria-controls");
    const navigation = controlledId
      ? document.getElementById(controlledId)
      : null;
    if (!navigation) continue;

    const close = () => {
      navigation.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    };

    toggle.addEventListener("click", () => {
      const opening = toggle.getAttribute("aria-expanded") !== "true";
      navigation.classList.toggle("is-open", opening);
      toggle.setAttribute("aria-expanded", String(opening));
      toggle.setAttribute("aria-label", opening ? "Close menu" : "Open menu");
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) close();
    });

    desktop.addEventListener?.("change", (event) => {
      if (event.matches) close();
    });
  }

  // Disclosure buttons toggle a panel for touch + keyboard. A button may sit on
  // a top-level item (level 1) or on a cascade row (level 2); it toggles the
  // nearest of the two, so the same handler serves both levels and the mobile
  // accordion.
  for (const disclosure of document.querySelectorAll(
    "[data-uwp-nav-disclosure]",
  )) {
    const owner = disclosure.closest(".uwp-nav-branch, .uwp-nav-item");
    if (!owner) continue;
    disclosure.addEventListener("click", (event) => {
      event.preventDefault();
      const open = !owner.classList.contains("is-open");
      owner.classList.toggle("is-open", open);
      disclosure.setAttribute("aria-expanded", String(open));
    });
  }

  // Edge-aware fly-out direction. Default placement is to the right of the row;
  // if that overflows the viewport, flip the panel to the left. Measured while
  // the panel is revealed but within the same synchronous task, before paint,
  // so there is no flash.
  const placeFlyout = (branch) => {
    const flyout = branch.querySelector(":scope > .uwp-nav-flyout");
    if (!flyout) return;
    flyout.classList.remove("uwp-nav-flyout--left");
    const overflowsRight =
      flyout.getBoundingClientRect().right >
      document.documentElement.clientWidth - EDGE_GAP;
    flyout.classList.toggle("uwp-nav-flyout--left", overflowsRight);
  };

  // Hover-intent for both levels. Open on pointer enter; close after a short
  // delay so a brief diagonal exit toward a nested panel does not snap it shut.
  // Fine pointers on wide viewports only; coarse pointers use the accordion.
  const wireHoverIntent = (element, isBranch) => {
    let closeTimer;

    const open = () => {
      window.clearTimeout(closeTimer);
      if (!finePointer.matches || !desktop.matches) return;
      if (isBranch) {
        const menu = element.closest(".uwp-nav-menu");
        if (menu) {
          for (const sibling of menu.querySelectorAll(
            ":scope > .uwp-nav-branch.is-open",
          )) {
            if (sibling !== element) sibling.classList.remove("is-open");
          }
        }
      }
      element.classList.add("is-open");
      if (isBranch) placeFlyout(element);
    };

    const scheduleClose = () => {
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        element.classList.remove("is-open");
      }, HOVER_CLOSE_DELAY);
    };

    element.addEventListener("mouseenter", open);
    element.addEventListener("mouseleave", scheduleClose);
    // Keyboard focus reveals the panel through CSS :focus-within; still measure
    // the fly-out so a focused branch flips at the edge too.
    if (isBranch) {
      element.addEventListener("focusin", () => {
        if (desktop.matches) placeFlyout(element);
      });
    }
  };

  for (const item of document.querySelectorAll(".uwp-nav-item")) {
    wireHoverIntent(item, false);
  }
  for (const branch of document.querySelectorAll(".uwp-nav-branch")) {
    wireHoverIntent(branch, true);
  }

  // Escape closes any open dropdown/fly-out and returns focus to the top-level
  // item link, so :focus-within releases and the panel fully collapses.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const item = document.activeElement?.closest(".uwp-nav-item");
    for (const open of document.querySelectorAll(
      ".uwp-nav-branch.is-open, .uwp-nav-item.is-open",
    )) {
      open.classList.remove("is-open");
      open
        .querySelector(":scope > [data-uwp-nav-disclosure]")
        ?.setAttribute("aria-expanded", "false");
    }
    if (item) {
      const link =
        item.querySelector(":scope > .uwp-nav-item__link") ||
        item.querySelector(":scope > a");
      link?.focus();
    }
  });
})();
