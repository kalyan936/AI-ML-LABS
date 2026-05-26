/* ============================================
   SCRIPT.JS — Premium Interactions
   Natural Eye Blink | Particles | Scroll Reveal
   Typing Effect | Counter Animation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== 1. WATERMARK CURSOR GLOW ==========
    const robotWrapper = document.getElementById('robotWrapper');
    const watermarkGlow = document.getElementById('watermarkGlow');

    if (robotWrapper && watermarkGlow) {
        robotWrapper.addEventListener('mousemove', (e) => {
            // Get coordinates relative to the wrapper
            const rect = robotWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Move the glow to follow the cursor exactly
            watermarkGlow.style.left = `${x}px`;
            watermarkGlow.style.top = `${y}px`;
        });
        
        // Reset the glow position when mouse leaves the image area
        robotWrapper.addEventListener('mouseleave', () => {
            watermarkGlow.style.left = '50%';
            watermarkGlow.style.top = '50%';
        });
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
                const isLight = document.body.classList.contains('light-theme');
                const baseOpacity = isLight ? this.opacity * 0.4 : this.opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(82, 0, 204, ${baseOpacity})`;
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
                        const isLight = document.body.classList.contains('light-theme');
                        const alpha = (isLight ? 0.05 : 0.12) * (1 - dist / CONNECT_DISTANCE);
                        ctx.strokeStyle = `rgba(82, 0, 204, ${alpha})`;
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
            const isLight = document.body.classList.contains('light-theme');
            if (window.scrollY > 100) {
                navbar.style.background = isLight ? 'rgba(248, 250, 252, 0.95)' : 'rgba(11, 15, 25, 0.95)';
                navbar.style.boxShadow = isLight ? '0 4px 30px rgba(0,0,0,0.05)' : '0 4px 30px rgba(0,0,0,0.3)';
            } else {
                navbar.style.background = isLight ? 'rgba(248, 250, 252, 0.85)' : 'rgba(11, 15, 25, 0.85)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // ========== 7. SMOOTH ANCHOR SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ========== 8. THEME SWITCHER ==========
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    function updateThemeIcon() {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('i');
        if (!icon) return;
        if (document.body.classList.contains('light-theme')) {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }
    
    // Initialize Theme Immediately on Script Load
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
    updateThemeIcon();

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThemeIcon();
            // Re-trigger scroll event to update navbar styles
            window.dispatchEvent(new Event('scroll'));
        });
    }

    // ========== 9. MAGNETIC BUTTONS ==========
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // ========== 10. SERVICES ARCHITECTURE CANVAS ANIMATION ==========
    const servicesCanvas = document.getElementById('services-bg-canvas');
    if (servicesCanvas) {
        const sCtx = servicesCanvas.getContext('2d');
        let sWidth = 0, sHeight = 0;
        
        function resizeServicesCanvas() {
            sWidth = servicesCanvas.parentElement.offsetWidth;
            sHeight = servicesCanvas.parentElement.offsetHeight;
            servicesCanvas.width = sWidth;
            servicesCanvas.height = sHeight;
        }
        resizeServicesCanvas();
        window.addEventListener('resize', resizeServicesCanvas);
        
        // Define architectural nodes
        const nodes = [
            { id: 0, xPct: 0.1, yPct: 0.25, name: 'DATA_STREAM' },
            { id: 1, xPct: 0.2, yPct: 0.65, name: 'LAKEHOUSE_DBT' },
            { id: 2, xPct: 0.45, yPct: 0.35, name: 'LLM_REASONER' },
            { id: 3, xPct: 0.55, yPct: 0.75, name: 'AGENT_ROUTING' },
            { id: 4, xPct: 0.75, yPct: 0.3, name: 'GUARDRAILS_SEC' },
            { id: 5, xPct: 0.9, yPct: 0.6, name: 'API_ENDPOINT' }
        ];
        
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
            [0, 2], [1, 3], [2, 4], [3, 5]
        ];
        
        let pulses = [];
        const maxPulses = 12;
        
        function spawnPulse() {
            if (pulses.length >= maxPulses) return;
            const conn = connections[Math.floor(Math.random() * connections.length)];
            pulses.push({
                from: conn[0],
                to: conn[1],
                progress: 0,
                speed: Math.random() * 0.006 + 0.003
            });
        }
        
        function drawServicesBg() {
            sCtx.clearRect(0, 0, sWidth, sHeight);
            const isLight = document.body.classList.contains('light-theme');
            
            // Draw grid
            const gridSize = 65;
            sCtx.strokeStyle = isLight ? 'rgba(82, 0, 204, 0.04)' : 'rgba(82, 0, 204, 0.07)';
            sCtx.lineWidth = 0.5;
            for (let x = 0; x < sWidth; x += gridSize) {
                sCtx.beginPath();
                sCtx.moveTo(x, 0);
                sCtx.lineTo(x, sHeight);
                sCtx.stroke();
            }
            for (let y = 0; y < sHeight; y += gridSize) {
                sCtx.beginPath();
                sCtx.moveTo(0, y);
                sCtx.lineTo(sWidth, y);
                sCtx.stroke();
            }
            
            // Calculate absolute positions
            const coords = nodes.map(n => ({
                x: n.xPct * sWidth,
                y: n.yPct * sHeight,
                name: n.name
            }));
            
            // Draw connections
            sCtx.strokeStyle = isLight ? 'rgba(82, 0, 204, 0.08)' : 'rgba(82, 0, 204, 0.15)';
            sCtx.lineWidth = 1;
            connections.forEach(conn => {
                const p1 = coords[conn[0]];
                const p2 = coords[conn[1]];
                sCtx.beginPath();
                sCtx.moveTo(p1.x, p1.y);
                sCtx.lineTo(p2.x, p2.y);
                sCtx.stroke();
            });
            
            // Draw node hubs
            coords.forEach(c => {
                // Outer ring
                sCtx.beginPath();
                sCtx.arc(c.x, c.y, 8, 0, Math.PI * 2);
                sCtx.fillStyle = isLight ? '#F1F5F9' : '#141c2e';
                sCtx.strokeStyle = 'var(--accent-primary)';
                sCtx.lineWidth = 2;
                sCtx.fill();
                sCtx.stroke();
                
                // Inner dot
                sCtx.beginPath();
                sCtx.arc(c.x, c.y, 3, 0, Math.PI * 2);
                sCtx.fillStyle = 'var(--accent-cyan)';
                sCtx.fill();
                
                // Label
                sCtx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.3)';
                sCtx.font = '9px monospace';
                sCtx.fillText(c.name, c.x + 12, c.y + 3);
            });
            
            // Update and draw pulses
            if (Math.random() < 0.03) spawnPulse();
            
            pulses.forEach((p, idx) => {
                p.progress += p.speed;
                if (p.progress >= 1) {
                    pulses.splice(idx, 1);
                    return;
                }
                
                const p1 = coords[p.from];
                const p2 = coords[p.to];
                const x = p1.x + (p2.x - p1.x) * p.progress;
                const y = p1.y + (p2.y - p1.y) * p.progress;
                
                // Glowing pulse
                sCtx.beginPath();
                sCtx.arc(x, y, 4, 0, Math.PI * 2);
                sCtx.fillStyle = 'var(--accent-cyan)';
                sCtx.shadowColor = 'var(--accent-cyan)';
                sCtx.shadowBlur = 10;
                sCtx.fill();
                
                // Reset shadow blur
                sCtx.shadowBlur = 0;
            });
            
            requestAnimationFrame(drawServicesBg);
        }
        drawServicesBg();
    }

    // ========== 11. ABOUT HERO CANVAS ANIMATION ==========
    const aboutHeroCanvas = document.getElementById('about-hero-canvas');
    if (aboutHeroCanvas) {
        const ahCtx = aboutHeroCanvas.getContext('2d');
        let ahWidth = 0, ahHeight = 0;
        
        function resizeAboutCanvas() {
            ahWidth = aboutHeroCanvas.parentElement.offsetWidth;
            ahHeight = aboutHeroCanvas.parentElement.offsetHeight;
            aboutHeroCanvas.width = ahWidth;
            aboutHeroCanvas.height = ahHeight;
        }
        resizeAboutCanvas();
        window.addEventListener('resize', resizeAboutCanvas);
        
        let nodesList = [];
        const numNodes = 28;
        
        class DriftNode {
            constructor() {
                this.x = Math.random() * ahWidth;
                this.y = Math.random() * ahHeight;
                this.vx = (Math.random() - 0.5) * 0.22;
                this.vy = (Math.random() - 0.5) * 0.22;
                this.radius = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > ahWidth) this.vx *= -1;
                if (this.y < 0 || this.y > ahHeight) this.vy *= -1;
            }
            draw() {
                ahCtx.beginPath();
                ahCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ahCtx.fillStyle = 'var(--accent-primary)';
                ahCtx.fill();
            }
        }
        
        for (let i = 0; i < numNodes; i++) {
            nodesList.push(new DriftNode());
        }
        
        function animateAboutHero() {
            if (!document.getElementById('about-hero-canvas')) return; // Safety exit if off-page
            ahCtx.clearRect(0, 0, ahWidth, ahHeight);
            const isLight = document.body.classList.contains('light-theme');
            
            // Draw grid
            const gridSize = 70;
            ahCtx.strokeStyle = isLight ? 'rgba(82, 0, 204, 0.03)' : 'rgba(82, 0, 204, 0.06)';
            ahCtx.lineWidth = 0.5;
            for (let x = 0; x < ahWidth; x += gridSize) {
                ahCtx.beginPath();
                ahCtx.moveTo(x, 0);
                ahCtx.lineTo(x, ahHeight);
                ahCtx.stroke();
            }
            for (let y = 0; y < ahHeight; y += gridSize) {
                ahCtx.beginPath();
                ahCtx.moveTo(0, y);
                ahCtx.lineTo(ahWidth, y);
                ahCtx.stroke();
            }
            
            // Update and draw nodes
            nodesList.forEach(n => {
                n.update();
                n.draw();
            });
            
            // Draw connection lines
            ahCtx.strokeStyle = isLight ? 'rgba(82, 0, 204, 0.05)' : 'rgba(82, 0, 204, 0.1)';
            ahCtx.lineWidth = 0.5;
            for (let i = 0; i < nodesList.length; i++) {
                for (let j = i + 1; j < nodesList.length; j++) {
                    const dx = nodesList[i].x - nodesList[j].x;
                    const dy = nodesList[i].y - nodesList[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ahCtx.beginPath();
                        ahCtx.moveTo(nodesList[i].x, nodesList[i].y);
                        ahCtx.lineTo(nodesList[j].x, nodesList[j].y);
                        ahCtx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateAboutHero);
        }
        animateAboutHero();
    }

    // ========== 12. ABOUT PAGE ARCHITECTURE SHOWCASE TABS ==========
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.diagram-pane');
    if (tabBtns.length > 0 && panes.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));
                
                btn.classList.add('active');
                const targetId = btn.getAttribute('data-target');
                const targetPane = document.getElementById(targetId);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }
});
