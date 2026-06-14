/**
 * Intercepts clicks on internal anchor links rendered inside description prose
 * (e.g. /api/sales/tag/account-management) and routes them through the Vue
 * Router SPA instead of triggering a full page reload.
 *
 * Vue Router 4 reacts to `popstate` events; calling `history.pushState` alone
 * does not fire that event, but dispatching it manually causes the router to
 * pick up the new URL and navigate client-side.
 *
 * Links that already carry data-scalar-type="page-link" are handled natively
 * by Scalar's own hydratePageLinks() and are skipped here.
 */
(function () {
  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href]');
    if (!anchor) return;

    // Already handled by Scalar's built-in page-link interceptor
    if (anchor.dataset && anchor.dataset.scalarType === 'page-link') return;

    var href = anchor.getAttribute('href');
    if (!href) return;

    // External or special-scheme links — let the browser handle them normally
    if (
      anchor.target === '_blank' ||
      /^[a-z][a-z0-9+.\-]*:/i.test(href) // matches http:, https:, mailto:, etc.
    ) return;

    // Only intercept root-relative paths
    if (!href.startsWith('/')) return;

    e.preventDefault();
    history.pushState(null, '', href);
    window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
  }, true /* capture: intercept before any other handler */);
})();
