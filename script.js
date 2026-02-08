// Main JavaScript for Pesantren Peradaban Website - Responsive Version

document.addEventListener('DOMContentLoaded', function() {
    // Detect touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const headerEl = document.querySelector('.header');
    const heroSection = document.querySelector('.hero-section');

    function ensureWhatsappFloat() {
        if (document.querySelector('.whatsapp-float')) return;
        const link = document.createElement('a');
        link.className = 'whatsapp-float';
        link.href = 'https://wa.me/6285210738001';
        link.target = '_blank';
        link.rel = 'noopener';
        link.setAttribute('aria-label', 'WhatsApp Pesantren Peradaban');
        link.innerHTML = '<i class=\"fab fa-whatsapp\"></i>';
        document.body.appendChild(link);
    }
    
    // Create mobile navigation overlay
    let navOverlay = document.querySelector('.nav-overlay');
    if (!navOverlay && navMenu) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);
    }

    // Update header height and body padding
    function updateHeaderOffsets() {
        if (!headerEl) return;
        
        const headerH = headerEl.offsetHeight;
        const isOverlay = headerEl.classList.contains('header-transparent') && heroSection;
        document.body.style.paddingTop = isOverlay ? '0px' : headerH + 'px';
        
        if (navMenu) {
            navMenu.style.top = headerH + 'px';
        }
        
        // Update CSS custom property for other elements
        document.documentElement.style.setProperty('--header-height', headerH + 'px');
    }

    function updateHeaderTransparency() {
        if (!headerEl) return;
        if (!heroSection) {
            headerEl.classList.remove('header-transparent');
            updateHeaderOffsets();
            return;
        }
        if (window.scrollY <= 10) {
            headerEl.classList.add('header-transparent');
        } else {
            headerEl.classList.remove('header-transparent');
        }
        updateHeaderOffsets();
    }

    // Handle mobile navigation
    function setupMobileNavigation() {
        if (!navToggle || !navMenu || !navOverlay) return;

        function closeAllDropdowns() {
            document.querySelectorAll('.dropdown.active, .dropdown-mobile.active').forEach(dropdown => {
                dropdown.classList.remove('active');
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Set accessibility attributes
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        navToggle.setAttribute('aria-controls', 'navMenu');
        navToggle.setAttribute('aria-expanded', 'false');

        // Mobile navigation state
        let isNavOpen = false;

        // Open navigation
        function openNav() {
            navMenu.classList.add('active');
            navOverlay.classList.add('show');
            document.body.classList.add('nav-open');
            navToggle.innerHTML = '<i class="fas fa-times"></i>';
            navToggle.setAttribute('aria-expanded', 'true');
            isNavOpen = true;
            
            // Trap focus inside mobile nav for accessibility
            trapFocus(navMenu);
        }

        // Close navigation
        function closeNav() {
            navMenu.classList.remove('active');
            navOverlay.classList.remove('show');
            document.body.classList.remove('nav-open');
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            navToggle.setAttribute('aria-expanded', 'false');
            isNavOpen = false;
            closeAllDropdowns();
            
            // Restore focus
            navToggle.focus();
        }

        // Toggle navigation
        function toggleNav() {
            if (isNavOpen) {
                closeNav();
            } else {
                openNav();
            }
        }

        // Handle dropdown on mobile
        function setupMobileDropdowns() {
            const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
            const isMobileView = () =>
                isTouchDevice || window.matchMedia('(max-width: 768px)').matches;
            
            dropdownToggles.forEach(toggle => {
                if (toggle.dataset.ppDropdownBound === 'true') return;
                toggle.dataset.ppDropdownBound = 'true';
                // Remove hover behavior on touch devices
                if (isTouchDevice) {
                    toggle.parentElement.classList.add('dropdown-mobile');
                }

                toggle.addEventListener('click', function(e) {
                    if (!isMobileView()) return;
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const dropdown = this.parentElement;
                    const isActive = dropdown.classList.contains('active');
                    
                    // Close other dropdowns
                    closeAllDropdowns();
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('active', !isActive);
                    
                    // Update aria-expanded
                    this.setAttribute('aria-expanded', String(!isActive));
                });
            });
            
            // Close dropdown when clicking outside
            if (document.body.dataset.ppDropdownDocBound !== 'true') {
                document.body.dataset.ppDropdownDocBound = 'true';
                document.addEventListener('click', function(e) {
                    if (isMobileView()) {
                        const clickedInsideDropdown = e.target.closest('.dropdown');
                        if (!clickedInsideDropdown) {
                            closeAllDropdowns();
                        }
                    }
                });
            }
        }

        // Setup event listeners
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Only handle on mobile screens
            if (window.innerWidth > 768) return;
            
            toggleNav();
        });

        navOverlay.addEventListener('click', function() {
            if (window.innerWidth <= 768 && isNavOpen) {
                closeNav();
                closeAllDropdowns();
            }
        });

        // Close nav when clicking outside on mobile
        document.addEventListener('click', function(event) {
            if (window.innerWidth > 768 || !isNavOpen) return;
            
            const clickedInsideNav = navMenu.contains(event.target);
            const clickedToggle = navToggle.contains(event.target);
            
            if (!clickedInsideNav && !clickedToggle) {
                closeNav();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isNavOpen) {
                closeNav();
                closeAllDropdowns();
            }
        });

        // Close mobile nav when resizing to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && isNavOpen) {
                closeNav();
            }
            
            // Re-initialize dropdowns on resize
            setupMobileDropdowns();
            closeAllDropdowns();
        });

        // Close dropdowns and nav when a link is clicked
        navMenu.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;
            if (link.classList.contains('dropdown-toggle')) return;
            closeAllDropdowns();
            if (window.innerWidth <= 768 && isNavOpen) {
                closeNav();
            }
        });

        // Initialize mobile dropdowns
        setupMobileDropdowns();
    }

    // Initialize navigation
    updateHeaderOffsets();
    window.addEventListener('resize', debounce(updateHeaderOffsets, 150));
    setupMobileNavigation();
    updateHeaderTransparency();
    setTimeout(updateHeaderTransparency, 0);
    window.addEventListener('scroll', debounce(updateHeaderTransparency, 20), { passive: true });
    ensureWhatsappFloat();
    setActiveNavLink();

    function setActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-link');
        if (!navLinks.length) return;
        const path = window.location.pathname.replace(/\\/g, '/');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href === '#' || href.startsWith('http')) return;
            const normalizedHref = href.replace(/\\/g, '/');
            const isIndex = /(^|\/)index\.html$/.test(normalizedHref);
            const matches = path.endsWith(normalizedHref) || (isIndex && (path.endsWith('/') || path.endsWith('/index.html')));
            if (matches) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Carousel Functionality with responsive improvements
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (carouselContainer) {
        // Element references
        const slides = document.querySelectorAll('.carousel-slide');
        const progressBar = document.querySelector('.carousel-progress');
        const progressSegments = document.querySelector('.carousel-progress-segments');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;
        let isTransitioning = false;
        let touchStartX = 0;
        let touchEndX = 0;
        
        // Swipe threshold (px)
        const SWIPE_THRESHOLD = 50;
        
        // Initialize carousel
        function initCarousel() {
            setupProgressSegments();
            // Start auto slide
            startAutoSlide();
            
            // Set initial active state
            updateSlide();
            
            // Event listeners for arrows
            if (prevBtn) {
                prevBtn.addEventListener('click', showPrevSlide);
                // Add touch support for arrows on mobile
                if (isTouchDevice) {
                    prevBtn.addEventListener('touchstart', handleTouchStart);
                }
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', showNextSlide);
                if (isTouchDevice) {
                    nextBtn.addEventListener('touchstart', handleTouchStart);
                }
            }
            
            // Pause auto slide on hover
            carouselContainer.addEventListener('mouseenter', pauseAutoSlide);
            carouselContainer.addEventListener('mouseleave', startAutoSlide);
            
            // Touch events for mobile swipe
            setupTouchEvents();
            
            // Keyboard navigation
            setupKeyboardNavigation();
            
            // Handle window resize
            window.addEventListener('resize', handleCarouselResize);
        }
        
        // Setup touch events with better mobile support
        function setupTouchEvents() {
            let touchStartY = 0;
            let isScrolling = false;
            
            carouselContainer.addEventListener('touchstart', function(e) {
                if (e.touches.length > 1) return; // Ignore multi-touch
                
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                isScrolling = false;
                pauseAutoSlide();
            }, { passive: true });
            
            carouselContainer.addEventListener('touchmove', function(e) {
                if (!touchStartX || e.touches.length > 1) return;
                
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                
                // Calculate movement
                const diffX = touchX - touchStartX;
                const diffY = touchY - touchStartY;
                
                // Check if user is scrolling vertically
                if (Math.abs(diffY) > Math.abs(diffX)) {
                    isScrolling = true;
                }
                
                // Prevent default only for horizontal swipes to allow vertical scrolling
                if (!isScrolling && Math.abs(diffX) > 10) {
                    e.preventDefault();
                }
            }, { passive: false });
            
            carouselContainer.addEventListener('touchend', function(e) {
                if (!touchStartX || isScrolling) {
                    resetTouch();
                    startAutoSlide();
                    return;
                }
                
                touchEndX = e.changedTouches[0].clientX;
                handleSwipe();
                resetTouch();
                startAutoSlide();
            }, { passive: true });
            
            function resetTouch() {
                touchStartX = 0;
                touchStartY = 0;
                touchEndX = 0;
                isScrolling = false;
            }
        }
        
        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > SWIPE_THRESHOLD) {
                if (diff > 0) {
                    // Swipe left - next slide
                    showNextSlide();
                } else {
                    // Swipe right - previous slide
                    showPrevSlide();
                }
            }
        }
        
        function handleTouchStart(e) {
            e.preventDefault();
            pauseAutoSlide();
        }
        
        function setupKeyboardNavigation() {
            document.addEventListener('keydown', function(e) {
                // Only handle if carousel is visible
                if (!carouselContainer.checkVisibility()) return;
                
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    showPrevSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    showNextSlide();
                } else if (e.key >= '1' && e.key <= '9') {
                    const slideIndex = parseInt(e.key) - 1;
                    if (slideIndex < totalSlides) {
                        goToSlide(slideIndex);
                    }
                }
            });
        }
        
        function handleCarouselResize() {
            // Update any carousel dimensions if needed
            updateSlide();
        }
        
        // Show next slide
        function showNextSlide() {
            if (isTransitioning) return;
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlide();
            resetAutoSlide();
        }
        
        // Show previous slide
        function showPrevSlide() {
            if (isTransitioning) return;
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlide();
            resetAutoSlide();
        }
        
        // Go to specific slide
        function goToSlide(slideIndex) {
            if (isTransitioning || slideIndex === currentSlide || slideIndex < 0 || slideIndex >= totalSlides) return;
            currentSlide = slideIndex;
            updateSlide();
            resetAutoSlide();
        }
        
        // Update slide display with smooth transitions
        function updateSlide() {
            isTransitioning = true;
            
            // Hide all slides
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Show current slide with slight delay for smooth transition
            requestAnimationFrame(() => {
                slides[currentSlide].classList.add('active');
                updateProgressBar();
                
                // Update ARIA attributes for accessibility
                slides.forEach((slide, index) => {
                    slide.setAttribute('aria-hidden', index !== currentSlide);
                    slide.setAttribute('aria-label', `Slide ${index + 1} of ${totalSlides}`);
                });
                
                // Announce slide change for screen readers
                announceSlideChange(currentSlide + 1);
                
                // Reset transitioning flag
                setTimeout(() => {
                    isTransitioning = false;
                }, 800); // Match CSS transition duration
            });
        }

        function setupProgressSegments() {
            if (!progressSegments || progressSegments.childElementCount > 0) return;
            for (let i = 0; i < totalSlides; i += 1) {
                const segment = document.createElement('button');
                segment.type = 'button';
                segment.className = 'carousel-progress-segment';
                segment.setAttribute('aria-label', `Ke slide ${i + 1}`);
                segment.addEventListener('click', () => {
                    if (isTransitioning) return;
                    goToSlide(i);
                });
                progressSegments.appendChild(segment);
            }
        }

        function updateProgressBar() {
            if (totalSlides === 0) return;
            if (progressBar) {
                progressBar.setAttribute('aria-valuemin', '1');
                progressBar.setAttribute('aria-valuemax', `${totalSlides}`);
                progressBar.setAttribute('aria-valuenow', `${currentSlide + 1}`);
            }
            if (progressSegments) {
                Array.from(progressSegments.children).forEach((segment, index) => {
                    segment.classList.toggle('active', index === currentSlide);
                });
            }
        }
        
        function announceSlideChange(slideNumber) {
            // Create or update live region for screen readers
            let liveRegion = document.getElementById('carousel-live-region');
            if (!liveRegion) {
                liveRegion = document.createElement('div');
                liveRegion.id = 'carousel-live-region';
                liveRegion.className = 'visually-hidden';
                liveRegion.setAttribute('aria-live', 'polite');
                liveRegion.setAttribute('aria-atomic', 'true');
                carouselContainer.appendChild(liveRegion);
            }
            
            liveRegion.textContent = `Slide ${slideNumber} of ${totalSlides}`;
        }
        
        // Auto slide functionality
        function startAutoSlide() {
            if (totalSlides <= 1) return; // Don't auto-slide if only one slide
            
            clearInterval(slideInterval);
            slideInterval = setInterval(showNextSlide, 5000);
        }
        
        function pauseAutoSlide() {
            clearInterval(slideInterval);
        }
        
        function resetAutoSlide() {
            pauseAutoSlide();
            startAutoSlide();
        }
        
        // Initialize the carousel
        initCarousel();
        
        // Pause auto-slide when page is not visible
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                pauseAutoSlide();
            } else {
                startAutoSlide();
            }
        });
        
        // Public API untuk kontrol dari luar jika diperlukan
        window.pesantrenCarousel = {
            nextSlide: showNextSlide,
            prevSlide: showPrevSlide,
            goToSlide: goToSlide,
            pause: pauseAutoSlide,
            play: startAutoSlide,
            getCurrentSlide: () => currentSlide,
            getTotalSlides: () => totalSlides
        };
    }
    
    // Smooth scrolling for anchor links with responsive improvements
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or external link
            if (href === '#' || href.startsWith('http')) return;
            
            // Check if the target is on the same page
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navOverlay.classList.remove('show');
                    document.body.classList.remove('nav-open');
                    if (navToggle) {
                        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
                
                // Calculate header height for offset
                const headerHeight = headerEl ? headerEl.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Smooth scroll with reduced motion support
                if (prefersReducedMotion()) {
                    window.scrollTo(0, targetPosition);
                } else {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Update URL hash without scrolling again
                history.pushState(null, null, href);
                
                // Focus the target for accessibility
                setTimeout(() => {
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                    targetElement.removeAttribute('tabindex');
                }, 1000);
            }
        });
    });
    
    // Add active class to current page in navigation
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkText = (link.textContent || '').trim();
            
            // Remove active class from all
            link.classList.remove('active');
            
            // Check if this link matches current page
            if (linkHref === currentPage || 
                (currentPage === 'index.html' && linkHref === 'index.html') ||
                (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
            
            // Handle program pages
            const programPages = ['smp-pesantren.html', 'sma-fullday.html', 'sma-boarding.html'];
            if (programPages.includes(currentPage) && linkHref === '#' && linkText.includes('Program')) {
                // This is for the program dropdown
                link.classList.add('active');
            }

            // Handle informasi pages (profil, kegiatan, alumni, faq)
            const infoPages = ['profil.html', 'kegiatan.html', 'alumni.html', 'faq.html'];
            if (infoPages.includes(currentPage) && linkHref === '#' && linkText.includes('Informasi')) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveNavLink();
    
    // Form validation for contact/registration forms
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        // Improve form accessibility
        form.setAttribute('novalidate', 'true');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            const firstInvalidInput = null;
            
            inputs.forEach((input, index) => {
                // Reset error state
                input.classList.remove('error');
                input.removeAttribute('aria-invalid');
                
                // Remove existing error messages
                const errorMsg = input.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
                
                // Check if field is empty
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    input.setAttribute('aria-invalid', 'true');
                    
                    if (!firstInvalidInput) {
                        firstInvalidInput = input;
                    }
                    
                    // Create error message
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = input.getAttribute('data-error-message') || 'Field ini harus diisi';
                    errorMsg.setAttribute('role', 'alert');
                    errorMsg.setAttribute('aria-live', 'polite');
                    errorMsg.style.color = '#e74c3c';
                    errorMsg.style.fontSize = '0.85rem';
                    errorMsg.style.marginTop = '0.3rem';
                    
                    input.insertAdjacentElement('afterend', errorMsg);
                } else {
                    // Email validation
                    if (input.type === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(input.value)) {
                            isValid = false;
                            input.classList.add('error');
                            input.setAttribute('aria-invalid', 'true');
                            
                            const errorMsg = document.createElement('div');
                            errorMsg.className = 'error-message';
                            errorMsg.textContent = 'Format email tidak valid';
                            errorMsg.setAttribute('role', 'alert');
                            errorMsg.setAttribute('aria-live', 'polite');
                            errorMsg.style.color = '#e74c3c';
                            errorMsg.style.fontSize = '0.85rem';
                            errorMsg.style.marginTop = '0.3rem';
                            
                            input.insertAdjacentElement('afterend', errorMsg);
                        }
                    }
                    
                    // Phone validation
                    if (input.type === 'tel' || input.name === 'phone') {
                        const phoneRegex = /^[0-9+\-\s()]{10,}$/;
                        if (!phoneRegex.test(input.value)) {
                            isValid = false;
                            input.classList.add('error');
                            input.setAttribute('aria-invalid', 'true');
                            
                            const errorMsg = document.createElement('div');
                            errorMsg.className = 'error-message';
                            errorMsg.textContent = 'Format nomor telepon tidak valid';
                            errorMsg.setAttribute('role', 'alert');
                            errorMsg.setAttribute('aria-live', 'polite');
                            errorMsg.style.color = '#e74c3c';
                            errorMsg.style.fontSize = '0.85rem';
                            errorMsg.style.marginTop = '0.3rem';
                            
                            input.insertAdjacentElement('afterend', errorMsg);
                        }
                    }
                }
            });
            
            if (isValid) {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.textContent = 'Form berhasil dikirim! Kami akan menghubungi Anda segera.';
                successMsg.setAttribute('role', 'alert');
                successMsg.setAttribute('aria-live', 'polite');
                successMsg.style.backgroundColor = '#2ecc71';
                successMsg.style.color = 'white';
                successMsg.style.padding = '1rem';
                successMsg.style.borderRadius = '8px';
                successMsg.style.marginTop = '1.5rem';
                successMsg.style.textAlign = 'center';
                
                // Remove any existing success message
                const existingMsg = form.querySelector('.success-message');
                if (existingMsg) {
                    existingMsg.remove();
                }
                
                form.appendChild(successMsg);
                
                // Focus on success message for screen readers
                successMsg.focus();
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    form.reset();
                    successMsg.remove();
                }, 3000);
                
                // In a real application, you would submit the form data here
                // form.submit();
            } else if (firstInvalidInput) {
                // Focus on first invalid input
                firstInvalidInput.focus();
            }
        });
        
        // Clear error on input
        form.addEventListener('input', function(e) {
            const input = e.target;
            
            if (input.classList.contains('error')) {
                input.classList.remove('error');
                input.removeAttribute('aria-invalid');
                
                // Remove error message
                const errorMsg = input.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });
        
        // Improve form field focus
        form.addEventListener('focusin', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                e.target.parentElement.classList.add('focused');
            }
        });
        
        form.addEventListener('focusout', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                e.target.parentElement.classList.remove('focused');
            }
        });
    });
    
    // Counter animation for stats with Intersection Observer
    function toLatinDigits(value) {
        if (!value) return '';
        return value
            .replace(/[\u0660-\u0669]/g, d => String(d.charCodeAt(0) - 0x0660))
            .replace(/[\u06F0-\u06F9]/g, d => String(d.charCodeAt(0) - 0x06F0));
    }

    function toArabicDigits(value) {
        return String(value).replace(/\d/g, d => String.fromCharCode(0x0660 + Number(d)));
    }

    function formatCounterValue(value, suffix, element) {
        const isRtl = document.documentElement.dir === 'rtl' || element.closest('.lang-rtl');
        const formatted = isRtl ? toArabicDigits(value) : String(value);
        let safeSuffix = suffix || '';
        if (isRtl && safeSuffix === '%') safeSuffix = '٪';
        return formatted + safeSuffix;
    }

    function animateCounter(element, target, suffix = '', duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = formatCounterValue(target, suffix, element);
                clearInterval(timer);
            } else {
                element.textContent = formatCounterValue(Math.floor(current), suffix, element);
            }
        }, 16);
    }
    
    // Initialize counter animation when stats are in viewport
    function initCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statNumbers.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const rawTarget = element.getAttribute('data-target') || element.textContent;
                    const target = parseInt(toLatinDigits(rawTarget).replace(/[^\d]/g, ''), 10);
                    if (Number.isNaN(target)) return;
                    const suffix = element.getAttribute('data-suffix') ||
                        (element.textContent.includes('%') || element.textContent.includes('٪') ? '%' :
                        (element.textContent.includes('+') ? '+' : ''));
                    
                    if (!element.classList.contains('animated')) {
                        element.classList.add('animated');
                        
                        // Use reduced motion if preferred
                        if (prefersReducedMotion()) {
                            element.textContent = formatCounterValue(target, suffix, element);
                        } else {
                            animateCounter(element, target, suffix);
                        }
                    }
                }
            });
        }, { 
            threshold: 0.5,
            rootMargin: '50px'
        });
        
        statNumbers.forEach(number => {
            observer.observe(number);
        });
    }
    
    // Call counter initialization
    initCounters();
    
    // Back to top button with responsive positioning
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    
    // Apply styles via CSS class
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .back-to-top {
                position: fixed;
                bottom: calc(var(--pp-fab-offset, 1.25rem) + var(--pp-fab-size, 54px) + var(--pp-fab-gap, 12px));
                right: var(--pp-fab-right, 1.25rem);
                width: clamp(40px, 4.5vw, 46px);
                height: clamp(40px, 4.5vw, 46px);
                background-color: rgba(212, 175, 55, 0.95);
                color: var(--navy);
                border-radius: 50%;
                border: 1px solid rgba(10, 42, 94, 0.12);
                font-size: clamp(0.95rem, 2.2vw, 1.05rem);
                cursor: pointer;
                box-shadow: 0 6px 14px rgba(10, 42, 94, 0.14);
                z-index: 100;
                opacity: 0;
                transform: translateY(18px);
                transition: opacity 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
            
            .back-to-top.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .back-to-top:hover,
            .back-to-top:focus {
                background-color: var(--gold-light);
                transform: translateY(-3px);
                box-shadow: 0 10px 22px rgba(10, 42, 94, 0.2);
            }
            
            .back-to-top:active {
                transform: translateY(-1px);
            }
            
            @media (max-width: 768px) {
                .back-to-top {
                    bottom: calc(var(--pp-fab-offset, 1.25rem) + var(--pp-fab-size, 54px) + var(--pp-fab-gap, 12px));
                    right: var(--pp-fab-right, 1.25rem);
                }
            }
            
            @media (max-width: 576px) {
                .back-to-top {
                    bottom: calc(var(--pp-fab-offset, 1.25rem) + var(--pp-fab-size, 54px) + var(--pp-fab-gap, 12px));
                    right: var(--pp-fab-right, 1.25rem);
                }
            }
            
            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .back-to-top {
                    transition: opacity 0.3s ease;
                }
                
                .back-to-top:hover,
                .back-to-top:focus {
                    transform: none;
                }
            }
        </style>
    `);
    
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', () => {
        if (prefersReducedMotion()) {
            window.scrollTo(0, 0);
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Focus management for accessibility
        setTimeout(() => {
            const firstFocusable = document.querySelector('header a, header button');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 500);
    });
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        // Debounce scroll events
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.scrollY > 650) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 100);
    });
    
    // Add loading animation for images with lazy loading support
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Skip if already loaded
        if (img.complete) {
            img.classList.add('loaded');
            return;
        }
        
        img.classList.add('loading');
        
        img.addEventListener('load', function() {
            this.classList.remove('loading');
            this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            this.classList.remove('loading');
            this.classList.add('error');
            console.error('Failed to load image:', this.src);
        });
    });
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    img.removeAttribute('data-src');
                    img.removeAttribute('data-srcset');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Add CSS for loading states
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            img.loading {
                opacity: 0;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
                border-radius: 4px;
            }
            
            img.loaded {
                opacity: 1;
                transition: opacity 0.3s ease;
            }
            
            img.error {
                opacity: 1;
                background-color: #ffe6e6;
                border: 1px solid #ffcccc;
            }
            
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            
            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                img.loading {
                    animation: none;
                }
            }
        </style>
    `);
    
    // Responsive table handling
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        if (table.offsetWidth > table.parentElement.offsetWidth) {
            table.parentElement.style.overflowX = 'auto';
            table.parentElement.style.WebkitOverflowScrolling = 'touch';
        }
    });
    
    // Handle responsive video embeds
    const videos = document.querySelectorAll('iframe[src*="youtube"], iframe[src*="vimeo"]');
    videos.forEach(video => {
        video.style.width = '100%';
        video.style.height = 'auto';
        video.style.aspectRatio = '16 / 9';
    });
    
    // Initialize all page components
    initializePageComponents();
});


