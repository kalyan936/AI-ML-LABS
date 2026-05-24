// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

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
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Abstract Torus Knot Geometry (Advanced look)
  const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  const material = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x00B4D8,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  const mesh = new THREE.Points(geometry, material);
  scene.add(mesh);
  
  camera.position.z = 30;

  // Mouse interactivity
  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth/2) * 0.0005;
    mouseY = (e.clientY - window.innerHeight/2) * 0.0005;
  });

  const clock = new THREE.Clock();
  function tick() {
    const elapsedTime = clock.getElapsedTime();
    
    mesh.rotation.y += 0.05 * (mouseX - mesh.rotation.y);
    mesh.rotation.x += 0.05 * (mouseY - mesh.rotation.x);
    mesh.rotation.z = elapsedTime * 0.1;
    
    // Pulse effect
    mesh.scale.set(
      1 + Math.sin(elapsedTime) * 0.1,
      1 + Math.cos(elapsedTime) * 0.1,
      1 + Math.sin(elapsedTime) * 0.1
    );

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
