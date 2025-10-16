// Gamification System
class GamificationSystem {
    constructor() {
        this.achievements = this.loadAchievements();
        this.streakData = this.loadStreakData();
        this.leaderboard = [];
        this.tieredAchievements = this.getTieredAchievements();
        this.init();
    }

    init() {
        this.createAchievementInterface();
        this.createStreakTracker();
        this.createTieredAchievementInterface();
        this.createCommunityPortal();
        this.setupEventListeners();
        this.checkAchievements();
    }

    loadAchievements() {
        const saved = localStorage.getItem('holoDeckAchievements');
        return saved ? JSON.parse(saved) : this.getDefaultAchievements();
    }

    getDefaultAchievements() {
        return [
            { id: 'first_steps', title: 'First Steps', description: 'Complete your first lesson', icon: '🎯', unlocked: false, progress: 0, maxProgress: 1 },
            { id: 'code_warrior', title: 'Code Warrior', description: 'Complete 10 lessons', icon: '⚔️', unlocked: false, progress: 0, maxProgress: 10 },
            { id: 'perfectionist', title: 'Perfectionist', description: 'Get 100% on 5 quizzes', icon: '💎', unlocked: false, progress: 0, maxProgress: 5 },
            { id: 'speed_demon', title: 'Speed Demon', description: 'Complete a lesson in under 2 minutes', icon: '⚡', unlocked: false, progress: 0, maxProgress: 1 },
            { id: 'explorer', title: 'Explorer', description: 'Try all different types of lessons', icon: '🗺️', unlocked: false, progress: 0, maxProgress: 4 },
            { id: 'zen_master', title: 'Zen Master', description: 'Execute "import this" in the playground', icon: '🧘', unlocked: false, progress: 0, maxProgress: 1 }
        ];
    }

    loadStreakData() {
        return {
            current: parseInt(localStorage.getItem('currentStreak') || '0'),
            longest: parseInt(localStorage.getItem('longestStreak') || '0'),
            lastVisit: localStorage.getItem('lastVisit'),
            freezeUsed: false
        };
    }

    createAchievementInterface() {
        const achievementContainer = document.createElement('div');
        achievementContainer.className = 'achievements-panel';
        achievementContainer.innerHTML = `
            <div class="achievements-header">
                <h3>Achievements</h3>
                <div class="achievement-stats">
                    <span id="unlocked-count">0</span>/<span id="total-count">${this.achievements.length}</span>
                </div>
            </div>
            <div class="achievements-grid" id="achievements-grid"></div>
        `;
        const style = document.createElement('style');
        style.textContent = `
            .achievements-panel { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem; }
            .achievements-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
            .achievement-stats { color: var(--text-secondary); font-size: 0.875rem; }
            .achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
            .achievement-item { background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); border-radius: var(--radius); padding: 1rem; text-align: center; transition: all 0.3s ease; position: relative; overflow: hidden; }
            .achievement-item.unlocked { border-color: var(--accent-green); background: rgba(52, 211, 153, 0.1); }
            .achievement-item.locked { opacity: 0.6; }
            .achievement-icon { font-size: 2rem; margin-bottom: 0.5rem; filter: grayscale(100%); transition: filter 0.3s ease; }
            .achievement-item.unlocked .achievement-icon { filter: grayscale(0%); }
            .achievement-title { font-weight: 600; margin-bottom: 0.5rem; }
            .achievement-description { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem; }
            .achievement-progress { background: rgba(255,255,255,0.1); height: 4px; border-radius: 2px; overflow: hidden; margin-bottom: 0.5rem; }
            .achievement-progress-bar { height: 100%; background: linear-gradient(90deg, var(--accent-magenta), var(--accent-cyan)); transition: width 0.5s ease; }
            .achievement-lock { position: absolute; top: 10px; right: 10px; font-size: 0.875rem; }
        `;
        document.head.appendChild(style);
        const dashboard = document.getElementById('home');
        if (dashboard) {
            const achievementsSection = dashboard.querySelector('#achievements').parentElement;
            achievementsSection.parentNode.insertBefore(achievementContainer, achievementsSection);
        }
    }

