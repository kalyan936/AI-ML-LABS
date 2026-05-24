// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
  // GSAP Registration
  gsap.registerPlugin(ScrollTrigger);

  // ── 1. Page Transition Loader ──
  const tl = gsap.timeline();
  tl.to(".page-transition", {
    duration: 1.2,
    yPercent: -100,
    ease: "power4.inOut",
    delay: 0.5
  }).from(".hero h1", {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: "power4.out",
    stagger: 0.2
  }, "-=0.5").from(".hero .btn-glitch", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power4.out"
  }, "-=0.8");

  // ── 2. Scroll Reveal Animations ──
  const revealElements = document.querySelectorAll(".gsap-reveal");
  revealElements.forEach((el) => {
    gsap.fromTo(el, {
      autoAlpha: 0,
      y: 60
    }, {
      autoAlpha: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // Navbar background on scroll
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if(window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ── 3. ThreeJS Neural Network Background ──
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

  // Particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 700;
  
  const posArray = new Float32Array(particlesCount * 3);
  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x00F0FF,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  const particlesMesh = new THREE.Points(particlesGeometry, material);
  scene.add(particlesMesh);
  
  camera.position.z = 3;

  // Mouse Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
  });

  // Animation Loop
  const clock = new THREE.Clock();
  
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
    particlesMesh.rotation.z = elapsedTime * 0.05;
    
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  
  tick();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
