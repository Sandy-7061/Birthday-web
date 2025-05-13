// Audio Manager for Shivani's Birthday Website
// This file handles all audio playback and ensures only one audio plays at a time

// Audio tracks storage
const AudioManager = {
    // Audio elements
    tracks: {},
    
    // Currently playing audio
    currentTrack: null,
    
    // Previous track (for returning to background music)
    previousTrack: null,
    
    // Volume settings
    mainVolume: 0.5,
    
    // Initialize the audio manager with all required tracks
    init() {
        // Create audio elements for all sections
        this.createTrack('backgroundMusic', 'assests/sounds/Jethalal wishing Happy Birthday.mp3');
        this.createTrack('balloonGame', 'assests/sounds/Ballone Game.mp3');
        this.createTrack('balloonPop', 'assests/sounds/balloon-pop.mp3');
        this.createTrack('allBalloonPopped', 'assests/sounds/On popped all ballone.mp3');
        this.createTrack('puzzleGame', 'assests/sounds/Birthday Puzzle.mp3');
        this.createTrack('memoryGame', 'assests/sounds/memory Game.mp3');
        this.createTrack('cakeSound', 'assests/sounds/On cake.mp3');
        this.createTrack('journeySection', 'assests/sounds/journey-section.mp3');
        this.createTrack('specialMemoryUnlock', 'assests/sounds/Special Memory Unlock.mp3');
        
        // Set event listeners for all sections
        this.setupEventListeners();
        
        // Log all track sources for debugging
        Object.keys(this.tracks).forEach(trackName => {
            console.log(`Track "${trackName}" source: ${this.tracks[trackName].src}`);
        });
        
        console.log('Audio Manager initialized with tracks:', Object.keys(this.tracks));
    },
    
    // Create an audio track
    createTrack(name, src, loop = false) {
        const audio = new Audio(src);
        audio.volume = this.mainVolume;
        audio.loop = loop;
        this.tracks[name] = audio;
        
        // Add event listeners for debugging
        audio.addEventListener('play', () => console.log(`${name} started playing`));
        audio.addEventListener('pause', () => console.log(`${name} paused`));
        audio.addEventListener('ended', () => {
            console.log(`${name} ended`);
            
            // For non-looping tracks that finish, return to background music if available
            if (!audio.loop && name !== 'backgroundMusic' && name !== 'balloonPop') {
                this.currentTrack = null;
                // Return to background music if the music toggle is on
                if (document.querySelector('.music-toggle.playing')) {
                    this.playTrack('backgroundMusic', true);
                }
            }
        });
        audio.addEventListener('error', (e) => console.error(`Error with ${name}:`, e));
        
        return audio;
    },
    
    // Play a track and stop any currently playing track
    playTrack(name, loop = false, volume = this.mainVolume) {
        // Special handling for balloon pop sound (overlay sound - doesn't stop other audio)
        if (name === 'balloonPop') {
            const popSound = new Audio(this.tracks.balloonPop.src);
            popSound.volume = volume;
            popSound.play().catch(err => console.error('Error playing pop sound:', err));
            return;
        }
        
        // Special handling for special memory unlock sound (short overlay sound)
        if (name === 'specialMemoryUnlock') {
            // Remember current track to return to it
            if (this.currentTrack && this.currentTrack !== name) {
                this.previousTrack = this.currentTrack;
                
                // Temporarily lower volume of current track
                if (this.tracks[this.currentTrack] && !this.tracks[this.currentTrack].paused) {
                    this.tracks[this.currentTrack].volume = this.mainVolume * 0.3;
                }
            }
            
            // Play special sound
            this.tracks[name].loop = false;
            this.tracks[name].volume = volume;
            this.tracks[name].play().catch(err => {
                console.error(`Error playing ${name}:`, err);
            });
            
            // Set up listener to return to previous track when done
            const unlockSound = this.tracks[name];
            unlockSound.onended = () => {
                if (this.previousTrack) {
                    // Restore volume of previous track
                    if (this.tracks[this.previousTrack]) {
                        this.tracks[this.previousTrack].volume = this.mainVolume;
                        this.currentTrack = this.previousTrack;
                        this.previousTrack = null;
                    }
                }
            };
            
            return;
        }
        
        // If the requested track is already playing, do nothing
        if (this.currentTrack === name && !this.tracks[name].paused) {
            console.log(`${name} is already playing`);
            return;
        }
        
        // Stop current track if it exists
        if (this.currentTrack && this.currentTrack !== name) {
            this.stopTrack(this.currentTrack);
        }
        
        // Set loop property
        this.tracks[name].loop = loop;
        
        // Set volume
        this.tracks[name].volume = volume;
        
        // Play the new track
        this.tracks[name].play().catch(err => {
            console.error(`Error playing ${name}:`, err);
        });
        
        // Update current track reference
        this.currentTrack = name;
        console.log(`Now playing: ${name}`);
    },
    
    // Pause a track
    pauseTrack(name) {
        if (this.tracks[name] && !this.tracks[name].paused) {
            this.tracks[name].pause();
            if (this.currentTrack === name) {
                this.currentTrack = null;
            }
        }
    },
    
    // Stop a track
    stopTrack(name) {
        if (this.tracks[name]) {
            this.tracks[name].pause();
            this.tracks[name].currentTime = 0;
            if (this.currentTrack === name) {
                this.currentTrack = null;
            }
        }
    },
    
    // Stop all tracks
    stopAll() {
        Object.keys(this.tracks).forEach(name => {
            this.stopTrack(name);
        });
        this.currentTrack = null;
        this.previousTrack = null;
    },
    
    // Set up event listeners for different sections
    setupEventListeners() {
        // Music toggle button
        const musicToggle = document.querySelector('.music-toggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', () => {
                if (this.currentTrack === 'backgroundMusic' && !this.tracks.backgroundMusic.paused) {
                    this.pauseTrack('backgroundMusic');
                    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
                    musicToggle.classList.remove('playing');
                } else {
                    // Only play background music if no other track is playing
                    if (!this.currentTrack) {
                        this.playTrack('backgroundMusic', true);
                        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                        musicToggle.classList.add('playing');
                    }
                }
            });
        }
        
        // Balloon game
        const startBalloonButton = document.getElementById('start-balloon-game');
        const balloonGame = document.getElementById('balloon-game');
        const closeBalloonButton = document.getElementById('close-balloon-game');
        
        if (startBalloonButton) {
            startBalloonButton.addEventListener('click', () => {
                // Stop any current track before playing balloon game music
                if (this.currentTrack) {
                    this.stopTrack(this.currentTrack);
                }
                this.playTrack('balloonGame', true);
            });
        }
        
        if (closeBalloonButton) {
            closeBalloonButton.addEventListener('click', () => {
                this.stopTrack('balloonGame');
                this.stopTrack('allBalloonPopped');
                // Return to background music if music toggle is on
                if (document.querySelector('.music-toggle.playing')) {
                    this.playTrack('backgroundMusic', true);
                }
            });
        }
        
        if (balloonGame) {
            const closeBtn = balloonGame.querySelector('.close-balloon-game-button');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.stopTrack('balloonGame');
                    this.stopTrack('allBalloonPopped');
                    // Return to background music if music toggle is on
                    if (document.querySelector('.music-toggle.playing')) {
                        this.playTrack('backgroundMusic', true);
                    }
                });
            }
        }
        
        // Cake interactions
        const cakeCanvas = document.getElementById('cake-canvas');
        if (cakeCanvas) {
            cakeCanvas.addEventListener('click', () => {
                // Remember the current track if it's background music
                let wasPlayingBackground = false;
                if (this.currentTrack === 'backgroundMusic') {
                    wasPlayingBackground = true;
                    this.pauseTrack('backgroundMusic');
                }
                
                // Play cake sound
                this.playTrack('cakeSound', false);
                
                // After cake sound ends, return to background music if it was playing
                this.tracks.cakeSound.onended = () => {
                    if (wasPlayingBackground && document.querySelector('.music-toggle.playing')) {
                        this.playTrack('backgroundMusic', true);
                    }
                };
            });
        }
        
        // Journey section
        document.addEventListener('scroll', this.handleSectionVisibility.bind(this));
        
        // Add event listeners for game modals
        const gameModal = document.getElementById('game-modal');
        if (gameModal) {
            // Find the close button
            const closeModal = gameModal.querySelector('.close-modal');
            if (closeModal) {
                closeModal.addEventListener('click', () => {
                    // Stop any game music
                    this.stopTrack('puzzleGame');
                    this.stopTrack('memoryGame');
                    
                    // Return to background music if music toggle is on
                    if (document.querySelector('.music-toggle.playing')) {
                        this.playTrack('backgroundMusic', true);
                    }
                });
            }
        }
        
        // Special section unlock
        const unlockBtn = document.getElementById('unlock-btn');
        if (unlockBtn) {
            unlockBtn.addEventListener('click', () => {
                // Password check is done in script.js, this only handles audio
                const password = document.getElementById('special-password');
                if (password && password.value === '13052002') {
                    console.log("Playing special memory unlock sound");
                    
                    // Double-check that the specialMemoryUnlock track exists and has loaded
                    if (!this.tracks.specialMemoryUnlock) {
                        console.log("Special Memory Unlock track not found, recreating it");
                        this.createTrack('specialMemoryUnlock', 'assests/sounds/Special Memory Unlock.mp3');
                    }
                    
                    // Always stop any current track before playing special sound
                    if (this.currentTrack) {
                        this.stopTrack(this.currentTrack);
                    }
                    
                    // Play the special memory unlock sound directly
                    const specialSound = this.tracks.specialMemoryUnlock;
                    specialSound.volume = this.mainVolume;
                    specialSound.loop = false;
                    
                    specialSound.play().catch(err => {
                        console.error("Error playing special memory unlock sound:", err);
                        // Try with a new Audio instance as fallback
                        const fallbackSound = new Audio('assests/sounds/Special Memory Unlock.mp3');
                        fallbackSound.volume = this.mainVolume;
                        fallbackSound.play().catch(err2 => console.error("Fallback also failed:", err2));
                    });
                    
                    this.currentTrack = 'specialMemoryUnlock';
                    
                    // After special sound ends, return to background music if music toggle is on
                    specialSound.onended = () => {
                        this.currentTrack = null;
                        if (document.querySelector('.music-toggle.playing')) {
                            this.playTrack('backgroundMusic', true);
                        }
                    };
                }
            });
        }
    },
    
    // Handle scrolling to play/pause section-specific audio
    handleSectionVisibility() {
        // Journey section detection
        const journeySection = document.getElementById('journey-section');
        if (journeySection) {
            const rect = journeySection.getBoundingClientRect();
            const isVisible = (
                rect.top < window.innerHeight &&
                rect.bottom > 0 &&
                rect.left < window.innerWidth &&
                rect.right > 0
            );
            
            if (isVisible && this.currentTrack !== 'journeySection') {
                // Stop any current track before playing journey section music
                if (this.currentTrack) {
                    this.stopTrack(this.currentTrack);
                }
                console.log("Journey section is visible, playing journey music");
                this.playTrack('journeySection', true, 0.3);
            } else if (!isVisible && this.currentTrack === 'journeySection') {
                console.log("Journey section no longer visible, stopping journey music");
                this.stopTrack('journeySection');
                // Return to background music if music toggle is on
                if (document.querySelector('.music-toggle.playing')) {
                    this.playTrack('backgroundMusic', true);
                }
            }
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    AudioManager.init();
    
    // Set music button to initial state - not playing
    const musicButton = document.querySelector('.music-toggle');
    if (musicButton) {
        musicButton.innerHTML = '<i class="fas fa-music"></i>';
        musicButton.classList.remove('playing');
    }
});

// Export the manager for other scripts to use
window.AudioManager = AudioManager; 