    createStreakTracker() {
        const streakContainer = document.createElement('div');
        streakContainer.className = 'streak-tracker';
        streakContainer.innerHTML = `
            <div class="streak-display">
                <div class="streak-icon">🔥</div>
                <div class="streak-info">
                    <div class="streak-count" id="streak-count">${this.streakData.current}</div>
                    <div class="streak-label">Day Streak</div>
                </div>
            </div>
            <div class="streak-actions">
                <button class="btn btn-secondary btn-sm" id="use-freeze" ${this.streakData.freezeUsed ? 'disabled' : ''}>
                    🛡️ Freeze (${this.streakData.freezeUsed ? 'Used' : 'Available'})
                </button>
            </div>
        `;
        const style = document.createElement('style');
        style.textContent = `
            .streak-tracker { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: 1rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
            .streak-display { display: flex; align-items: center; gap: 1rem; }
            .streak-icon { font-size: 2rem; animation: ${this.streakData.current > 0 ? 'flame 2s ease-in-out infinite alternate' : 'none'}; }
            @keyframes flame { from { transform: scale(1) rotate(-2deg); } to { transform: scale(1.1) rotate(2deg); } }
            .streak-info { text-align: left; }
            .streak-count { font-size: 2rem; font-weight: bold; color: var(--accent-magenta); font-family: var(--font-heading); }
            .streak-label { color: var(--text-secondary); font-size: 0.875rem; }
            .streak-actions { display: flex; gap: 0.5rem; }
        `;
        document.head.appendChild(style);
        const dashboard = document.getElementById('home');
        if (dashboard) {
            const streakCard = dashboard.querySelector('.bento-item:has(#current-streak)');
            if (streakCard) streakCard.appendChild(streakContainer);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => { if (e.target.id === 'use-freeze') this.useStreakFreeze(); });
        document.addEventListener('lessonCompleted', () => { this.updateAchievements(); });
        document.addEventListener('quizCompleted', (e) => { if (e.detail.score === 100) this.updateAchievements('perfect_quiz'); });
    }

    updateAchievements(trigger = null) {
        const completedLessons = appData.userProgress.completedLessons.length;
        const perfectQuizzes = Object.values(appData.userProgress.quizScores).filter(score => score === 100).length;
        this.achievements.forEach(achievement => {
            switch (achievement.id) {
                case 'first_steps': achievement.progress = Math.min(completedLessons, 1); break;
                case 'code_warrior': achievement.progress = Math.min(completedLessons, 10); break;
                case 'perfectionist': achievement.progress = Math.min(perfectQuizzes, 5); break;
                case 'speed_demon': achievement.progress = achievement.unlocked ? 1 : 0; break;
                case 'explorer': achievement.progress = ['lesson', 'practice', 'concept'].filter(type => this.hasCompletedType(type)).length; break;
                case 'zen_master': achievement.progress = appData.userProgress.achievements.includes('Zen of Python') ? 1 : 0; break;
            }
            if (achievement.progress >= achievement.maxProgress && !achievement.unlocked) {
                achievement.unlocked = true;
                this.showAchievementNotification(achievement);
            }
        });
        this.saveAchievements();
        this.renderAchievements();
    }

    hasCompletedType(type) {
        switch (type) {
            case 'lesson': return appData.userProgress.completedLessons.length > 0;
            case 'practice': return appData.practiceProblems.some(p => appData.userProgress.completedLessons.includes(p.id));
            case 'concept': return appData.userProgress.achievements.some(a => a.includes('Concept'));
            default: return false;
        }
    }

    renderAchievements() {
        const container = document.getElementById('achievements-grid');
        if (!container) return;
        container.innerHTML = this.achievements.map(achievement => {
            const progress = (achievement.progress / achievement.maxProgress) * 100;
            return `
                <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-progress"><div class="achievement-progress-bar" style="width: ${progress}%"></div></div>
                    ${!achievement.unlocked ? '<div class="achievement-lock">🔒</div>' : ''}
                </div>`;
        }).join('');
        const unlocked = this.achievements.filter(a => a.unlocked).length;
        document.getElementById('unlocked-count').textContent = unlocked;
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${achievement.icon}</div>
                <div class="notification-text">
                    <div class="notification-title">Achievement Unlocked!</div>
                    <div class="notification-description">${achievement.title}</div>
                </div>
            </div>`;
        const style = document.createElement('style');
        style.textContent = `
            .achievement-notification { position: fixed; top: 20px; right: 20px; background: var(--glass-bg); border: 1px solid var(--accent-green); border-radius: var(--radius-lg); padding: 1rem; z-index: 10000; box-shadow: 0 10px 30px rgba(52, 211, 153, 0.3); animation: slideInRight 0.5s ease; }
            @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            .notification-content { display: flex; align-items: center; gap: 1rem; }
            .notification-icon { font-size: 2rem; }
            .notification-title { font-weight: bold; color: var(--accent-green); }
            .notification-description { color: var(--text-secondary); font-size: 0.875rem; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);
        appData.userProgress.holoPoints += 25;
        localStorage.setItem('holoPoints', appData.userProgress.holoPoints.toString());
        setTimeout(() => { notification.remove(); style.remove(); }, 5000);
    }

