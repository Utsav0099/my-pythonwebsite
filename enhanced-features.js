// Theme Toggle Component
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('holoDeckTheme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme();
        this.createToggleButton();
        this.setupEventListeners();
    }

    createToggleButton() {
        // Create theme toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.id = 'theme-toggle';
        toggleBtn.title = 'Toggle Dark/Light Mode';
        toggleBtn.innerHTML = this.theme === 'dark' ? '🌙' : '☀️';

        // Add to navigation
        const navLinks = document.getElementById('nav-links');
        if (navLinks) {
            navLinks.appendChild(toggleBtn);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'theme-toggle') {
                this.toggleTheme();
            }
        });
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        localStorage.setItem('holoDeckTheme', this.theme);

        // Update button icon
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.innerHTML = this.theme === 'dark' ? '🌙' : '☀️';
        }
    }

    applyTheme() {
        document.body.className = this.theme === 'light' ? 'light-theme' : '';
    }
}

// Enhanced Search System
class EnhancedSearch {
    constructor() {
        this.searchIndex = this.buildSearchIndex();
        this.init();
    }

    init() {
        this.createSearchInterface();
        this.setupEventListeners();
    }

    buildSearchIndex() {
        const index = [];

        // Index modules and lessons
        appData.modules.forEach(module => {
            index.push({
                type: 'module',
                title: module.title,
                description: module.description,
                id: module.id,
                difficulty: module.difficulty
            });

            module.lessons.forEach(lesson => {
                index.push({
                    type: 'lesson',
                    title: lesson.title,
                    content: lesson.content,
                    id: lesson.id,
                    moduleId: module.id,
                    moduleTitle: module.title
                });
            });
        });

        // Index practice problems
        appData.practiceProblems.forEach(problem => {
            index.push({
                type: 'practice',
                title: problem.title,
                prompt: problem.prompt,
                id: problem.id,
                difficulty: problem.difficulty
            });
        });

        // Index concept cards
        appData.conceptCards.forEach(concept => {
            index.push({
                type: 'concept',
                title: concept.title,
                description: concept.desc,
                code: concept.code,
                id: concept.id
            });
        });

        return index;
    }

