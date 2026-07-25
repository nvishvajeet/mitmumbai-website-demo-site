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

/* Counters animate once, on first view, and only when the visitor has not
   asked for reduced motion. The final value is already in the HTML, so with
   JavaScript off or motion reduced the number is simply correct from the
   start. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.addEventListener("DOMContentLoaded", function () {
    var targets = document.querySelectorAll("[data-count-to]");
    if (!targets.length || reduced.matches || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        var node = entry.target;
        var end = parseInt(node.getAttribute("data-count-to"), 10);
        if (!isFinite(end)) return;
        var started = null;
        var duration = 900;
        node.textContent = "0";
        requestAnimationFrame(function step(now) {
          if (started === null) started = now;
          var progress = Math.min((now - started) / duration, 1);
          // ease-out so the number settles rather than stopping dead
          node.textContent = String(Math.round(end * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) requestAnimationFrame(step);
        });
      });
    }, { threshold: 0.4 });

    targets.forEach(function (t) { observer.observe(t); });
  });
})();

/* The directory filter ships in the shared package, but it matches on an
   element's text. Faculty cards carry a prepared data-filter-text so a search
   for "chemistry" or "IIT" hits the degree line too. */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("[data-uwp-filter-form]");
    if (!form) return;
    var input = form.querySelector('input[type="search"]');
    var target = document.getElementById(form.getAttribute("data-uwp-filter-target"));
    var status = form.querySelector("[data-uwp-filter-status]");
    if (!input || !target) return;
    var items = Array.prototype.slice.call(target.querySelectorAll("[data-uwp-filter-item]"));

    function apply() {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      items.forEach(function (item) {
        var hay = item.getAttribute("data-filter-text") || item.textContent.toLowerCase();
        var match = !q || hay.indexOf(q) !== -1;
        item.hidden = !match;
        if (match) shown++;
      });
      if (status) {
        status.textContent = q
          ? shown + " of " + items.length + " faculty match “" + input.value.trim() + "”"
          : "";
      }
    }

    input.addEventListener("input", apply);
    form.addEventListener("reset", function () { setTimeout(apply, 0); });
  });
})();