    useStreakFreeze() {
        if (this.streakData.freezeUsed) { alert('Streak freeze already used!'); return; }
        this.streakData.freezeUsed = true;
        localStorage.setItem('streakFreezeUsed', 'true');
        const freezeBtn = document.getElementById('use-freeze');
        if (freezeBtn) { freezeBtn.disabled = true; freezeBtn.textContent = '🛡️ Freeze (Used)'; }
        alert('Streak freeze activated! Your streak is protected for today.');
    }

    saveAchievements() {
        localStorage.setItem('holoDeckAchievements', JSON.stringify(this.achievements));
    }

    getTieredAchievements() {
        return [
            { id: 'novice_coder', title: 'Novice Coder', tier: 1, description: 'Complete 5 lessons', icon: '🐣', requirements: { lessons: 5 }, unlocked: false, rewards: { points: 50, badge: 'Novice' } },
            { id: 'apprentice_coder', title: 'Apprentice Coder', tier: 2, description: 'Complete 15 lessons', icon: '🧙', requirements: { lessons: 15 }, unlocked: false, rewards: { points: 100, badge: 'Apprentice' } },
            { id: 'journeyman_coder', title: 'Journeyman Coder', tier: 3, description: 'Complete 30 lessons', icon: '⚒️', requirements: { lessons: 30 }, unlocked: false, rewards: { points: 200, badge: 'Journeyman' } },
            { id: 'expert_coder', title: 'Expert Coder', tier: 4, description: 'Complete 50 lessons', icon: '🏆', requirements: { lessons: 50 }, unlocked: false, rewards: { points: 500, badge: 'Expert' } },
            { id: 'master_coder', title: 'Master Coder', tier: 5, description: 'Complete 100 lessons', icon: '👑', requirements: { lessons: 100 }, unlocked: false, rewards: { points: 1000, badge: 'Master' } },
            { id: 'perfectionist_bronze', title: 'Perfectionist (Bronze)', tier: 1, description: 'Get 100% on 3 quizzes', icon: '🥉', requirements: { perfectQuizzes: 3 }, unlocked: false, rewards: { points: 75, badge: 'Perfectionist I' } },
            { id: 'perfectionist_silver', title: 'Perfectionist (Silver)', tier: 2, description: 'Get 100% on 10 quizzes', icon: '🥈', requirements: { perfectQuizzes: 10 }, unlocked: false, rewards: { points: 150, badge: 'Perfectionist II' } },
            { id: 'perfectionist_gold', title: 'Perfectionist (Gold)', tier: 3, description: 'Get 100% on 25 quizzes', icon: '🥇', requirements: { perfectQuizzes: 25 }, unlocked: false, rewards: { points: 300, badge: 'Perfectionist III' } },
            { id: 'streak_warrior', title: 'Streak Warrior', tier: 1, description: 'Maintain a 7-day streak', icon: '🔥', requirements: { streak: 7 }, unlocked: false, rewards: { points: 100, badge: 'Streak Warrior' } },
            { id: 'streak_legend', title: 'Streak Legend', tier: 2, description: 'Maintain a 30-day streak', icon: '🔥', requirements: { streak: 30 }, unlocked: false, rewards: { points: 500, badge: 'Streak Legend' } },
            { id: 'streak_hero', title: 'Streak Hero', tier: 3, description: 'Maintain a 100-day streak', icon: '🔥', requirements: { streak: 100 }, unlocked: false, rewards: { points: 2000, badge: 'Streak Hero' } }
        ];
    }

    createTieredAchievementInterface() {
        const tieredContainer = document.createElement('div');
        tieredContainer.className = 'tiered-achievements';
        tieredContainer.innerHTML = `
            <div class="tiered-header">
                <h3>Tiered Achievements</h3>
                <div class="tier-progress">
                    <span id="tier-count">0</span>/<span id="total-tiers">${this.tieredAchievements.length}</span>
                </div>
            </div>
            <div class="tiered-grid" id="tiered-grid"></div>`;
        const style = document.createElement('style');
        style.textContent = `
            .tiered-achievements { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem; }
            .tiered-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
            .tiered-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
            .tiered-item { background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); border-radius: var(--radius); padding: 1rem; transition: all 0.3s ease; position: relative; }
            .tiered-item.unlocked { border-color: var(--accent-green); background: rgba(52, 211, 153, 0.1); }
            .tiered-item.locked { opacity: 0.7; }
            .tiered-tier { position: absolute; top: -5px; right: -5px; background: var(--accent-magenta); color: var(--bg-primary); border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold; }
            .tiered-icon { font-size: 2rem; margin-bottom: 0.5rem; }
            .tiered-title { font-weight: 600; margin-bottom: 0.5rem; color: var(--accent-cyan); }
            .tiered-description { color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem; }
            .tiered-progress { background: rgba(255,255,255,0.1); height: 4px; border-radius: 2px; overflow: hidden; margin-bottom: 0.5rem; }
            .tiered-progress-bar { height: 100%; background: linear-gradient(90deg, var(--accent-magenta), var(--accent-cyan)); transition: width 0.5s ease; }
            .tiered-rewards { font-size: 0.75rem; color: var(--accent-green); margin-top: 0.5rem; }
        `;
        document.head.appendChild(style);
        const dashboard = document.getElementById('home');
        if (dashboard) {
            const achievementsSection = dashboard.querySelector('.achievements-panel');
            if (achievementsSection) achievementsSection.parentNode.insertBefore(tieredContainer, achievementsSection.nextSibling);
        }
    }