    createSearchInterface() {
        // Enhanced search bar with suggestions
        const searchContainer = document.createElement('div');
        searchContainer.className = 'enhanced-search-container';
        searchContainer.innerHTML = `
            <div class="search-input-wrapper">
                <input type="text" id="enhanced-search" placeholder="Search everything... (Ctrl+K for advanced search)" class="input">
                <div class="search-suggestions" id="search-suggestions" style="display: none;"></div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .enhanced-search-container {
                position: relative;
                max-width: 600px;
                margin: 0 auto 2rem;
            }

            .search-input-wrapper {
                position: relative;
            }

            .search-suggestions {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--bg-secondary);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius);
                max-height: 300px;
                overflow-y: auto;
                z-index: 1000;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }

            .search-result-item {
                padding: 1rem;
                border-bottom: 1px solid var(--glass-border);
                cursor: pointer;
                transition: background-color 0.2s ease;
            }

            .search-result-item:hover {
                background: var(--glass-hover-border);
            }

            .search-result-title {
                font-weight: 600;
                color: var(--accent-cyan);
                margin-bottom: 0.25rem;
            }

            .search-result-type {
                font-size: 0.75rem;
                color: var(--text-secondary);
                text-transform: uppercase;
                margin-bottom: 0.5rem;
            }

            .search-result-preview {
                color: var(--text-secondary);
                font-size: 0.875rem;
                line-height: 1.4;
            }

            .search-result-highlight {
                background: var(--accent-yellow);
                color: var(--bg-primary);
                padding: 0.1em 0.2em;
                border-radius: 2px;
            }
        `;
        document.head.appendChild(style);

        // Add to main container
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(searchContainer, container.firstChild);
        }
    }

    setupEventListeners() {
        const searchInput = document.getElementById('enhanced-search');
        const suggestions = document.getElementById('search-suggestions');

        // Debounce helper
        const debounce = (fn, delay = 250) => {
            let t;
            return (...args) => {
                clearTimeout(t);
                t = setTimeout(() => fn(...args), delay);
            };
        };

        if (searchInput) {
            const debouncedSearch = debounce((value) => this.handleSearch(value, suggestions), 250);
            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        }

        // Global keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
        });
    }

    handleSearch(query, suggestionsContainer) {
        if (!query.trim()) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const results = this.search(query);
        this.displaySuggestions(results, suggestionsContainer);
    }

    search(query) {
        const searchTerm = query.toLowerCase();
        return this.searchIndex
            .filter(item => {
                return item.title.toLowerCase().includes(searchTerm) ||
                       (item.description && item.description.toLowerCase().includes(searchTerm)) ||
                       (item.content && item.content.toLowerCase().includes(searchTerm)) ||
                       (item.prompt && item.prompt.toLowerCase().includes(searchTerm)) ||
                       (item.code && item.code.toLowerCase().includes(searchTerm));
            })
            .slice(0, 8); // Limit results
    }

    displaySuggestions(results, container) {
        if (results.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.innerHTML = results.map(result => {
            const highlightedTitle = this.highlightText(result.title, container.previousElementSibling.value);
            const preview = this.getPreviewText(result);

            return `
                <div class="search-result-item" data-id="${result.id}" data-type="${result.type}">
                    <div class="search-result-title">${highlightedTitle}</div>
                    <div class="search-result-type">${result.type} ${result.difficulty ? `• ${result.difficulty}` : ''}</div>
                    <div class="search-result-preview">${preview}</div>
                </div>
            `;
        }).join('');

        container.style.display = 'block';

        // Add click handlers
        container.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                this.handleResultClick(item.dataset);
                container.style.display = 'none';
            });
        });
    }

    highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="search-result-highlight">$1</span>');
    }

    getPreviewText(result) {
        let text = result.description || result.content || result.prompt || '';
        if (text.length > 100) {
            text = text.substring(0, 100) + '...';
        }
        return text;
    }

    handleResultClick(data) {
        switch (data.type) {
            case 'lesson':
                const lesson = this.findLessonById(data.id);
                if (lesson) {
                    window.app.loadLesson(lesson);
                }
                break;
            case 'practice':
                const problem = appData.practiceProblems.find(p => p.id === data.id);
                if (problem) {
                    window.app.loadLesson(problem);
                }
                break;
            case 'concept':
                showPage('concepts');
                setTimeout(() => {
                    const conceptSearch = document.getElementById('concept-search');
                    if (conceptSearch) {
                        conceptSearch.value = data.id;
                        conceptSearch.dispatchEvent(new Event('input'));
                    }
                }, 100);
                break;
            case 'module':
                showPage('modules');
                setTimeout(() => {
                    const moduleSearch = document.getElementById('module-search');
                    if (moduleSearch) {
                        moduleSearch.value = data.title;
                        moduleSearch.dispatchEvent(new Event('input'));
                    }
                }, 100);
                break;
        }
    }

    findLessonById(id) {
        for (const module of appData.modules) {
            const lesson = module.lessons.find(l => l.id === id);
            if (lesson) return lesson;
        }
        return null;
    }

    performSearch(query) {
        if (!query.trim()) return;

        const results = this.search(query);
        if (results.length === 0) {
            alert('No results found for: ' + query);
            return;
        }

        // Navigate to first result
        if (results[0]) {
            this.handleResultClick({
                id: results[0].id,
                type: results[0].type
            });
        }
    }
}

// Code Visualization System
class CodeVisualizer {
    constructor() {
        this.init();
    }

    init() {
        this.createVisualizationPanel();
        this.setupEventListeners();
    }

