// ===== LOADING SCREEN =====
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after page loads
    window.addEventListener('load', function() {
        setTimeout(function() {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                }, 1000);
            }
        }, 1500); // Show loading for at least 1.5 seconds
    });
});

// ===== NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.featured-item, .value-item, .direction-item, .contact-item, .menu-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// ===== CURRENT TIME AND OPENING STATUS =====
document.addEventListener('DOMContentLoaded', function() {
    function updateOpeningStatus() {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour * 60 + minute; // Convert to minutes
        
        let isOpen = false;
        let statusText = 'Closed';
        let nextOpen = '';
        
        // Opening hours:
        // Monday & Wednesday: Closed
        // Tuesday & Thursday: 11:30-2pm & 4-8pm
        // Friday: 11:30-2pm & 4-8pm  
        // Saturday & Sunday: 12-3pm & 4-8pm
        
        const lunchStart = 11 * 60 + 30; // 11:30
        const lunchEnd = 14 * 60; // 2:00pm
        const dinnerStart = 16 * 60; // 4:00pm
        const dinnerEnd = 20 * 60; // 8:00pm
        
        const weekendLunchStart = 12 * 60; // 12:00
        const weekendLunchEnd = 15 * 60; // 3:00pm
        
        switch(day) {
            case 1: // Monday
            case 3: // Wednesday
                statusText = 'Closed';
                break;
                
            case 2: // Tuesday
            case 4: // Thursday
            case 5: // Friday
                if ((currentTime >= lunchStart && currentTime <= lunchEnd) ||
                    (currentTime >= dinnerStart && currentTime <= dinnerEnd)) {
                    isOpen = true;
                    statusText = 'Open';
                } else if (currentTime < lunchStart) {
                    nextOpen = 'Opens at 11:30 AM';
                } else if (currentTime > lunchEnd && currentTime < dinnerStart) {
                    nextOpen = 'Opens at 4:00 PM';
                } else {
                    nextOpen = 'Opens tomorrow at 11:30 AM';
                }
                break;
                
            case 0: // Sunday
            case 6: // Saturday
                if ((currentTime >= weekendLunchStart && currentTime <= weekendLunchEnd) ||
                    (currentTime >= dinnerStart && currentTime <= dinnerEnd)) {
                    isOpen = true;
                    statusText = 'Open';
                } else if (currentTime < weekendLunchStart) {
                    nextOpen = 'Opens at 12:00 PM';
                } else if (currentTime > weekendLunchEnd && currentTime < dinnerStart) {
                    nextOpen = 'Opens at 4:00 PM';
                } else {
                    nextOpen = 'Opens tomorrow at 12:00 PM';
                }
                break;
        }
        
        // Update status indicators on the page
        const statusElements = document.querySelectorAll('.opening-status');
        statusElements.forEach(el => {
            el.textContent = statusText;
            el.className = `opening-status ${isOpen ? 'open' : 'closed'}`;
        });
        
        const nextOpenElements = document.querySelectorAll('.next-open');
        nextOpenElements.forEach(el => {
            el.textContent = nextOpen;
        });
    }
    
    // Update status immediately and every minute
    updateOpeningStatus();
    setInterval(updateOpeningStatus, 60000);
});

// ===== PHONE CLICK TRACKING =====
document.addEventListener('DOMContentLoaded', function() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Analytics or tracking could go here
            console.log('Phone number clicked:', this.href);
        });
    });
});

// ===== MENU ITEM HIGHLIGHT =====
document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
});

// ===== MAP INTERACTION =====
document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.querySelector('.map-container');
    
    if (mapContainer) {
        mapContainer.addEventListener('click', function() {
            // Optional: Add click tracking for map interactions
            console.log('Map clicked');
        });
    }
});

// ===== SCROLL TO TOP =====
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #e67e22, #d35400);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(230, 126, 34, 0.3);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.1)';
        this.style.boxShadow = '0 8px 25px rgba(230, 126, 34, 0.4)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 5px 15px rgba(230, 126, 34, 0.3)';
    });
});

// ===== FORM VALIDATION (if forms are added later) =====
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
        
        // Email validation
        if (input.type === 'email' && input.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value.trim())) {
                isValid = false;
                input.classList.add('error');
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && input.value.trim()) {
            const phonePattern = /^[\d\s\-\+\(\)]+$/;
            if (!phonePattern.test(input.value.trim())) {
                isValid = false;
                input.classList.add('error');
            }
        }
    });
    
    return isValid;
}

// ===== PERFORMANCE OPTIMIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical images
    const criticalImages = [
        'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error reports to analytics here
});

// ===== SERVICE WORKER REGISTRATION (for offline capability) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registered successfully');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// ===== MOBILE MENU STYLES =====
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
        
        @media (max-width: 768px) {
            .nav-menu.active {
                display: flex;
                position: fixed;
                left: 0;
                top: 70px;
                flex-direction: column;
                background-color: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(10px);
                width: 100%;
                text-align: center;
                transition: 0.3s;
                box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
                padding: 2rem 0;
                gap: 1.5rem;
            }
            
            .nav-menu.active .nav-phone {
                margin-top: 1rem;
            }
        }
        
        .scroll-to-top:hover {
            transform: translateY(-3px) scale(1.1);
        }
        
        .opening-status.open {
            color: #27ae60;
            font-weight: bold;
        }
        
        .opening-status.closed {
            color: #e74c3c;
            font-weight: bold;
        }
        
        .next-open {
            font-size: 0.9rem;
            color: #7f8c8d;
            font-style: italic;
        }
        
        .error {
            border: 2px solid #e74c3c !important;
            background-color: rgba(231, 76, 60, 0.1) !important;
        }
    `;
    document.head.appendChild(style);
});

console.log('Waikanae Beach Takeaways website loaded successfully! 🌊🐟');