// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        backTop.classList.add('visible');
    } else {
        navbar.classList.remove('scrolled');
        backTop.classList.remove('visible');
    }
});

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ========== HAMBURGER MENU ==========
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ========== TYPEWRITER ==========
const phrases = [
    'Computer Hardware Engineer',
    'Django Developer',
    'Network Administrator',
    'Embedded Systems Nerd',
];
let pi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');

function type() {
    const phrase = phrases[pi];
    tw.textContent = deleting ? phrase.slice(0, ci--) : phrase.slice(0, ci++);

    let delay = deleting ? 60 : 100;
    if (!deleting && ci > phrase.length) { deleting = true; delay = 1800; }
    if (deleting && ci < 0) { deleting = false; pi = (pi + 1) % phrases.length; ci = 0; delay = 400; }
    setTimeout(type, delay);
}
type();

// ========== SCROLL REVEAL ==========
const reveals = document.querySelectorAll('.section, .skill-card, .project-card, .info-card, .contact-form');
reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 60);
        }
    });
}, { threshold: 0.1 });

reveals.forEach(el => observer.observe(el));

// ========== SKILL BAR ANIMATION ==========
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-grid').forEach(g => skillObserver.observe(g));

// ========== COUNT-UP ==========
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-num').forEach(num => {
                const target = +num.dataset.target;
                let count = 0;
                const step = Math.ceil(target / 40);
                const interval = setInterval(() => {
                    count = Math.min(count + step, target);
                    num.textContent = count;
                    if (count >= target) clearInterval(interval);
                }, 40);
            });
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.about-stats').forEach(s => statObserver.observe(s));

// ========== ACTIVE NAV LINK ==========
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
        const top = sec.offsetTop, h = sec.offsetHeight;
        const id = sec.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            link.style.color = scrollY >= top && scrollY < top + h ? 'var(--text)' : '';
        }
    });
});

// ========== CONTACT FORM (Google Forms) ==========
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
const successModal = document.getElementById('successModal');
const modalClose = document.getElementById('modalClose');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation
    if (!name || !email || !message) {
        formStatus.textContent = '⚠️ Please fill in all required fields.';
        formStatus.className = 'form-status error';
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formStatus.textContent = '⚠️ Please enter a valid email address.';
        formStatus.className = 'form-status error';
        return;
    }

    // Prepare submission
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;
    formStatus.textContent = '';

    try {
        // Send to Google Forms (Sheets)
        const formData = new FormData(form);
        await fetch(form.action, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });

        // Success flow
        form.reset();
        successModal.classList.add('active');
        formStatus.textContent = '';
    } catch (error) {
        console.error('Submission error:', error);
        formStatus.textContent = '❌ Something went wrong. Please try again.';
        formStatus.className = 'form-status error';
    } finally {
        submitBtn.innerHTML = '<span>Send Message 🚀</span>';
        submitBtn.disabled = false;
    }
});

modalClose.addEventListener('click', () => {
    successModal.classList.remove('active');
});



// ========== SMOOTH HOVER TILT on Cards ==========
document.querySelectorAll('.project-card, .skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
        card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ========== DISABLE RIGHT-CLICK ==========
document.addEventListener('contextmenu', (e) => e.preventDefault());