// ============================================
// UTILITY FUNCTIONS
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="email"], input[type="tel"], input[type="submit"], select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    });
}

function initializePageComponents() {
    // Initialize any additional page-specific components
    const pageId = document.body.id || document.body.getAttribute('data-page');
    
    switch(pageId) {
        case 'home-page':
            initHomePageComponents();
            break;
        case 'program-page':
            initProgramPageComponents();
            break;
        case 'teacher-page':
            initTeacherPageComponents();
            break;
        case 'contact-page':
            initContactPageComponents();
            break;
        default:
            initCommonComponents();
    }
}

function initHomePageComponents() {
    // Home page specific initialization
    console.log('Initializing home page components');
}

function initProgramPageComponents() {
    // Program page specific initialization
    console.log('Initializing program page components');
}

function initTeacherPageComponents() {
    // Teacher page specific initialization
    console.log('Initializing teacher page components');
}

function initContactPageComponents() {
    // Contact page specific initialization
    console.log('Initializing contact page components');
}

function initCommonComponents() {
    // Common components for all pages
    console.log('Initializing common components');
}

// ============================================
// JAVASCRIPT KHUSUS UNTUK HALAMAN PESANTREN PERADABAN
// Responsive improvements
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi semua komponen halaman dengan responsive handling
    pp_initPageComponents();
});

