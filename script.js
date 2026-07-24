/* ==========================================================================
   GCK LAB - 3D INTERACTIVE SCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. THREE.JS 3D WEBGL BACKGROUND SCENE ---
  initWebGLScene();

  // --- 2. 3D CARD TILT & SPECULAR SHINE ENGINE ---
  init3DTiltEngine();

  // --- 3. MAGNETIC BUTTONS & CURSOR FOLLOW ENGINE ---
  initMagneticAndCursor();

  // --- 4. SCROLL REVEALS & NAVBAR ---
  initScrollAnimations();

  // --- 5. INTERACTIVE TERMINAL ---
  initTerminal();

  // --- 6. FAQ ACCORDION & MODALS ---
  initFAQAndModals();

  // --- 7. ANIMATED COUNTERS ---
  initCounters();

});

/* -------------------------------------------------------------------------- */
/* 1. THREE.JS 3D SCENE SETUP                                                 */
/* -------------------------------------------------------------------------- */
function initWebGLScene() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050811, 0.0015);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Ambient Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0xF2A65A, 2, 80); // Saffron light
  pointLight1.position.set(20, 20, 20);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x38BDF8, 2, 80); // Cyan light
  pointLight2.position.set(-20, -20, 10);
  scene.add(pointLight2);

  // 1A. Particle Constellation Network
  const particleCount = 700;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorSaffron = new THREE.Color(0xF2A65A);
  const colorCyan = new THREE.Color(0x38BDF8);
  const colorGreen = new THREE.Color(0x34D399);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 90;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 90;

    let c = Math.random() > 0.5 ? colorSaffron : (Math.random() > 0.5 ? colorCyan : colorGreen);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.25,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(geometry, particleMaterial);
  scene.add(particleSystem);

  // 1B. Floating 3D Geometric Sculptures
  const geometries = [
    new THREE.IcosahedronGeometry(3, 1),
    new THREE.TorusKnotGeometry(2, 0.6, 64, 16),
    new THREE.OctahedronGeometry(2.5, 0)
  ];

  const meshGroup = new THREE.Group();

  const matWireframe = new THREE.MeshStandardMaterial({
    color: 0xF2A65A,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });

  const matGlass = new THREE.MeshPhysicalMaterial({
    color: 0x38BDF8,
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.9,
    transparent: true,
    opacity: 0.35,
    wireframe: true
  });

  const mesh1 = new THREE.Mesh(geometries[0], matWireframe);
  mesh1.position.set(-18, 8, -5);
  meshGroup.add(mesh1);

  const mesh2 = new THREE.Mesh(geometries[1], matGlass);
  mesh2.position.set(20, -10, -8);
  meshGroup.add(mesh2);

  const mesh3 = new THREE.Mesh(geometries[2], matWireframe);
  mesh3.position.set(15, 12, -10);
  meshGroup.add(mesh3);

  scene.add(meshGroup);

  // Interaction Coordinates
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
  });

  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate particles
    particleSystem.rotation.y = elapsedTime * 0.03;
    particleSystem.rotation.x = elapsedTime * 0.02;

    // Rotate geometric shapes
    mesh1.rotation.x = elapsedTime * 0.2;
    mesh1.rotation.y = elapsedTime * 0.3;

    mesh2.rotation.x = elapsedTime * 0.15;
    mesh2.rotation.z = elapsedTime * 0.25;

    mesh3.rotation.y = elapsedTime * 0.4;

    // Smooth camera mouse follow (Lerp)
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 12;
    camera.position.y = -targetY * 12 + (scrollY * 0.008);
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* -------------------------------------------------------------------------- */
/* 2. 3D CARD TILT & SPECULAR SHINE ENGINE                                    */
/* -------------------------------------------------------------------------- */
function init3DTiltEngine() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    const shine = card.querySelector('.card-shine');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const maxTilt = parseFloat(card.getAttribute('data-tilt-max')) || 12;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      if (shine) {
        const posX = (x / rect.width) * 100;
        const posY = (y / rect.height) * 100;
        shine.style.background = `radial-gradient(circle at ${posX}% ${posY}%, rgba(255, 255, 255, 0.18), transparent 65%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      if (shine) {
        shine.style.opacity = '0';
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 3. MAGNETIC BUTTONS & CURSOR FOLLOW                                        */
/* -------------------------------------------------------------------------- */
function initMagneticAndCursor() {
  const cursorGlow = document.getElementById('cursor-glow');
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let currentX = cursorX;
  let currentY = cursorY;

  window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  function updateCursor() {
    currentX += (cursorX - currentX) * 0.15;
    currentY += (cursorY - currentY) * 0.15;

    if (cursorGlow) {
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
    }

    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Magnetic Buttons
  const magnetics = document.querySelectorAll('.magnetic');

  magnetics.forEach(btn => {
    const strength = parseFloat(btn.getAttribute('data-strength')) || 20;

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${relX * (strength / 100)}px, ${relY * (strength / 100)}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 4. SCROLL REVEALS & NAVBAR                                                 */
/* -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // IntersectionObserver for Scroll Reveal
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));

  // Mobile Menu Toggle
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 5. INTERACTIVE TERMINAL                                                    */
/* -------------------------------------------------------------------------- */
function initTerminal() {
  const promptInput = document.getElementById('terminalPromptInput');
  if (!promptInput) return;

  const tabBtns = document.querySelectorAll('.tab-btn');

  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      tabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cmd = tab.getAttribute('data-command');
      runTermCommand(cmd);
    });
  });
}

window.runTermCommand = function(command) {
  const terminalOutput = document.getElementById('terminalOutput');
  const promptInput = document.getElementById('terminalPromptInput');
  if (!terminalOutput) return;

  if (command === 'clear') {
    terminalOutput.innerHTML = `
      <div class="term-line"><span class="t-prompt">gcklab@cloud:~$</span> <span id="terminalPromptInput"></span><span class="terminal-cursor"></span></div>
    `;
    return;
  }

  let responseHTML = '';

  switch (command) {
    case 'cat mission.txt':
      responseHTML = `
        <div class="term-line"><span class="t-prompt">gcklab@cloud:~$</span> <span class="t-cmd">cat mission.txt</span></div>
        <div class="term-response t-highlight">"Build high-performance web products that understand India."</div>
        <div class="term-response t-dim">"One focused problem. One robust, elegant build."</div>
      `;
      break;
    case 'ls services/':
    case 'services':
      responseHTML = `
        <div class="term-line"><span class="t-prompt">gcklab@cloud:~$</span> <span class="t-cmd">ls services/</span></div>
        <div class="term-response t-success">AutoLeadz (WhatsApp Lead Automation)</div>
        <div class="term-response t-success">ResumeWave (ATS Resume Builder)</div>
        <div class="term-response t-success">IncomeWave (Freelancer Finance Ledger)</div>
        <div class="term-response t-highlight">Custom Websites & Web Apps</div>
      `;
      break;
    case 'contact':
    case 'contact.info':
      responseHTML = `
        <div class="term-line"><span class="t-prompt">gcklab@cloud:~$</span> <span class="t-cmd">cat contact.info</span></div>
        <div class="term-response t-highlight">Email: gurucharan.k@zohomail.in</div>
        <div class="term-response t-highlight">WhatsApp / Phone: +91 82963 72184</div>
        <div class="term-response t-dim">Location: Karnataka, India</div>
      `;
      break;
    case 'pricing':
    case 'help':
      responseHTML = `
        <div class="term-line"><span class="t-prompt">gcklab@cloud:~$</span> <span class="t-cmd">${command}</span></div>
        <div class="term-response t-success">Starter Website: ₹4,999 (4-6 days)</div>
        <div class="term-response t-highlight">Business Website: ₹9,999 (8-10 days)</div>
        <div class="term-response t-success">Custom Web App: ₹19,999+ (2-4 weeks)</div>
      `;
      break;
    default:
      responseHTML = `
        <div class="term-line"><span class="t-prompt">gcklab@cloud:~$</span> <span class="t-cmd">${command}</span></div>
        <div class="term-response t-dim">Command executed: OK</div>
      `;
  }

  const newBlock = document.createElement('div');
  newBlock.innerHTML = responseHTML;

  const cursorLine = terminalOutput.querySelector('.term-line:last-child');
  terminalOutput.insertBefore(newBlock, cursorLine);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
};

/* -------------------------------------------------------------------------- */
/* 6. FAQ ACCORDION & MODALS                                                  */
/* -------------------------------------------------------------------------- */
function initFAQAndModals() {
  // Accordion
  const faqCards = document.querySelectorAll('.faq-card-3d');

  faqCards.forEach(card => {
    const question = card.querySelector('.faq-question');
    const answer = card.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');

      faqCards.forEach(c => {
        c.classList.remove('open');
        c.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        card.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Modals
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal') + 'Modal';
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('open');
      }
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });

    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        overlay.classList.remove('open');
      });
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 7. ANIMATED COUNTERS                                                       */
/* -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target')) || 0;
        let count = 0;
        const speed = 50;

        const updateCount = () => {
          if (count < target) {
            count++;
            entry.target.innerText = count;
            setTimeout(updateCount, speed);
          } else {
            entry.target.innerText = target;
          }
        };

        updateCount();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}
