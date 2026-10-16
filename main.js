(() => {
  const burger = document.querySelector('#burger');
  const navLinks = document.querySelector('#navLinks');
  const closeMenu = () => {
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    navLinks.classList.remove('is-open');
  };
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('is-open', open);
  });
  navLinks.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      burger.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('#nav')) closeMenu();
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

  if ('IntersectionObserver' in window) {
    const links = [...navLinks.querySelectorAll('a')];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('main > section').forEach((section) => observer.observe(section));
  }

  const chips = [...document.querySelectorAll('.chip')];
  const pills = [...document.querySelectorAll('.pill')];
  chips.forEach((chip) => chip.addEventListener('click', () => {
    chips.forEach((button) => {
      const active = button === chip;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    pills.forEach((pill) => {
      pill.hidden = chip.dataset.filter !== 'all' && pill.dataset.cat !== chip.dataset.filter;
    });
  }));

  const form = document.querySelector('#contactForm');
  const status = document.querySelector('#formStatus');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.first.trim() || !data.message.trim()) {
      status.textContent = 'Please enter your name and message.';
      form.elements[!data.first.trim() ? 'first' : 'message'].focus();
      return;
    }
    const name = `${data.first.trim()} ${data.last.trim()}`.trim();
    const subject = `Portfolio enquiry from ${name}`;
    const body = `${data.message.trim()}\n\n— ${name}\n${data.email}`;
    window.location.href = `mailto:subashthiruppathy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Your email draft is ready in your email app. Send it there to get in touch.';
  });
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
