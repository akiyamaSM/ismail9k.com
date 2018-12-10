import 'intersection-observer';
let observer;

(function () {
  initServiceWorker();
  initObserver();
  googleAnalytics();
})();


function initObserver () {
  document.addEventListener('DOMContentLoaded', function () {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          startAnimating(entry.target);
        }
      });
    });
    Array.from(document.querySelectorAll('.animation')).forEach(el => {
      observer.observe(el);
    });

  });
}

function startAnimating (el) {
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

function googleAnalytics () {
  window.dataLayer = window.dataLayer || [];
  function gtag () {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'UA-130812708-1');
}

function initServiceWorker () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(swReg => {
          return swReg;
        })
        .catch(err => {
          // eslint-disable-next-line
          console.error('Service Worker Error', err);
        });
    });
  }
}