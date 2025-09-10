// Email Campaign Presentation App JavaScript

class PresentationApp {
    constructor() {
        this.currentSectionIndex = 0;
        this.sections = [];
        this.navLinks = [];
        this.progressBar = null;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Get all sections and navigation links
        this.sections = document.querySelectorAll('.content-section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.progressBar = document.getElementById('progressBar');
        
        // Set up event listeners
        this.setupNavigation();
        this.setupKeyboardNavigation();
        this.setupProgressIndicator();
        
        // Initialize the first section
        this.showSection(0);
        
        console.log('Email Campaign Presentation initialized');
    }
    
    setupNavigation() {
        this.navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(index);
            });
        });
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    this.nextSection();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSection();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.showSection(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.showSection(this.sections.length - 1);
                    break;
            }
        });
    }
    
    setupProgressIndicator() {
        // Ensure progress bar is visible and properly styled
        if (this.progressBar) {
            this.progressBar.style.visibility = 'visible';
            this.progressBar.style.opacity = '1';
        }
        this.updateProgressBar();
    }
    
    showSection(index) {
        if (index < 0 || index >= this.sections.length) {
            return;
        }
        
        // Hide all sections
        this.sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from all nav links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Show the selected section
        this.sections[index].classList.add('active');
        this.navLinks[index].classList.add('active');
        
        // Update current section index
        this.currentSectionIndex = index;
        
        // Update progress bar
        this.updateProgressBar();
        
        // Scroll to top of content
        this.scrollToTop();
        
        // Animate section entrance
        this.animateSection(this.sections[index]);
        
        // Update document title
        this.updateDocumentTitle(index);
    }
    
    nextSection() {
        const nextIndex = this.currentSectionIndex + 1;
        if (nextIndex < this.sections.length) {
            this.showSection(nextIndex);
        }
    }
    
    previousSection() {
        const prevIndex = this.currentSectionIndex - 1;
        if (prevIndex >= 0) {
            this.showSection(prevIndex);
        }
    }
    
    updateProgressBar() {
        if (this.progressBar) {
            const progress = ((this.currentSectionIndex + 1) / this.sections.length) * 100;
            this.progressBar.style.width = `${progress}%`;
            this.progressBar.style.transition = 'width 0.3s ease-out';
        }
    }
    
    scrollToTop() {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
    
    animateSection(section) {
        // Reset animation
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        // Trigger animation
        requestAnimationFrame(() => {
            section.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
        
        // Animate cards and elements within the section
        this.animateSectionElements(section);
    }
    
    animateSectionElements(section) {
        const cards = section.querySelectorAll('.card, .highlight-card, .platform-card, .segment-card, .case-study-card');
        const metrics = section.querySelectorAll('.metric-card');
        const charts = section.querySelectorAll('.chart-image');
        
        // Animate cards with staggered delay
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Animate metric cards (but don't animate their text content to avoid inconsistency)
        metrics.forEach((metric, index) => {
            metric.style.opacity = '0';
            metric.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                metric.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                metric.style.opacity = '1';
                metric.style.transform = 'translateY(0)';
            }, index * 150);
        });
        
        // Animate simple metric values (those in .metric class, not .metric-card)
        const simpleMetrics = section.querySelectorAll('.metric .metric-value');
        simpleMetrics.forEach((metric, index) => {
            setTimeout(() => {
                this.animateMetricValue(metric);
            }, index * 200);
        });
        
        // Animate charts
        charts.forEach((chart, index) => {
            chart.style.opacity = '0';
            chart.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                chart.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
                chart.style.opacity = '1';
                chart.style.transform = 'scale(1)';
            }, 200 + index * 100);
        });
    }
    
    animateMetricValue(element) {
        const originalText = element.textContent;
        
        // Only animate if it's a simple percentage (like "20%" or "25%")
        const simplePercentMatch = originalText.match(/^(\d+)%$/);
        
        if (simplePercentMatch) {
            const targetValue = parseInt(simplePercentMatch[1]);
            let current = 0;
            const duration = 1000; // 1 second
            const startTime = Date.now();
            
            const animation = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Use easing function for smoother animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                current = Math.floor(targetValue * easeOutQuart);
                
                element.textContent = current + '%';
                
                if (progress < 1) {
                    requestAnimationFrame(animation);
                } else {
                    element.textContent = originalText; // Ensure final value is exact
                }
            };
            
            element.textContent = '0%';
            requestAnimationFrame(animation);
        }
        // For complex values like "2-3%" or text, don't animate to avoid inconsistency
    }
    
    updateDocumentTitle(index) {
        const sectionTitles = [
            'Executive Summary',
            'Project Overview',
            'Platform Selection',
            'Email Design Strategy',
            'Segmentation Strategy',
            'Campaign Timeline',
            'Key Metrics & KPIs',
            'A/B Testing Framework',
            'Performance Analysis',
            'Case Studies',
            'Budget & Resources',
            'Recommendations',
            'Conclusion'
        ];
        
        if (sectionTitles[index]) {
            document.title = `${sectionTitles[index]} - Email Campaign Strategy`;
        }
    }
    
    // Utility method to get current section info
    getCurrentSectionInfo() {
        return {
            index: this.currentSectionIndex,
            total: this.sections.length,
            progress: ((this.currentSectionIndex + 1) / this.sections.length) * 100
        };
    }
    
    // Method to jump to a specific section by ID
    goToSection(sectionId) {
        const sectionIndex = Array.from(this.sections).findIndex(section => section.id === sectionId);
        if (sectionIndex !== -1) {
            this.showSection(sectionIndex);
        }
    }
}

