document.querySelector('.button')?.addEventListener('click', () => {
  document.querySelector('#stops')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
