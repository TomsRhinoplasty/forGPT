// public/js/debounce.js
/**
 * Returns a debounced version of `fn` that only runs
 * once per `wait` ms at most.
 */
export function debounce(fn, wait = 150) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}