    createVisualizationPanel() {
        const panel = document.createElement('div');
        panel.className = 'code-visualization-panel';
        panel.id = 'code-visualization-panel';
        panel.innerHTML = `
            <div class="visualization-header">
                <h3>Code Execution Visualizer</h3>
                <button class="btn btn-secondary btn-sm" id="toggle-visualizer">Hide</button>
            </div>
            <div class="visualization-content">
                <div class="execution-steps" id="execution-steps"></div>
                <div class="variable-watcher" id="variable-watcher">
                    <h4>Variables</h4>
                    <div class="variable-list" id="variable-list"></div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .code-visualization-panel {
                position: fixed;
                top: 100px;
                right: 20px;
                width: 400px;
                max-height: 70vh;
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-lg);
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 1000;
                display: none;
                backdrop-filter: blur(10px);
            }

            .visualization-header {
                padding: 1rem;
                border-bottom: 1px solid var(--glass-border);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .visualization-content {
                padding: 1rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                max-height: 60vh;
                overflow-y: auto;
            }

            .execution-steps {
                flex: 1;
            }

            .variable-watcher {
                border-top: 1px solid var(--glass-border);
                padding-top: 1rem;
            }

            .execution-step {
                padding: 0.5rem;
                margin-bottom: 0.5rem;
                background: rgba(0,0,0,0.2);
                border-radius: var(--radius);
                border-left: 3px solid var(--accent-cyan);
            }

            .execution-step.current {
                border-left-color: var(--accent-green);
                background: rgba(52, 211, 153, 0.1);
            }

            .variable-item {
                display: flex;
                justify-content: space-between;
                padding: 0.25rem 0;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .variable-name {
                color: var(--accent-magenta);
                font-weight: 600;
            }

            .variable-value {
                color: var(--accent-cyan);
                font-family: var(--font-mono);
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(panel);
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'toggle-visualizer') {
                this.toggleVisualizer();
            }
        });

        // Add visualize button to editor headers
        const lessonEditor = document.querySelector('#lesson .editor-header');
        const playgroundEditor = document.querySelector('#compiler .editor-header');

        if (lessonEditor) {
            const visualizeBtn = document.createElement('button');
            visualizeBtn.className = 'btn btn-secondary btn-sm';
            visualizeBtn.textContent = '👁️ Visualize';
            visualizeBtn.addEventListener('click', () => this.toggleVisualizer());
            lessonEditor.appendChild(visualizeBtn);
        }

        if (playgroundEditor) {
            const visualizeBtn = document.createElement('button');
            visualizeBtn.className = 'btn btn-secondary btn-sm';
            visualizeBtn.textContent = '👁️ Visualize';
            visualizeBtn.addEventListener('click', () => this.toggleVisualizer());
            playgroundEditor.appendChild(visualizeBtn);
        }
    }

    toggleVisualizer() {
        const panel = document.getElementById('code-visualization-panel');
        if (panel.style.display === 'none' || !panel.style.display) {
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }
    }

    visualizeCode(code) {
        this.clearVisualization();
        const steps = this.parseCodeSteps(code);
        this.displaySteps(steps);
    }

    parseCodeSteps(code) {
        const steps = [];
        const lines = code.split('\n');

        lines.forEach((line, index) => {
            if (line.trim()) {
                steps.push({
                    line: index + 1,
                    content: line.trim(),
                    type: this.getLineType(line)
                });
            }
        });

        return steps;
    }

    getLineType(line) {
        const trimmed = line.trim();
        if (trimmed.startsWith('#')) return 'comment';
        if (trimmed.includes('=')) return 'assignment';
        if (trimmed.startsWith('def ')) return 'function';
        if (trimmed.startsWith('if ')) return 'condition';
        if (trimmed.startsWith('for ')) return 'loop';
        if (trimmed.startsWith('print(')) return 'output';
        return 'statement';
    }

    displaySteps(steps) {
        const container = document.getElementById('execution-steps');
        container.innerHTML = steps.map((step, index) => `
            <div class="execution-step" data-step="${index}">
                <div><strong>Line ${step.line}:</strong> ${this.syntaxHighlight(step.content)}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
                    Type: ${step.type}
                </div>
            </div>
        `).join('');
    }

    syntaxHighlight(code) {
        // Simple syntax highlighting
        return code
            .replace(/(def|if|for|while|class|import|from)\b/g, '<span style="color: var(--accent-magenta);">$1</span>')
            .replace(/(\w+)(\s*=\s*)/g, '<span style="color: var(--accent-green);">$1</span>$2')
            .replace(/(".*?")/g, '<span style="color: var(--accent-yellow);">$1</span>')
            .replace(/(#.*$)/gm, '<span style="color: var(--text-secondary);">$1</span>')
            .replace(/\b(\d+)\b/g, '<span style="color: var(--accent-cyan);">$1</span>');
    }

    clearVisualization() {
        const container = document.getElementById('execution-steps');
        if (container) container.innerHTML = '';
    }

    updateVariables(variables) {
        const container = document.getElementById('variable-list');
        container.innerHTML = Object.entries(variables).map(([name, value]) => `
            <div class="variable-item">
                <span class="variable-name">${name}</span>
                <span class="variable-value">${value}</span>
            </div>
        `).join('');
    }
}

// Progress Tracking Enhancements
class ProgressTracker {
    constructor() {
        this.goals = JSON.parse(localStorage.getItem('holoDeckGoals') || '[]');
        this.init();
    }

    init() {
        this.createGoalInterface();
        this.setupEventListeners();
        this.updateProgress();
    }

    createGoalInterface() {
        const goalContainer = document.createElement('div');
        goalContainer.className = 'goal-tracker';
        goalContainer.innerHTML = `
            <div class="goal-header">
                <h3>Learning Goals</h3>
                <button class="btn btn-secondary btn-sm" id="add-goal-btn">Add Goal</button>
            </div>
            <div class="goals-list" id="goals-list"></div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .goal-tracker {
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-lg);
                padding: 1.5rem;
                margin-bottom: 2rem;
            }

