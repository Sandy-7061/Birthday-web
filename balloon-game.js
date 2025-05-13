// Balloon Game for Shivani's Birthday

// Immediately hide the balloon message as soon as the script loads
(function() {
    const balloonMessage = document.querySelector('.balloon-message');
    if (balloonMessage) {
        balloonMessage.style.display = 'none';
        balloonMessage.style.opacity = '0';
        balloonMessage.style.visibility = 'hidden';
        balloonMessage.classList.add('hidden');
    }
})();

// Global function to start the balloon game
function startBalloonGame() {
    const balloonGame = document.getElementById('balloon-game');
    if (balloonGame) {
        // Show loading message
        const loadingMessage = document.createElement('div');
        loadingMessage.style.position = 'absolute';
        loadingMessage.style.top = '50%';
        loadingMessage.style.left = '50%';
        loadingMessage.style.transform = 'translate(-50%, -50%)';
        loadingMessage.style.color = 'white';
        loadingMessage.style.fontSize = '24px';
        loadingMessage.style.fontWeight = 'bold';
        loadingMessage.style.textAlign = 'center';
        loadingMessage.style.zIndex = '1002';
        loadingMessage.innerText = 'Loading balloons...';
        
        // Show the game container first
        balloonGame.classList.remove('hidden');
        balloonGame.appendChild(loadingMessage);
        
        // Use AudioManager to play balloon game music
        if (window.AudioManager) {
            // Stop any current track before playing balloon game music
            if (AudioManager.currentTrack) {
                AudioManager.stopTrack(AudioManager.currentTrack);
            }
            AudioManager.playTrack('balloonGame', true);
        }
        
        // Short delay to ensure the game container is visible before starting
        setTimeout(() => {
            // Reset the game state
            resetBalloonGame();
            
            // Remove loading message after a short delay
            setTimeout(() => {
                if (balloonGame.contains(loadingMessage)) {
                    balloonGame.removeChild(loadingMessage);
                }
            }, 1000);
        }, 200);
    }
}

// Global function to reset the balloon game
function resetBalloonGame() {
    console.log("Resetting balloon game"); // Debug log
    
    // Reset counters and UI
    poppedBalloons = 0;
    missedBalloons = 0;
    
    // Clear any existing timer
    clearInterval(gameTimer);
    
    const balloonContainer = document.querySelector('.balloon-container');
    const balloonMessage = document.querySelector('.balloon-message');

    // Clear any existing balloons
    if (balloonContainer) {
        console.log("Clearing balloon container");
        balloonContainer.innerHTML = '';
    } else {
        console.log("WARNING: Balloon container not found!");
    }
    
    // Hide the message if visible
    if (balloonMessage) {
        balloonMessage.classList.add('hidden');
        balloonMessage.style.display = 'none';
        balloonMessage.style.opacity = '0';
        balloonMessage.style.visibility = 'hidden';
    } else {
        console.log("WARNING: Balloon message element not found!");
    }
    
    // Force DOM update before creating new balloons
    setTimeout(() => {
        // Restart the game by creating new balloons
        if (typeof createBalloons === 'function') {
            createBalloons();
        } else {
            console.log("ERROR: createBalloons function not found!");
        }
    }, 100);
}

