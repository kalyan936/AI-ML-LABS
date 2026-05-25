/* ============================================
   SCRIPT.JS — Premium Interactions
   Natural Eye Blink | Particles | Scroll Reveal
   Typing Effect | Counter Animation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== 1. NATURAL EYE BLINK ==========
    const eyelidLeft  = document.getElementById('eyelidLeft');
    const eyelidRight = document.getElementById('eyelidRight');

    if (eyelidLeft && eyelidRight) {
        function blink() {
            // Natural close: fast
            eyelidLeft.style.transition  = 'transform 0.12s ease-in';
            eyelidRight.style.transition = 'transform 0.12s ease-in';
            eyelidLeft.style.transform   = 'scaleY(1)';
            eyelidRight.style.transform  = 'scaleY(1)';

            // Natural open: slightly slower
            setTimeout(() => {
                eyelidLeft.style.transition  = 'transform 0.18s ease-out';
                eyelidRight.style.transition = 'transform 0.18s ease-out';
                eyelidLeft.style.transform   = 'scaleY(0)';
                eyelidRight.style.transform  = 'scaleY(0)';
            }, 130);

            // Schedule next blink — natural human intervals (2-6s) with occasional double-blink
            const nextDelay = 2000 + Math.random() * 4000;
            setTimeout(() => {
                // 20% chance of a quick double blink
                if (Math.random() < 0.2) {
                    blink();
                    setTimeout(blink, 350);
                } else {
                    blink();
                }
            }, nextDelay);
        }

        // Start blinking after initial load
        setTimeout(blink, 1500);
    }

    // ========== 2. PARTICLE BACKGROUND ==========
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 80;
        const CONNECT_DISTANCE = 140;

        function resizeCanvas() {
            canvas.width  = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 2 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(82, 0, 204, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DISTANCE) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(82, 0, 204, ${0.12 * (1 - dist / CONNECT_DISTANCE)})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ========== 3. SCROLL REVEAL ==========
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // ========== 4. TYPING EFFECT ==========
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        const phrases = ['Gen AI & Agentic AI', 'Machine Learning', 'Data Science', 'Intelligent Automation'];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeLoop() {
            const current = phrases[phraseIndex];
            if (isDeleting) {
                typedEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
            }

            let speed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === current.length) {
                speed = 2200; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                speed = 500;
            }

            setTimeout(typeLoop, speed);
        }
        setTimeout(typeLoop, 800);
    }

    // ========== 5. COUNTER ANIMATION ==========
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                function updateCounter() {
                    current += step;
                    if (current < target) {
                        el.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target;
                    }
                }
                updateCounter();
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // ========== 6. NAVBAR SCROLL EFFECT ==========
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(11, 15, 25, 0.95)';
                navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)';
            } else {
                navbar.style.background = 'rgba(11, 15, 25, 0.85)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // ========== 7. SMOOTH ANCHOR SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