            .goal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }

            .goal-item {
                padding: 1rem;
                border: 1px solid var(--glass-border);
                border-radius: var(--radius);
                margin-bottom: 1rem;
                background: rgba(0,0,0,0.1);
            }

            .goal-item.completed {
                border-color: var(--accent-green);
                background: rgba(52, 211, 153, 0.1);
            }

            .goal-progress {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin: 0.5rem 0;
            }

            .goal-progress-bar {
                flex: 1;
                height: 8px;
                background: rgba(255,255,255,0.1);
                border-radius: 4px;
                overflow: hidden;
            }

            .goal-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--accent-magenta), var(--accent-cyan));
                transition: width 0.5s ease;
            }

            .goal-actions {
                display: flex;
                gap: 0.5rem;
                margin-top: 0.5rem;
            }

            .goal-deadline {
                font-size: 0.875rem;
                color: var(--text-secondary);
            }
        `;
        document.head.appendChild(style);

        // Add to dashboard
        const dashboard = document.getElementById('home');
        if (dashboard) {
            const firstCard = dashboard.querySelector('.bento-item');
            if (firstCard) {
                firstCard.parentNode.insertBefore(goalContainer, firstCard);
            }
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'add-goal-btn') {
                this.showGoalModal();
            }
        });
    }

    showGoalModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h2 class="modal-title">Set Learning Goal</h2>
                <div class="modal-body">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem;">Goal Title:</label>
                        <input type="text" id="goal-title" class="input" placeholder="e.g., Complete Python Basics">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem;">Target Date:</label>
                        <input type="date" id="goal-deadline" class="input">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem;">Target Lessons:</label>
                        <input type="number" id="goal-target" class="input" placeholder="Number of lessons to complete" min="1">
                    </div>
                </div>
                <div style="text-align: right;">
                    <button class="btn btn-secondary btn-sm" onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
                    <button class="btn btn-sm" onclick="app.progressTracker.createGoal()">Create Goal</button>
                </div>
            </div>
        `;

        document.getElementById('modal-container').appendChild(modal);
    }

    createGoal() {
        const title = document.getElementById('goal-title').value;
        const deadline = document.getElementById('goal-deadline').value;
        const target = parseInt(document.getElementById('goal-target').value);

        if (!title || !target) {
            alert('Please fill in all fields');
            return;
        }

        const goal = {
            id: Date.now().toString(),
            title,
            deadline,
            target,
            completed: 0,
            created: new Date().toISOString()
        };

        this.goals.push(goal);
        this.saveGoals();
        this.renderGoals();
        this.closeModal();
    }

    renderGoals() {
        const container = document.getElementById('goals-list');
        if (!container) return;

        container.innerHTML = this.goals.map(goal => {
            const completedLessons = appData.userProgress.completedLessons.length;
            const progress = Math.min((completedLessons / goal.target) * 100, 100);
            const isCompleted = progress >= 100;

            return `
                <div class="goal-item ${isCompleted ? 'completed' : ''}">
                    <h4>${goal.title}</h4>
                    <div class="goal-progress">
                        <div class="goal-progress-bar">
                            <div class="goal-progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span>${Math.round(progress)}%</span>
                    </div>
                    <div class="goal-deadline">
                        Target: ${goal.target} lessons
                        ${goal.deadline ? `• Deadline: ${new Date(goal.deadline).toLocaleDateString()}` : ''}
                    </div>
                    ${isCompleted ? '<div style="color: var(--accent-green); font-weight: bold;">✓ Completed!</div>' : ''}
                </div>
            `;
        }).join('');
    }

    updateProgress() {
        this.renderGoals();
    }

    saveGoals() {
        localStorage.setItem('holoDeckGoals', JSON.stringify(this.goals));
    }

    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) modal.remove();
    }
}

