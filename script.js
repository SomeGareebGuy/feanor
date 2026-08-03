document.addEventListener('DOMContentLoaded', () => {
  const sections = Array.from(document.querySelectorAll('.section'));
  const riddleSections = Array.from(document.querySelectorAll('.riddle-section'));
  let current = 0;
  let locked = false;
  let startY = 0;

  function animateSection(index) {
    sections.forEach((section) => section.classList.remove('is-entering'));
    const targetSection = sections[index];
    if (!targetSection) {
      return;
    }

    targetSection.classList.remove('is-entering');
    void targetSection.offsetWidth;
    targetSection.classList.add('is-entering');
  }

  function goToSection(index) {
    if (index < 0 || index >= sections.length) {
      return;
    }

    current = index;
    window.scrollTo({ top: current * window.innerHeight, behavior: 'auto' });
    window.scrollTo(0, current * window.innerHeight);
    animateSection(current);
  }

  function changeSection(direction) {
    if (locked) {
      return;
    }

    locked = true;

    if (direction > 0) {
      goToSection(current + 1);
    } else if (direction < 0) {
      goToSection(current - 1);
    }

    setTimeout(() => {
      locked = false;
    }, 250);
  }

  function normalizeAnswer(value) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  riddleSections.forEach((section) => {
    const form = section.querySelector('.answer-form');
    const input = section.querySelector('.answer-input');
    const feedback = section.querySelector('.feedback');

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      const expected = section.getAttribute('data-answer') || '';
      const currentAnswer = normalizeAnswer(input?.value || '');

      if (normalizeAnswer(expected) === currentAnswer) {
        section.classList.remove('locked');
        section.classList.add('unlocked');
        feedback.textContent = 'Unlocked.';
        input.value = '';
      } else {
        feedback.textContent = 'Not quite — try again.';
      }
    });

    input?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        form?.requestSubmit();
      }
    });
  });

  document.getElementById('start-journey')?.addEventListener('click', (event) => {
    event.preventDefault();
    goToSection(1);
  });

  window.addEventListener('wheel', (event) => {
    event.preventDefault();

    if (event.deltaY > 0) {
      changeSection(1);
    } else if (event.deltaY < 0) {
      changeSection(-1);
    }
  }, { passive: false });

  window.addEventListener('touchstart', (event) => {
    startY = event.touches[0]?.clientY ?? 0;
  }, { passive: true });

  window.addEventListener('touchend', (event) => {
    const endY = event.changedTouches[0]?.clientY ?? startY;
    const deltaY = endY - startY;
    const swipeThreshold = 45;

    if (deltaY < -swipeThreshold) {
      changeSection(1);
    } else if (deltaY > swipeThreshold) {
      changeSection(-1);
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    goToSection(current);
  });

  goToSection(0);
});