    updateTieredAchievements() {
        const completedLessons = appData.userProgress.completedLessons.length;
        const perfectQuizzes = Object.values(appData.userProgress.quizScores).filter(score => score === 100).length;
        const currentStreak = this.streakData.current;
        this.tieredAchievements.forEach(achievement => {
            let progress = 0;
            if (achievement.requirements.lessons) progress = Math.min(completedLessons, achievement.requirements.lessons);
            if (achievement.requirements.perfectQuizzes) progress = Math.min(perfectQuizzes, achievement.requirements.perfectQuizzes);
            if (achievement.requirements.streak) progress = Math.min(currentStreak, achievement.requirements.streak);
            achievement.progress = progress;
            if (progress >= Object.values(achievement.requirements)[0] && !achievement.unlocked) {
                achievement.unlocked = true;
                this.unlockTieredAchievement(achievement);
            }
        });
        this.renderTieredAchievements();
    }

    renderTieredAchievements() {
        const container = document.getElementById('tiered-grid');
        if (!container) return;
        container.innerHTML = this.tieredAchievements.map(achievement => {
            const requirement = Object.values(achievement.requirements)[0];
            const progress = (achievement.progress / requirement) * 100;
            return `
                <div class="tiered-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                    <div class="tiered-tier">T${achievement.tier}</div>
                    <div class="tiered-icon">${achievement.icon}</div>
                    <div class="tiered-title">${achievement.title}</div>
                    <div class="tiered-description">${achievement.description}</div>
                    <div class="tiered-progress"><div class="tiered-progress-bar" style="width: ${progress}%"></div></div>
                    <div class="tiered-rewards">Rewards: ${achievement.rewards.points} pts, ${achievement.rewards.badge} badge</div>
                </div>`;
        }).join('');
        const unlocked = this.tieredAchievements.filter(a => a.unlocked).length;
        document.getElementById('tier-count').textContent = unlocked;
    }

    unlockTieredAchievement(achievement) {
        appData.userProgress.holoPoints += achievement.rewards.points;
        localStorage.setItem('holoPoints', appData.userProgress.holoPoints.toString());
        const badgeName = `${achievement.rewards.badge} Badge`;
        if (!appData.userProgress.achievements.includes(badgeName)) {
            appData.userProgress.achievements.push(badgeName);
            localStorage.setItem('achievements', JSON.stringify(appData.userProgress.achievements));
        }
        this.showAchievementNotification(achievement);
    }

    createCommunityPortal() {
        this.createCommunityInterface();
        this.setupCommunityEventListeners();
        this.initializeCommunityContent();
    }

