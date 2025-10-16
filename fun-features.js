// Fun & Whimsical Features System
class FunFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.createSynthwavePlayer();
        this.addParticleCustomizer();
        this.createEasterEggs();
        this.addLoreSystem();
        this.createTypingSpeedTest();
        this.addQuoteOfTheDay();
        this.createRandomFactGenerator();
        this.addSeasonalThemes();
        this.createCodeArtGallery();
        this.addHoloPet();
        this.createZenOfPythonViewer();
        this.addAnimatedTerminal();
    }

    createSynthwavePlayer() {
        const playerContainer = document.createElement('div');
        playerContainer.className = 'synthwave-player';
        playerContainer.innerHTML = `
            <div class="player-controls">
                <button id="play-pause" title="Play/Pause">▶️</button>
                <button id="volume-toggle" title="Mute/Unmute">🔊</button>
                <div class="volume-slider">
                    <input type="range" id="volume-control" min="0" max="100" value="50">
                </div>
                <div class="track-info">
                    <span id="current-track">Synthwave Mix</span>
                </div>
            </div>
            <div class="playlist">
                <div class="track-item active" data-track="synthwave">🌆 Synthwave Mix</div>
                <div class="track-item" data-track="cyberpunk">🤖 Cyberpunk Beats</div>
                <div class="track-item" data-track="retrowave">🌊 Retrowave</div>
                <div class="track-item" data-track="ambient">🎵 Ambient Focus</div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .synthwave-player {
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-lg);
                padding: 1rem;
                width: 300px;
                z-index: 1000;
                backdrop-filter: blur(10px);
            }

            .player-controls {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .player-controls button {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 1.2rem;
                padding: 0.5rem;
                border-radius: var(--radius);
                transition: background-color 0.2s;
            }

            .player-controls button:hover {
                background: var(--glass-hover-border);
            }

            .volume-slider {
                flex: 1;
                margin: 0 0.5rem;
            }

            .volume-slider input {
                width: 100%;
                height: 4px;
                background: var(--glass-border);
                border-radius: 2px;
                outline: none;
            }

            .volume-slider input::-webkit-slider-thumb {
                appearance: none;
                width: 12px;
                height: 12px;
                background: var(--accent-cyan);
                border-radius: 50%;
                cursor: pointer;
            }

            .track-info {
                font-size: 0.875rem;
                color: var(--text-secondary);
            }

            .playlist {
                max-height: 200px;
                overflow-y: auto;
            }

            .track-item {
                padding: 0.5rem;
                cursor: pointer;
                border-radius: var(--radius);
                margin-bottom: 0.25rem;
                transition: background-color 0.2s;
            }

            .track-item:hover {
                background: var(--glass-hover-border);
            }

            .track-item.active {
                background: var(--accent-cyan);
                color: var(--bg-primary);
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(playerContainer);

        // Audio tracks (using placeholder URLs)
        this.audioTracks = {
            synthwave: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            cyberpunk: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            retrowave: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            ambient: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
        };

        this.currentAudio = null;
        this.isPlaying = false;
        this.currentTrack = 'synthwave';

        // Setup event listeners
        document.getElementById('play-pause').addEventListener('click', () => this.togglePlayPause());
        document.getElementById('volume-toggle').addEventListener('click', () => this.toggleMute());
        document.getElementById('volume-control').addEventListener('input', (e) => this.setVolume(e.target.value));

        document.querySelectorAll('.track-item').forEach(item => {
            item.addEventListener('click', () => this.changeTrack(item.dataset.track));
        });
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pauseAudio();
        } else {
            this.playAudio();
        }
    }

    playAudio() {
        if (!this.currentAudio) {
            this.currentAudio = new Audio(this.audioTracks[this.currentTrack]);
            this.currentAudio.loop = true;
            this.currentAudio.volume = parseInt(document.getElementById('volume-control').value) / 100;
        }

        this.currentAudio.play();
        this.isPlaying = true;
        document.getElementById('play-pause').textContent = '⏸️';
    }

    pauseAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.isPlaying = false;
            document.getElementById('play-pause').textContent = '▶️';
        }
    }

    toggleMute() {
        if (this.currentAudio) {
            this.currentAudio.muted = !this.currentAudio.muted;
            document.getElementById('volume-toggle').textContent = this.currentAudio.muted ? '🔇' : '🔊';
        }
    }

    setVolume(volume) {
        if (this.currentAudio) {
            this.currentAudio.volume = volume / 100;
        }
    }

    changeTrack(trackId) {
        this.currentTrack = trackId;
        document.getElementById('current-track').textContent = document.querySelector(`[data-track="${trackId}"]`).textContent;

        // Update active track
        document.querySelectorAll('.track-item').forEach(item => {
            item.classList.toggle('active', item.dataset.track === trackId);
        });

        // Change audio source
        if (this.currentAudio) {
            this.currentAudio.src = this.audioTracks[trackId];
            if (this.isPlaying) {
                this.currentAudio.play();
            }
        }
    }

    addParticleCustomizer() {
        const customizer = document.createElement('div');
        customizer.className = 'particle-customizer';
        customizer.innerHTML = `
            <button id="particle-toggle" title="Customize Particles">✨</button>
            <div id="particle-controls" style="display: none;">
                <div class="control-group">
                    <label>Color:</label>
                    <input type="color" id="particle-color" value="#ffffff">
                </div>
                <div class="control-group">
                    <label>Density:</label>
                    <input type="range" id="particle-density" min="10" max="100" value="60">
                </div>
                <div class="control-group">
                    <label>Speed:</label>
                    <input type="range" id="particle-speed" min="0.5" max="3" step="0.1" value="1">
                </div>
                <button id="apply-particles">Apply</button>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .particle-customizer {
                position: fixed;
                bottom: 20px;
                right: 300px;
                z-index: 1000;
            }

            .particle-customizer button {
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: 50%;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.3s ease;
            }

            .particle-customizer button:hover {
                background: var(--glass-hover-border);
                transform: scale(1.1);
            }

            #particle-controls {
                position: absolute;
                bottom: 60px;
                right: 0;
                background: var(--bg-secondary);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius);
                padding: 1rem;
                min-width: 200px;
            }

            .control-group {
                margin-bottom: 1rem;
            }

            .control-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-size: 0.875rem;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(customizer);

        // Setup event listeners
        document.getElementById('particle-toggle').addEventListener('click', () => {
            const controls = document.getElementById('particle-controls');
            controls.style.display = controls.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('apply-particles').addEventListener('click', () => {
            this.updateParticles();
        });
    }

    updateParticles() {
        const color = document.getElementById('particle-color').value;
        const density = document.getElementById('particle-density').value;
        const speed = document.getElementById('particle-speed').value;

        // Update particles.js configuration
        if (window.pJSDom && window.pJSDom.length > 0) {
            const particles = window.pJSDom[0].pJS.particles;
            particles.color.value = color;
            particles.number.value = parseInt(density);
            particles.move.speed = parseFloat(speed);

            // Refresh particles
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    }

    createEasterEggs() {
        // Add hidden features that can be discovered
        this.addKonamiCode();
        this.addSecretCommands();
        this.addHiddenElements();
    }

    addKonamiCode() {
        const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        let position = 0;

        document.addEventListener('keydown', (e) => {
            if (e.code === konami[position]) {
                position++;
                if (position === konami.length) {
                    this.activateKonamiCode();
                    position = 0;
                }
            } else {
                position = 0;
            }
        });
    }

    activateKonamiCode() {
        // Fun effects
        document.body.style.animation = 'rainbow 2s linear infinite';
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        this.showNotification('🎮 Konami Code Activated! 🌈', 'success', 'Easter Egg');

        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 10000);
    }

    addSecretCommands() {
        // Add secret commands to the command palette
        const secretCommands = [
            {
                name: '🦄 Enable Unicorn Mode',
                action: () => this.enableUnicornMode()
            },
            {
                name: '🎭 Matrix Mode',
                action: () => this.enableMatrixMode()
            },
            {
                name: '🚀 Hyperdrive',
                action: () => this.activateHyperdrive()
            }
        ];

        // Add to command palette if it exists
        if (window.app && window.app.renderCommandPaletteResults) {
            const originalRender = window.app.renderCommandPaletteResults;
            window.app.renderCommandPaletteResults = function(query) {
                originalRender.call(this, query);

                if (query.toLowerCase().includes('unicorn') || query.toLowerCase().includes('secret')) {
                    const resultsContainer = document.getElementById('command-palette-results');
                    secretCommands.forEach(cmd => {
                        const item = document.createElement('div');
                        item.className = 'cp-result-item secret';
                        item.innerHTML = `<span>${cmd.name}</span><span class="cp-result-item-hint">Easter Egg</span>`;
                        item.addEventListener('click', cmd.action);
                        resultsContainer.appendChild(item);
                    });
                }
            };
        }
    }

    enableUnicornMode() {
        const unicorns = ['🦄', '🌈', '✨', '💖', '🎆'];
        let unicornIndex = 0;

        const interval = setInterval(() => {
            document.body.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ctext y='50' font-size='50'%3E${unicorns[unicornIndex]}%3C/text%3E%3C/svg%3E")`;
            unicornIndex = (unicornIndex + 1) % unicorns.length;
        }, 1000);

        setTimeout(() => {
            clearInterval(interval);
            document.body.style.backgroundImage = '';
        }, 10000);

        this.showNotification('🦄 Unicorn mode activated!', 'success');
    }

    enableMatrixMode() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '10000';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const matrix = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff00';
            ctx.font = `${fontSize}px monospace`;

            drops.forEach((drop, i) => {
                const text = matrix[Math.floor(Math.random() * matrix.length)];
                ctx.fillText(text, i * fontSize, drop * fontSize);

                if (drop * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            });
        };

        const interval = setInterval(draw, 33);

        setTimeout(() => {
            clearInterval(interval);
            document.body.removeChild(canvas);
        }, 10000);
    }

    activateHyperdrive() {
        const duration = 3000;
        const start = Date.now();

        const animate = () => {
            const elapsed = Date.now() - start;
            const progress = elapsed / duration;

            if (progress < 1) {
                const speed = 1 + progress * 10;
                document.body.style.transform = `scale(${1 + progress * 0.1})`;
                document.body.style.filter = `blur(${progress * 2}px)`;

                requestAnimationFrame(animate);
            } else {
                document.body.style.transform = '';
                document.body.style.filter = '';
            }
        };

        requestAnimationFrame(animate);
        this.showNotification('🚀 Engaging hyperdrive!', 'info');
    }

    addHiddenElements() {
        // Add hidden elements that can be discovered
        const hiddenDiv = document.createElement('div');
        hiddenDiv.className = 'hidden-easter-egg';
        hiddenDiv.innerHTML = '🎉 You found an easter egg! 🎉';
        hiddenDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--accent-magenta);
            color: white;
            padding: 2rem;
            border-radius: var(--radius-lg);
            z-index: 10000;
            display: none;
            text-align: center;
        `;

        document.body.appendChild(hiddenDiv);

        // Add click handler to brand for easter egg
        const brand = document.querySelector('.brand');
        if (brand) {
            brand.addEventListener('dblclick', () => {
                hiddenDiv.style.display = 'block';
                setTimeout(() => {
                    hiddenDiv.style.display = 'none';
                }, 3000);
            });
        }
    }

    addLoreSystem() {
        const loreContainer = document.createElement('div');
        loreContainer.className = 'holo-deck-lore';
        loreContainer.innerHTML = `
            <div class="lore-trigger" title="View Holo-Deck Lore">📚</div>
            <div class="lore-content" id="lore-content" style="display: none;">
                <h3>The Legend of the Holo-Deck</h3>
                <p>In the year 2147, as humanity ventured into the digital cosmos, the Holo-Deck was born...</p>
                <p>A sanctuary for aspiring code warriors, where the boundaries between reality and virtuality blur...</p>
                <p>Here, in this cybernetic realm, you will forge your destiny, one line of code at a time...</p>
                <p>May your algorithms be efficient, your logic sound, and your Python skills legendary...</p>
                <button onclick="this.parentElement.style.display='none'">Close Legend</button>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .holo-deck-lore {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1000;
            }

            .lore-trigger {
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            .lore-trigger:hover {
                background: var(--glass-hover-border);
                transform: scale(1.1);
            }

            .lore-content {
                background: var(--bg-secondary);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-lg);
                padding: 2rem;
                margin-top: 1rem;
                max-width: 500px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }

            .lore-content h3 {
                color: var(--accent-magenta);
                margin-bottom: 1rem;
            }

            .lore-content p {
                margin-bottom: 1rem;
                line-height: 1.6;
            }

            .lore-content button {
                background: var(--accent-cyan);
                border: none;
                padding: 0.5rem 1rem;
                border-radius: var(--radius);
                cursor: pointer;
                color: var(--bg-primary);
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(loreContainer);

        // Setup event listener
        document.querySelector('.lore-trigger').addEventListener('click', () => {
            const content = document.getElementById('lore-content');
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });
    }

    createTypingSpeedTest() {
        const testContainer = document.createElement('div');
        testContainer.className = 'typing-test';
        testContainer.innerHTML = `
            <div class="test-trigger" title="Typing Speed Test">⌨️</div>
            <div class="test-interface" id="test-interface" style="display: none;">
                <h3>Typing Speed Test</h3>
                <div class="test-text" id="test-text">
                    The quick brown fox jumps over the lazy dog. Python programming is fun and interactive.
                    Learn to code with the Holo-Deck system and become a master developer.
                </div>
                <textarea id="typing-input" placeholder="Start typing here..." rows="3"></textarea>
                <div class="test-stats">
                    <span id="wpm">0</span> WPM |
                    <span id="accuracy">100</span>% Accuracy |
                    <span id="time-left">60</span>s
                </div>
                <div class="test-controls">
                    <button id="restart-test">Restart</button>
                    <button onclick="this.parentElement.parentElement.parentElement.style.display='none'">Close</button>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .typing-test {
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 1000;
            }

            .test-trigger {
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            .test-trigger:hover {
                background: var(--glass-hover-border);
                transform: scale(1.1);
            }

            .test-interface {
                background: var(--bg-secondary);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-lg);
                padding: 2rem;
                margin-top: 1rem;
                width: 600px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }

            .test-text {
                background: var(--glass-bg);
                padding: 1rem;
                border-radius: var(--radius);
                margin-bottom: 1rem;
                line-height: 1.6;
                font-size: 1.1rem;
            }

            .test-text .correct {
                color: var(--accent-green);
            }

            .test-text .incorrect {
                color: var(--accent-red);
                text-decoration: underline;
            }

            .test-text .current {
                background: var(--accent-cyan);
                color: var(--bg-primary);
            }

            #typing-input {
                width: 100%;
                padding: 1rem;
                border: 1px solid var(--glass-border);
                border-radius: var(--radius);
                background: var(--glass-bg);
                color: var(--text-primary);
                font-family: var(--font-mono);
                margin-bottom: 1rem;
                resize: vertical;
            }

            .test-stats {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 1rem;
                font-weight: bold;
            }

            .test-controls {
                display: flex;
                justify-content: center;
                gap: 1rem;
            }

            .test-controls button {
                background: var(--accent-cyan);
                border: none;
                padding: 0.5rem 1rem;
                border-radius: var(--radius);
                cursor: pointer;
                color: var(--bg-primary);
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(testContainer);

        this.setupTypingTest();
    }

    setupTypingTest() {
        const trigger = document.querySelector('.test-trigger');
        const interface = document.getElementById('test-interface');
        const input = document.getElementById('typing-input');
        const restartBtn = document.getElementById('restart-test');

        trigger.addEventListener('click', () => {
            interface.style.display = interface.style.display === 'none' ? 'block' : 'none';
            if (interface.style.display === 'block') {
                input.focus();
                this.startTypingTest();
            }
        });

        restartBtn.addEventListener('click', () => {
            this.startTypingTest();
        });
    }

    startTypingTest() {
        const textElement = document.getElementById('test-text');
        const input = document.getElementById('typing-input');
        const wpmElement = document.getElementById('wpm');
        const accuracyElement = document.getElementById('accuracy');
        const timeElement = document.getElementById('time-left');

        const testText = textElement.textContent;
        let currentIndex = 0;
        let startTime = null;
        let timer = null;
        let timeLeft = 60;

        // Reset display
        textElement.innerHTML = testText.split('').map((char, index) => `<span data-index="${index}">${char}</span>`).join('');
        input.value = '';
        wpmElement.textContent = '0';
        accuracyElement.textContent = '100';
        timeElement.textContent = '60';

        const updateDisplay = () => {
            const typedText = input.value;
            const textSpans = textElement.querySelectorAll('span');

            textSpans.forEach((span, index) => {
                if (index < typedText.length) {
                    if (typedText[index] === testText[index]) {
                        span.className = 'correct';
                    } else {
                        span.className = 'incorrect';
                    }
                } else if (index === typedText.length) {
                    span.className = 'current';
                } else {
                    span.className = '';
                }
            });
        };

        const calculateStats = () => {
            const typedText = input.value;
            const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
            const wordsTyped = typedText.trim().split(/\s+/).length;
            const wpm = Math.round(wordsTyped / timeElapsed) || 0;

            const correctChars = typedText.split('').filter((char, index) => char === testText[index]).length;
            const accuracy = typedText.length > 0 ? Math.round((correctChars / typedText.length) * 100) : 100;

            wpmElement.textContent = wpm;
            accuracyElement.textContent = accuracy;
        };

        const tick = () => {
            timeLeft--;
            timeElement.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);
                this.endTypingTest();
            }
        };

        input.addEventListener('input', () => {
            if (!startTime) {
                startTime = Date.now();
                timer = setInterval(tick, 1000);
            }

            updateDisplay();
            calculateStats();

            if (input.value.length === testText.length) {
                clearInterval(timer);
                this.endTypingTest();
            }
        });

        input.focus();
    }

    endTypingTest() {
        const wpm = document.getElementById('wpm').textContent;
        const accuracy = document.getElementById('accuracy').textContent;

        this.showNotification(
            `Test completed! ${wpm} WPM with ${accuracy}% accuracy!`,
            'success',
            '⌨️ Typing Test'
        );
    }

    addQuoteOfTheDay() {
        const quotes = [
            "Code is like humor. When you have to explain it, it's bad. – Cory House",
            "Programs must be written for people to read, and only incidentally for machines to execute. – Harold Abelson",
            "The best way to predict the future is to invent it. – Alan Kay",
            "First, solve the problem. Then, write the code. – John Johnson",
            "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code. – Dan Salomon",
            "Nine people can't make a baby in a month. – Fred Brooks",
            "If debugging is the process of removing bugs, then programming must be the process of putting them in. – Edsger Dijkstra",
            "A good programmer is someone who always looks both ways before crossing a one-way street. – Doug Linder",
            "Measuring programming progress by lines of code is like measuring aircraft building progress by weight. – Bill Gates",
            "The most disastrous thing that you can ever learn is your first programming language. – Alan Kay"
        ];

        const quoteContainer = document.createElement('div');
        quoteContainer.className = 'quote-of-the-day';
        quoteContainer.innerHTML = `
            <div class="quote-text" id="quote-text"></div>
            <button id="new-quote" title="New Quote">🔄</button>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .quote-of-the-day {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-lg);
                padding: 1rem;
                max-width: 300px;
                z-index: 1000;
                backdrop-filter: blur(10px);
            }

            .quote-text {
                font-style: italic;
                color: var(--accent-magenta);
                margin-bottom: 1rem;
                line-height: 1.4;
            }

            #new-quote {
                background: none;
                border: 1px solid var(--glass-border);
                border-radius: var(--radius);
                padding: 0.5rem;
                cursor: pointer;
                transition: all 0.2s;
            }

            #new-quote:hover {
                background: var(--glass-hover-border);
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(quoteContainer);

        // Display random quote
        const displayQuote = () => {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            document.getElementById('quote-text').textContent = `"${randomQuote}"`;
        };

        displayQuote();

        document.getElementById('new-quote').addEventListener('click', displayQuote);
    }

    createRandomFactGenerator() {
        const facts = [
            "Python was named after Monty Python's Flying Circus, not the snake!",
            "Python's philosophy is summarized in 'The Zen of Python' - type 'import this' to see it",
            "Python has over 137,000 packages available through PyPI",
            "The Python Software Foundation (PSF) owns and protects the Python trademark",
            "Python is used by companies like Google, Netflix, Instagram, and Spotify",
            "Guido van Rossum, Python's creator, worked at Google and Dropbox",
            "Python's first version was released in 1991",
            "Python is the fastest-growing major programming language",
            "Python supports multiple programming paradigms: procedural, object-oriented, and functional",
            "Python's creator chose the name because he wanted something 'short, unique, and slightly mysterious'"
        ];

        const factContainer = document.createElement('div');
        factContainer.className = 'random-fact';
        factContainer.innerHTML = `
            <button id="fact-button" title="Random Python Fact">🎲</button>
            <div id="fact-display" style="display: none;"></div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .random-fact {
                position: fixed;
                bottom: 20px;
                left: 80px;
                z-index: 1000;
            }

            #fact-button {
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: 50%;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.3s ease;
            }

            #fact-button:hover {
                background: var(--glass-hover-border);
                transform: scale(1.1);
            }

            #fact-display {
                position: absolute;
                bottom: 60px;
                left: 0;
                background: var(--bg-secondary);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius);
                padding: 1rem;
                width: 300px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(factContainer);

        // Setup event listener
        document.getElementById('fact-button').addEventListener('click', () => {
            const display = document.getElementById('fact-display');
            const randomFact = facts[Math.floor(Math.random() * facts.length)];

            display.textContent = randomFact;
            display.style.display = display.style.display === 'none' ? 'block' : 'none';
        });
    }

    addSeasonalThemes() {
        const now = new Date();
        const month = now.getMonth() + 1; // JavaScript months are 0-indexed

        let theme = 'default';
        let themeData = {};

        // Determine seasonal theme
        if (month === 12 || month === 1) {
            theme = 'winter';
            themeData = {
                colors: {
                    primary: '#4fc3f7',
                    secondary: '#81c784',
                    accent: '#ffb74d'
                },
                particles: '❄️',
                greeting: 'Winter Coding Session! ☃️'
            };
        } else if (month >= 3 && month <= 5) {
            theme = 'spring';
            themeData = {
                colors: {
                    primary: '#81c784',
                    secondary: '#ffb74d',
                    accent: '#f48fb1'
                },
                particles: '🌸',
                greeting: 'Spring into Coding! 🌱'
            };
        } else if (month >= 6 && month <= 8) {
            theme = 'summer';
            themeData = {
                colors: {
                    primary: '#ffb74d',
                    secondary: '#4fc3f7',
                    accent: '#81c784'
                },
                particles: '☀️',
                greeting: 'Summer Coding Vibes! 🏖️'
            };
        } else {
            theme = 'autumn';
            themeData = {
                colors: {
                    primary: '#ff8a65',
                    secondary: '#ffb74d',
                    accent: '#81c784'
                },
                particles: '🍂',
                greeting: 'Autumn Coding Season! 🍁'
            };
        }

        this.applySeasonalTheme(theme, themeData);
    }

    applySeasonalTheme(theme, themeData) {
        // Apply seasonal customizations
        const style = document.createElement('style');
        style.textContent = `
            .seasonal-${theme} {
                --seasonal-primary: ${themeData.colors.primary};
                --seasonal-secondary: ${themeData.colors.secondary};
                --seasonal-accent: ${themeData.colors.accent};
            }

            .seasonal-${theme} .brand::after {
                content: " ${themeData.greeting}";
                font-size: 0.75rem;
                opacity: 0.7;
            }

            .seasonal-${theme} .particles::before {
                content: "${themeData.particles}";
                position: fixed;
                top: 10px;
                right: 10px;
                font-size: 2rem;
                z-index: 1001;
                animation: float 3s ease-in-out infinite;
            }

            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
        `;

        document.head.appendChild(style);
        document.body.classList.add(`seasonal-${theme}`);

        // Update greeting if available
        const greeting = document.getElementById('user-greeting');
        if (greeting && themeData.greeting) {
            greeting.textContent = greeting.textContent + ` - ${themeData.greeting}`;
        }
    }

    createCodeArtGallery() {
        const galleryContainer = document.createElement('div');
        galleryContainer.className = 'code-art-gallery';
        galleryContainer.innerHTML = `
            <div class="gallery-trigger" title="Code Art Gallery">🎨</div>
            <div class="gallery-content" id="gallery-content" style="display: none;">
                <h3>Python Art Gallery</h3>
                <div class="art-grid" id="art-grid">
                    <div class="art-piece" data-art="mandelbrot">
                        <div class="art-preview">🌀</div>
                        <h4>Mandelbrot Set</h4>
                        <p>Generate the famous Mandelbrot fractal</p>
                    </div>
                    <div class="art-piece" data-art="sierpinski">
                        <div class="art-preview">🔺</div>
                        <h4>Sierpinski Triangle</h4>
                        <p>Create a fractal triangle pattern</p>
                    </div>
                    <div class="art-piece" data-art="julia">
                        <div class="art-preview">🌊</div>
                        <h4>Julia Set</h4>
                        <p>Explore complex number fractals</p>
                    </div>
                    <div class="art-piece" data-art="spiral">
                        <div class="art-preview">🌀</div>
                        <h4>Archimedean Spiral</h4>
                        <p>Draw mathematical spirals</p>
                    </div>
                </div>
                <div class="art-code" id="art-code"></div>
                <button onclick="this.parentElement.style.display='none'">Close Gallery</button>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .code-art-gallery {
                position: fixed;
                top: 20px;
                left: 80px;
                z-index: 1000;
            }

            .gallery-trigger {
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            .gallery-trigger:hover {
                background: var(--glass-hover-border);
                transform: scale(1.1);
            }

            .gallery-content {
                position: absolute;
                top: 50px;
                left: 0;
                background: var(--bg-secondary);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-lg);
                padding: 2rem;
                width: 600px;
                max-height: 70vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }

            .art-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .art-piece {
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius);
                padding: 1rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .art-piece:hover {
                border-color: var(--accent-magenta);
                transform: translateY(-2px);
            }

            .art-preview {
                font-size: 3rem;
                margin-bottom: 1rem;
            }

            .art-code {
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius);
                padding: 1rem;
                margin-bottom: 1rem;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(galleryContainer);

        this.setupCodeArtGallery();
    }

    setupCodeArtGallery() {
        const trigger = document.querySelector('.gallery-trigger');
        const content = document.getElementById('gallery-content');

        trigger.addEventListener('click', () => {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });

        document.querySelectorAll('.art-piece').forEach(piece => {
            piece.addEventListener('click', () => {
                this.displayArtCode(piece.dataset.art);
            });
        });
    }

    displayArtCode(artType) {
        const codeContainer = document.getElementById('art-code');
        const artCode = this.getArtCode(artType);

        codeContainer.innerHTML = `
            <h4>${artType.charAt(0).toUpperCase() + artType.slice(1)} Code</h4>
            <pre><code class="language-python">${artCode}</code></pre>
            <button onclick="navigator.clipboard.writeText(\`${artCode.replace(/`/g, '\\`')}\`)">Copy Code</button>
        `;

        // Syntax highlight the code
        if (window.Prism) {
            window.Prism.highlightElement(codeContainer.querySelector('code'));
        }
    }

    getArtCode(artType) {
        const codes = {
            mandelbrot: `import matplotlib.pyplot as plt
import numpy as np

def mandelbrot(c, max_iter):
    z = 0
    for n in range(max_iter):
        if abs(z) > 2:
            return n
        z = z*z + c
    return max_iter

# Create the plot
x = np.linspace(-2, 1, 800)
y = np.linspace(-1.5, 1.5, 600)
X, Y = np.meshgrid(x, y)
C = X + 1j * Y

# Calculate Mandelbrot set
mandel = np.array([mandelbrot(c, 100) for c in C.ravel()])
mandel = mandel.reshape(C.shape)

# Plot
plt.imshow(mandel, extent=[-2, 1, -1.5, 1.5], cmap='hot')
plt.title('Mandelbrot Set')
plt.show()`,

            sierpinski: `import matplotlib.pyplot as plt
import numpy as np

def sierpinski_triangle(ax, x, y, size, depth):
    if depth == 0:
        # Draw triangle
        triangle = plt.Polygon([[x, y], [x + size, y], [x + size/2, y + size]], color='blue')
        ax.add_patch(triangle)
    else:
        # Recursively draw smaller triangles
        sierpinski_triangle(ax, x, y, size/2, depth-1)
        sierpinski_triangle(ax, x + size/2, y, size/2, depth-1)
        sierpinski_triangle(ax, x + size/4, y + size/2, size/2, depth-1)

# Create plot
fig, ax = plt.subplots()
ax.set_aspect('equal')
ax.axis('off')

# Draw Sierpinski triangle
sierpinski_triangle(ax, 0, 0, 10, 6)

plt.title('Sierpinski Triangle')
plt.show()`,

            julia: `import matplotlib.pyplot as plt
import numpy as np

def julia_set(c, x_min, x_max, y_min, y_max, width, height, max_iter):
    x = np.linspace(x_min, x_max, width)
    y = np.linspace(y_min, y_max, height)
    X, Y = np.meshgrid(x, y)
    Z = X + 1j * Y

    julia = np.zeros(Z.shape, dtype=int)

    for i in range(height):
        for j in range(width):
            z = Z[i, j]
            for n in range(max_iter):
                if abs(z) > 2:
                    julia[i, j] = n
                    break
                z = z*z + c

    return julia

# Julia set parameters
c = complex(-0.7, 0.27015)
julia = julia_set(c, -1.5, 1.5, -1.5, 1.5, 800, 600, 100)

# Plot
plt.imshow(julia, extent=[-1.5, 1.5, -1.5, 1.5], cmap='viridis')
plt.title(f'Julia Set (c = {c})')
plt.colorbar()
plt.show()`,

            spiral: `import matplotlib.pyplot as plt
import numpy as np

def draw_spiral(turns, size):
    theta = np.linspace(0, turns * 2 * np.pi, 1000)
    r = np.linspace(0, size, 1000)

    x = r * np.cos(theta)
    y = r * np.sin(theta)

    plt.plot(x, y, 'b-', linewidth=2)
    plt.axis('equal')
    plt.title(f'Archimedean Spiral ({turns} turns)')
    plt.grid(True, alpha=0.3)

# Draw multiple spirals
for turns in [1, 2, 3, 5]:
    plt.figure(figsize=(8, 8))
    draw_spiral(turns, 10)

plt.show()`
        };

        return codes[artType] || 'Code not available';
    }

    addHoloPet() {
        const petContainer = document.createElement('div');
        petContainer.className = 'holo-pet';
        petContainer.innerHTML = `
            <div class="pet-display" id="pet-display">🐍</div>
            <div class="pet-stats" id="pet-stats" style="display: none;">
                <h4>Holo-Pet Status</h4>
                <div class="stat-bar">
                    <label>Happiness:</label>
                    <div class="progress"><div class="progress-bar" id="happiness-bar"></div></div>
                </div>
                <div class="stat-bar">
                    <label>Level:</label>
                    <span id="pet-level">1</span>
                </div>
                <button id="feed-pet">🍎 Feed</button>
                <button id="play-pet">🎮 Play</button>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .holo-pet {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
            }

            .pet-display {
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: 50%;
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 2rem;
                transition: all 0.3s ease;
                animation: pet-breathe 4s ease-in-out infinite;
            }

            .pet-display:hover {
                background: var(--glass-hover-border);
                transform: scale(1.1);
            }

            @keyframes pet-breathe {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            .pet-stats {
                position: absolute;
                bottom: 70px;
                right: 0;
                background: var(--bg-secondary);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius);
                padding: 1rem;
                width: 200px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }

            .stat-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }

            .stat-bar label {
                font-size: 0.875rem;
            }

            .stat-bar .progress {
                flex: 1;
                margin-left: 0.5rem;
                height: 8px;
            }

            #pet-level {
                font-weight: bold;
                color: var(--accent-cyan);
            }

            .pet-stats button {
                width: 100%;
                margin: 0.25rem 0;
                padding: 0.5rem;
                border: 1px solid var(--glass-border);
                border-radius: var(--radius);
                background: var(--glass-bg);
                cursor: pointer;
                transition: all 0.2s;
            }

            .pet-stats button:hover {
                background: var(--glass-hover-border);
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(petContainer);

        this.setupHoloPet();
    }

    setupHoloPet() {
        const petDisplay = document.getElementById('pet-display');
        const petStats = document.getElementById('pet-stats');
        const happinessBar = document.getElementById('happiness-bar');
        const petLevel = document.getElementById('pet-level');

        let happiness = parseInt(localStorage.getItem('petHappiness') || '50');
        let level = parseInt(localStorage.getItem('petLevel') || '1');

        const updatePet = () => {
            happinessBar.style.width = happiness + '%';
            petLevel.textContent = level;

            // Update pet appearance based on happiness
            if (happiness > 70) {
                petDisplay.textContent = '🐍';
            } else if (happiness > 30) {
                petDisplay.textContent = '😊';
            } else {
                petDisplay.textContent = '😴';
            }
        };

        petDisplay.addEventListener('click', () => {
            petStats.style.display = petStats.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('feed-pet').addEventListener('click', () => {
            happiness = Math.min(100, happiness + 20);
            localStorage.setItem('petHappiness', happiness.toString());
            updatePet();
            this.showNotification('🐍 Your pet is happy!', 'success');
        });

        document.getElementById('play-pet').addEventListener('click', () => {
            happiness = Math.min(100, happiness + 10);
            localStorage.setItem('petHappiness', happiness.toString());
            updatePet();
            this.showNotification('🎮 Playing with your pet!', 'info');
        });

        // Decrease happiness over time
        setInterval(() => {
            happiness = Math.max(0, happiness - 1);
            localStorage.setItem('petHappiness', happiness.toString());
            updatePet();
        }, 30000); // Every 30 seconds

        updatePet();
    }

    createZenOfPythonViewer() {
        const zenContainer = document.createElement('div');
        zenContainer.className = 'zen-viewer';
        zenContainer.innerHTML = `
            <div class="zen-trigger" title="The Zen of Python">🧘</div>
            <div class="zen-content" id="zen-content" style="display: none;">
                <h3>The Zen of Python</h3>
                <div class="zen-text" id="zen-text"></div>
                <button id="run-zen">import this</button>
                <button onclick="this.parentElement.style.display='none'">Close</button>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .zen-viewer {
                position: fixed;
                top: 20px;
                left: 120px;
                z-index: 1000;
            }

            .zen-trigger {
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            .zen-trigger:hover {
                background: var(--glass-hover-border);
                transform: scale(1.1);
            }

            .zen-content {
                position: absolute;
                top: 50px;
                left: 0;
                background: var(--bg-secondary);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-lg);
                padding: 2rem;
                width: 500px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }

            .zen-text {
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius);
                padding: 1rem;
                margin: 1rem 0;
                line-height: 1.6;
                max-height: 300px;
                overflow-y: auto;
                font-family: var(--font-mono);
                white-space: pre-wrap;
            }

            .zen-content button {
                margin: 0.5rem 0.5rem 0 0;
                padding: 0.5rem 1rem;
                border: 1px solid var(--glass-border);
                border-radius: var(--radius);
                background: var(--glass-bg);
                cursor: pointer;
                transition: all 0.2s;
            }

            .zen-content button:hover {
                background: var(--glass-hover-border);
            }

            #run-zen {
                background: var(--accent-magenta);
                color: var(--text-primary);
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(zenContainer);

        this.setupZenViewer();
    }

    setupZenViewer() {
        const trigger = document.querySelector('.zen-trigger');
        const content = document.getElementById('zen-content');
        const runBtn = document.getElementById('run-zen');

        trigger.addEventListener('click', () => {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });

        runBtn.addEventListener('click', () => {
            // Simulate running "import this" in Python
            const zenText = `The Zen of Python, by Tim Peters

Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!`;

            document.getElementById('zen-text').textContent = zenText;
            this.showNotification('🧘 The Zen of Python revealed!', 'info');
        });
    }

    addAnimatedTerminal() {
        const terminalContainer = document.createElement('div');
        terminalContainer.className = 'animated-terminal';
        terminalContainer.innerHTML = `
            <div class="terminal-trigger" title="Animated Terminal">💻</div>
            <div class="terminal-window" id="terminal-window" style="display: none;">
                <div class="terminal-header">
                    <div class="terminal-controls">
                        <span class="control red"></span>
                        <span class="control yellow"></span>
                        <span class="control green"></span>
                    </div>
                    <div class="terminal-title">holo-deck:~ $</div>
                </div>
                <div class="terminal-body" id="terminal-body">
                    <div class="terminal-line">Welcome to Holo-Deck Terminal</div>
                    <div class="terminal-line typing">Initializing holographic systems...</div>
                </div>
                <div class="terminal-input">
                    <span class="prompt">$</span>
                    <input type="text" id="terminal-input" placeholder="Type a command...">
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .animated-terminal {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 1000;
            }

            .terminal-trigger {
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            .terminal-trigger:hover {
                background: var(--glass-hover-border);
                transform: scale(1.1);
            }

            .terminal-window {
                background: var(--bg-secondary);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius);
                width: 600px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                overflow: hidden;
            }

            .terminal-header {
                background: rgba(0,0,0,0.3);
                padding: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .terminal-controls {
                display: flex;
                gap: 0.5rem;
            }

            .control {
                width: 12px;
                height: 12px;
                border-radius: 50%;
            }

            .control.red { background: #ff5f57; }
            .control.yellow { background: #ffbd2e; }
            .control.green { background: #28ca42; }

            .terminal-title {
                color: var(--text-secondary);
                font-size: 0.875rem;
                margin-left: 1rem;
            }

            .terminal-body {
                padding: 1rem;
                max-height: 300px;
                overflow-y: auto;
                font-family: var(--font-mono);
                background: rgba(0,0,0,0.5);
            }

            .terminal-line {
                margin-bottom: 0.5rem;
                color: var(--text-primary);
            }

            .typing::after {
                content: '|';
                animation: blink 1s infinite;
            }

            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }

            .terminal-input {
                display: flex;
                align-items: center;
                padding: 0.5rem 1rem;
                background: rgba(0,0,0,0.3);
                border-top: 1px solid var(--glass-border);
            }

            .prompt {
                color: var(--accent-green);
                margin-right: 0.5rem;
            }

            #terminal-input {
                background: none;
                border: none;
                color: var(--text-primary);
                font-family: var(--font-mono);
                flex: 1;
                outline: none;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(terminalContainer);

        this.setupAnimatedTerminal();
    }

    setupAnimatedTerminal() {
        const trigger = document.querySelector('.terminal-trigger');
        const window = document.getElementById('terminal-window');
        const input = document.getElementById('terminal-input');
        const body = document.getElementById('terminal-body');

        trigger.addEventListener('click', () => {
            window.style.display = window.style.display === 'none' ? 'block' : 'none';
            if (window.style.display === 'block') {
                setTimeout(() => input.focus(), 100);
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.processTerminalCommand(input.value);
                input.value = '';
            }
        });

        // Simulate typing animation
        this.simulateTyping();
    }

    simulateTyping() {
        const commands = [
            'Loading neural networks...',
            'Calibrating holographic emitters...',
            'Syncing with quantum processors...',
            'Holo-Deck online. Ready for commands.',
            ''
        ];

        let commandIndex = 0;
        const typeNext = () => {
            if (commandIndex < commands.length) {
                this.typeCommand(commands[commandIndex], () => {
                    commandIndex++;
                    setTimeout(typeNext, 1000);
                });
            }
        };

        setTimeout(typeNext, 1000);
    }

    typeCommand(command, callback) {
        const body = document.getElementById('terminal-body');
        const line = document.createElement('div');
        line.className = 'terminal-line typing';
        line.textContent = command;
        body.appendChild(line);

        setTimeout(() => {
            line.classList.remove('typing');
            if (callback) callback();
        }, 2000);
    }

    processTerminalCommand(command) {
        const body = document.getElementById('terminal-body');
        const response = this.getTerminalResponse(command.toLowerCase());

        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `<span class="prompt">$</span> ${command}`;
        body.appendChild(commandLine);

        if (response) {
            const responseLine = document.createElement('div');
            responseLine.className = 'terminal-line';
            responseLine.textContent = response;
            body.appendChild(responseLine);
        }

        body.scrollTop = body.scrollHeight;
    }

    getTerminalResponse(command) {
        const responses = {
            'help': 'Available commands: help, status, clear, python, about',
            'status': 'Holo-Deck systems operational. All learning modules online.',
            'clear': (() => {
                setTimeout(() => {
                    document.getElementById('terminal-body').innerHTML = '';
                    this.simulateTyping();
                }, 100);
                return 'Clearing terminal...';
            })(),
            'python': 'Starting Python interpreter... (simulated)',
            'about': 'Holo-Deck v2.0 - An immersive Python learning environment',
            'hello': 'Hello, code warrior! Ready to learn some Python?',
            'date': `Current time: ${new Date().toLocaleString()}`,
            'joke': 'Why do Python programmers wear glasses? Because they can\'t C#',
            'quote': 'The best way to predict the future is to invent it. - Alan Kay'
        };

        return responses[command] || `Command not recognized: ${command}. Type 'help' for available commands.`;
    }

    showNotification(message, type = 'info', title = null) {
        if (window.uiEnhancer && window.uiEnhancer.showNotification) {
            window.uiEnhancer.showNotification(message, type, title);
        }
    }
}

// Initialize all fun features
document.addEventListener('DOMContentLoaded', () => {
    window.funFeatures = new FunFeatures();
});
