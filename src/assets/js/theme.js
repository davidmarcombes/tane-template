// Dark mode: loaded (not deferred) in <head> so the theme is applied before the page paints.
// Uses the visitor's choice from the toggle if they made one, otherwise the system setting.
(function () {
  var KEY = 'theme'; // 'dark' | 'light'
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function apply(dark) {
    root.classList.toggle('dark', dark);
  }

  apply(stored() ? stored() === 'dark' : media.matches);

  // Follow system changes until the visitor picks a theme
  media.addEventListener('change', function (event) {
    if (!stored()) apply(event.matches);
  });

  // Header toggle: <button x-data="themeToggle" @click="toggle" :aria-pressed="dark">
  document.addEventListener('alpine:init', function () {
    window.Alpine.data('themeToggle', function () {
      return {
        dark: root.classList.contains('dark'),
        toggle: function () {
          this.dark = !this.dark;
          apply(this.dark);
          try { localStorage.setItem(KEY, this.dark ? 'dark' : 'light'); } catch (e) {}
        }
      };
    });
  });
})();