function pp_initPageComponents() {
    // Initialize form validation with mobile support
    if (typeof pp_initFormValidation === 'function') {
        pp_initFormValidation();
    }
    
    // Initialize registration form steps with responsive UI
    if (typeof pp_initRegistrationSteps === 'function') {
        pp_initRegistrationSteps();
    }
    
    // Initialize teacher modal with touch support
    if (typeof pp_initTeacherModal === 'function') {
        pp_initTeacherModal();
    }
    
    // Initialize image gallery with mobile gestures
    if (typeof pp_initImageGallery === 'function') {
        pp_initImageGallery();
    }

    // Initialize gallery reveal animations
    if (typeof pp_initGalleryReveal === 'function') {
        pp_initGalleryReveal();
    }

    if (typeof pp_initGalleryFilters === 'function') {
        pp_initGalleryFilters();
    }
    
    // Initialize counters with Intersection Observer
    if (typeof pp_initCounters === 'function') {
        pp_initCounters();
    }
    
    // Initialize accordion with mobile touch
    if (typeof pp_initAccordion === 'function') {
        pp_initAccordion();
    }
    
    // Initialize responsive tables
    if (typeof pp_initResponsiveTables === 'function') {
        pp_initResponsiveTables();
    }
    
    // Initialize mobile menu for PP pages
    if (typeof pp_initMobileMenu === 'function') {
        pp_initMobileMenu();
    }
}