    createCommunityInterface() {
        const communityContainer = document.createElement('div');
        communityContainer.className = 'community-portal';
        communityContainer.innerHTML = `
            <div class="community-header"><h3>Community Portal</h3><div class="community-stats"><span id="community-contributions">0</span> contributions</div></div>
            <div class="community-tabs"><button class="community-tab active" data-tab="submit">Submit Content</button><button class="community-tab" data-tab="browse">Browse Community</button><button class="community-tab" data-tab="leaderboard">Leaderboard</button></div>
            <div class="community-content">
                <div class="community-tab-content active" data-content="submit">
                    <div class="submission-forms">
                        <div class="form-section"><h4>Submit Practice Problem</h4><form id="practice-problem-form" class="community-form"><div class="form-group"><label>Title:</label><input type="text" name="problem-title" placeholder="Problem title..." required></div><div class="form-group"><label>Difficulty:</label><select name="problem-difficulty" required><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div><div class="form-group"><label>Description:</label><textarea name="problem-description" placeholder="Describe the problem..." rows="4" required></textarea></div><div class="form-group"><label>Starter Code:</label><textarea name="problem-starter" placeholder="Provide starter code..." rows="3"></textarea></div><div class="form-group"><label>Test Cases (JSON format):</label><textarea name="problem-tests" placeholder='[{"input": "test", "expected": "result"}]' rows="3"></textarea></div><button type="submit" class="btn">Submit Problem</button></form></div>
                        <div class="form-section"><h4>Submit Concept Card</h4><form id="concept-card-form" class="community-form"><div class="form-group"><label>Title:</label><input type="text" name="concept-title" placeholder="Concept title..." required></div><div class="form-group"><label>Description:</label><textarea name="concept-desc" placeholder="Explain the concept..." rows="3" required></textarea></div><div class="form-group"><label>Code Example:</label><textarea name="concept-code" placeholder="Show example code..." rows="4" required></textarea></div><button type="submit" class="btn">Submit Concept</button></form></div>
                    </div>
                </div>
                <div class="community-tab-content" data-content="browse"><div class="community-browser"><div class="browser-filters"><select id="content-filter"><option value="all">All Content</option><option value="problems">Problems</option><option value="concepts">Concepts</option></select><input type="text" id="content-search" placeholder="Search community content..."></div><div class="community-grid" id="community-grid"></div></div></div>
                <div class="community-tab-content" data-content="leaderboard"><div class="leaderboard-container"><div class="leaderboard-header"><h4>Top Contributors</h4><button class="btn btn-secondary btn-sm" id="refresh-leaderboard">Refresh</button></div><div class="leaderboard-list" id="leaderboard-list"><div class="leaderboard-placeholder"><p>Complete community contributions to see the leaderboard!</p></div></div></div></div>
            </div>`;
        const style = document.createElement('style');
        style.textContent = `
            .community-portal { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem; }
            .community-tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid var(--glass-border); }
            .community-tab { background: none; border: none; padding: 0.5rem 1rem; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.3s ease; }
            .community-tab.active, .community-tab:hover { color: var(--accent-cyan); border-bottom-color: var(--accent-cyan); }
            .community-tab-content { display: none; } .community-tab-content.active { display: block; }
            .submission-forms { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; }
            .form-section { background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); border-radius: var(--radius); padding: 1.5rem; }
            .form-section h4 { color: var(--accent-cyan); margin-bottom: 1rem; }
            .form-group { margin-bottom: 1rem; } .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
            .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.75rem; background: var(--bg-secondary); border: 1px solid var(--glass-border); border-radius: var(--radius); color: var(--text-primary); font-family: var(--font-mono); }
            .form-group textarea { resize: vertical; min-height: 100px; }
            .browser-filters { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
            .community-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
            .community-item { background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); border-radius: var(--radius); padding: 1.5rem; transition: all 0.3s ease; cursor: pointer; }
            .community-item:hover { border-color: var(--accent-magenta); transform: translateY(-2px); }
            .community-item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
            .community-item-type { padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
            .type-problem { background: rgba(34, 197, 94, 0.2); color: var(--accent-green); } .type-concept { background: rgba(59, 130, 246, 0.2); color: var(--accent-cyan); }
            .community-item-title { color: var(--accent-cyan); margin-bottom: 0.5rem; }
            .community-item-description { color: var(--text-secondary); font-size: 0.875rem; line-height: 1.5; }
            .leaderboard-container { max-width: 600px; } .leaderboard-list { background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); border-radius: var(--radius); padding: 1rem; }
            .leaderboard-placeholder { text-align: center; color: var(--text-secondary); padding: 2rem; }
            .leaderboard-entry { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--glass-border); }
            .leaderboard-entry:last-child { border-bottom: none; }
            .leaderboard-rank { width: 30px; height: 30px; background: var(--accent-magenta); color: var(--bg-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.875rem; }
            .leaderboard-info { flex: 1; } .leaderboard-name { font-weight: 600; } .leaderboard-score { color: var(--text-secondary); font-size: 0.875rem; }
        `;
        document.head.appendChild(style);
        const communityPage = document.getElementById('community');
        if (communityPage) communityPage.appendChild(communityContainer);
    }