// Interactive Features Class
class InteractiveFeatures {
    constructor(app) {
        this.app = app;
        this.init();
    }
    
    init() {
        this.setupHoverEffects();
        this.setupClickEffects();
        this.setupToolTips();
        this.setupCollapsibleSections();
        this.setupPrintFunctionality();
    }
    
    setupHoverEffects() {
        // Enhanced hover effects for cards
        const cards = document.querySelectorAll('.card, .highlight-card, .platform-card, .segment-card, .case-study-card, .metric-card, .recommendation-card');
        
        cards.forEach(card => {
            // Store original transform and shadow
            const originalTransform = getComputedStyle(card).transform;
            const originalBoxShadow = getComputedStyle(card).boxShadow;
            
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-6px) scale(1.02)';
                this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)';
                this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = originalBoxShadow;
                this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
        });
        
        // Special hover effects for navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.paddingLeft = '24px';
                this.style.transition = 'all 0.2s ease-out';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.paddingLeft = 'var(--space-20)';
                this.style.transition = 'all 0.2s ease-out';
            });
        });
    }
    
    setupClickEffects() {
        // Add click effects to interactive elements
        const interactiveElements = document.querySelectorAll('.btn, .nav-link, .metric-card, .card, .platform-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('click', function(e) {
                // Create ripple effect
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                ripple.style.cssText = `
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: var(--color-primary);
                    opacity: 0.6;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                // Ensure parent has relative positioning for ripple
                const originalPosition = this.style.position;
                this.style.position = 'relative';
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                    if (originalPosition) {
                        this.style.position = originalPosition;
                    } else {
                        this.style.position = '';
                    }
                }, 600);
            });
        });
    }
    
    setupToolTips() {
        // Add tooltips to metric cards and important elements
        const metricCards = document.querySelectorAll('.metric-card');
        
        metricCards.forEach(card => {
            const description = card.querySelector('.metric-description');
            if (description) {
                card.setAttribute('title', description.textContent);
                card.style.cursor = 'help';
            }
        });
        
        // Add tooltips to navigation items
        const navLinks = document.querySelectorAll('.nav-link');
        const tooltipTexts = [
            'Overview of campaign objectives and success metrics',
            'Problem statement and solution approach',
            'Comparison of email marketing platforms',
            'Responsive template design strategy',
            'Audience targeting and personalization',
            '4-week implementation timeline',
            'Performance measurement framework',
            'Testing methodology and optimization',
            'Monitoring and reporting structure',
            'Real-world campaign examples',
            'Resource allocation and ROI projections',
            'Strategic implementation guidance',
            'Summary and next steps'
        ];
        
        navLinks.forEach((link, index) => {
            if (tooltipTexts[index]) {
                link.setAttribute('title', tooltipTexts[index]);
            }
        });
    }
    
    setupCollapsibleSections() {
        // Make some sections collapsible for better mobile experience
        const collapsibleHeaders = document.querySelectorAll('.case-study-header, .platform-header');
        
        collapsibleHeaders.forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                if (content) {
                    const isVisible = content.style.display !== 'none';
                    content.style.display = isVisible ? 'none' : 'block';
                    
                    // Add visual indicator
                    const indicator = this.querySelector('.collapse-indicator') || document.createElement('span');
                    indicator.className = 'collapse-indicator';
                    indicator.textContent = isVisible ? '+' : '−';
                    indicator.style.cssText = `
                        float: right;
                        font-size: 1.2em;
                        font-weight: bold;
                        margin-left: auto;
                    `;
                    
                    if (!this.querySelector('.collapse-indicator')) {
                        this.appendChild(indicator);
                    }
                }
            });
        });
    }
    
    setupPrintFunctionality() {
        // Add print functionality
        const printButton = document.createElement('button');
        printButton.textContent = '🖨️ Print';
        printButton.className = 'print-button';
        printButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            background: var(--color-primary);
            color: white;
            border: none;
            border-radius: var(--radius-base);
            padding: 12px 16px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease-out;
            font-family: var(--font-family-base);
        `;
        
        printButton.addEventListener('click', () => {
            window.print();
        });
        
        printButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
        });
        
        printButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        document.body.appendChild(printButton);
        
        // Show print button when hovering over presentation
        const presentationContainer = document.querySelector('.presentation-container');
        if (presentationContainer) {
            presentationContainer.addEventListener('mouseenter', () => {
                printButton.style.opacity = '1';
                printButton.style.transform = 'translateY(0)';
            });
            
            presentationContainer.addEventListener('mouseleave', () => {
                printButton.style.opacity = '0';
                printButton.style.transform = 'translateY(20px)';
            });
        }
    }
}

