// Runs synchronously before React hydration so there's no theme flash on load.
(function () {
  try {
    var t = localStorage.getItem("fitore-theme");
    if (t === "cool") {
      document.documentElement.setAttribute("data-theme", "cool");
    }
  } catch (e) {
    /* localStorage may be disabled; fall through to default (warm) */
  }
})();
