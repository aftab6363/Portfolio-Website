/* ==========================================================================
   Advanced Animations JavaScript
   ========================================================================== */

(function() {
    'use strict';

    /* ======================================================================
       GSAP-like Animation Functions (Pure JavaScript)
       ====================================================================== */

    // Easing functions
    const Easing = {
        linear: t => t,
        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        easeInQuart: t => t * t * t * t,
        easeOutQuart: t => 1 - (--t) * t * t * t,
        easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
        easeInElastic: t => {
            const c4 = (2 * Math.PI) / 3;
            return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
        },
        easeOutElastic: t => {
            const c4 = (2 * Math.PI) / 3;
            return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
        },
        easeInOutElastic: t => {
            const c5 = (2 * Math.PI) / 4.5;
            return t === 0 ? 0 : t === 1 ? 1 : t < 0.5
                ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
                : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
        }
    };

    /* ======================================================================
       Custom Animation Engine
       ====================================================================== */

    function animate(element, properties, duration = 1000, easing = 'easeOutCubic', callback) {
        const start = performance.now();
        const startValues = {};
        const targetValues = {};
        
        // Get initial values
        for (let prop in properties) {
            if (prop === 'opacity') {
                startValues[prop] = parseFloat(window.getComputedStyle(element).opacity) || 0;
            } else if (prop === 'transform') {
                startValues[prop] = element.style.transform || '';
            } else {
                startValues[prop] = parseFloat(window.getComputedStyle(element)[prop]) || 0;
            }
            targetValues[prop] = properties[prop];
        }
        
        function step(timestamp) {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = Easing[easing](progress);
            
            for (let prop in properties) {
                if (prop === 'transform') {
                    element.style[prop] = targetValues[prop];
                } else {
                    const currentValue = startValues[prop] + (targetValues[prop] - startValues[prop]) * easedProgress;
                    element.style[prop] = prop === 'opacity' ? currentValue : currentValue + 'px';
                }
            }
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else if (callback) {
                callback();
            }
        }
        
        requestAnimationFrame(step);
    }

    /* ======================================================================
       Stagger Animation
       ====================================================================== */

    function staggerAnimation(elements, properties, duration = 1000, staggerDelay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                animate(element, properties, duration);
            }, index * staggerDelay);
        });
    }

    /* ======================================================================
       Scroll-Triggered Animations
       ====================================================================== */

    class ScrollAnimation {
        constructor(options = {}) {
            this.elements = document.querySelectorAll(options.selector || '.animate-on-scroll');
            this.threshold = options.threshold || 0.1;
            this.rootMargin = options.rootMargin || '0px';
            this.animationClass = options.animationClass || 'animated';
            this.init();
        }
        
        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(this.animationClass);
                        if (this.options && this.options.once) {
                            observer.unobserve(entry.target);
                        }
                    } else if (!this.options || !this.options.once) {
                        entry.target.classList.remove(this.animationClass);
                    }
                });
            }, {
                threshold: this.threshold,
                rootMargin: this.rootMargin
            });
            
            this.elements.forEach(el => observer.observe(el));
        }
    }

    /* ======================================================================
       Text Animation Effects
       ====================================================================== */

    // Split text into spans for character-by-character animation
    function splitText(element) {
        const text = element.textContent;
        element.innerHTML = '';
        
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            element.appendChild(span);
        });
        
        return element.children;
    }

    // Animate text characters
    function animateText(element, animation = 'fadeInUp', duration = 50) {
        const chars = splitText(element);
        
        Array.from(chars).forEach((char, index) => {
            char.style.opacity = '0';
            setTimeout(() => {
                char.style.transition = 'all 0.5s ease';
                char.style.opacity = '1';
                
                if (animation === 'fadeInUp') {
                    char.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        char.style.transform = 'translateY(0)';
                    }, 10);
                } else if (animation === 'scale') {
                    char.style.transform = 'scale(0)';
                    setTimeout(() => {
                        char.style.transform = 'scale(1)';
                    }, 10);
                } else if (animation === 'rotate') {
                    char.style.transform = 'rotateY(90deg)';
                    setTimeout(() => {
                        char.style.transform = 'rotateY(0)';
                    }, 10);
                }
            }, index * duration);
        });
    }

    /* ======================================================================
       Wave Animation for Elements
       ====================================================================== */

    function waveAnimation(elements, delay = 100) {
        elements.forEach((element, index) => {
            element.style.animation = `wave 2s ease-in-out ${index * delay}ms infinite`;
        });
    }

    /* ======================================================================
       Magnetic Button Effect
       ====================================================================== */

    function magneticButton(button, strength = 0.3) {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    }

    /* ======================================================================
       3D Tilt Effect
       ====================================================================== */

    function tiltEffect(element, maxTilt = 20) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = ((y - centerY) / centerY) * maxTilt;
            const tiltY = ((centerX - x) / centerX) * maxTilt;
            
            element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    }

    /* ======================================================================
       Ripple Effect
       ====================================================================== */

    function addRippleEffect(element) {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
                animation: ripple 0.6s ease-out;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    }

    /* ======================================================================
       Particle System
       ====================================================================== */

    class ParticleSystem {
        constructor(container, options = {}) {
            this.container = container;
            this.particleCount = options.particleCount || 50;
            this.particleColor = options.particleColor || '#6C63FF';
            this.minSize = options.minSize || 2;
            this.maxSize = options.maxSize || 6;
            this.minSpeed = options.minSpeed || 10;
            this.maxSpeed = options.maxSpeed || 30;
            this.particles = [];
            this.init();
        }
        
        init() {
            for (let i = 0; i < this.particleCount; i++) {
                this.createParticle();
            }
        }
        
        createParticle() {
            const particle = document.createElement('div');
            const size = Math.random() * (this.maxSize - this.minSize) + this.minSize;
            const speed = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: radial-gradient(circle, ${this.particleColor} 0%, transparent 70%);
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                pointer-events: none;
                opacity: ${Math.random() * 0.5 + 0.3};
                animation: floatParticle ${speed}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    /* ======================================================================
       Mouse Trail Effect
       ====================================================================== */

    class MouseTrail {
        constructor(options = {}) {
            this.color = options.color || '#6C63FF';
            this.size = options.size || 20;
            this.duration = options.duration || 500;
            this.init();
        }
        
        init() {
            document.addEventListener('mousemove', (e) => {
                this.createTrail(e.clientX, e.clientY);
            });
        }
        
        createTrail(x, y) {
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed;
                width: ${this.size}px;
                height: ${this.size}px;
                border-radius: 50%;
                background: ${this.color};
                left: ${x - this.size / 2}px;
                top: ${y - this.size / 2}px;
                pointer-events: none;
                z-index: 9999;
                opacity: 0.6;
                animation: fadeOutScale ${this.duration}ms ease-out forwards;
            `;
            
            document.body.appendChild(trail);
            setTimeout(() => trail.remove(), this.duration);
        }
    }

    /* ======================================================================
       Parallax Layers
       ====================================================================== */

    class ParallaxLayer {
        constructor(selector, speed = 0.5) {
            this.elements = document.querySelectorAll(selector);
            this.speed = speed;
            this.init();
        }
        
        init() {
            window.addEventListener('scroll', () => {
                this.update();
            });
        }
        
        update() {
            const scrollY = window.scrollY;
            this.elements.forEach(element => {
                const speed = element.dataset.speed || this.speed;
                const yPos = -(scrollY * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        }
    }

    /* ======================================================================
       Floating Elements
       ====================================================================== */

    function floatingAnimation(elements, options = {}) {
        elements.forEach((element, index) => {
            const duration = options.duration || (Math.random() * 2 + 3);
            const delay = options.delay || (index * 0.2);
            const distance = options.distance || 20;
            
            element.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
            element.style.setProperty('--float-distance', `${distance}px`);
        });
    }

    /* ======================================================================
       Glitch Effect
       ====================================================================== */

    function glitchEffect(element, duration = 100) {
        const original = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        let iterations = 0;
        const interval = setInterval(() => {
            element.textContent = original
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return original[index];
                    }
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                })
                .join('');
            
            if (iterations >= original.length) {
                clearInterval(interval);
            }
            
            iterations += 1 / 3;
        }, duration);
    }

    /* ======================================================================
       Initialize Animations
       ====================================================================== */

    document.addEventListener('DOMContentLoaded', function() {
        // Apply magnetic effect to buttons
        const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
        magneticButtons.forEach(btn => magneticButton(btn, 0.2));
        
        // Apply tilt effect to cards
        const tiltCards = document.querySelectorAll('.project-card, .skill-card');
        tiltCards.forEach(card => tiltEffect(card, 10));
        
        // Add ripple effect to buttons
        const rippleButtons = document.querySelectorAll('.btn, .social-link');
        rippleButtons.forEach(btn => addRippleEffect(btn));
        
        // Floating animation for hero elements
        const floatingElements = document.querySelectorAll('.hero-socials .social-link');
        floatingAnimation(floatingElements, {
            duration: 3,
            distance: 10
        });
        
        // Initialize parallax for hero section
        if (window.innerWidth > 768) {
            new ParallaxLayer('.hero-image', 0.3);
        }
        
        // Add CSS animations for ripple effect
        if (!document.getElementById('ripple-animation-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                
                @keyframes fadeOutScale {
                    to {
                        transform: scale(0);
                        opacity: 0;
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(var(--float-distance, -20px));
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        console.log('🎨 Advanced animations initialized!');
    });

    /* ======================================================================
       Export for use in other scripts
       ====================================================================== */

    window.AnimationUtils = {
        animate,
        staggerAnimation,
        ScrollAnimation,
        animateText,
        waveAnimation,
        magneticButton,
        tiltEffect,
        addRippleEffect,
        ParticleSystem,
        MouseTrail,
        ParallaxLayer,
        floatingAnimation,
        glitchEffect,
        Easing
    };

})();