// Mobile Navigation Class
class MobileNavigation {
    constructor(app) {
        this.app = app;
        this.init();
    }
    
    init() {
        this.createMobileToggle();
        this.setupMobileGestures();
        this.handleResize();
    }
    
    createMobileToggle() {
        // Create mobile menu toggle
        const toggle = document.createElement('button');
        toggle.innerHTML = '☰';
        toggle.className = 'mobile-nav-toggle';
        toggle.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: var(--color-primary);
            color: white;
            border: none;
            border-radius: var(--radius-base);
            padding: 12px;
            font-size: 18px;
            cursor: pointer;
            display: none;
            box-shadow: var(--shadow-md);
            transition: all 0.2s ease-out;
        `;
        
        toggle.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.toggle('open');
            }
        });
        
        toggle.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        toggle.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(toggle);
        this.mobileToggle = toggle;
    }
    
    setupMobileGestures() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Swipe gestures for navigation (require significant movement)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
                if (deltaX > 0) {
                    // Swipe right - previous section
                    this.app.previousSection();
                } else {
                    // Swipe left - next section
                    this.app.nextSection();
                }
            }
        });
    }
    
    handleResize() {
        const checkMobile = () => {
            const isMobile = window.innerWidth <= 640;
            if (this.mobileToggle) {
                this.mobileToggle.style.display = isMobile ? 'block' : 'none';
            }
        };
        
        window.addEventListener('resize', checkMobile);
        checkMobile(); // Initial check
    }
}

// Analytics and Tracking Class
class PresentationAnalytics {
    constructor(app) {
        this.app = app;
        this.sessionData = {
            startTime: Date.now(),
            sectionsVisited: new Set(),
            timeSpentPerSection: {},
            currentSectionStartTime: Date.now()
        };
        this.init();
    }
    
    init() {
        this.trackSectionChanges();
        this.trackTimeSpent();
        this.trackInteractions();
    }
    
    trackSectionChanges() {
        // Override the app's showSection method to track analytics
        const originalShowSection = this.app.showSection.bind(this.app);
        
        this.app.showSection = (index) => {
            // Track time spent on previous section
            const now = Date.now();
            const previousIndex = this.app.currentSectionIndex;
            const timeSpent = now - this.sessionData.currentSectionStartTime;
            
            if (this.sessionData.timeSpentPerSection[previousIndex]) {
                this.sessionData.timeSpentPerSection[previousIndex] += timeSpent;
            } else {
                this.sessionData.timeSpentPerSection[previousIndex] = timeSpent;
            }
            
            // Track new section
            this.sessionData.sectionsVisited.add(index);
            this.sessionData.currentSectionStartTime = now;
            
            // Call original method
            originalShowSection(index);
        };
    }
    
    trackTimeSpent() {
        // Track total session time
        setInterval(() => {
            const sessionTime = Date.now() - this.sessionData.startTime;
            console.log('Session time:', Math.floor(sessionTime / 1000) + 's');
        }, 30000); // Log every 30 seconds
    }
    
    trackInteractions() {
        // Track clicks on various elements
        document.addEventListener('click', (e) => {
            const element = e.target;
            let elementType = 'unknown';
            
            if (element.classList.contains('nav-link')) elementType = 'navigation';
            else if (element.classList.contains('btn')) elementType = 'button';
            else if (element.classList.contains('card')) elementType = 'card';
            else if (element.classList.contains('metric-card')) elementType = 'metric';
            
            console.log('Analytics: Interaction -', elementType, 'at section', this.app.currentSectionIndex);
        });
    }
    
    getSessionSummary() {
        return {
            totalTime: Date.now() - this.sessionData.startTime,
            sectionsVisited: Array.from(this.sessionData.sectionsVisited),
            completionRate: (this.sessionData.sectionsVisited.size / this.app.sections.length) * 100,
            timeSpentPerSection: this.sessionData.timeSpentPerSection
        };
    }
}

// Add CSS for animations and effects
const additionalStyles = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

/* Enhanced progress bar visibility */
.progress-indicator {
    background: rgba(var(--color-primary-rgb, 33, 128, 141), 0.2);
    border: 1px solid rgba(var(--color-primary-rgb, 33, 128, 141), 0.3);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.progress-bar {
    background: linear-gradient(90deg, var(--color-primary), var(--color-teal-400));
    box-shadow: 0 2px 4px rgba(var(--color-primary-rgb, 33, 128, 141), 0.3);
    position: relative;
}

.progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

/* Enhanced card hover effects */
.card, .highlight-card, .platform-card, .segment-card, .case-study-card, .metric-card, .recommendation-card {
    will-change: transform, box-shadow;
}

@media print {
    .sidebar {
        display: none !important;
    }
    
    .main-content {
        margin-left: 0 !important;
        max-width: 100% !important;
    }
    
    .content-section {
        display: block !important;
        page-break-after: always;
    }
    
    .content-section:last-child {
        page-break-after: avoid;
    }
    
    .print-button {
        display: none !important;
    }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application
let presentationApp;
let interactiveFeatures;
let mobileNavigation;
let analytics;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    presentationApp = new PresentationApp();
    
    // Initialize other features after the main app
    setTimeout(() => {
        interactiveFeatures = new InteractiveFeatures(presentationApp);
        mobileNavigation = new MobileNavigation(presentationApp);
        analytics = new PresentationAnalytics(presentationApp);
    }, 100);
    
    // Global keyboard shortcuts info
    console.log(`
Email Campaign Presentation - Keyboard Shortcuts:
→/↓ - Next section
←/↑ - Previous section  
Home - First section
End - Last section
Ctrl+P - Print presentation
    `);
}

// Expose global functions for debugging
window.presentationDebug = {
    goToSection: (index) => presentationApp?.showSection(index),
    getCurrentInfo: () => presentationApp?.getCurrentSectionInfo(),
    getAnalytics: () => analytics?.getSessionSummary()
};