function pp_initMobileMenu() {
    // Mobile menu handling for PP pages
    const mobileMenuToggle = document.querySelector('.pp-mobile-menu-toggle');
    if (!mobileMenuToggle) return;
    
    const mobileMenu = document.querySelector('.pp-mobile-menu');
    if (!mobileMenu) return;
    
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('active');
        
        if (!isExpanded) {
            // Trap focus in mobile menu
            trapFocus(mobileMenu);
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.focus();
        }
    });
}

function pp_initResponsiveTables() {
    const tables = document.querySelectorAll('.pp-table');
    
    tables.forEach(table => {
        // Add wrapper for horizontal scrolling on mobile
        if (!table.parentElement.classList.contains('pp-table-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'pp-table-wrapper';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
            
            // Add scroll indicator for mobile
            if (window.innerWidth <= 768) {
                const indicator = document.createElement('div');
                indicator.className = 'pp-scroll-indicator';
                indicator.innerHTML = '<span>← Scroll →</span>';
                wrapper.appendChild(indicator);
            }
        }
        
        // Make table headers sticky on mobile
        if (window.innerWidth <= 768) {
            const headers = table.querySelectorAll('th');
            headers.forEach(header => {
                header.style.position = 'sticky';
                header.style.top = '0';
                header.style.backgroundColor = 'var(--pp-light-gray)';
                header.style.zIndex = '1';
            });
        }
    });
    
    // Update on resize
    window.addEventListener('resize', debounce(function() {
        tables.forEach(table => {
            const wrapper = table.parentElement;
            const indicator = wrapper.querySelector('.pp-scroll-indicator');
            
            if (window.innerWidth <= 768 && !indicator) {
                const indicator = document.createElement('div');
                indicator.className = 'pp-scroll-indicator';
                indicator.innerHTML = '<span>← Scroll →</span>';
                wrapper.appendChild(indicator);
            } else if (window.innerWidth > 768 && indicator) {
                indicator.remove();
            }
        });
    }, 250));
}

// Override form validation with mobile improvements
function pp_validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = field.getAttribute('data-error-required') || 'Field ini harus diisi';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = field.getAttribute('data-error-email') || 'Format email tidak valid';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        // More flexible phone validation for international numbers
        const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)\.]{9,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = field.getAttribute('data-error-phone') || 'Format nomor telepon tidak valid';
        }
    }
    
    // Show error message
    if (!isValid) {
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        
        let errorElement = field.nextElementSibling;
        
        if (!errorElement || !errorElement.classList.contains('pp-form-error')) {
            errorElement = document.createElement('div');
            errorElement.className = 'pp-form-error';
            errorElement.setAttribute('role', 'alert');
            errorElement.setAttribute('aria-live', 'polite');
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        
        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
        
        // Scroll to error on mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    } else {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('pp-form-error')) {
            errorElement.classList.remove('show');
        }
    }
    
    return isValid;
}