// Initialize all components when the app loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    window.themeManager = new ThemeManager();

    // Initialize enhanced search
    window.enhancedSearch = new EnhancedSearch();

    // Initialize code visualizer
    window.codeVisualizer = new CodeVisualizer();

    // Initialize progress tracker
    window.progressTracker = new ProgressTracker();

    // Create or reuse an ARIA live region for screen readers
    let srLive = document.getElementById('sr-live');
    if (!srLive) {
        srLive = document.createElement('div');
        srLive.id = 'sr-live';
        srLive.setAttribute('aria-live', 'polite');
        srLive.setAttribute('aria-atomic', 'true');
        srLive.style.position = 'absolute';
        srLive.style.left = '-9999px';
        document.body.appendChild(srLive);
    }

    // Safely bind to app.runCode once app exists
    const tryBindRunCode = () => {
        if (!window.app || typeof window.app.runCode !== 'function') return false;
        const originalRunCode = window.app.runCode.bind(window.app);
        window.app.runCode = function(editorType, outputId) {
            try {
                const code = window.editors?.[editorType]?.getValue?.() || '';
                if (window.codeVisualizer) {
                    window.codeVisualizer.visualizeCode(code);
                }
                // Ensure Skulpt read is defined
                if (typeof Sk !== 'undefined' && (!Sk.builtin || !Sk.builtin.read)) {
                    const read = function (x) {
                        if (Sk.builtinFiles && Sk.builtinFiles['files'] && Sk.builtinFiles['files'][x]) {
                            return Sk.builtinFiles['files'][x];
                        }
                        throw `File not found: ${x}`;
                    };
                    Sk.builtin = Sk.builtin || {};
                    Sk.builtin.read = read;
                }
                // Update ARIA live region to announce run
                const announce = editorType === 'lesson' ? 'Executing lesson code' : 'Executing playground code';
                const el = document.getElementById('sr-live');
                if (el) { el.textContent = announce; }
            } catch (e) { /* non-blocking */ }
            return originalRunCode(editorType, outputId);
        };
        return true;
    };

    if (!tryBindRunCode()) {
        const iv = setInterval(() => { if (tryBindRunCode()) clearInterval(iv); }, 20);
        setTimeout(() => clearInterval(iv), 5000);
    }
});
