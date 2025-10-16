// Integration Script - Ties all enhanced features together
class FeatureIntegrator {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Integrating Holo-Deck Enhanced Features...');
        this.setupFeatureInteractions();
        this.createFeatureDashboard();
        this.addFeatureMetrics();
        console.log('✅ All feature modules integrated successfully');
    }

    setupFeatureInteractions() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupProgressTracking();
            this.setupAchievementTriggers();
            this.setupThemeIntegration();
            this.setupNotificationIntegration();
        });
    }

    setupProgressTracking() {
        if (!window.app?.markLessonComplete) return;

        const originalMarkComplete = window.app.markLessonComplete.bind(window.app);
        window.app.markLessonComplete = function (...args) {
            originalMarkComplete(...args);
            if (window.gamificationSystem) window.gamificationSystem.updateAchievements();
            if (window.progressTracker) window.progressTracker.updateProgress();
            if (window.uiEnhancer) window.uiEnhancer.showNotification('🎉 Lesson completed!', 'success', 'Progress');
            if (window.funFeatures?.holoPet) {
                const happiness = parseInt(localStorage.getItem('petHappiness') || '50');
                localStorage.setItem('petHappiness', Math.min(100, happiness + 5).toString());
            }
        };
    }

    setupAchievementTriggers() {
        // This can be expanded to create achievements for using specific new features
    }

    setupThemeIntegration() {
        if (!window.themeManager?.toggleTheme) return;

        const originalToggle = window.themeManager.toggleTheme.bind(window.themeManager);
        window.themeManager.toggleTheme = function (...args) {
            originalToggle(...args);
            if (window.uiEnhancer) {
                window.uiEnhancer.showNotification(`🎨 Switched to ${this.theme} theme`, 'info', 'Theme');
            }
        };
    }

    setupNotificationIntegration() {
        if (!window.uiEnhancer?.showNotification) return;

        const originalShowNotification = window.uiEnhancer.showNotification.bind(window.uiEnhancer);
        window.uiEnhancer.showNotification = function (message, type = 'info', title = null, ...args) {
            originalShowNotification(message, type, title, ...args);
            if (type === 'success' || type === 'error') {
                this.playNotificationSound(type); // 'this' is now correctly uiEnhancer
            }
        };
    }

    createFeatureDashboard() { /* UI for feature dashboard */ }
    setupFeatureDashboard() { /* Event listeners for dashboard */ }
    updateFeatureMetrics() { /* Logic to update metrics */ }
    addFeatureMetrics() { /* Tracking and performance monitoring */ }
}

// Defer EnhancedHoloDeck definition until PythonHoloDeck is available
(function ensureEnhancedClass() {
    function defineClass() {
        if (typeof PythonHoloDeck === 'undefined') return false;
        class EnhancedHoloDeck extends PythonHoloDeck {
            constructor() {
                super();
                this.featureIntegrator = new FeatureIntegrator();
                this.setupEnhancedFeatures();
            }

            setupEnhancedFeatures() {
                this.addFeatureButtons();
            }

            addFeatureButtons() {
                const quickFeatures = document.createElement('div');
                quickFeatures.className = 'quick-features';
                quickFeatures.style.cssText = 'position: fixed; top: 150px; right: 20px; display: flex; flex-direction: column; gap: 0.5rem; z-index: 1000;';
                quickFeatures.innerHTML = `
                    <button class="feature-button" title="Code Art Gallery" onclick="window.funFeatures?.createCodeArtGallery()">🎨</button>
                    <button class="feature-button" title="Typing Test" onclick="window.funFeatures?.createTypingSpeedTest()">⌨️</button>
                    <button class="feature-button" title="Holo-Pet" onclick="window.funFeatures?.addHoloPet()">🐍</button>
                `;
                const style = document.createElement('style');
                style.textContent = `.feature-button { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.2rem; transition: all 0.3s ease; } .feature-button:hover { background: var(--glass-hover-border); transform: scale(1.1); }`;
                document.head.appendChild(style);
                document.body.appendChild(quickFeatures);
            }
        }
        // Expose globally so index.html can detect it
        window.EnhancedHoloDeck = EnhancedHoloDeck;
        return true;
    }

    if (!defineClass()) {
        const interval = setInterval(() => {
            if (defineClass()) clearInterval(interval);
        }, 10);
        // Also attempt on DOMContentLoaded just in case
        document.addEventListener('DOMContentLoaded', defineClass, { once: true });
    }
})();