document.addEventListener('DOMContentLoaded', () => {
  setupStickyNav();
  setupScrollFade();
  setupActiveNavLink();
  setupDemoForm();
  setupBurgerMenu();
  setupAutoCloseMenu();
});

// NAV: Sticky + color dinámico al hacer scroll
function setupStickyNav() {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', throttle(() => {
    const isScrolled = window.scrollY > 50;
    nav.style.background = isScrolled ? '#f8f5fc' : 'transparent';
    nav.style.boxShadow = isScrolled ? '0 2px 6px rgba(0,0,0,0.05)' : 'none';
    nav.style.transition = 'background 0.3s ease, box-shadow 0.3s ease';
    nav.querySelectorAll('a').forEach(link => link.style.color = '#1e3a8a');
  }, 100));
}

// Scroll reveal animation
function setupScrollFade() {
  const faders = document.querySelectorAll('.scroll-fade');
  const appearOptions = { threshold: 0.1 };
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, appearOptions);
  faders.forEach(el => appearOnScroll.observe(el));
}

// Activa link actual en navegación
function setupActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a');

  window.addEventListener('scroll', throttle(() => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 80;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, 100));
}

// Validación y envío del formulario de demo
function setupDemoForm() {
  const demoForm = document.getElementById("demoForm");
  if (!demoForm) return;

  demoForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const telefono = form.telefono.value.trim();
    const sector = form.sector.value.trim();

    if (!nombre || !email || !telefono || !sector) {
      showMessage('mensaje-error', true);
      return;
    }

    const data = { nombre, email, telefono, sector };

    const webhookURL = "https://hook.eu2.make.com/njsunmcpef6lxssfokhmo8otufmrpod7";

    const success = await fetchWebhookData(webhookURL, data);

    if (success) {
      showMessage('mensaje-exito', true);
      showMessage('mensaje-error', false);
      form.reset();
    } else {
      showMessage('mensaje-error', true);
    }
  });
}

// Función reutilizable para llamada al webhook
async function fetchWebhookData(url, payload) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    return response.ok;
  } catch (error) {
    console.error("Error al enviar formulario:", error);
    return false;
  }
}

// Mostrar/ocultar mensaje de estado
function showMessage(id, visible) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('visible', visible);
}

// Burger menu para móviles
function setupBurgerMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  if (!menuToggle) return;

  menuToggle.addEventListener('click', () => {
    document.body.classList.toggle('menu-open');
  });
}

// Cerrar menú móvil al hacer click en un link
function setupAutoCloseMenu() {
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
    });
  });
}

// Limita llamadas a funciones en scroll
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