// Update teacher modal for mobile
function pp_initTeacherModal() {
    const teacherCards = document.querySelectorAll('.pp-teacher-card');
    if (teacherCards.length === 0) return;
    
    // Create modal only once
    let modal = document.querySelector('.pp-teacher-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'pp-teacher-modal';
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('role', 'dialog');
        
        modal.innerHTML = `
            <div class="pp-modal-content" role="document">
                <button class="pp-modal-close" aria-label="Close modal">&times;</button>
                <div class="pp-modal-body"></div>
                <div class="pp-modal-footer">
                    <button class="pp-modal-prev" aria-label="Previous teacher">&lsaquo;</button>
                    <button class="pp-modal-next" aria-label="Next teacher">&rsaquo;</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    let currentTeacherIndex = 0;
    const teacherData = [];
    
    // Collect teacher data
    teacherCards.forEach((card, index) => {
        const name = card.querySelector('.pp-teacher-name')?.textContent || '';
        const subject = card.querySelector('.pp-teacher-subject')?.textContent || '';
        const bio = card.querySelector('.pp-teacher-bio')?.textContent || '';
        const imgSrc = card.querySelector('img')?.src || '';
        
        teacherData.push({ name, subject, bio, imgSrc, index });
        
        // Make cards clickable
        card.style.cursor = 'pointer';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View details for ${name}`);
        
        card.addEventListener('click', () => openTeacherModal(index));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openTeacherModal(index);
            }
        });
    });
    
    function openTeacherModal(index) {
        currentTeacherIndex = index;
        updateModalContent();
        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'flex';
        
        // Trap focus in modal
        trapFocus(modal);
        
        // Prevent body scrolling on mobile
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
        
        // Restore body scrolling
        document.body.style.overflow = '';
        
        // Return focus to the card that opened the modal
        teacherCards[currentTeacherIndex].focus();
    }
    
    function updateModalContent() {
        const teacher = teacherData[currentTeacherIndex];
        const modalBody = modal.querySelector('.pp-modal-body');
        
        modalBody.innerHTML = `
            <div class="pp-modal-teacher">
                <div class="pp-modal-img">
                    <img src="${teacher.imgSrc}" alt="${teacher.name}" loading="lazy">
                </div>
                <div class="pp-modal-info">
                    <h2>${teacher.name}</h2>
                    <h3>${teacher.subject}</h3>
                    <p>${teacher.bio}</p>
                    <div class="pp-modal-details">
                        <p><strong>Pendidikan:</strong> S1 Pendidikan Agama Islam - Universitas Islam Negeri</p>
                        <p><strong>Pengalaman:</strong> 10+ tahun mengajar di pesantren</p>
                        <p><strong>Keahlian:</strong> Tahfiz Al-Qur'an, Fiqh, Bahasa Arab</p>
                    </div>
                </div>
            </div>
        `;
        
        // Update navigation buttons state
        const prevBtn = modal.querySelector('.pp-modal-prev');
        const nextBtn = modal.querySelector('.pp-modal-next');
        
        prevBtn.disabled = currentTeacherIndex === 0;
        nextBtn.disabled = currentTeacherIndex === teacherData.length - 1;
    }
    
    // Modal event listeners
    modal.querySelector('.pp-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.pp-modal-prev').addEventListener('click', () => {
        if (currentTeacherIndex > 0) {
            currentTeacherIndex--;
            updateModalContent();
        }
    });
    modal.querySelector('.pp-modal-next').addEventListener('click', () => {
        if (currentTeacherIndex < teacherData.length - 1) {
            currentTeacherIndex++;
            updateModalContent();
        }
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                if (currentTeacherIndex > 0) {
                    currentTeacherIndex--;
                    updateModalContent();
                }
            } else if (e.key === 'ArrowRight') {
                if (currentTeacherIndex < teacherData.length - 1) {
                    currentTeacherIndex++;
                    updateModalContent();
                }
            }
        }
    });
    
    // Add responsive modal styles
    const style = document.createElement('style');
    style.textContent = `
        .pp-teacher-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            box-sizing: border-box;
        }
        
        .pp-modal-content {
            background-color: white;
            border-radius: 12px;
            max-width: min(800px, 90vw);
            width: 100%;
            max-height: min(90vh, 600px);
            overflow-y: auto;
            position: relative;
            animation: pp-modalFadeIn 0.3s ease;
        }
        
        .pp-modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 44px;
            height: 44px;
            font-size: 1.5rem;
            color: var(--pp-navy);
            background: none;
            border: none;
            cursor: pointer;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }
        
        .pp-modal-body {
            padding: 2rem;
        }
        
        .pp-modal-footer {
            display: flex;
            justify-content: space-between;
            padding: 1rem 2rem;
            border-top: 1px solid var(--pp-gray);
        }
        
        .pp-modal-prev,
        .pp-modal-next {
            background: var(--pp-gold);
            color: var(--pp-navy);
            border: none;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .pp-modal-prev:disabled,
        .pp-modal-next:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }
        
        .pp-modal-teacher {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        
        @media (min-width: 768px) {
            .pp-modal-teacher {
                grid-template-columns: 1fr 2fr;
            }
            
            .pp-modal-body {
                padding: 3rem;
            }
        }
        
        .pp-modal-img {
            border-radius: 12px;
            overflow: hidden;
            aspect-ratio: 1;
        }
        
        .pp-modal-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        
        .pp-modal-info h2 {
            color: var(--pp-navy);
            margin-bottom: 0.5rem;
            font-size: 1.5rem;
        }
        
        .pp-modal-info h3 {
            color: var(--pp-gold);
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
        }
        
        .pp-modal-info p {
            color: var(--pp-dark-gray);
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }
        
        .pp-modal-details p {
            margin-bottom: 0.5rem;
            font-size: 0.95rem;
        }
        
        @keyframes pp-modalFadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
            .pp-modal-content {
                animation: none;
            }
        }
        
        /* Mobile landscape */
        @media (max-height: 500px) and (orientation: landscape) {
            .pp-modal-content {
                max-height: 85vh;
            }
        }
    `;
    document.head.appendChild(style);
}