    setupCommunityEventListeners() {
        document.addEventListener('click', (e) => { if (e.target.classList.contains('community-tab')) this.switchCommunityTab(e.target.dataset.tab); });
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'practice-problem-form') { e.preventDefault(); this.submitPracticeProblem(); }
            if (e.target.id === 'concept-card-form') { e.preventDefault(); this.submitConceptCard(); }
        });
        document.addEventListener('input', (e) => { if (e.target.id === 'content-search') this.filterCommunityContent(e.target.value); });
        document.addEventListener('change', (e) => { if (e.target.id === 'content-filter') this.filterCommunityContent('', e.target.value); });
        document.addEventListener('click', (e) => { if (e.target.id === 'refresh-leaderboard') this.updateLeaderboard(); });
    }

    switchCommunityTab(tab) {
        document.querySelectorAll('.community-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        document.querySelectorAll('.community-tab-content').forEach(content => content.classList.toggle('active', content.dataset.content === tab));
    }

    submitPracticeProblem() {
        const form = document.getElementById('practice-problem-form');
        const formData = new FormData(form);
        const problem = {
            id: `community_${Date.now()}`, title: formData.get('problem-title'), difficulty: formData.get('problem-difficulty'), description: formData.get('problem-description'),
            starter: formData.get('problem-starter'), testCases: this.parseTestCases(formData.get('problem-tests')), author: 'Community', timestamp: new Date().toISOString()
        };
        this.addToCommunityContent('problems', problem);
        form.reset();
        this.showNotification('✅ Practice problem submitted successfully!', 'success');
        this.updateContributionCount();
    }

    submitConceptCard() {
        const form = document.getElementById('concept-card-form');
        const formData = new FormData(form);
        const concept = {
            id: `community_${Date.now()}`, title: formData.get('concept-title'), description: formData.get('concept-desc'), code: formData.get('concept-code'),
            author: 'Community', timestamp: new Date().toISOString()
        };
        this.addToCommunityContent('concepts', concept);
        form.reset();
        this.showNotification('✅ Concept card submitted successfully!', 'success');
        this.updateContributionCount();
    }

    parseTestCases(testCasesString) { try { return JSON.parse(testCasesString || '[]'); } catch (e) { return []; } }

    addToCommunityContent(type, content) {
        const communityContent = this.loadCommunityContent();
        if (!communityContent[type]) communityContent[type] = [];
        communityContent[type].push(content);
        localStorage.setItem('communityContent', JSON.stringify(communityContent));
        this.renderCommunityContent(this.loadCommunityContent()); // Re-render after adding
    }

    loadCommunityContent() {
        const saved = localStorage.getItem('communityContent');
        return saved ? JSON.parse(saved) : { problems: [], concepts: [] };
    }
    
    initializeCommunityContent() {
        const communityContent = this.loadCommunityContent();
        this.renderCommunityContent(communityContent);
        this.updateContributionCount();
    }

    renderCommunityContent(content) {
        const container = document.getElementById('community-grid');
        if (!container) return;
        const allContent = [...content.problems.map(p => ({ ...p, type: 'problem' })), ...content.concepts.map(c => ({ ...c, type: 'concept' }))];
        container.innerHTML = allContent.map(item => `
            <div class="community-item" data-id="${item.id}" data-type="${item.type}">
                <div class="community-item-header">
                    <h4 class="community-item-title">${item.title}</h4>
                    <span class="community-item-type type-${item.type}">${item.type === 'problem' ? 'Problem' : 'Concept'}</span>
                </div>
                <div class="community-item-description">${item.description || item.prompt || 'No description available'}</div>
                <div class="community-item-meta"><small>By: ${item.author}</small><small>${new Date(item.timestamp).toLocaleDateString()}</small></div>
            </div>`).join('');
    }

    filterCommunityContent(query = '', filter = 'all') {
        const items = document.querySelectorAll('#community-grid .community-item');
        const searchTerm = query.toLowerCase();
        const activeFilter = document.getElementById('content-filter').value;
        items.forEach(item => {
            const title = item.querySelector('.community-item-title').textContent.toLowerCase();
            const description = item.querySelector('.community-item-description').textContent.toLowerCase();
            const type = item.dataset.type;
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesFilter = activeFilter === 'all' || type === activeFilter.slice(0, -1);
            item.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
        });
    }

    updateContributionCount() {
        const communityContent = this.loadCommunityContent();
        const totalContributions = communityContent.problems.length + communityContent.concepts.length;
        document.getElementById('community-contributions').textContent = totalContributions;
    }

    updateLeaderboard() {
        const mockLeaderboard = [
            { name: 'PythonMaster', score: 2500, contributions: 15 }, { name: 'CodeNinja', score: 2100, contributions: 12 },
            { name: 'AlgoExpert', score: 1800, contributions: 10 }, { name: 'ScriptWizard', score: 1600, contributions: 8 },
            { name: 'DataGuru', score: 1400, contributions: 7 }
        ];
        const container = document.getElementById('leaderboard-list');
        if (!container) return;
        container.innerHTML = mockLeaderboard.map((entry, index) => `
            <div class="leaderboard-entry">
                <div class="leaderboard-rank">${index + 1}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${entry.name}</div>
                    <div class="leaderboard-score">${entry.score} pts • ${entry.contributions} contributions</div>
                </div>
            </div>`).join('');
    }

    checkAchievements() {
        const completedLessons = appData.userProgress.completedLessons.length;
        if (completedLessons > 0) {
            this.updateAchievements();
            this.updateTieredAchievements();
        }
        this.renderAchievements();
        this.renderTieredAchievements();
    }
}

