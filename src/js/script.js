import 'intersection-observer';
let observer;

(function() {
  initServiceWorker();
  document.addEventListener('DOMContentLoaded', function() {
    initObserver();
    initThemeSwitcher();
    initPlaygroundPortal();
  });
})();

function initObserver() {
  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAnimating(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  Array.from(document.querySelectorAll('.animation')).forEach(el => {
    observer.observe(el);
  });
  Array.from(document.querySelectorAll('.fx')).forEach(el => {
    observer.observe(el);
  });
}

function startAnimating(el) {
  if (el.classList.contains('fx')) {
    el.classList.add('is-active');
    return;
  }
  const name = el.dataset.animation;
  el.classList.add(name);

  const onEnd = () => {
    observer.unobserve(el);
    el.classList.remove(name, 'animation');
    el.removeAttribute('data-animation');
    el.removeEventListener('animationend', onEnd);
  };

  el.addEventListener('animationend', onEnd);
}

function initServiceWorker() {
  if (!navigator.serviceWorker) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('sw.js')
      .then(swReg => {
        return swReg;
      })
      .catch(err => {
        // eslint-disable-next-line
        console.error('Service Worker Error', err);
      });
  });
}

function initThemeSwitcher() {
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const themeSwitcher = document.querySelector('#themeSwitcher');

  themeSwitcher.checked = mql.matches;
  themeSwitcher.addEventListener('change', themeChangeHandler);
  mql.addListener(themeChangeHandler);
}

function themeChangeHandler(e) {
  const body = document.querySelector('body');
  const themeSwitcher = document.querySelector('#themeSwitcher');
  const isDark = (e.target && e.target.checked) || e.matches;

  themeSwitcher.checked = isDark;
  body.classList.remove('theme-dark', 'theme-light');
  body.classList.add(`theme-${isDark ? 'dark' : 'light'}`);
}

function initPlaygroundPortal() {
  const figure = document.querySelector('#figure');
  const touchDuration = 1000; //length of time we want the user to touch before we do something
  let timer;

  const goToPlayground = e => {
    e.preventDefault();
    window.open('/playground.html');
  };
  const touchstart = () => {
    timer = setTimeout(goToPlayground, touchDuration);
  };
  const touchend = () => {
    if (timer) {
      clearTimeout(timer);
    }
  };

  figure.addEventListener('touchstart', touchstart);
  figure.addEventListener('touchend', touchend);
  figure.addEventListener('contextmenu', goToPlayground);
}