// Update image gallery for mobile gestures
function pp_initImageGallery() {
    const galleryContainers = document.querySelectorAll('.pp-gallery');
    if (galleryContainers.length === 0) return;

    // Create lightbox once
    let lightbox = document.querySelector('.pp-lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'pp-lightbox';
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-label', 'Image gallery');
        
        lightbox.innerHTML = `
            <button class="pp-lightbox-close" aria-label="Close gallery">&times;</button>
            <button class="pp-lightbox-prev" aria-label="Previous image">&lsaquo;</button>
            <button class="pp-lightbox-next" aria-label="Next image">&rsaquo;</button>
            <div class="pp-lightbox-content">
                <img src="" alt="" loading="lazy">
            </div>
            <div class="pp-lightbox-counter"></div>
        `;
        document.body.appendChild(lightbox);
    }

    lightbox._galleryImages = lightbox._galleryImages || [];
    lightbox._originImages = lightbox._originImages || [];
    lightbox._currentIndex = lightbox._currentIndex || 0;

    function updateLightbox() {
        const lightboxImg = lightbox.querySelector('img');
        const counter = lightbox.querySelector('.pp-lightbox-counter');
        const galleryImages = lightbox._galleryImages || [];
        const currentImageIndex = lightbox._currentIndex || 0;

        if (!galleryImages.length) return;

        lightboxImg.src = galleryImages[currentImageIndex].src;
        lightboxImg.alt = galleryImages[currentImageIndex].alt;

        counter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;

        const prevBtn = lightbox.querySelector('.pp-lightbox-prev');
        const nextBtn = lightbox.querySelector('.pp-lightbox-next');

        prevBtn.disabled = currentImageIndex === 0;
        nextBtn.disabled = currentImageIndex === galleryImages.length - 1;
    }

    function closeLightbox() {
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.style.display = 'none';
        document.body.style.overflow = '';

        const origin = lightbox._originImages[lightbox._currentIndex];
        if (origin) {
            origin.focus();
        }
    }

    if (lightbox.dataset.ppBound !== 'true') {
        lightbox.dataset.ppBound = 'true';

        lightbox.querySelector('.pp-lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.pp-lightbox-prev').addEventListener('click', () => {
            if (lightbox._currentIndex > 0) {
                lightbox._currentIndex -= 1;
                updateLightbox();
            }
        });
        lightbox.querySelector('.pp-lightbox-next').addEventListener('click', () => {
            if (lightbox._galleryImages && lightbox._currentIndex < lightbox._galleryImages.length - 1) {
                lightbox._currentIndex += 1;
                updateLightbox();
            }
        });

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    if (lightbox._currentIndex > 0) {
                        lightbox._currentIndex -= 1;
                        updateLightbox();
                    }
                } else if (e.key === 'ArrowRight') {
                    if (lightbox._galleryImages && lightbox._currentIndex < lightbox._galleryImages.length - 1) {
                        lightbox._currentIndex += 1;
                        updateLightbox();
                    }
                }
            }
        });

        if ('ontouchstart' in window) {
            let touchStartX = 0;
            let touchEndX = 0;

            lightbox.addEventListener('touchstart', function(e) {
                if (e.touches.length > 1) return;
                touchStartX = e.touches[0].clientX;
            }, { passive: true });

            lightbox.addEventListener('touchend', function(e) {
                if (!touchStartX) return;

                touchEndX = e.changedTouches[0].clientX;
                const diff = touchStartX - touchEndX;

                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        if (lightbox._galleryImages && lightbox._currentIndex < lightbox._galleryImages.length - 1) {
                            lightbox._currentIndex += 1;
                            updateLightbox();
                        }
                    } else {
                        if (lightbox._currentIndex > 0) {
                            lightbox._currentIndex -= 1;
                            updateLightbox();
                        }
                    }
                }

                touchStartX = 0;
                touchEndX = 0;
            }, { passive: true });
        }
    }
    
    galleryContainers.forEach(container => {
        const images = container.querySelectorAll('img');
        if (images.length === 0) return;
        
        const galleryImages = Array.from(images);
        
        images.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');

            const open = () => {
                lightbox._galleryImages = galleryImages;
                lightbox._originImages = galleryImages;
                lightbox._currentIndex = index;
                updateLightbox();
                lightbox.setAttribute('aria-hidden', 'false');
                lightbox.style.display = 'flex';

                trapFocus(lightbox);

                if (window.innerWidth <= 768) {
                    document.body.style.overflow = 'hidden';
                }
            };
            
            img.addEventListener('click', open);
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open();
                }
            });
        });
    });
    
    // Add lightbox styles
    const style = document.createElement('style');
    style.textContent = `
        .pp-lightbox {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            box-sizing: border-box;
            touch-action: pan-y pinch-zoom;
        }
        
        .pp-lightbox-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 44px;
            height: 44px;
            font-size: 1.5rem;
            color: white;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .pp-lightbox-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .pp-lightbox-prev,
        .pp-lightbox-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 44px;
            height: 44px;
            font-size: 1.5rem;
            color: white;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .pp-lightbox-prev {
            left: 1rem;
        }
        
        .pp-lightbox-next {
            right: 1rem;
        }
        
        .pp-lightbox-prev:disabled,
        .pp-lightbox-next:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }
        
        .pp-lightbox-prev:hover:not(:disabled),
        .pp-lightbox-next:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .pp-lightbox-content {
            max-width: 90%;
            max-height: 80%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .pp-lightbox-content img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 4px;
        }
        
        .pp-lightbox-counter {
            position: absolute;
            bottom: 2rem;
            left: 0;
            width: 100%;
            text-align: center;
            color: white;
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        @media (max-width: 768px) {
            .pp-lightbox-prev,
            .pp-lightbox-next {
                position: fixed;
                bottom: 1rem;
                top: auto;
                transform: none;
            }
            
            .pp-lightbox-prev {
                left: 1rem;
            }
            
            .pp-lightbox-next {
                right: 1rem;
            }
            
            .pp-lightbox-counter {
                bottom: 5rem;
            }
        }
        
        @media (max-height: 500px) and (orientation: landscape) {
            .pp-lightbox-content {
                max-height: 90%;
            }
        }
    `;
    document.head.appendChild(style);
}

