if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(swReg => {
        // eslint-disable-next-line
        console.log('Service Worker is registered', swReg);
      })
      .catch(err => {
        // eslint-disable-next-line
        console.error('Service Worker Error', err);
      });
  });
}