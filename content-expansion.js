// Content Expansion System - Major content additions for Enhanced Holo-Deck v2.1
class ContentExpander {
    constructor() {
        this.init();
    }

    init() {
        this.expandModules();
        this.expandConceptCards();
        this.createProjectBlueprints();
        this.addAdvancedModules();
        this.setupContentIntegration();
    }

    expandModules() {
        const data = (typeof window !== 'undefined' && window.appData) || (typeof appData !== 'undefined' ? appData : null);
        if (!data) return;
        const granularModules = [
            { id: 'data_types_deep_dive', title: 'Data Types In-Depth', description: 'Advanced features of fundamental data types', icon: '📊', difficulty: 'Beginner', lessons: [/*...*/] },
            { id: 'comprehensions_masterclass', title: 'Comprehensions Masterclass', description: 'Master list, dict, and set comprehensions', icon: '🎯', difficulty: 'Intermediate', lessons: [/*...*/] },
            { id: 'magic_methods', title: 'Python Data Model (Magic Methods)', description: 'Understand operator overloading', icon: '🪄', difficulty: 'Advanced', lessons: [/*...*/] }
        ];
        data.modules.push(...granularModules);
    }

    expandConceptCards() {
        const data = (typeof window !== 'undefined' && window.appData) || (typeof appData !== 'undefined' ? appData : null);
        if (!data) return;
        const magicMethodCards = [
            { id: 'c_dunder_init', title: '__init__(self, ...)', desc: 'Constructor method.', code: '...' },
            { id: 'c_dunder_str', title: '__str__(self)', desc: 'Human-readable string representation.', code: '...' }
        ];
        const libraryCards = [
            { id: 'c_itertools_product', title: 'itertools.product()', desc: 'Cartesian product of iterables.', code: '...' },
            { id: 'c_collections_counter', title: 'collections.Counter()', desc: 'Count elements in an iterable.', code: '...' }
        ];
        data.conceptCards.push(...magicMethodCards, ...libraryCards);
    }

    createProjectBlueprints() {
        const data = (typeof window !== 'undefined' && window.appData) || (typeof appData !== 'undefined' ? appData : null);
        if (!data) return;
        const projectBlueprints = [
            {
                id: 'project_cli_tool', title: 'Build a CLI Tool', description: 'Create a command-line tool with argparse', icon: '🛠️', difficulty: 'Intermediate', type: 'project',
                lessons: [
                    { id: 'cli_intro', title: 'Intro to argparse', content: 'Learn to accept command-line arguments.', code: 'import argparse\n...', quiz: [/*...*/] }
                ]
            },
            {
                id: 'project_web_scraper', title: 'Create a Web Scraper', description: 'Extract data from websites with Beautiful Soup', icon: '🕷️', difficulty: 'Intermediate', type: 'project',
                lessons: [
                    { id: 'scraper_basics', title: 'Scraping Fundamentals', content: 'Basics of requests and Beautiful Soup.', code: 'import requests\n...', quiz: [/*...*/] }
                ]
            }
        ];
        // We will store this separately for now and handle it via command palette
        data.projectBlueprints = projectBlueprints;
    }

    addAdvancedModules() {
        const data = (typeof window !== 'undefined' && window.appData) || (typeof appData !== 'undefined' ? appData : null);
        if (!data) return;
        const advancedModules = [
            {
                id: 'devops_automation', title: 'DevOps & Automation', description: 'Automate tasks with Python', icon: '⚙️', difficulty: 'Intermediate',
                lessons: [
                    { id: 'file_system_ops', title: 'File System Operations', content: 'Automate file operations.', code: 'import os\n...', quiz: [/*...*/] }
                ]
            }
        ];
        data.modules.push(...advancedModules);
    }

    setupContentIntegration() {
        this.updateCommandPalette();
    }

    updateCommandPalette() {
        if (!window.app?.renderCommandPaletteResults) return;

        const originalRender = window.app.renderCommandPaletteResults;
        const self = this;

        window.app.renderCommandPaletteResults = function (query) {
            // Call the original function to render existing results
            originalRender.call(this, query);

            // Add project blueprints to search results
            const resultsContainer = document.getElementById('command-palette-results');
            const data = (typeof window !== 'undefined' && window.appData) || (typeof appData !== 'undefined' ? appData : null);
            if (data?.projectBlueprints) {
                data.projectBlueprints.forEach(project => {
                    if (project.title.toLowerCase().includes(query.toLowerCase())) {
                        const item = document.createElement('div');
                        item.className = 'cp-result-item';
                        item.innerHTML = `<span>${project.title}</span><span class="cp-result-item-hint">Project</span>`;
                        item.addEventListener('click', () => {
                            self.loadProject(project);
                            this.toggleCommandPalette();
                        });
                        resultsContainer.appendChild(item);
                    }
                });
            }
        };
    }

    loadProject(project) {
        // Load the first lesson of the project to start
        if (window.app?.loadLesson && project.lessons?.[0]) {
            window.app.loadLesson(project.lessons[0]);
        } else {
            console.error("Could not load project:", project);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.contentExpander = new ContentExpander();
});