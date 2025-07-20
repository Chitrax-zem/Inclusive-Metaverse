// Accessibility Module for Inclusive Metaverse Platform
document.addEventListener('DOMContentLoaded', function() {
    // Initialize accessibility settings from localStorage or use defaults
    const accessibilitySettings = JSON.parse(localStorage.getItem('accessibilitySettings')) || {
        textSize: 'medium',
        contrast: 'default',
        colorblindMode: false,
        textToSpeech: false,
        screenReaderMode: false,
        reduceMotion: false
    };

    // Apply saved settings on page load
    applyAccessibilitySettings(accessibilitySettings);

    // Text size controls
    document.getElementById('text-size-increase').addEventListener('click', function() {
        adjustTextSize('increase');
    });
    
    document.getElementById('text-size-decrease').addEventListener('click', function() {
        adjustTextSize('decrease');
    });

    // Contrast mode toggle
    document.getElementById('high-contrast').addEventListener('click', function() {
        toggleHighContrast();
    });

    // Colorblind mode toggle
    document.getElementById('colorblind-mode').addEventListener('click', function() {
        toggleColorblindMode();
    });

    // Text-to-speech toggle
    document.getElementById('text-to-speech').addEventListener('click', function() {
        toggleTextToSpeech();
    });

    // Screen reader optimization toggle
    document.getElementById('screen-reader-mode').addEventListener('click', function() {
        toggleScreenReaderMode();
    });

    // Reduce motion toggle
    document.getElementById('reduce-motion').addEventListener('click', function() {
        toggleReduceMotion();
    });

    // Pronoun selector handling
    document.getElementById('pronouns').addEventListener('change', function() {
        if (this.value === 'custom') {
            document.getElementById('custom-pronouns').classList.remove('hidden');
        } else {
            document.getElementById('custom-pronouns').classList.add('hidden');
        }
    });

    // Function to adjust text size
    function adjustTextSize(direction) {
        const body = document.body;
        const currentSize = parseFloat(getComputedStyle(body).fontSize);
        let newSize;

        if (direction === 'increase') {
            newSize = Math.min(currentSize * 1.2, 24); // Max 24px
            accessibilitySettings.textSize = 'large';
        } else {
            newSize = Math.max(currentSize * 0.8, 14); // Min 14px
            accessibilitySettings.textSize = 'small';
        }

        document.documentElement.style.fontSize = newSize + 'px';
        saveAccessibilitySettings();
    }

    // Function to toggle high contrast mode
    function toggleHighContrast() {
        document.body.classList.toggle('high-contrast');
        accessibilitySettings.contrast = document.body.classList.contains('high-contrast') ? 'high' : 'default';
        saveAccessibilitySettings();
        
        // Update button state
        const button = document.getElementById('high-contrast');
        button.classList.toggle('active');
    }

    // Function to toggle colorblind mode
    function toggleColorblindMode() {
        document.body.classList.toggle('colorblind-mode');
        accessibilitySettings.colorblindMode = !accessibilitySettings.colorblindMode;
        saveAccessibilitySettings();
        
        // Update button state
        const button = document.getElementById('colorblind-mode');
        button.classList.toggle('active');
    }

    // Function to toggle text-to-speech
    function toggleTextToSpeech() {
        accessibilitySettings.textToSpeech = !accessibilitySettings.textToSpeech;
        saveAccessibilitySettings();
        
        // Update button state
        const button = document.getElementById('text-to-speech');
        button.classList.toggle('active');
        
        if (accessibilitySettings.textToSpeech) {
            // Initialize text-to-speech if enabled
            initTextToSpeech();
        }
    }

    // Function to initialize text-to-speech
    function initTextToSpeech() {
        // Check if the browser supports the Web Speech API
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance();
            speech.lang = 'en-US';
            
            // Get all readable content on the page
            const readableElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, a, button');
            
            // Speak the content when elements are focused
            readableElements.forEach(element => {
                element.addEventListener('focus', function() {
                    if (accessibilitySettings.textToSpeech) {
                        speech.text = element.textContent;
                        window.speechSynthesis.speak(speech);
                    }
                });
            });
        } else {
            alert('Text-to-speech is not supported in your browser. Please try Chrome, Edge or Safari.');
        }
    }

    // Function to toggle screen reader mode
    function toggleScreenReaderMode() {
        document.body.classList.toggle('screen-reader-optimized');
        accessibilitySettings.screenReaderMode = !accessibilitySettings.screenReaderMode;
        saveAccessibilitySettings();
        
        // Update button state
        const button = document.getElementById('screen-reader-mode');
        button.classList.toggle('active');
        
        // Add ARIA attributes when enabled
        if (accessibilitySettings.screenReaderMode) {
            enhanceForScreenReader();
        }
    }

    // Function to enhance page for screen readers
    function enhanceForScreenReader() {
        // Add ARIA roles and labels to interactive elements
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
                button.setAttribute('aria-label', button.getAttribute('title') || 'Button');
            }
        });
        
        // Add ARIA to images
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            img.setAttribute('alt', img.getAttribute('aria-label') || 'Decorative image');
        });
    }

    // Function to toggle reduced motion
    function toggleReduceMotion() {
        document.body.classList.toggle('reduce-motion');
        accessibilitySettings.reduceMotion = !accessibilitySettings.reduceMotion;
        saveAccessibilitySettings();
        
        // Update button state
        const button = document.getElementById('reduce-motion');
        button.classList.toggle('active');
        
        // Adjust animations if needed
        if (accessibilitySettings.reduceMotion) {
            reduceAnimations();
        }
    }

    // Function to reduce or remove animations
    function reduceAnimations() {
        // This would interface with the Three.js scene to reduce motion
        // For now we'll just demonstrate with CSS animations
        const animatedElements = document.querySelectorAll('[class*="animate-"], [class*="transition-"]');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
    }

    // Function to apply accessibility settings
    function applyAccessibilitySettings(settings) {
        // Text size
        switch(settings.textSize) {
            case 'large':
                document.documentElement.style.fontSize = '20px';
                break;
            case 'small':
                document.documentElement.style.fontSize = '14px';
                break;
            default:
                document.documentElement.style.fontSize = '16px';
        }
        
        // High contrast
        if (settings.contrast === 'high') {
            document.body.classList.add('high-contrast');
            document.getElementById('high-contrast').classList.add('active');
        }
        
        // Colorblind mode
        if (settings.colorblindMode) {
            document.body.classList.add('colorblind-mode');
            document.getElementById('colorblind-mode').classList.add('active');
        }
        
        // Text-to-speech
        if (settings.textToSpeech) {
            document.getElementById('text-to-speech').classList.add('active');
            initTextToSpeech();
        }
        
        // Screen reader mode
        if (settings.screenReaderMode) {
            document.body.classList.add('screen-reader-optimized');
            document.getElementById('screen-reader-mode').classList.add('active');
            enhanceForScreenReader();
        }
        
        // Reduce motion
        if (settings.reduceMotion) {
            document.body.classList.add('reduce-motion');
            document.getElementById('reduce-motion').classList.add('active');
            reduceAnimations();
        }
    }

    // Function to save settings to localStorage
    function saveAccessibilitySettings() {
        localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilitySettings));
    }

    // Keyboard navigation for accessibility panel
    document.querySelector('.accessibility-panel').addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelector('.accessibility-options').classList.remove('visible');
        }
    });

    // Initialize any additional accessibility features
    function init() {
        // Ensure focus outlines are visible for keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    init();
});

// Additional accessibility functions that might be used throughout the platform
function focusTrap(element) {
    // Trap focus within a modal for better keyboard navigation
    const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
        const isTabPressed = (e.key === 'Tab');

        if (!isTabPressed) return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    });

    firstFocusableElement.focus();
}

function announceToScreenReader(message) {
    // Create live region for screen reader announcements
    let liveRegion = document.getElementById('sr-live-region');
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'sr-live-region';
        liveRegion.classList.add('sr-only');
        liveRegion.setAttribute('aria-live', 'polite');
        document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = message;
}

function isKeyboardNavigation() {
    return document.body.classList.contains('keyboard-navigation');
}
