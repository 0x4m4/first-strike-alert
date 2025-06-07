document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const FIRSTBLOODS_API_URL = '/api/firstbloods';
    const MOCK_MODE = false;
    const ANNOUNCEMENT_DURATION = 15000; // Duration to show announcement in ms (matches transmission.mp3 length)
    
    // DOM Elements
    const scoreboardBody = document.getElementById('scoreboard-body');
    const bloodSoundElement = document.getElementById('blood-sound-element');
    const announcementScreen = document.getElementById('announcement-screen');
    const announceTeam = document.getElementById('announce-team');
    const announceChallenge = document.getElementById('announce-challenge');
    const announceCategory = document.getElementById('announce-category');
    const announceTime = document.getElementById('announce-time');
    
    // State
    let bloodsData = [];
    let knownSolves = new Set();
    let lastFetchTime = 0;
    let isAnnouncementVisible = false;
    let announcementQueue = [];
    
    // Audio context initialization
    let audioContext;
    
    // Initialize audio context on page load
    initializeAudio();
    
    // Add keyboard event listener for "/" key (for testing)
    document.addEventListener('keydown', function(event) {
        if (event.key === '/') {
            if (bloodSoundElement) {
                playBloodSound();
            }
        }
    });
    
    // Audio context handler
    function initializeAudio() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            
            // Create empty buffer to initialize audio
            const buffer = audioContext.createBuffer(1, 1, 22050);
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start(0);
            
            audioContext.resume().then(() => {
                console.log('Audio context successfully initialized');
            });
            
            // Set up audio event listeners
            bloodSoundElement.addEventListener('ended', handleSoundEnded);
            
            // Make sure blood sound is properly loaded
            bloodSoundElement.load();
        } catch(e) {
            console.error('Audio context initialization failed:', e);
        }
    }
    
    // Handle sound ending
    function handleSoundEnded() {
        console.log('Transmission sound finished playing');
        // Hide announcement immediately after sound ends since it's a 15-second sound
        hideAnnouncementScreen();
        
        // Check if there are more announcements in the queue
        if (announcementQueue.length > 0) {
            // Add a small delay before showing the next announcement
            setTimeout(() => {
                const nextBlood = announcementQueue.shift();
                showAnnouncementScreen(nextBlood);
            }, 1500);
        }
    }
    
    // Play transmission sound
    function playBloodSound() {
        if (bloodSoundElement && audioContext) {
            // Resume audio context (required by browsers)
            audioContext.resume().then(() => {
                bloodSoundElement.currentTime = 0;
                bloodSoundElement.play()
                    .then(() => console.log('Transmission sound played successfully'))
                    .catch(e => {
                        console.error('Transmission sound playback error:', e);
                        // Try a different approach if the first one fails
                        bloodSoundElement.muted = false;
                        bloodSoundElement.volume = 1.0;
                        bloodSoundElement.currentTime = 0;
                        bloodSoundElement.play().catch(err => console.error('Second attempt failed:', err));
                    });
            }).catch(e => console.error('Resume audio context error:', e));
        } else {
            console.error('Transmission sound element or audio context not found');
        }
    }
    
    // Show announcement screen with transmission
    function showAnnouncementScreen(blood) {
        if (isAnnouncementVisible) {
            // If already showing an announcement, queue this one
            announcementQueue.push(blood);
            return;
        }
        
        // Format time
        const date = new Date(blood.date || new Date());
        const timeString = date.toLocaleTimeString([], { hour12: false });
        
        // Extract values with fallbacks
        const teamName = extractTeamName(blood);
        const challengeName = blood.name || blood.challenge_name || 'Unknown';
        const category = blood.category || 'Unknown';
        
        console.log('INTERCEPTED TRANSMISSION - First blood detected:', { teamName, challengeName, category, timeString });
        
        // Set announcement details
        announceTeam.textContent = teamName;
        announceChallenge.textContent = challengeName;
        announceCategory.textContent = category;
        announceTime.textContent = timeString;
        
        // Show announcement screen
        announcementScreen.classList.remove('hidden');
        isAnnouncementVisible = true;
        
        // Play transmission sound
        playBloodSound();
        
        // Update document title to notify users on other tabs
        const originalTitle = document.title;
        document.title = `🔴 FIRST BLOOD: ${teamName} - ${challengeName}`;
        
        // Reset title after announcement is done
        setTimeout(() => {
            document.title = originalTitle;
        }, ANNOUNCEMENT_DURATION);
    }
    
    // Extract team name from various blood data formats
    function extractTeamName(blood) {
        // Debug the blood object to see its structure
        console.log('Blood object structure:', blood);
        
        if (blood.team && typeof blood.team === 'string') return blood.team;
        if (blood.team && blood.team.name) return blood.team.name;
        if (blood.team_name) return blood.team_name;
        if (blood.user_name) return blood.user_name;
        if (blood.user && blood.user.name) return blood.user.name;
        if (blood.solved_by && blood.solved_by.name) return blood.solved_by.name;
        
        return 'Unknown Resistance Fighter';
    }
    
    // Hide announcement screen
    function hideAnnouncementScreen() {
        announcementScreen.classList.add('hidden');
        isAnnouncementVisible = false;
    }
    
    // Initialize
    console.log('AI Regime First Blood Monitoring System Activated');
    fetchBloods(false);
    
    // Set up polling
    function setupPolling() {
        console.log('Setting up polling - checking for blood every 5 seconds');
        setInterval(() => fetchBloods(true), 5000);
        setInterval(() => fetchBloods(false), 60000);
    }
    
    setupPolling();
    
    // Fetch blood data
    async function fetchBloods(silent = false) {
        if (!silent) {
            scoreboardBody.innerHTML = `
                <tr class="loading-row">
                    <td colspan="4">SCANNING RESISTANCE DATABASE...</td>
                </tr>
            `;
        }
        
        try {
            const url = MOCK_MODE ? '/api/mock/solves' : FIRSTBLOODS_API_URL;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Failed to fetch first bloods');
            
            const data = await response.json();
            console.log('Raw blood data:', data); // Debug the raw data
            
            const newBloods = Array.isArray(data) ? data : (data.data || []);
            
            // Process new bloods
            if (lastFetchTime === 0) {
                newBloods.forEach(blood => trackBlood(blood));
            } else {
                announceNewBloods(newBloods);
            }
            
            lastFetchTime = Date.now();
            bloodsData = newBloods;
            
            if (!silent) {
                renderBloods(bloodsData);
                generateBloodStats(bloodsData);
            }
            
            console.log(`RESISTANCE ACTIVITY REPORT: ${newBloods.length} FIRST BLOODS DETECTED`);
        } catch (error) {
            console.error('Error fetching data:', error);
            handleFetchError(silent);
        }
    }
    
    function trackBlood(blood) {
        if (!blood?.id && !blood?.challenge_id) return;
        const challengeId = blood.id || blood.challenge_id;
        const teamId = blood.team_id || (blood.team?.id || 'unknown');
        knownSolves.add(`${challengeId}-${teamId}`);
    }
    
    function handleFetchError(silent) {
        if (!silent) {
            scoreboardBody.innerHTML = `
                <tr class="error-row">
                    <td colspan="4">
                        ERROR: CONNECTION FAILURE
                        <button onclick="fetchBloods(false)" class="retry-btn">RECONNECT</button>
                    </td>
                </tr>
            `;
        }
    }
    
    function announceNewBloods(newBloods) {
        if (!Array.isArray(newBloods)) {
            console.warn('Invalid bloods data:', newBloods);
            return;
        }
        
        const newBloodsFound = [];
        
        newBloods.forEach(blood => {
            if (!blood?.id && !blood?.challenge_id) return;
            
            const challengeId = blood.id || blood.challenge_id;
            const teamId = blood.team_id || (blood.team?.id || 'unknown');
            const bloodId = `${challengeId}-${teamId}`;
            
            if (!knownSolves.has(bloodId)) {
                knownSolves.add(bloodId);
                if (isRecentBlood(blood)) {
                    newBloodsFound.push(blood);
                }
            }
        });
        
        if (newBloodsFound.length > 0) {
            console.log(`🔊 NEW FIRST BLOOD DETECTED: ${newBloodsFound.length} 🔊`);
            
            // Sort newBloodsFound by date, newest first
            newBloodsFound.sort((a, b) => {
                const dateA = new Date(a.date || 0);
                const dateB = new Date(b.date || 0);
                return dateB - dateA;
            });
            
            // Show the first blood announcement immediately, queue the rest
            const firstBlood = newBloodsFound.shift();
            showAnnouncementScreen(firstBlood);
            
            // Queue the remaining announcements
            newBloodsFound.forEach(blood => {
                announcementQueue.push(blood);
            });
            
            // Refresh the display
            renderBloods(bloodsData);
            generateBloodStats(bloodsData);
        }
    }
    
    function isRecentBlood(blood) {
        const solveTime = new Date(blood.date || Date.now());
        return (Date.now() - solveTime) <= 900000; // 15 minutes
    }
    
    function renderBloods(data) {
        if (!data || data.length === 0) {
            scoreboardBody.innerHTML = `
                <tr>
                    <td colspan="4">NO RESISTANCE ACTIVITY DETECTED</td>
                </tr>
            `;
            return;
        }
        
        // Clear the table
        scoreboardBody.innerHTML = '';
        
        // Sort by date (most recent first)
        data.sort((a, b) => {
            const dateA = new Date(a.date || 0);
            const dateB = new Date(b.date || 0);
            return dateB - dateA;
        });
        
        // Add rows
        data.forEach(blood => {
            // Format date
            const date = new Date(blood.date || new Date());
            const timeString = formatDate(date);
            
            // Create row
            const row = document.createElement('tr');
            
            // Add new blood highlight if recent
            if (isRecentBlood(blood) && Date.now() - date.getTime() < 60000) { // Highlight if < 1 min old
                row.classList.add('new-blood');
            }
            
            // Extract data with proper fallbacks
            const challengeName = blood.name || blood.challenge_name || 'Unknown';
            const category = blood.category || 'Unknown';
            const teamName = extractTeamName(blood);
            
            // Add row content
            row.innerHTML = `
                <td>${challengeName}</td>
                <td>${category}</td>
                <td>${teamName} ${isRecentBlood(blood) && Date.now() - date.getTime() < 60000 ? '<span class="new-indicator"></span>' : ''}</td>
                <td>${timeString}</td>
            `;
            
            // Add to table
            scoreboardBody.appendChild(row);
        });
    }
    
    function generateBloodStats(bloods) {
        const bloodStats = document.getElementById('blood-stats');
        
        if (!bloods || bloods.length === 0) {
            bloodStats.innerHTML = `<div class="loading">NO RESISTANCE ACTIVITY DETECTED</div>`;
            return;
        }
        
        // Group bloods by team
        const teamBloodsMap = {};
        
        bloods.forEach(blood => {
            const teamName = extractTeamName(blood);
            if (!teamBloodsMap[teamName]) {
                teamBloodsMap[teamName] = [];
            }
            teamBloodsMap[teamName].push(blood);
        });
        
        // Sort teams by blood count
        const sortedTeams = Object.keys(teamBloodsMap).sort((a, b) => {
            return teamBloodsMap[b].length - teamBloodsMap[a].length;
        });
        
        // Build HTML
        let statsHTML = `
            <div class="stats-header">
                <h3>RESISTANCE ANALYSIS</h3>
            </div>
            <div class="stats-grid">
        `;
        
        // Generate team stats
        sortedTeams.forEach(teamName => {
            const teamBloods = teamBloodsMap[teamName];
            
            statsHTML += `
                <div class="team-stats">
                    <div class="team-stats-header">
                        <div class="team-name-header">${teamName}</div>
                        <div class="blood-count">${teamBloods.length}</div>
                    </div>
                    <ul class="challenge-list">
            `;
            
            // Sort challenges by date
            teamBloods.sort((a, b) => {
                const dateA = new Date(a.date || 0);
                const dateB = new Date(b.date || 0);
                return dateB - dateA;
            });
            
            // Add challenges
            teamBloods.forEach(blood => {
                const challengeName = blood.name || blood.challenge_name || 'Unknown';
                const category = blood.category || 'Unknown';
                
                statsHTML += `
                    <li>
                        <div class="challenge-name">${challengeName}</div>
                        <div class="challenge-category">${category}</div>
                    </li>
                `;
            });
            
            statsHTML += `
                    </ul>
                </div>
            `;
        });
        
        statsHTML += `</div>`;
        
        // Set HTML
        bloodStats.innerHTML = statsHTML;
    }
    
    function formatDate(date) {
        // Format date as HH:MM:SS
        return date.toLocaleTimeString([], { hour12: false });
    }
    
    // More robust team name extraction function (separate from the render function)
    function getTeamName(blood) {
        return extractTeamName(blood);
    }
}); 