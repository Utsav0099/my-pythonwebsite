// UI/UX Enhancement System
class UIEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardShortcuts();
        this.enhanceAccessibility();
        this.createNotificationSystem();
        this.addProgressIndicators();
        this.setupErrorHandling();
        this.createSkillTree();
        this.setupThemeSynthesizer();
    }

    setupKeyboardShortcuts() {
        const shortcuts = {
            'ctrl+1': () => this.navigateToPage('home'),
            'ctrl+2': () => this.navigateToPage('skill-tree'),
            'ctrl+3': () => this.navigateToPage('practice'),
            'ctrl+4': () => this.navigateToPage('concepts'),
            'ctrl+5': () => this.navigateToPage('compiler'),
            'ctrl+6': () => this.navigateToPage('community'),
            'ctrl+s': (e) => { e.preventDefault(); this.saveCurrentWork(); },
            'ctrl+r': (e) => { e.preventDefault(); this.runCurrentCode(); },
            'ctrl+shift+r': (e) => { e.preventDefault(); this.resetCurrentCode(); },
            'ctrl+k': (e) => { e.preventDefault(); this.toggleCommandPalette(); },
            'ctrl+shift+t': (e) => { e.preventDefault(); this.toggleTheme(); },
            'ctrl+shift+f': (e) => { e.preventDefault(); this.toggleFullscreen(); },
            'alt+1': () => this.focusMainContent(),
            'alt+2': () => this.focusNavigation(),
            'escape': () => this.handleEscape()
        };
        document.addEventListener('keydown', (e) => {
            const key = this.getKeyCombination(e);
            if (shortcuts[key]) shortcuts[key](e);
        });
        this.createShortcutHelp();
    }

    getKeyCombination(e) {
        let parts = [];
        if (e.ctrlKey || e.metaKey) parts.push('ctrl');
        if (e.shiftKey) parts.push('shift');
        if (e.altKey) parts.push('alt');
        parts.push(e.key.toLowerCase());
        return parts.join('+');
    }

    navigateToPage(pageId) { if (window.showPage) window.showPage(pageId); }
    saveCurrentWork() { if (window.app?.saveProgress) { window.app.saveProgress('all'); this.showNotification('💾 Work saved successfully!', 'success'); } }

    runCurrentCode() {
        const currentPage = this.getCurrentPage();
        if (currentPage === 'lesson' && window.app) window.app.runCode('lesson', 'lesson-output');
        else if (currentPage === 'compiler' && window.app) window.app.runCode('playground', 'playground-output');
    }

    resetCurrentCode() {
        try {
            const lesson = window.currentLesson;
            const editor = (window.editors && window.editors.lesson) ? window.editors.lesson : (window.ace ? window.ace.edit('lesson-editor') : null);
            if (editor && lesson) {
                const original = lesson.starter || lesson.code || '';
                editor.setValue(original, -1);
                this.showNotification('🔄 Code reset to original', 'info');
            } else {
                this.showNotification('No lesson loaded to reset.', 'error');
            }
        } catch (e) {
            console.error(e);
            this.showNotification('Failed to reset code.', 'error');
        }
    }

    toggleCommandPalette() { if (window.app?.toggleCommandPalette) window.app.toggleCommandPalette(); }
    toggleTheme() { if (window.themeManager) window.themeManager.toggleTheme(); }

    toggleFullscreen() {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(err => console.error(err));
        else if (document.exitFullscreen) document.exitFullscreen();
    }

    focusMainContent() {
        const main = document.querySelector('main');
        if (main) { main.setAttribute('tabindex', -1); main.focus(); main.scrollIntoView({ behavior: 'smooth' }); }
    }

    focusNavigation() {
        const nav = document.querySelector('.nav-links a');
        if (nav) nav.focus();
    }

    handleEscape() {
        if (window.app?.closeModal) window.app.closeModal();
        const cp = document.getElementById('command-palette-container');
        if (cp?.style.display === 'flex' && window.app?.toggleCommandPalette) window.app.toggleCommandPalette();
    }

    createShortcutHelp() {
        const helpContainer = document.createElement('div');
        helpContainer.className = 'keyboard-shortcuts-help';
        helpContainer.innerHTML = `<button class="help-toggle" id="help-toggle" title="Keyboard Shortcuts">⌨️</button><div class="help-content" id="help-content" style="display: none;">...</div>`;
        document.body.appendChild(helpContainer);
        // Logic for populating and showing help content would go here.
    }

    enhanceAccessibility() { /* ARIA labels, skip links, etc. */ }

    createNotificationSystem() {
        this.notificationQueue = [];
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 1rem; max-width: 400px;';
        document.body.appendChild(container);
    }

    showNotification(message, type = 'info', title = null, duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `background: var(--bg-secondary); border: 1px solid var(--glass-border); border-radius: var(--radius); padding: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: slideInRight 0.5s ease; border-left: 4px solid var(--accent-cyan);`;
        if (type === 'success') notification.style.borderLeftColor = 'var(--accent-green)';
        if (type === 'error') notification.style.borderLeftColor = 'var(--accent-red)';

        const titleHTML = title ? `<div style="font-weight: 600;">${title}</div>` : '';
        notification.innerHTML = `${titleHTML}<div style="color: var(--text-secondary); font-size: 0.875rem;">${message}</div>`;
        container.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease forwards';
            notification.addEventListener('animationend', () => notification.remove());
        }, duration);
    }

    playNotificationSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            const freq = { success: 800, error: 200, info: 400 };
            oscillator.frequency.setValueAtTime(freq[type] || 400, audioContext.currentTime);
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) { console.warn("Audio notification not supported."); }
    }

    addProgressIndicators() { /* Loading overlays, etc. */ }
    setupErrorHandling() { /* Global error handlers */ }

    getCurrentPage() {
        const activePage = document.querySelector('.page-view.active');
        return activePage ? activePage.id : null;
    }

    createSkillTree() {
        const skillTreePage = document.getElementById('skill-tree');
        if (!skillTreePage) return;

        const style = document.createElement('style');
        style.textContent = `
            .skill-tree-container { display: flex; flex-direction: column; gap: 2rem; }
            .skill-tree-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
            .skill-node { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; transition: all 0.3s ease; }
            .skill-node:hover { transform: translateY(-5px); border-color: var(--accent-cyan); }
            .skill-node.completed { border-color: var(--accent-green); background: rgba(52, 211, 153, 0.1); }
            .skill-node-title { font-weight: 600; color: var(--accent-cyan); }
            .skill-node-progress-bar { width: 100%; height: 6px; background: var(--glass-border); border-radius: 3px; overflow: hidden; margin-top: 1rem; }
            .skill-node-progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent-magenta), var(--accent-cyan)); transition: width 0.8s ease; }
        `;
        document.head.appendChild(style);

        skillTreePage.innerHTML = `<div class="skill-tree-container"><h2>Skill Tree</h2><div class="skill-tree-grid"></div></div>`;
        this.renderSkillTree();
        this.setupSkillTreeEventListeners();
    }

    renderSkillTree() {
        const grid = document.querySelector('#skill-tree .skill-tree-grid');
        if (!grid || !window.appData) return;
        grid.innerHTML = window.appData.modules.map(module => this.renderSkillNode(module)).join('');
    }

    renderSkillNode(module) {
        const completed = module.lessons.filter(l => appData.userProgress.completedLessons.includes(l.id)).length;
        const progress = module.lessons.length > 0 ? (completed / module.lessons.length) * 100 : 0;
        return `
            <div class="skill-node ${progress === 100 ? 'completed' : ''}" data-module-id="${module.id}">
                <h3 class="skill-node-title">${module.icon} ${module.title}</h3>
                <p>${module.description}</p>
                <div class="skill-node-progress-bar"><div class="skill-node-progress-fill" style="width: ${progress}%"></div></div>
            </div>
        `;
    }

    setupSkillTreeEventListeners() {
        document.querySelector('#skill-tree')?.addEventListener('click', (e) => {
            const skillNode = e.target.closest('.skill-node');
            if (skillNode && window.app) {
                const moduleId = skillNode.dataset.moduleId;
                const module = window.appData.modules.find(m => m.id === moduleId);
                if (module?.lessons?.[0]) window.app.loadLesson(module.lessons[0]);
            }
        });
    }

    setupThemeSynthesizer() {
        // Implementation for theme synthesizer UI and logic
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.uiEnhancer = new UIEnhancer();
});