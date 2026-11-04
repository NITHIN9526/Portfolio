const nav = document.getElementById('mainNav');
const menuToggle = document.getElementById('menuToggle');
const year = document.getElementById('year');
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
const successToast = document.getElementById('successToast');

if (year) year.textContent = new Date().getFullYear();

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  });
});

document.addEventListener('click', event => {
  if (!nav?.contains(event.target) && !menuToggle?.contains(event.target)) {
    nav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
});

form?.addEventListener('submit', async event => {
  event.preventDefault();
  const name = document.getElementById('name')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const message = document.getElementById('message')?.value.trim();

  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formStatus.textContent = 'Please enter a name, valid email and message.';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Sending…';
  formStatus.textContent = '';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      mode: 'no-cors'
    });
    // Google Forms uses no-cors; the browser cannot inspect its response.
    form.reset();
    successToast?.classList.add('show');
    window.setTimeout(() => successToast?.classList.remove('show'), 4500);
    formStatus.textContent = 'Your browser submitted the form. Thank you!';
  } catch (error) {
    formStatus.textContent = 'Could not submit right now. Please email me directly.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send message <span>↗</span>';
  }
});
