/* ============================================================
   SCRIPT.JS — SaaS Consulting Design System Interactions
   Theme Switcher | Scroll States | Interactive Visuals
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== 1. THEME SWITCHER LOGIC ==========
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            if (themeIcon) {
                themeIcon.className = 'fa-solid fa-sun';
            }
        } else {
            document.body.classList.remove('light-theme');
            if (themeIcon) {
                themeIcon.className = 'fa-solid fa-moon';
            }
        }
    }

    // Determine initial theme state
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const defaultTheme = savedTheme || (prefersLight ? 'light' : 'dark');
    applyTheme(defaultTheme);

    // Event listener for theme toggle click
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isCurrentlyLight = document.body.classList.contains('light-theme');
            const newTheme = isCurrentlyLight ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // ========== 2. STICKY NAVBAR ON SCROLL ==========
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        };
        // Run once on load and bind scroll event
        handleScroll();
        window.addEventListener('scroll', handleScroll);
    }

    // ========== 3. SCROLL REVEAL ANIMATION ==========
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observerOptions = { 
        threshold: 0.05, 
        rootMargin: '0px 0px -20px 0px' 
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // ========== 4. SMOOTH ANCHOR SCROLLING ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