function pp_initGalleryReveal() {
    const galleries = document.querySelectorAll('.pp-gallery');
    if (galleries.length === 0) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    galleries.forEach(gallery => {
        const images = Array.from(gallery.querySelectorAll('img'));
        if (images.length === 0) return;

        images.forEach((img, index) => {
            img.style.transitionDelay = `${Math.min(index * 40, 240)}ms`;
        });

        if (prefersReduced || typeof IntersectionObserver === 'undefined') {
            images.forEach(img => img.classList.add('pp-reveal-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('pp-reveal-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

        images.forEach(img => observer.observe(img));
    });
}

function pp_initGalleryFilters() {
    const filterBar = document.querySelector('.pp-gallery-filters');
    const galleries = Array.from(document.querySelectorAll('.pp-activity-gallery[data-category]'));
    const labels = Array.from(document.querySelectorAll('.pp-gallery-label'));
    if (!filterBar || galleries.length === 0) return;

    const filters = Array.from(filterBar.querySelectorAll('.pp-gallery-filter'));

    function setActiveFilter(filter) {
        filters.forEach(btn => {
            const isActive = btn === filter;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
            btn.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        const filterValue = filter.dataset.filter;
        if (filterValue === 'all') {
            labels.forEach(label => label.classList.remove('pp-gallery-hidden'));
            galleries.forEach(gallery => gallery.classList.remove('pp-gallery-hidden'));
            return;
        }

        labels.forEach(label => {
            const nextGallery = label.nextElementSibling;
            const matches = nextGallery && nextGallery.dataset && nextGallery.dataset.category === filterValue;
            label.classList.toggle('pp-gallery-hidden', !matches);
        });

        galleries.forEach(gallery => {
            const matches = gallery.dataset.category === filterValue;
            gallery.classList.toggle('pp-gallery-hidden', !matches);
        });
    }

    filters.forEach(btn => {
        btn.addEventListener('click', () => setActiveFilter(btn));
    });

    filterBar.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        const currentIndex = filters.findIndex(btn => btn.classList.contains('active'));
        if (currentIndex === -1) return;
        const direction = e.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (currentIndex + direction + filters.length) % filters.length;
        const nextBtn = filters[nextIndex];
        nextBtn.focus();
        setActiveFilter(nextBtn);
    });
}

// Update counter animation for mobile performance
function pp_initCounters() {
    const counters = document.querySelectorAll('.pp-counter');
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const suffix = counter.getAttribute('data-suffix') || '';
                
                if (!counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    
                    // Use requestAnimationFrame for better performance
                    if (prefersReducedMotion()) {
                        counter.textContent = target + suffix;
                    } else {
                        pp_animateCounter(counter, target, suffix);
                    }
                }
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '50px'
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function pp_animateCounter(element, target, suffix = '') {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    let lastTime = 0;
    
    function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const delta = timestamp - lastTime;
        
        if (delta >= 16) { // ~60fps
            current += increment * (delta / 16);
            
            if (current >= target) {
                element.textContent = target + suffix;
                return;
            } else {
                element.textContent = Math.floor(current) + suffix;
                lastTime = timestamp;
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
}

// Update accordion for mobile touch
function pp_initAccordion() {
    const accordionHeaders = document.querySelectorAll('.pp-accordion-header');
    if (accordionHeaders.length === 0) return;
    
    accordionHeaders.forEach(header => {
        if (header.dataset.ppAccordionBound === 'true') return;
        header.dataset.ppAccordionBound = 'true';
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        
        const content = header.nextElementSibling;
        if (content) {
            content.setAttribute('aria-hidden', 'true');
        }
        
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const accordionContent = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle active class
            this.setAttribute('aria-expanded', !isExpanded);
            if (accordionItem) {
                accordionItem.classList.toggle('active', !isExpanded);
            }
            
            if (accordionContent) {
                accordionContent.setAttribute('aria-hidden', isExpanded);
                
                if (!isExpanded) {
                    accordionContent.style.maxHeight = '0';
                    requestAnimationFrame(() => {
                        accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
                    });
                } else {
                    accordionContent.style.maxHeight = '0';
                }
            }
        });
        
        // Keyboard support
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Make touch-friendly on mobile
        if ('ontouchstart' in window) {
            header.style.minHeight = '44px';
            header.style.display = 'flex';
            header.style.alignItems = 'center';
        }
    });
    
}

