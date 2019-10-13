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
    }, {
      threshold: 0.2
    });

    Array.from(document.querySelectorAll('.animation')).forEach(el => {
      observer.observe(el);
    });
    Array.from(document.querySelectorAll('.fx')).forEach(el => {
      observer.observe(el);
    });
  });
}

function startAnimating (el) {
  if(el.classList.contains('fx')) {
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