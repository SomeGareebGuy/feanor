document.addEventListener('DOMContentLoaded', () => {
  const sections = Array.from(document.querySelectorAll('.section'));
  const riddleSections = Array.from(document.querySelectorAll('.riddle-section'));
  let current = 0;
  let locked = false;
  let startY = 0;

  function animateSection(index, previousIndex) {
    sections.forEach((section) => {
      section.classList.remove('is-entering', 'is-leaving', 'from-next', 'from-prev');
      section.classList.remove('active');
    });

    const targetSection = sections[index];
    const previousSection = previousIndex !== null ? sections[previousIndex] : null;

    if (!targetSection) {
      return;
    }

    if (previousSection && previousSection !== targetSection) {
      previousSection.classList.add('is-leaving');
      previousSection.classList.toggle('from-next', index > previousIndex);
      previousSection.classList.toggle('from-prev', index < previousIndex);
    }

    targetSection.classList.add('active', 'is-entering');
    targetSection.classList.toggle('from-next', index > previousIndex);
    targetSection.classList.toggle('from-prev', index < previousIndex);

    window.setTimeout(() => {
      sections.forEach((section) => {
        section.classList.remove('is-entering', 'is-leaving', 'from-next', 'from-prev');
      });
      sections.forEach((section, sectionIndex) => {
        section.classList.toggle('active', sectionIndex === index);
      });
    }, 450);
  }

  function goToSection(index) {
    if (index < 0 || index >= sections.length) {
      return;
    }

    const previousIndex = current;
    current = index;
    window.scrollTo({ top: 0, behavior: 'auto' });
    animateSection(current, previousIndex);
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