class CodeChallengeSystem {
    constructor() {
        this.challenges = this.loadChallenges();
        this.currentChallenge = null;
        this.init();
    }

    init() {
        this.createChallengeInterface();
        this.setupEventListeners();
    }

    loadChallenges() {
        const saved = localStorage.getItem('holoDeckChallenges');
        return saved ? JSON.parse(saved) : this.getDefaultChallenges();
    }

    getDefaultChallenges() {
        return [
            { id: 'daily_001', title: 'Variable Swap', description: 'Swap two variables without using a temporary variable', difficulty: 'easy', starter: '# Swap a and b without temp variable\na = 5\nb = 10\n\n# Your code here\n', testCases: [{ input: 'a = 5; b = 10', expected: 'a = 10; b = 5' }, { input: 'a = 100; b = 200', expected: 'a = 200; b = 100' }], hints: ['Try using tuple unpacking', 'In Python: a, b = b, a'], completed: false, attempts: 0 },
            { id: 'daily_002', title: 'FizzBuzz', description: 'Print numbers 1-20, but replace multiples of 3 with "Fizz" and 5 with "Buzz"', difficulty: 'easy', starter: '# Print FizzBuzz for numbers 1-20\n', testCases: [{ input: '1', expected: '1' }, { input: '3', expected: 'Fizz' }, { input: '5', expected: 'Buzz' }, { input: '15', expected: 'FizzBuzz' }], hints: ['Use modulo operator (%)', 'Check for multiples of both 3 and 5 first'], completed: false, attempts: 0 },
            { id: 'daily_003', title: 'Palindrome Check', description: 'Check if a string is a palindrome (reads the same backwards)', difficulty: 'medium', starter: 'def is_palindrome(s):\n    # Your code here\n    pass\n', testCases: [{ input: '"radar"', expected: 'True' }, { input: '"hello"', expected: 'False' }, { input: '"A man a plan a canal Panama"', expected: 'True' }], hints: ['Convert to lowercase and remove spaces', 'Compare string with its reverse'], completed: false, attempts: 0 }
        ];
    }

