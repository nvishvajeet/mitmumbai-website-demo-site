/* Shared behaviour for the MIT Mumbai concept site.
   One job today: a colour-theme toggle that persists and reports its state to
   assistive technology. Kept class-driven so pages stay static. */
(function () {
  "use strict";
  var KEY = "mit-mumbai-theme";
  var root = document.documentElement;

  function current() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function apply(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
    }
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    apply(current());
    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        apply(current() === "dark" ? "light" : "dark");
      });
    });
  });
})();
