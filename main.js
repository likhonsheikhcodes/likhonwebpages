document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });

    // Typed.js Implementation
    const typedElement = document.querySelector('.typing');
    if (typedElement) {
        new Typed(typedElement, {
            strings: [
                'Full Stack Developer',
                'Tech Educator',
                'Open Source Contributor',
                'Community Leader',
                'JavaScript Expert',
                'React Developer',
                'Node.js Developer'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            smartBackspace: true
        });
    }

    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    function setTheme(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (themeToggle) {
            themeToggle.innerHTML = isDark ? 
                '<i class="fas fa-sun"></i>' : 
                '<i class="fas fa-moon"></i>';
        }
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = prefersDarkScheme.matches;
    setTheme(savedTheme ? savedTheme === 'dark' : systemPrefersDark);

    // Theme toggle click event
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme !== 'dark');
        });
    }

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches);
        }
    });

    // Language Toggle
    let isEnglish = true;

    function toggleLanguage() {
        const enElements = document.querySelectorAll('.en');
        const bnElements = document.querySelectorAll('.bn');

        // Fade out current language
        const currentElements = isEnglish ? enElements : bnElements;
        const newElements = isEnglish ? bnElements : enElements;

        currentElements.forEach(el => {
            el.style.opacity = '0';
            setTimeout(() => {
                el.style.display = 'none';
            }, 300);
        });

        // Fade in new language
        setTimeout(() => {
            newElements.forEach(el => {
                el.style.display = 'block';
                setTimeout(() => {
                    el.style.opacity = '1';
                }, 50);
            });
        }, 300);

        isEnglish = !isEnglish;
        localStorage.setItem('language', isEnglish ? 'en' : 'bn');
    }

    // Initialize language
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'bn') {
        toggleLanguage();
    }

    const langToggle = document.querySelector('.lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    // GitHub Projects Fetching
    async function fetchGitHubProjects() {
        const projectsGrid = document.getElementById('github-projects');
        const loadingSpinner = document.querySelector('.projects-loader');

        if (!projectsGrid || !loadingSpinner) return;

        try {
            const response = await fetch('https://api.github.com/users/likhonsheikhcodes/repos?sort=updated&per_page=6');
            if (!response.ok) throw new Error('Failed to fetch projects');
            
            const repos = await response.json();
            loadingSpinner.style.display = 'none';
            
            repos.forEach(repo => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                projectCard.setAttribute('data-aos', 'fade-up');
                
                projectCard.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available'}</p>
                    <div class="project-stats">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                    </div>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                            <i class="fab fa-github"></i> View Project
                        </a>
                        ${repo.homepage ? `
                            <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link">
                                <i class="fas fa-external-link-alt"></i> Live Demo
                            </a>
                        ` : ''}
                    </div>
                `;
                projectsGrid.appendChild(projectCard);
            });
        } catch (error) {
            console.error('Error fetching GitHub projects:', error);
            loadingSpinner.style.display = 'none';
            if (projectsGrid) {
                projectsGrid.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Failed to load projects. Please try again later.</p>
                    </div>
                `;
            }
        }
    }

    // Initialize GitHub Projects
    fetchGitHubProjects();

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Loading Animation
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    }

    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.error('ServiceWorker registration failed:', err);
            });
    });
}

// Error Tracking
window.addEventListener('error', (e) => {
    console.error('Global error handler:', e.message);
    // Implement error logging service here if needed
});