    createChallengeInterface() {
        const challengeContainer = document.createElement('div');
        challengeContainer.className = 'challenge-system';
        challengeContainer.innerHTML = `
            <div class="challenge-header"><h3>Daily Code Challenge</h3><button class="btn btn-secondary btn-sm" id="new-challenge-btn">New Challenge</button></div>
            <div class="challenge-content" id="challenge-content"><div class="challenge-placeholder"><p>Complete lessons to unlock daily challenges!</p></div></div>`;
        const style = document.createElement('style');
        style.textContent = `
            .challenge-system { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem; }
            .challenge-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
            .challenge-placeholder { text-align: center; color: var(--text-secondary); padding: 2rem; }
            .challenge-item { border: 1px solid var(--glass-border); border-radius: var(--radius); padding: 1rem; margin-bottom: 1rem; }
            .challenge-title { color: var(--accent-cyan); margin-bottom: 0.5rem; }
            .challenge-description { color: var(--text-secondary); margin-bottom: 1rem; }
            .challenge-meta { display: flex; gap: 1rem; margin-bottom: 1rem; }
            .challenge-difficulty { padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
            .difficulty-easy { background: rgba(52, 211, 153, 0.2); color: var(--accent-green); }
            .difficulty-medium { background: rgba(245, 158, 11, 0.2); color: var(--accent-yellow); }
            .difficulty-hard { background: rgba(248, 113, 113, 0.2); color: var(--accent-red); }
            .challenge-hints { background: rgba(0,0,0,0.2); border-radius: var(--radius); padding: 1rem; margin-top: 1rem; }
            .hint-item { padding: 0.5rem; border-left: 3px solid var(--accent-magenta); margin-bottom: 0.5rem; font-style: italic; }
            .challenge-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
        `;
        document.head.appendChild(style);
        const practicePage = document.getElementById('practice');
        if (practicePage) {
            const practiceTitle = practicePage.querySelector('h1');
            if (practiceTitle) practiceTitle.parentNode.insertBefore(challengeContainer, practiceTitle.nextSibling);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'new-challenge-btn') this.loadRandomChallenge();
            if (e.target.classList.contains('hint-btn')) this.showHint(e.target.dataset.hintIndex);
            if (e.target.id === 'submit-challenge') this.submitChallenge();
        });
    }

    loadRandomChallenge() {
        const availableChallenges = this.challenges.filter(c => !c.completed);
        if (availableChallenges.length === 0) { alert('No more challenges available! Great job!'); return; }
        this.currentChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
        this.displayChallenge();
    }

    displayChallenge() {
        const container = document.getElementById('challenge-content');
        if (!container || !this.currentChallenge) return;
        container.innerHTML = `
            <div class="challenge-item">
                <h4 class="challenge-title">${this.currentChallenge.title}</h4>
                <div class="challenge-description">${this.currentChallenge.description}</div>
                <div class="challenge-meta"><span class="challenge-difficulty difficulty-${this.currentChallenge.difficulty}">${this.currentChallenge.difficulty}</span><span>Attempts: ${this.currentChallenge.attempts}</span></div>
                <div class="editor-container">
                    <div class="editor-header"><span class="editor-title">challenge.py</span><div class="challenge-actions"><button class="btn btn-secondary btn-sm hint-btn" data-hint-index="0">💡 Hint</button><button class="btn btn-sm" id="submit-challenge">Submit</button></div></div>
                    <div class="editor" id="challenge-editor"></div>
                    <div class="output" id="challenge-output">Ready to test your solution...</div>
                </div>
                <div class="challenge-hints" id="challenge-hints" style="display: none;"><div class="hint-item" id="hint-0">${this.currentChallenge.hints[0]}</div></div>
            </div>`;
        const challengeEditor = ace.edit('challenge-editor', { theme: 'ace/theme/tomorrow_night_eighties', mode: 'ace/mode/python', fontSize: 14, showPrintMargin: false, highlightActiveLine: true, wrap: true });
        challengeEditor.setValue(this.currentChallenge.starter, -1);
        this.currentChallenge.editor = challengeEditor;
    }

    showHint(hintIndex) {
        const hintsContainer = document.getElementById('challenge-hints');
        if (!hintsContainer) return;
        hintsContainer.style.display = 'block';
        const nextHintIndex = parseInt(hintIndex) + 1;
        if (nextHintIndex < this.currentChallenge.hints.length && !document.getElementById(`hint-${nextHintIndex}`)) {
            const nextHint = document.createElement('div');
            nextHint.className = 'hint-item';
            nextHint.id = `hint-${nextHintIndex}`;
            nextHint.textContent = this.currentChallenge.hints[nextHintIndex];
            hintsContainer.appendChild(nextHint);
            event.target.dataset.hintIndex = nextHintIndex; // Update the button's index
        }
    }

    submitChallenge() {
        if (!this.currentChallenge) return;
        const code = this.currentChallenge.editor.getValue();
        const output = document.getElementById('challenge-output');
        output.innerHTML = 'Testing solution...';
        this.runChallengeTests(code, this.currentChallenge.testCases, output);
    }

    runChallengeTests(code, testCases, outputElement) {
        // This is a simplified test runner for demonstration. A real implementation would be more robust.
        let passed = 0;
        outputElement.innerHTML = '';
        testCases.forEach((testCase, index) => {
            // This is a mock test. In a real scenario, you'd securely execute the code.
            const isCorrect = Math.random() > 0.3; // 70% chance of passing
            if (isCorrect) {
                passed++;
                outputElement.innerHTML += `<div style="color: var(--accent-green);">✓ Test ${index + 1}: PASSED</div>`;
            } else {
                outputElement.innerHTML += `<div style="color: var(--accent-red);">✗ Test ${index + 1}: FAILED</div>`;
            }
        });
        setTimeout(() => {
            if (passed === testCases.length) this.completeChallenge();
            else {
                this.currentChallenge.attempts++;
                outputElement.innerHTML += `<div style="color: var(--accent-yellow); margin-top: 1rem;">${passed}/${testCases.length} tests passed. Try again!</div>`;
            }
        }, 500);
    }

    completeChallenge() {
        if (!this.currentChallenge) return;
        this.currentChallenge.completed = true;
        this.saveChallenges();
        const output = document.getElementById('challenge-output');
        output.innerHTML = `<div style="color: var(--accent-green); font-weight: bold;">🎉 Challenge Completed!</div><div>You've earned 50 Holo-Points.</div>`;
        appData.userProgress.holoPoints += 50;
        localStorage.setItem('holoPoints', appData.userProgress.holoPoints.toString());
        document.dispatchEvent(new CustomEvent('lessonCompleted'));
    }

    saveChallenges() {
        localStorage.setItem('holoDeckChallenges', JSON.stringify(this.challenges));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.gamificationSystem = new GamificationSystem();
    window.codeChallengeSystem = new CodeChallengeSystem();
});