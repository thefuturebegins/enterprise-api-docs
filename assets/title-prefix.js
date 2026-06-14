(function () {
  var PREFIX = 'Enterprise API \u2014 ';
  function applyPrefix() {
    if (document.title && !document.title.startsWith(PREFIX)) {
      document.title = PREFIX + document.title;
    }
  }
  new MutationObserver(applyPrefix)
    .observe(document.head, { subtree: true, characterData: true, childList: true });
  document.addEventListener('DOMContentLoaded', applyPrefix);
  applyPrefix();
})();