// Variables to track popped and missed balloons globally
let poppedBalloons = 0;
let missedBalloons = 0;
let gameTimer = null;
let gameTimeRemaining = 60; // 1 minute in seconds

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const startButton = document.getElementById('start-balloon-game');
    const balloonGame = document.getElementById('balloon-game');
    const balloonContainer = document.querySelector('.balloon-container');
    const balloonMessage = document.querySelector('.balloon-message');
    const closeButton = document.getElementById('close-balloon-game');
    const floatingElements = document.getElementById('floating-elements');
    const restartButton = document.getElementById('restart-balloon-game');
    
    // Game variables
    const totalBalloons = 30; // Total balloons in the game
    const successThreshold = 23; // Need to pop at least 23 balloons to win
    
    // Background images for balloons from assets folder
    const balloonBackgrounds = [
        'assests/best walpaper of shivnai.jpg',
        'assests/cool pic of shivani wtih earning.jpg',
        'assests/Cute face.jpg',
        'assests/First Movie at Jabalpur.jpg',
        'assests/Last birthday of shivani.jpg',
        'assests/Me and Shivani Fun act.jpg',
        'assests/My give git to shivani 1.jpg',
        'assests/School pic of Shivani.jpg',
        'assests/Shivani is Cycling.jpg',
        'assests/Shivani wtih taddey 1.jpg'
    ];
    
    // Debug log all image paths
    console.log("Balloon images to use:", balloonBackgrounds);
    
    // Ensure balloon message is hidden on load
    if (balloonMessage) {
        balloonMessage.classList.add('hidden');
        balloonMessage.style.display = 'none';
        balloonMessage.style.opacity = '0';
        balloonMessage.style.visibility = 'hidden';
    }
    
    // Create floating elements (cakes, hearts, balloons) that continuously flow in the background
    createFloatingElements();
    
    // Initialize balloon game button
    if (startButton) {
        startButton.addEventListener('click', startGame);
    }
    
    // Close balloon game
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            if (balloonGame) balloonGame.classList.add('hidden');
            if (balloonMessage) {
                balloonMessage.classList.add('hidden');
                balloonMessage.style.display = 'none';
                balloonMessage.style.opacity = '0';
                balloonMessage.style.visibility = 'hidden';
            }
            // Stop balloon game music and return to background music
            if (window.AudioManager) {
                AudioManager.stopTrack('balloonGame');
                AudioManager.stopTrack('allBalloonPopped');
                // Return to background music if music toggle is on
                if (document.querySelector('.music-toggle.playing')) {
                    AudioManager.playTrack('backgroundMusic', true);
                }
            }
        });
    }
    
    // Restart balloon game
    if (restartButton) {
        restartButton.addEventListener('click', resetBalloonGame);
    }
    
    // Create floating elements in the background
    function createFloatingElements() {
        if (!floatingElements) return;
        
        const elementTypes = ['🎂', '❤️', '🎈', '🎁', '✨', '🎉'];
        const totalElements = 30;
        
        for (let i = 0; i < totalElements; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.textContent = elementTypes[Math.floor(Math.random() * elementTypes.length)];
            element.style.fontSize = `${Math.random() * 20 + 10}px`;
            element.style.left = `${Math.random() * 100}vw`;
            element.style.opacity = '0.3';
            element.style.animationDuration = `${Math.random() * 20 + 10}s`;
            element.style.animationDelay = `${Math.random() * 10}s`;
            
            floatingElements.appendChild(element);
        }
    }
    
    // Start balloon game
    function startGame() {
        console.log("Starting balloon game"); // Debug log
        
        // Reset game state
        poppedBalloons = 0;
        missedBalloons = 0;
        
        const balloonContainer = document.querySelector('.balloon-container');
        const balloonMessage = document.querySelector('.balloon-message');
        const balloonGame = document.getElementById('balloon-game');
        
        // Clear container and hide message
        if (balloonContainer) balloonContainer.innerHTML = '';
        if (balloonMessage) {
            balloonMessage.classList.add('hidden');
            balloonMessage.style.display = 'none';
            balloonMessage.style.opacity = '0';
            balloonMessage.style.visibility = 'hidden';
        }
        
        // Show game container
        if (balloonGame) {
            console.log("Showing balloon game container");
            balloonGame.classList.remove('hidden');
            
            // Use AudioManager to play balloon game music
            if (window.AudioManager) {
                // Stop any current track before playing balloon game music
                if (AudioManager.currentTrack) {
                    AudioManager.stopTrack(AudioManager.currentTrack);
                }
                AudioManager.playTrack('balloonGame', true);
            }
            
            // Ensure container is visible before creating balloons
            setTimeout(() => {
                // Create balloons
                createBalloons();
            }, 300);
        } else {
            console.log("ERROR: Balloon game container not found!");
        }
    }
    
    // Create balloons for the game
    function createBalloons() {
        console.log("Creating balloons!"); // Debug message
        const maxVisibleBalloons = 5; // Max number of balloons visible at any time
        let activeBalloonCount = 0;
        let totalCreatedBalloons = 0;
        
        // Create game timer UI
        const timerElement = document.createElement('div');
        timerElement.className = 'balloon-timer';
        timerElement.innerHTML = `
            <div class="timer-display">Time: <span id="timer-countdown">01:00</span></div>
            <div class="balloon-counter">Popped: <span id="popped-counter">0</span>/<span id="target-counter">${successThreshold}</span></div>
        `;
        balloonContainer.appendChild(timerElement);
        
        // Update counter display
        const poppedCounter = document.getElementById('popped-counter');
        if (poppedCounter) {
            poppedCounter.textContent = '0';
        }
        
        // Start the game timer
        gameTimeRemaining = 60; // Reset to 1 minute
        clearInterval(gameTimer); // Clear any existing timer
        
        gameTimer = setInterval(() => {
            gameTimeRemaining--;
            
            // Update timer display
            const minutes = Math.floor(gameTimeRemaining / 60);
            const seconds = gameTimeRemaining % 60;
            const timerDisplay = document.getElementById('timer-countdown');
            
            if (timerDisplay) {
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            
            // Check if time is up
            if (gameTimeRemaining <= 0) {
                clearInterval(gameTimer);
                
                // End the game
                if (poppedBalloons >= successThreshold) {
                    showSuccessMessage();
                } else {
                    showFailureMessage();
                }
                
                // Remove all remaining balloons
                const balloons = document.querySelectorAll('.balloon');
                balloons.forEach(balloon => {
                    if (balloonContainer.contains(balloon)) {
                        balloonContainer.removeChild(balloon);
                    }
                });
            }
            
            // Update popped counter display
            if (poppedCounter) {
                poppedCounter.textContent = poppedBalloons.toString();
            }
            
            // Check if we've reached the success threshold
            if (poppedBalloons >= successThreshold) {
                clearInterval(gameTimer);
                showSuccessMessage();
                
                // Remove all remaining balloons
                const balloons = document.querySelectorAll('.balloon');
                balloons.forEach(balloon => {
                    if (balloonContainer.contains(balloon)) {
                        balloonContainer.removeChild(balloon);
                    }
                });
            }
        }, 1000);
        
        // Function to create a new balloon
        function createNextBalloon() {
            console.log(`Creating balloon ${totalCreatedBalloons + 1} of ${totalBalloons}`); // Debug message
            
            if (totalCreatedBalloons >= totalBalloons) {
                console.log("All balloons created!");
                return;
            }
            
            if (!balloonContainer) {
                console.log("No balloon container found!");
                return;
            }
            
            createBalloon(() => {
                console.log("Balloon completed!"); // Debug message
                activeBalloonCount--;
                
                // If we've created all balloons and none are active, show game over message
                if (totalCreatedBalloons >= totalBalloons && activeBalloonCount === 0) {
                    console.log("Game over! Showing message."); // Debug message
                    if (poppedBalloons >= successThreshold) {
                        showSuccessMessage();
                    } else {
                        showFailureMessage();
                    }
                }
                else if (totalCreatedBalloons < totalBalloons) {
                    // Continue creating balloons if we haven't reached the total
                    createNextBalloon();
                }
            });
            
            totalCreatedBalloons++;
            activeBalloonCount++;
            
            // If we can still add more balloons to reach max visible, create another
            if (activeBalloonCount < maxVisibleBalloons && totalCreatedBalloons < totalBalloons) {
                setTimeout(createNextBalloon, 1000); // Add a new balloon every second
            }
        }
        
        // Start with initial balloons
        for (let i = 0; i < Math.min(3, totalBalloons); i++) {
            setTimeout(() => {
                createNextBalloon();
            }, i * 800); // Stagger the initial balloons
        }
    }
    
    // Create a single balloon
    function createBalloon(onComplete) {
        if (!balloonContainer) return;
        
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        // Set balloon style - make them bigger
        const size = Math.random() * 100 + 100; // Random size between 100-200px (bigger)
        
        // Get random background image for the balloon
        const backgroundImage = balloonBackgrounds[Math.floor(Math.random() * balloonBackgrounds.length)];
        
        // Define a unique ID for this balloon's pattern
        const patternId = `img-pattern-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Set balloon with background image
        balloon.innerHTML = `
            <div style="width: ${size}px; height: ${size * 1.2}px; position: relative;">
                <svg width="${size}" height="${size * 1.2}" viewBox="0 0 100 120">
                    <defs>
                        <pattern id="${patternId}" patternUnits="userSpaceOnUse" width="100" height="100">
                            <image href="${backgroundImage}" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
                        </pattern>
                    </defs>
                    <path d="M50,0 C22.4,0 0,22.4 0,50 C0,77.6 22.4,100 50,100 C77.6,100 100,77.6 100,50 C100,22.4 77.6,0 50,0 Z" fill="url(#${patternId})" />
                    <path d="M50,100 L55,120 L45,120 Z" fill="#ff6ba9" />
                    <path d="M50,10 C40,30 60,30 50,50 C40,70 60,70 50,90" stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none" />
                </svg>
            </div>
        `;
        
        // Set balloon position and animation properties
        balloon.style.left = `${Math.random() * 90 + 5}%`; // Random horizontal position (5-95%)
        balloon.style.bottom = `-${size}px`;
        
        // Faster animation for balloons - 5-8 seconds to float up (previously 10-15)
        const animationDuration = Math.random() * 3 + 5;
        balloon.style.animation = `balloonFloat ${animationDuration}s linear forwards`;
        
        // Add click event to pop balloon
        balloon.addEventListener('click', function() {
            // Pop animation
            balloon.innerHTML = `
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                    <svg width="${size * 1.5}" height="${size * 1.5}" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#ff6ba9" stroke-width="3" stroke-dasharray="10 5" />
                        <circle cx="50" cy="50" r="30" fill="none" stroke="#b67aff" stroke-width="2" />
                        <circle cx="50" cy="50" r="20" fill="none" stroke="#ffd95c" stroke-width="2" stroke-dasharray="5 3" />
                        <path d="M30,30 L70,70 M30,70 L70,30" stroke="#ff6ba9" stroke-width="3" />
                    </svg>
                </div>
            `;
            
            // Play popping sound using AudioManager
            if (window.AudioManager) {
                AudioManager.playTrack('balloonPop');
            } else {
                // Fallback if AudioManager is not available
                try {
                    const popSound = new Audio('assests/sounds/balloon-pop.mp3');
                    popSound.volume = 0.5;
                    popSound.play().catch(err => {
                        console.log('Audio playback error:', err);
                    });
                } catch (e) {
                    console.log('Error playing pop sound:', e);
                }
            }
            
            // Apply CSS animation for balloon disappearing
            balloon.style.opacity = '0';
            balloon.style.transform = 'scale(0.5)';
            
            // Increment popped counter and update display
            poppedBalloons++;
            const poppedCounter = document.getElementById('popped-counter');
            if (poppedCounter) {
                poppedCounter.textContent = poppedBalloons.toString();
            }
            
            // Check if we've reached the success threshold
            if (poppedBalloons >= successThreshold) {
                clearInterval(gameTimer);
                
                // Delay showing the success message to allow pop animation to complete
                setTimeout(() => {
                    showSuccessMessage();
                    
                    // Remove all remaining balloons
                    const balloons = document.querySelectorAll('.balloon');
                    balloons.forEach(balloon => {
                        if (balloonContainer && balloonContainer.contains(balloon)) {
                            balloonContainer.removeChild(balloon);
                        }
                    });
                }, 500);
            }
            
            // Remove balloon after animation
            setTimeout(() => {
                if (balloonContainer && balloonContainer.contains(balloon)) {
                    balloonContainer.removeChild(balloon);
                }
                
                // Call the onComplete callback to manage balloon flow
                if (typeof onComplete === 'function') {
                    onComplete();
                }
            }, 1000);
        });
        
        // REMOVED: The automatic timeout that was destroying balloons
        // Only handle balloons that float off the top of the screen
        const checkOffscreenInterval = setInterval(() => {
            const balloonRect = balloon.getBoundingClientRect();
            
            // Check if balloon is completely off the top of the screen
            if (balloonRect.bottom < 0) { // Changed from -100 to 0 to detect as soon as balloon is fully off-screen
                clearInterval(checkOffscreenInterval);
                
                if (balloonContainer && balloonContainer.contains(balloon)) {
                    balloon.style.opacity = '0';
                    
                    setTimeout(() => {
                        if (balloonContainer && balloonContainer.contains(balloon)) {
                            balloonContainer.removeChild(balloon);
                            missedBalloons++;
                            
                            // Call the onComplete callback
                            if (typeof onComplete === 'function') {
                                onComplete();
                            }
                        }
                    }, 500); // Reduced from 1000ms to 500ms
                }
            }
        }, 500); // Check position more frequently (500ms instead of 1000ms)
        
        balloonContainer.appendChild(balloon);
    }
    
    // Show success message when enough balloons are popped
    function showSuccessMessage() {
        if (!balloonMessage) return;
        
        // Update message content for success
        const messageTitle = balloonMessage.querySelector('h2');
        const messageText = balloonMessage.querySelectorAll('p');
        
        if (messageTitle) {
            messageTitle.textContent = '🎉 Congratulations! 🎉';
        }
        
        if (messageText && messageText.length >= 2) {
            messageText[0].textContent = `You popped ${poppedBalloons} out of ${totalBalloons} balloons!`;
            messageText[1].textContent = 'Happy 23rd Birthday Shivani! You are buddi now! 😄';
        }
        
        // Make restart button visible in the message
        if (restartButton) {
            restartButton.style.display = 'inline-block';
        }
        
        // Play success sound
        if (window.AudioManager) {
            // First stop the balloon game music
            AudioManager.stopTrack('balloonGame');
            // Then play the success sound
            AudioManager.playTrack('allBalloonPopped');
        }
        
        // Show the message
        showCompletionMessage();
    }
    
    // Show failure message when too many balloons are missed
    function showFailureMessage() {
        if (!balloonMessage) return;
        
        // Update message content for failure
        const messageTitle = balloonMessage.querySelector('h2');
        const messageText = balloonMessage.querySelectorAll('p');
        
        if (messageTitle) {
            messageTitle.textContent = 'Choti bacchi ho kya? 😏';
        }
        
        if (messageText && messageText.length >= 2) {
            messageText[0].textContent = `You only popped ${poppedBalloons} balloons! You need 23 for Shivani's birthday!`;
            messageText[1].textContent = 'Try again and pop more balloons this time!';
        }
        
        // Make restart button visible in the message
        if (restartButton) {
            restartButton.style.display = 'inline-block';
        }
        
        // Show the message
        showCompletionMessage();
    }
    
    // Show the completion message (either success or failure)
    function showCompletionMessage() {
        if (!balloonMessage) return;
        
        // Add celebration animation
        const styleId = 'celebration-style';
        let celebrationStyle = document.getElementById(styleId);
        
        if (!celebrationStyle) {
            celebrationStyle = document.createElement('style');
            celebrationStyle.id = styleId;
            celebrationStyle.innerHTML = `
                @keyframes celebrate {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.1); }
                }
                
                .celebrating {
                    display: block !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    animation: celebrate 0.5s ease-in-out 3;
                }
            `;
            document.head.appendChild(celebrationStyle);
        }
        
        // Show message with animation
        balloonMessage.classList.remove('hidden');
        balloonMessage.style.display = 'block';
        balloonMessage.style.opacity = '1';
        balloonMessage.style.visibility = 'visible';
        balloonMessage.classList.add('celebrating');
        
        // Remove animation class after it completes
        setTimeout(() => {
            if (balloonMessage) {
                balloonMessage.classList.remove('celebrating');
            }
        }, 1500);
    }
    
    // Make these functions available globally
    window.createBalloons = createBalloons;
}); 