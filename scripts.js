// Function to check if an element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
    );
}

// Function to animate counter from 0 to target
function animateCounter(element, target, suffix) {
    let current = 0;
    const duration = 2000; // 2 seconds
    const steps = 40; // update every 50ms
    const increment = target / steps;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, duration / steps);
}

// Function to handle scroll animation
function handleScrollAnimation() {
    
    const elements = document.querySelectorAll('.fade-in:not(.visible)');
    
    elements.forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('visible');
        }
    });
}

// Add fade-in class to elements that should animate
function initializeFadeElements() {
    // Home page elements with sequential animation
    const homeElements = [
        '.hero-content',
        '.hero-content .text',
        '.hero-content .hero-image',
        '.stats',
        '.stat-card'
    ];

    // Other sections' elements
    const scrollElements = [
        '.about-card',
        '.expertise',
        '.work-experience',
        '.contact-card',
        '.portfolio-grid',
        '.social-links'
    ];

    // Initialize home elements with sequential animation
    let delay = 200;
    homeElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.add('fade-in');
            // Trigger immediate animation for home elements
            setTimeout(() => {
                element.classList.add('visible');
                // Trigger counter animation for stat cards
                if (selector === '.stat-card') {
                    const h3 = element.querySelector('h3');
                    if (h3) {
                        const text = h3.textContent.trim();
                        let target = 0;
                        let suffix = '';
                        if (text.includes('+ Y.')) {
                            target = parseInt(text.replace('+ Y.', ''));
                            suffix = '+ Y.';
                        } else if (text.includes('+')) {
                            target = parseInt(text.replace('+', ''));
                            suffix = '+';
                        } else {
                            target = parseInt(text);
                        }
                        animateCounter(h3, target, suffix);
                    }
                }
            }, delay);
            delay += 200; // Increment delay for next element
        });
    });

    // Initialize scroll elements
    scrollElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.add('fade-in');
        });
    });
}

// Throttle function to limit how often a function can be called
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Initialize animations when page is fully loaded (including images)
window.addEventListener('load', () => {
    initializeFadeElements();
    // Slight delay to ensure all elements are properly initialized
    setTimeout(() => {
        handleScrollAnimation(); // Check for elements in view on initial load
    }, 100);
});

// Listen for scroll events with throttling for better performance
window.addEventListener('scroll', throttle(() => {
    handleScrollAnimation();
}, 100));

// Also trigger on window resize to handle any layout changes
window.addEventListener('resize', throttle(() => {
    handleScrollAnimation();
}, 100));

/* Mobile navigation toggle: smooth glide + overlay + accessibility */
window.addEventListener('load', () => {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('primary-nav');
    const overlay = document.getElementById('nav-overlay');

    if (!toggle || !nav || !overlay) return; // nothing to do if elements missing

    const openNav = () => {
        nav.classList.add('show');
        toggle.setAttribute('aria-expanded', 'true');
        overlay.classList.add('active');
        overlay.hidden = false;
        toggle.classList.add('open');
        // swap icon to X
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        }
        // prevent body scroll while nav is open on small screens
        document.body.style.overflow = 'hidden';
        // focus the first link for keyboard users after the opening animation
        setTimeout(() => {
            const firstLink = nav.querySelector('a');
            if (firstLink) firstLink.focus();
        }, 160);
    };

    const closeNav = () => {
        nav.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
        overlay.classList.remove('active');
        // hide overlay after transition
        setTimeout(() => overlay.hidden = true, 300);
        document.body.style.overflow = '';
        toggle.classList.remove('open');
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
        // return focus to the toggle for accessibility
        setTimeout(() => toggle.focus(), 220);
    };

    toggle.addEventListener('click', () => {
        if (nav.classList.contains('show')) closeNav();
        else openNav();
    });

    // close when clicking overlay
    overlay.addEventListener('click', closeNav);

    // close menu when a nav link is clicked (so user sees the page immediately)
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            // Allow normal anchor behavior, but close the nav immediately
            if (window.innerWidth <= 768) closeNav();
        });
    });

    // close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('show')) closeNav();
    });

    // ensure nav is closed if viewport becomes large
    window.addEventListener('resize', throttle(() => {
        if (window.innerWidth > 768 && nav.classList.contains('show')) {
            closeNav();
        }
    }, 150));
});