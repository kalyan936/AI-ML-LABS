// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Theme Toggler Logic
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');

  // Initialize theme from localStorage
  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      
      let theme = 'dark';
      if (document.body.classList.contains('light-theme')) {
        theme = 'light';
        if (sunIcon && moonIcon) {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
        }
      } else {
        if (sunIcon && moonIcon) {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
        }
      }
      localStorage.setItem('theme', theme);
      updateThreeTheme();
    });
  }

  // 1. Preloader Removal
  setTimeout(() => {
    gsap.to('.preloader', {
      yPercent: -100, duration: 1.5, ease: 'power4.inOut',
      onComplete: () => {
        document.querySelector('.preloader').style.display = 'none';
        initScrollAnimations();
      }
    });
  }, 1000);

  // 2. Lenis Smooth Scroll Setup
  const lenis = new window.Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 3. Custom Cursor Logic
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  
  if(cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
      
      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 150, fill: "forwards" });
    });

    // Hover states for links and buttons
    const interactables = document.querySelectorAll('a, button, .magnetic-btn');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // 4. Magnetic Buttons
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, { duration: 0.3, x: x * 0.4, y: y * 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { duration: 0.7, x: 0, y: 0, ease: 'elastic.out(1, 0.3)' });
    });
  });

  // 5. GSAP Advanced Animations (Called after preloader)
  function initScrollAnimations() {
    // Parallax Images
    const imgReveals = document.querySelectorAll('.img-reveal img');
    imgReveals.forEach(img => {
      gsap.to(img, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    // Reveal Grid Items
    const glassPanels = document.querySelectorAll('.glass-panel');
    glassPanels.forEach(panel => {
      gsap.fromTo(panel, 
        { y: 100, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.5, ease: 'power4.out',
          scrollTrigger: {
            trigger: panel,
            start: "top 85%",
          }
        }
      );
    });

    // Simple Split Text Effect (by splitting lines manually via HTML for simplicity)
    const splitTexts = document.querySelectorAll('.split-line');
    splitTexts.forEach(line => {
      gsap.fromTo(line, 
        { y: '100%', opacity: 0 },
        { 
          y: '0%', opacity: 1, duration: 1.2, ease: 'power4.out',
          scrollTrigger: { trigger: line.parentElement, start: "top 80%" }
        }
      );
    });
  }

  // 6. Three.js Background Array WebGL
  initThreeJS();
});

function initThreeJS() {
  const canvas = document.getElementById('webgl-canvas');
  if(!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Organic Neural-wave particle field
  const count = 3000;
  const positions = new Float32Array(count * 3);
  const originalY = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Distribute particles in a wide flowing sheet
    const x = (Math.random() - 0.5) * 80;
    const y = (Math.random() - 0.5) * 40;
    const z = (Math.random() - 0.5) * 60;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    originalY[i] = y;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Custom high-end glowing particles
  const material = new THREE.PointsMaterial({
    size: 0.12,
    color: 0x00B4D8, // Cyan base
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  window.threePointsMaterial = material;
  if (typeof updateThreeTheme === 'function') {
    updateThreeTheme();
  }

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  camera.position.z = 35;
  camera.position.y = 5;

  // Interactivity (Smooth damping mouse control)
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX - window.innerWidth / 2) * 0.005;
    targetY = (e.clientY - window.innerHeight / 2) * 0.005;
  });

  // Dynamic shrinking navbar logic
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      const isLight = document.body.classList.contains('light-theme');
      if (window.scrollY > 50) {
        navbar.style.height = '80px';
        navbar.style.background = isLight ? 'rgba(245, 245, 247, 0.92)' : 'rgba(5, 5, 5, 0.85)';
      } else {
        navbar.style.height = '100px';
        navbar.style.background = isLight ? 'rgba(245, 245, 247, 0.4)' : 'rgba(5, 5, 5, 0.4)';
      }
    }
  });

  const clock = new THREE.Clock();

  function tick() {
    const elapsedTime = clock.getElapsedTime();

    // Smooth inertia for mouse interactivity
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    points.rotation.y = elapsedTime * 0.03 + mouseX * 0.5;
    points.rotation.x = mouseY * 0.3;

    // Organic neural wave undulations
    const positionsArr = geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positionsArr[i3];
      const z = positionsArr[i3 + 2];
      
      // Undulation based on double sine wave patterns
      positionsArr[i3 + 1] = originalY[i] + Math.sin(elapsedTime * 1.5 + x * 0.15) * 3 + Math.cos(elapsedTime * 1.2 + z * 0.15) * 2;
    }
    geometry.attributes.position.needsUpdate = true;

    // Color shifting gradient over time
    const hue = (elapsedTime * 0.05) % 1;
    material.color.setHSL(hue, 0.8, 0.6);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function updateThreeTheme() {
  const material = window.threePointsMaterial;
  if (!material) return;
  if (document.body.classList.contains('light-theme')) {
    material.opacity = 0.35;
  } else {
    material.opacity = 0.70;
  }
}
