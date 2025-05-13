// DOM Elements
const loader = document.querySelector('.loader');
const progress = document.querySelector('.progress');
const cursorFollower = document.querySelector('.cursor-follower');
const musicToggle = document.querySelector('.music-toggle');
const backgroundMusic = document.getElementById('background-music');
const birthdayTitle = document.querySelector('.birthday-title');
const flyingCards = document.querySelector('.flying-cards');
const sections = document.querySelectorAll('.section');
const nav = document.querySelector('nav');
const wishCards = document.querySelectorAll('.wish-card');
const memoryCards = document.querySelectorAll('.memory-card');

// Global Variables
let isLoaded = false;
let isMusicPlaying = false;
let confettiInterval;

// Loader Animation
function initLoader() {
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    isLoaded = true;
                    animateEntrance();
                    startConfetti();
                }, 500);
            }, 500);
        } else {
            width += 1;
            progress.style.width = width + '%';
        }
    }, 30);
}

// Cursor Follower
function initCursorFollower() {
    document.addEventListener('mousemove', (e) => {
        if (isLoaded) {
            cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }
    });
}

// Toggle Music
function initMusicToggle() {
    // Create the floating audio controller
    createFloatingAudioController();
    
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Birthday Music</span>';
            hideAudioController(); // Hide the controller when music is paused
        } else {
            backgroundMusic.play()
                .then(() => {
                    console.log("Background music started successfully");
                    updateTrackInfo('Birthday Music');
                    showAudioController(); // Show the controller when music starts playing
                })
                .catch(err => {
                    console.error("Error playing background music:", err);
                });
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i><span>Music Playing</span>';
        }
        isMusicPlaying = !isMusicPlaying;
    });
}

// Create floating audio controller
function createFloatingAudioController() {
    // Check if controller already exists
    if (document.getElementById('floating-audio-controller')) return;
    
    const audioController = document.createElement('div');
    audioController.id = 'floating-audio-controller';
    audioController.classList.add('audio-controller');
    audioController.innerHTML = `
        <div class="audio-controller-inner">
            <button id="audio-play" title="Play"><i class="fas fa-play"></i></button>
            <button id="audio-pause" title="Pause"><i class="fas fa-pause"></i></button>
            <button id="audio-stop" title="Stop"><i class="fas fa-stop"></i></button>
            <div class="current-track-info">Now Playing: Birthday Music</div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(audioController);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .audio-controller {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            padding: 10px 15px;
            border-radius: 50px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            display: none;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
        }
        
        .audio-controller.visible {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }
        
        .audio-controller-inner {
            display: flex;
            align-items: center;
        }
        
        .audio-controller button {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            margin-right: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .audio-controller button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }
        
        .audio-controller button:active {
            transform: scale(0.95);
        }
        
        .current-track-info {
            color: white;
            font-size: 0.9rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 150px;
        }
    `;
    
    document.head.appendChild(style);
    
    // Add event listeners with improved functionality
    document.getElementById('audio-play').addEventListener('click', function() {
        console.log("Play button clicked");
        
        // Find the currently active audio element
        let audioToPlay = getCurrentAudioElement();
        
        if (audioToPlay) {
            audioToPlay.play()
                .then(() => {
                    console.log("Audio playback started successfully");
                    isMusicPlaying = true;
                    updateMusicToggleDisplay(true);
                })
                .catch(err => {
                    console.error("Error playing audio:", err);
                });
        } else if (window.AudioManager && AudioManager.currentTrack) {
            AudioManager.playTrack(AudioManager.currentTrack, true);
            updateTrackInfo(AudioManager.currentTrack);
        }
    });
    
    document.getElementById('audio-pause').addEventListener('click', function() {
        console.log("Pause button clicked");
        
        // Find the currently active audio element
        let audioToPause = getCurrentAudioElement();
        
        if (audioToPause) {
            audioToPause.pause();
            console.log("Audio paused");
            isMusicPlaying = false;
            updateMusicToggleDisplay(false);
        } else if (window.AudioManager && AudioManager.currentTrack) {
            AudioManager.pauseTrack(AudioManager.currentTrack);
        }
    });
    
    document.getElementById('audio-stop').addEventListener('click', function() {
        console.log("Stop button clicked");
        
        // Find the currently active audio element
        let audioToStop = getCurrentAudioElement();
        
        if (audioToStop) {
            audioToStop.pause();
            audioToStop.currentTime = 0;
            console.log("Audio stopped");
            isMusicPlaying = false;
            updateMusicToggleDisplay(false);
            hideAudioController();
        } else if (window.AudioManager && AudioManager.currentTrack) {
            AudioManager.stopTrack(AudioManager.currentTrack);
            hideAudioController();
        }
    });
    
    // Initially hide the controller
    hideAudioController();
}

// Helper function to get the currently playing audio element
function getCurrentAudioElement() {
    // First check for romantic audio which has higher priority
    const romanticAudio = document.getElementById('romantic-audio');
    if (romanticAudio && !romanticAudio.paused) {
        return romanticAudio;
    }
    
    // Then check for background music
    if (backgroundMusic && !backgroundMusic.paused) {
        return backgroundMusic;
    }
    
    // If neither is playing but we're in "playing" state, return the appropriate one
    if (isMusicPlaying) {
        return backgroundMusic;
    }
    
    // Check all audio elements to find any that's playing
    const allAudio = document.querySelectorAll('audio');
    for (let audio of allAudio) {
        if (!audio.paused) {
            return audio;
        }
    }
    
    // If no audio is playing, return the most relevant one
    if (romanticAudio) {
        return romanticAudio;
    }
    
    return backgroundMusic;
}

// Helper function to update the music toggle display
function updateMusicToggleDisplay(isPlaying) {
    if (musicToggle) {
        if (isPlaying) {
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i><span>Music Playing</span>';
        } else {
            musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Birthday Music</span>';
        }
    }
}

// Show the audio controller
function showAudioController() {
    const controller = document.getElementById('floating-audio-controller');
    if (controller) {
        controller.classList.add('visible');
        console.log("Audio controller shown");
    }
}

// Hide the audio controller
function hideAudioController() {
    const controller = document.getElementById('floating-audio-controller');
    if (controller) {
        controller.classList.remove('visible');
        console.log("Audio controller hidden");
    }
}

// Update track info in the controller
function updateTrackInfo(trackName) {
    const trackInfo = document.querySelector('.current-track-info');
    if (trackInfo) {
        trackInfo.textContent = 'Now Playing: ' + trackName;
        console.log("Track info updated to:", trackName);
    }
}

// Entrance Animation
function animateEntrance() {
    birthdayTitle.classList.add('fade-in');
    
    // Create flying cards with birthday wishes
    const wishes = [
        "Happy Birthday Shivani!",
        "22 and Fabulous!",
        "May all your dreams come true!",
        "Wishing you joy and happiness!",
        "Have a magical day!",
        "Another year of being amazing!",
        "Stay blessed and beautiful!",
        "Time to celebrate you!"
    ];
    
    wishes.forEach((wish, index) => {
        setTimeout(() => {
            const card = document.createElement('div');
            card.classList.add('flying-card');
            card.innerHTML = wish;
            
            // Random position and animation
            const startX = Math.random() * window.innerWidth;
            const startY = window.innerHeight + 100;
            const endX = Math.random() * window.innerWidth;
            const endY = -100;
            const rotation = Math.random() * 30 - 15;
            
            card.style.setProperty('--startX', `${startX}px`);
            card.style.setProperty('--startY', `${startY}px`);
            card.style.setProperty('--endX', `${endX}px`);
            card.style.setProperty('--endY', `${endY}px`);
            card.style.setProperty('--rotation', `${rotation}deg`);
            
            flyingCards.appendChild(card);
            
            // Remove card after animation completes
            setTimeout(() => {
                flyingCards.removeChild(card);
            }, 15000);
        }, index * 1000);
    });
}

// Initialize all components when document is ready
document.addEventListener('DOMContentLoaded', function() {
    initCake();
    initWishes();
    initSpecialSection();
    
    // Add event listener to update audio controller when AudioManager plays a track
    if (window.AudioManager) {
        document.addEventListener('audioTrackChange', function(e) {
            if (e.detail && e.detail.track) {
                updateTrackInfo(e.detail.track);
                showAudioController();
            }
        });
    }
});

// Initialize the 3D Cake using Three.js
function initCake() {
    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / 500, 0.1, 1000);
    const canvas = document.getElementById('cake-canvas');
    
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(5, 10, 5);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);
    
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
    frontLight.position.set(0, 5, 10);
    scene.add(frontLight);
    
    // Create cake stand
    const standGeometry = new THREE.CylinderGeometry(5, 6, 0.5, 32);
    const standMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xf1f1f1,
        shininess: 100
    });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = -3;
    stand.castShadow = true;
    stand.receiveShadow = true;
    scene.add(stand);
    
    // Create layers of the cake
    const cakeLayers = [];
    const layerColors = [0xff9dd1, 0xffb8df, 0xffd4ec];
    const layerSizes = [4.5, 3.5, 2.5];
    const layerHeights = [1.5, 1.5, 1.5];
    
    for (let i = 0; i < 3; i++) {
        const layerGeometry = new THREE.CylinderGeometry(layerSizes[i], layerSizes[i], layerHeights[i], 32);
        const layerMaterial = new THREE.MeshPhongMaterial({ 
            color: layerColors[i],
            shininess: 30,
            specular: 0x555555
        });
        const layer = new THREE.Mesh(layerGeometry, layerMaterial);
        layer.position.y = -1.5 + (i * layerHeights[i]);
        layer.castShadow = true;
        layer.receiveShadow = true;
        scene.add(layer);
        cakeLayers.push(layer);
        
        // Add frosting between layers
        if (i > 0) {
            const frostingGeometry = new THREE.TorusGeometry(layerSizes[i] + 0.15, 0.2, 16, 50);
            const frostingMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xffffff,
                shininess: 80
            });
            const frosting = new THREE.Mesh(frostingGeometry, frostingMaterial);
            frosting.position.y = -1.5 + (i * layerHeights[i]) - (layerHeights[i] / 2);
            frosting.rotation.x = Math.PI / 2;
            frosting.castShadow = true;
            scene.add(frosting);
        }
        
        // Add decorations to each layer
        addLayerDecorations(scene, layerSizes[i], -1.5 + (i * layerHeights[i]));
    }
    
    // Add top frosting
    const topFrostingGeometry = new THREE.CylinderGeometry(2.6, layerSizes[2], 0.3, 32);
    const topFrostingMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        shininess: 80
    });
    const topFrosting = new THREE.Mesh(topFrostingGeometry, topFrostingMaterial);
    topFrosting.position.y = 2.25;
    topFrosting.castShadow = true;
    scene.add(topFrosting);
    
    // Add candles
    const candles = [];
    const candleColors = [0xff5e94, 0x8a5eff, 0xffde59, 0x64ff59, 0x59c7ff];
    const candlePositions = [
        { x: 0, y: 0 },
        { x: 1.2, y: 0 },
        { x: -1.2, y: 0 },
        { x: 0, y: 1.2 },
        { x: 0, y: -1.2 },
        { x: 0.85, y: 0.85 },
        { x: -0.85, y: 0.85 },
        { x: 0.85, y: -0.85 },
        { x: -0.85, y: -0.85 }
    ];
    
    for (let i = 0; i < candlePositions.length; i++) {
        const colorIndex = i % candleColors.length;
        const candleGroup = new THREE.Group();
        
        // Candle body
        const candleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
        const candleMaterial = new THREE.MeshPhongMaterial({ 
            color: candleColors[colorIndex],
            shininess: 30
        });
        const candle = new THREE.Mesh(candleGeometry, candleMaterial);
        candle.position.y = 0.5;
        candleGroup.add(candle);
        
        // Add candle flame
        const flameGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const flameMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            transparent: true,
            opacity: 0.9
        });
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.y = 1.1;
        flame.scale.y = 1.5;
        candleGroup.add(flame);
        
        // Add flame light
        const flameLight = new THREE.PointLight(0xffff00, 0.5, 3);
        flameLight.position.y = 1.1;
        candleGroup.add(flameLight);
        
        candleGroup.position.set(
            candlePositions[i].x,
            2.4,
            candlePositions[i].y
        );
        
        scene.add(candleGroup);
        candles.push({
            group: candleGroup,
            flame: flame,
            light: flameLight,
            isLit: true
        });
    }
    
    // Create number decorations using cylinders for "22"
    const num2Group = createNumberTwo();
    num2Group.position.set(-0.6, 2.6, 0);
    num2Group.scale.set(0.2, 0.2, 0.2);
    scene.add(num2Group);
    
    const num2Group2 = createNumberTwo();
    num2Group2.position.set(0.6, 2.6, 0);
    num2Group2.scale.set(0.2, 0.2, 0.2);
    scene.add(num2Group2);
    
    // Set camera position
    camera.position.set(0, 4, 12);
    camera.lookAt(0, 0, 0);
    
    // Add interactivity for cake rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationGroup = new THREE.Group();
    
    // Add all cake layers and decorations to the rotation group
    cakeLayers.forEach(layer => {
        scene.remove(layer);
        rotationGroup.add(layer);
    });
    scene.add(rotationGroup);
    
    canvas.addEventListener('mousedown', function(e) {
        isDragging = true;
    });
    
    canvas.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };
            
            // Rotate cake based on mouse movement
            rotationGroup.rotation.y += deltaMove.x * 0.01;
        }
        
        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
    });
    
    canvas.addEventListener('mouseup', function(e) {
        isDragging = false;
    });
    
    // Add click interaction for blowing out candles
    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
        const mouseY = -((e.clientY - rect.top) / canvas.clientHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(mouseX, mouseY);
        
        raycaster.setFromCamera(mouse, camera);
        
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        if (intersects.length > 0) {
            // Find the closest candle and blow it out
            for (let i = 0; i < candles.length; i++) {
                const candle = candles[i];
                if (candle.isLit) {
                    candle.flame.visible = false;
                    candle.light.intensity = 0;
                    candle.isLit = false;
                    
                    // Add particle effect for blown candle
                    createSmokeEffect(scene, candle.group.position.x, candle.group.position.y + 1.1, candle.group.position.z);
                    
                    break;
                }
            }
            
            // Check if all candles are blown out
            const allBlownOut = candles.every(candle => !candle.isLit);
            if (allBlownOut) {
                showBirthdayMessage();
            }
        }
    });
    
    // Add window resize handler
    window.addEventListener('resize', function() {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Animate candle flames
        candles.forEach(candle => {
            if (candle.isLit) {
                candle.flame.scale.y = 1.5 + Math.sin(Date.now() * 0.01) * 0.1;
                candle.light.intensity = 0.5 + Math.sin(Date.now() * 0.01) * 0.1;
            }
        });
        
        // Slowly rotate the cake
        rotationGroup.rotation.y += 0.001;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Helper function to create decorations on cake layers
function addLayerDecorations(scene, radius, height) {
    const decorColors = [0xffde59, 0x8a5eff, 0xff5e94];
    
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const decorGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const decorMaterial = new THREE.MeshPhongMaterial({ 
            color: decorColors[i % decorColors.length],
            shininess: 80
        });
        const decor = new THREE.Mesh(decorGeometry, decorMaterial);
        decor.position.set(x, height, z);
        decor.castShadow = true;
        scene.add(decor);
    }
}

// Helper function to create a number two shape
function createNumberTwo() {
    const group = new THREE.Group();
    
    // Top horizontal bar
    const topBar = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.7, 0.7),
        new THREE.MeshPhongMaterial({ color: 0xffde59 })
    );
    topBar.position.y = 5;
    group.add(topBar);
    
    // Right vertical bar
    const rightBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 2.5, 0.7),
        new THREE.MeshPhongMaterial({ color: 0xffde59 })
    );
    rightBar.position.set(1.2, 3.5, 0);
    group.add(rightBar);
    
    // Bottom horizontal bar
    const bottomBar = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.7, 0.7),
        new THREE.MeshPhongMaterial({ color: 0xffde59 })
    );
    bottomBar.position.y = 2;
    group.add(bottomBar);
    
    // Left vertical bar
    const leftBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 2.5, 0.7),
        new THREE.MeshPhongMaterial({ color: 0xffde59 })
    );
    leftBar.position.set(-1.2, 0.5, 0);
    group.add(leftBar);
    
    // Bottom horizontal bar again
    const bottomBar2 = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.7, 0.7),
        new THREE.MeshPhongMaterial({ color: 0xffde59 })
    );
    bottomBar2.position.y = -1;
    group.add(bottomBar2);
    
    return group;
}

// Create smoke effect when candle is blown out
function createSmokeEffect(scene, x, y, z) {
    const particleCount = 20;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 8, 8),
            new THREE.MeshBasicMaterial({
                color: 0xcccccc,
                transparent: true,
                opacity: 0.7
            })
        );
        
        particle.position.set(
            x + (Math.random() * 0.2 - 0.1),
            y,
            z + (Math.random() * 0.2 - 0.1)
        );
        
        particle.userData = {
            velocity: new THREE.Vector3(
                Math.random() * 0.02 - 0.01,
                Math.random() * 0.05 + 0.02,
                Math.random() * 0.02 - 0.01
            ),
            life: 60 + Math.random() * 20
        };
        
        scene.add(particle);
        particles.push(particle);
    }
    
    // Animation function for smoke particles
    function animateSmoke() {
        let hasActiveParticles = false;
        
        particles.forEach(particle => {
            if (particle.userData.life > 0) {
                particle.position.add(particle.userData.velocity);
                particle.userData.life--;
                particle.material.opacity = particle.userData.life / 80;
                particle.scale.x = particle.scale.y = particle.scale.z = 1 + (60 - particle.userData.life) / 60;
                hasActiveParticles = true;
            } else if (particle.parent) {
                scene.remove(particle);
            }
        });
        
        if (hasActiveParticles) {
            requestAnimationFrame(animateSmoke);
        }
    }
    
    animateSmoke();
}

// Show birthday message when all candles are blown out
function showBirthdayMessage() {
    const messageElement = document.createElement('div');
    messageElement.className = 'birthday-message';
    messageElement.innerHTML = `
        <h2>Happy 23rd Birthday, Shivani!</h2>
        <p>You've blown out all the candles! Make a wish!</p>
        <div class="confetti"></div>
    `;
    
    document.body.appendChild(messageElement);
    
    // Add some CSS for the message
    const style = document.createElement('style');
    style.textContent = `
        .birthday-message {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ff69b4, #9370db);
            color: white;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: messageIn 0.5s ease;
        }
        
        @keyframes messageIn {
            from {
                opacity: 0;
                transform: translate(-50%, -60%);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
        }
        
        .confetti {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }
    `;
    
    document.head.appendChild(style);
    
    // Create confetti effect
    createConfetti();
    
    // Auto hide message after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }, 5000);
}

// Create confetti effect
function createConfetti() {
    const confettiContainer = document.querySelector('.confetti');
    const colors = ['#ff69b4', '#9370db', '#ffd700', '#87cefa', '#98fb98'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 5 + 5}px;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.5};
            transform: rotate(${Math.random() * 360}deg);
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
        `;
        
        confettiContainer.appendChild(confetti);
    }
    
    // Add animation for confetti
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            from {
                transform: translateY(-50px) rotate(0deg);
                opacity: 1;
            }
            to {
                transform: translateY(${window.innerHeight}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize wishes section with flying cards
function initWishes() {
    const wishesContainer = document.querySelector('.wishes-container');
    const wishes = [
        "Happy 23rd birthday, Shivani! May your day be as beautiful as you are.",
        "Wishing you a day filled with happiness and a year filled with joy!",
        "May all your dreams and wishes come true in this coming year.",
        "Sending you smiles for every moment of your special day.",
        "Hope your 23rd birthday is as amazing as you are!",
        "Another adventure-filled year awaits you. Welcome it with open arms!",
        "May this special day bring you endless joy and tons of precious memories!",
        "Wishing you a wonderful birthday and a magnificent year ahead."
    ];
    
    wishes.forEach((wish, index) => {
        const wishCard = document.createElement('div');
        wishCard.className = 'wish-card';
        wishCard.innerHTML = wish;
        wishCard.style.animationDelay = `${index * 2}s`;
        wishCard.style.top = `${Math.random() * 60 + 20}%`;
        
        wishesContainer.appendChild(wishCard);
    });
}

// Initialize special section with password protection
function initSpecialSection() {
    const passwordInput = document.getElementById('special-password');
    const unlockBtn = document.getElementById('unlock-btn');
    const specialContent = document.getElementById('special-content');
    const correctPassword = "07092023"; // May 13, 2002
    
    unlockBtn.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
    
    function checkPassword() {
        if (passwordInput.value === correctPassword) {
            specialContent.classList.remove('hidden');
            loadSpecialContent();
            
            // Add success animation
            passwordInput.style.borderColor = '#4CAF50';
            unlockBtn.innerHTML = "Unlocked!";
            unlockBtn.style.backgroundColor = '#4CAF50';
            
            // Scroll to the content
            setTimeout(() => {
                specialContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        } else {
            // Add error animation
            passwordInput.style.borderColor = '#f44336';
            passwordInput.classList.add('shake');
            
            setTimeout(() => {
                passwordInput.classList.remove('shake');
                passwordInput.style.borderColor = '';
            }, 500);
        }
    }
    
    function loadSpecialContent() {
        const specialContent = document.getElementById('special-content');
        
        // Clear any previous content
        specialContent.innerHTML = '';
        
        // Create container for special content
        const specialContainer = document.createElement('div');
        specialContainer.className = 'special-container';
        
        // Add title and description
        const title = document.createElement('h2');
        title.textContent = '❤️ Our Special Memories ❤️';
        
        const description = document.createElement('p');
        description.className = 'special-description';
        description.textContent = 'These are our most precious memories together, collected just for you. Happy Birthday, my love!';
        
        // Play special memory unlock sound using AudioManager
        if (window.AudioManager) {
            console.log("Playing special memory unlock sound from AudioManager");
            // Stop any currently playing audio first
            if (AudioManager.currentTrack) {
                AudioManager.stopTrack(AudioManager.currentTrack);
            }
            
            // Play the special unlock sound
            AudioManager.playTrack('specialMemoryUnlock', false);
        }
        
        // Add elements to container
        specialContainer.appendChild(title);
        specialContainer.appendChild(description);
        
        // Add container to special content
        specialContent.appendChild(specialContainer);
        
        // Create grid for special items
        const specialGrid = document.createElement('div');
        specialGrid.className = 'special-grid';
        specialContent.appendChild(specialGrid);
        
        // These would be the special images and videos from the Password folder
        const specialItems = [
            { 
                type: 'image', 
                src: 'assests/Password/me and shivani.jpeg', 
                caption: 'Together Forever',
                description: 'Every moment with you feels like a beautiful dream. Your hand in mine, your smile lighting up my world - this is what perfection looks like.'
            },
            { 
                type: 'image', 
                src: 'assests/Password/Traditional look.jpeg', 
                caption: 'Beautiful Traditional Look',
                description: 'You look absolutely breathtaking in traditional attire. The way you carry yourself with such grace and elegance makes my heart skip a beat.'
            },
            { 
                type: 'image', 
                src: 'assests/Password/in waterpark with Shivani.jpeg', 
                caption: 'Fun at Waterpark',
                description: 'Adventure is always better with you by my side. The joy and laughter we shared that day at the waterpark is a memory I\'ll treasure forever.'
            },
            { 
                type: 'image', 
                src: 'assests/Password/Ghibli art.jpeg', 
                caption: 'Artistic Portrait',
                description: 'Your beauty transcends reality and enters the realm of art. This portrait captures your essence in the most magical way possible.'
            },
            { 
                type: 'image', 
                src: 'assests/Password/Traditional lokk.jpeg', 
                caption: 'Stunning in Traditional Attire',
                description: 'Words fail to describe how beautiful you look here. Your smile, your eyes, everything about you is absolutely mesmerizing.'
            },
            { 
                type: 'video', 
                src: 'assests/Password/Romatic video with shivani.mp4', 
                caption: 'Romantic Moments',
                description: 'Some moments are too precious to capture in words. This video holds the essence of story - pure, genuine, and beautiful.'
            },
            { 
                type: 'image', 
                src: 'assests/Password/hot shivni.jpeg', 
                caption: 'Gorgeous You',
                description: 'Your beauty leaves me breathless every single time. You are the definition of perfection, inside and out.'
            },
            { 
                type: 'image', 
                src: 'assests/Password/Best pic with shivani.jpeg', 
                caption: 'Best Times Together',
                description: 'The best moments in life are the ones spent with you. Your presence makes everything brighter and more beautiful.'
            },
            { 
                type: 'image', 
                src: 'assests/Password/Romantic pose.jpeg', 
                caption: 'Romantic Pose',
                description: 'Every pose, every glance, every smile of yours tells a story - a story of love, passion, and the beautiful bond we share.'
            }
        ];
        
        specialItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'memory-story-item';
            itemElement.setAttribute('data-index', index);
            
            // Alternate layout for odd/even items
            const isEven = index % 2 === 0;
            itemElement.classList.add(isEven ? 'memory-right' : 'memory-left');
            
            if (item.type === 'image') {
                itemElement.innerHTML = `
                    <div class="memory-content ${isEven ? 'memory-content-right' : 'memory-content-left'}">
                        <div class="memory-media">
                            <img src="${item.src}" alt="${item.caption}" loading="lazy">
                        </div>
                        <div class="memory-text">
                            <h3>${item.caption}</h3>
                            <p>${item.description}</p>
                            <div class="memory-hearts">
                                <span>❤️</span><span>❤️</span><span>❤️</span>
                            </div>
                        </div>
                    </div>
                    <div class="memory-date">
                        <span>Special Memory  #${index + 1}</span>
                    </div>
                `;
            } else if (item.type === 'video') {
                itemElement.innerHTML = `
                    <div class="memory-content ${isEven ? 'memory-content-right' : 'memory-content-left'}">
                        <div class="memory-media">
                            <video controls poster="${item.src.replace('.mp4', '-poster.jpg')}">
                                <source src="${item.src}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div class="memory-text">
                            <h3>${item.caption}</h3>
                            <p>${item.description}</p>
                            <div class="memory-hearts">
                                <span>❤️</span><span>❤️</span><span>❤️</span>
                            </div>
                        </div>
                    </div>
                    <div class="memory-date">
                        <span>Special Memory #${index + 1}</span>
                    </div>
                `;
                
                // Add hover effect for videos
                const video = itemElement.querySelector('video');
                if (video) {
                    itemElement.addEventListener('mouseenter', () => {
                        video.play().catch(err => console.log('Video play on hover failed:', err));
                    });
                    
                    itemElement.addEventListener('mouseleave', () => {
                        video.pause();
                    });
                }
            }
            
            specialGrid.appendChild(itemElement);
        });
        
        // Add conclusion
        const memoryConclusion = document.createElement('div');
        memoryConclusion.className = 'memory-story-conclusion';
        memoryConclusion.innerHTML = `
            <div class="memory-divider">
                <span>❤️</span>
                <hr>
                <span>❤️</span>
            </div>
            <h3>Forever and Always</h3>
            <p>These memories are just the beginning of our beautiful journey together. I promise to create many more magical moments with you, to fill our story with love, joy, and endless happiness. Happy 23rd Birthday Shivani.</p>
            <div class="memory-signature">With all my love, Your Forever Person</div>
        `;
        specialContent.appendChild(memoryConclusion);
        
        // Add CSS for memory story
        const styleId = 'memory-story-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                #special-content {
                    display: block;
                    background: linear-gradient(135deg, rgba(255,210,240,0.9), rgba(230,220,255,0.9));
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                }
                
                .memory-story-intro, .memory-story-conclusion {
                    text-align: center;
                    padding: 30px;
                    margin: 20px 0;
                    background: rgba(255,255,255,0.8);
                    border-radius: 20px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
                }
                
                .memory-story-intro h3, .memory-story-conclusion h3 {
                    font-size: 2.2rem;
                    color: var(--primary-color);
                    margin-bottom: 15px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                .memory-story-intro p, .memory-story-conclusion p {
                    font-size: 1.2rem;
                    line-height: 1.8;
                    color: #555;
                    margin-bottom: 20px;
                }
                
                .memory-divider {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 25px 0;
                }
                
                .memory-divider hr {
                    flex: 1;
                    border: none;
                    height: 2px;
                    background: linear-gradient(to right, rgba(255,107,169,0.2), rgba(182,122,255,0.8), rgba(255,107,169,0.2));
                    margin: 0 15px;
                }
                
                .memory-divider span {
                    font-size: 1.5rem;
                    color: var(--primary-color);
                    animation: pulse 1.5s infinite;
                }
                
                .memory-story-container {
                    position: relative;
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 20px 0;
                }
                
                .memory-story-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 50%;
                    width: 3px;
                    background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
                    transform: translateX(-50%);
                }
                
                .memory-story-item {
                    position: relative;
                    margin-bottom: 50px;
                    width: 45%;
                    opacity: 0;
                    transform: translateY(30px);
                    animation: memoryFadeIn 0.8s ease forwards;
                }
                
                @keyframes memoryFadeIn {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .memory-story-item.memory-right {
                    margin-left: auto;
                }
                
                .memory-story-item::before {
                    content: '';
                    position: absolute;
                    top: 20px;
                    width: 20px;
                    height: 20px;
                    background-color: var(--accent-color);
                    border-radius: 50%;
                    box-shadow: 0 0 10px rgba(255,217,92,0.8);
                    z-index: 1;
                }
                
                .memory-story-item.memory-left::before {
                    right: -10px;
                }
                
                .memory-story-item.memory-right::before {
                    left: -10px;
                }
                
                .memory-content {
                    background: white;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    display: flex;
                    flex-direction: column;
                }
                
                .memory-media {
                    width: 100%;
                    overflow: hidden;
                    border-radius: 15px 15px 0 0;
                }
                
                .memory-media img, .memory-media video {
                    width: 100%;
                    display: block;
                    transition: transform 0.5s ease;
                }
                
                .memory-content:hover .memory-media img,
                .memory-content:hover .memory-media video {
                    transform: scale(1.05);
                }
                
                .memory-text {
                    padding: 20px;
                    text-align: center;
                }
                
                .memory-text h3 {
                    color: var(--primary-color);
                    margin-bottom: 10px;
                    font-size: 1.5rem;
                }
                
                .memory-text p {
                    line-height: 1.7;
                    color: #555;
                    margin-bottom: 15px;
                }
                
                .memory-date {
                    position: absolute;
                    top: 0;
                    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
                    color: white;
                    padding: 8px 15px;
                    border-radius: 30px;
                    font-size: 0.9rem;
                    font-weight: bold;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                
                .memory-left .memory-date {
                    right: -110px;
                }
                
                .memory-right .memory-date {
                    left: -110px;
                }
                
                .memory-hearts {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 15px;
                }
                
                .memory-hearts span {
                    display: inline-block;
                    animation: heartbeat 1.5s infinite;
                }
                
                .memory-hearts span:nth-child(2) {
                    animation-delay: 0.5s;
                }
                
                .memory-hearts span:nth-child(3) {
                    animation-delay: 1s;
                }
                
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                }
                
                .memory-signature {
                    font-style: italic;
                    font-size: 1.1rem;
                    margin-top: 15px;
                    color: var(--primary-color);
                }
                
                /* Responsive design for memory story */
                @media (max-width: 768px) {
                    .memory-story-container::before {
                        left: 30px;
                    }
                    
                    .memory-story-item {
                        width: 85%;
                        margin-left: auto !important;
                    }
                    
                    .memory-story-item.memory-left::before,
                    .memory-story-item.memory-right::before {
                        left: -22px;
                        right: auto;
                    }
                    
                    .memory-left .memory-date,
                    .memory-right .memory-date {
                        left: 15px;
                        top: -40px;
                        right: auto;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add staggered animation delay to each memory item
        const items = document.querySelectorAll('.memory-story-item');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
        });

        // Play romantic music when special section is unlocked
        playRomanticMusic();
        
        // Remove old lightbox initialization in favor of click-to-zoom on images
        document.querySelectorAll('.memory-media img').forEach(img => {
            img.addEventListener('click', function() {
                const src = this.src;
                const caption = this.closest('.memory-content').querySelector('h3').textContent;
                
                // Create or get lightbox
                let lightbox = document.querySelector('.memory-lightbox');
                if (!lightbox) {
                    lightbox = document.createElement('div');
                    lightbox.className = 'lightbox memory-lightbox';
                    lightbox.innerHTML = `
                        <div class="lightbox-content">
                            <span class="close-lightbox">&times;</span>
                            <img class="lightbox-image">
                            <div class="lightbox-caption"></div>
                        </div>
                    `;
                    document.body.appendChild(lightbox);
                    
                    // Add close functionality
                    lightbox.addEventListener('click', function(e) {
                        if (e.target === lightbox || e.target.className === 'close-lightbox') {
                            lightbox.classList.remove('active');
                        }
                    });
                }
                
                // Set image and caption
                lightbox.querySelector('.lightbox-image').src = src;
                lightbox.querySelector('.lightbox-caption').textContent = caption;
                
                // Show lightbox
                lightbox.classList.add('active');
            });
        });
    }
    
    function playRomanticMusic() {
        // Create a special audio element for romantic music
        const romanticAudio = document.createElement('audio');
        romanticAudio.volume = 0.4;
        romanticAudio.loop = true;
        romanticAudio.id = 'romantic-audio';
        
        // Check if background music is playing and pause it
        const backgroundMusic = document.getElementById('background-music');
        if (backgroundMusic && !backgroundMusic.paused) {
            backgroundMusic.pause();
            
            // Update music toggle button
            const musicToggle = document.querySelector('.music-toggle');
            if (musicToggle) {
                musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Birthday Music</span>';
                musicToggle.classList.remove('playing');
            }
        }
        
        // Add special music player for the romantic music
        const specialMusicPlayer = document.createElement('div');
        specialMusicPlayer.className = 'music-player special-music-player';
        specialMusicPlayer.innerHTML = `
            <button class="music-toggle romantic-toggle"><i class="fas fa-heart"></i></button>
            <div class="track-info">
                <div class="track-name">Romantic Music</div>
            </div>
        `;
        
        document.body.appendChild(specialMusicPlayer);
        document.body.appendChild(romanticAudio);
        
        // Play romantic music using AudioManager if available
        if (window.AudioManager) {
            AudioManager.playTrack('specialMemoryUnlock', true);
            updateTrackInfo('Special Memory Music');
            showAudioController();
        } else {
            // Fallback if AudioManager is not available
            romanticAudio.play();
        }
        
        // Add toggle functionality
        const romanticToggle = document.querySelector('.romantic-toggle');
        let isRomanticPlaying = true;
        
        romanticToggle.addEventListener('click', function() {
            if (isRomanticPlaying) {
                if (window.AudioManager) {
                    AudioManager.pauseTrack('specialMemoryUnlock');
                    hideAudioController();
                } else {
                    romanticAudio.pause();
                }
                romanticToggle.innerHTML = '<i class="fas fa-heart-broken"></i>';
            } else {
                if (window.AudioManager) {
                    AudioManager.playTrack('specialMemoryUnlock', true);
                    showAudioController();
                    updateTrackInfo('Special Memory Music');
                } else {
                    romanticAudio.play();
                }
                romanticToggle.innerHTML = '<i class="fas fa-heart"></i>';
            }
            
            isRomanticPlaying = !isRomanticPlaying;
        });
    }
}

// Scroll Animation
function initScrollAnimation() {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        // Make navbar background solid when scrolling
        if (scrollPosition > 50) {
            nav.style.background = 'rgba(255, 255, 255, 1)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.9)';
        }
        
        // Animate sections when scrolling into view
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition > sectionTop - window.innerHeight + 200 && 
                scrollPosition < sectionTop + sectionHeight) {
                section.classList.add('fade-in');
                
                // Animate cards in the wishes section
                if (section.id === 'wishes') {
                    wishCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.querySelector('.wish-content').style.animationDelay = `${index * 0.2}s`;
                            card.querySelector('.wish-content').style.animationPlayState = 'running';
                        }, index * 200);
                    });
                }
                
                // Animate memory cards in the gallery section
                if (section.id === 'gallery') {
                    memoryCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(30px)';
                            card.style.transition = 'all 0.8s ease';
                            
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 100);
                        }, index * 200);
                    });
                }
            }
        });
    });
}

// Confetti Animation
function startConfetti() {
    confettiInterval = setInterval(() => {
        createConfetti();
    }, 300);
    
    // Stop confetti after 10 seconds to save resources
    setTimeout(() => {
        clearInterval(confettiInterval);
    }, 10000);
}

// Initialize Games
function initGames() {
    const playButtons = document.querySelectorAll('.play-btn');
    const gameArea = document.getElementById('game-area');
    const closeButtons = document.querySelectorAll('.close-game');
    
    // Game templates
    const puzzleTemplate = document.getElementById('puzzle-template');
    const memoryTemplate = document.getElementById('memory-template');
    const quizTemplate = document.getElementById('quiz-template');
    
    // Add event listeners to play buttons
    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gameType = button.getAttribute('data-game');
            gameArea.classList.remove('hidden');
            
            // Clear previous game
            gameArea.innerHTML = '';
            
            // Load appropriate game
            switch(gameType) {
                case 'puzzle':
                    gameArea.appendChild(puzzleTemplate.content.cloneNode(true));
                    initPuzzleGame();
                    break;
                case 'memory':
                    gameArea.appendChild(memoryTemplate.content.cloneNode(true));
                    initMemoryGame();
                    break;
                case 'quiz':
                    gameArea.appendChild(quizTemplate.content.cloneNode(true));
                    initQuizGame();
                    break;
            }
            
            // Add close button functionality
            const closeButton = gameArea.querySelector('.close-game');
            closeButton.addEventListener('click', () => {
                gameArea.classList.add('hidden');
            });
        });
    });
}

// Puzzle Game
function initPuzzleGame() {
    const puzzleBoard = document.querySelector('.puzzle-board');
    const image = new Image();
    image.src = 'assests/best walpaper of shivnai.jpg';
    
    image.onload = function() {
        // Create puzzle pieces
        const pieces = [];
        const pieceWidth = image.width / 3;
        const pieceHeight = image.height / 3;
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const piece = document.createElement('div');
                piece.classList.add('puzzle-piece');
                piece.dataset.row = row;
                piece.dataset.col = col;
                piece.dataset.correctRow = row;
                piece.dataset.correctCol = col;
                
                // Set background image position
                piece.style.backgroundImage = `url(${image.src})`;
                piece.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`;
                piece.style.backgroundSize = `${image.width}px ${image.height}px`;
                
                pieces.push(piece);
            }
        }
        
        // Shuffle pieces
        for (let i = pieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
        }
        
        // Add pieces to board
        pieces.forEach(piece => {
            puzzleBoard.appendChild(piece);
            
            // Make pieces draggable
            piece.draggable = true;
            
            piece.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', `${piece.dataset.row},${piece.dataset.col}`);
            });
            
            piece.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            
            piece.addEventListener('drop', (e) => {
                e.preventDefault();
                const [sourceRow, sourceCol] = e.dataTransfer.getData('text/plain').split(',');
                const targetRow = piece.dataset.row;
                const targetCol = piece.dataset.col;
                
                // Swap pieces
                const sourcePiece = document.querySelector(`.puzzle-piece[data-row="${sourceRow}"][data-col="${sourceCol}"]`);
                
                // Swap positions
                [sourcePiece.dataset.row, piece.dataset.row] = [piece.dataset.row, sourcePiece.dataset.row];
                [sourcePiece.dataset.col, piece.dataset.col] = [piece.dataset.col, sourcePiece.dataset.col];
                
                // Check if puzzle is solved
                checkPuzzleSolved();
            });
        });
    };
    
    // Check if puzzle is solved
    function checkPuzzleSolved() {
        const pieces = document.querySelectorAll('.puzzle-piece');
        let isSolved = true;
        
        pieces.forEach(piece => {
            if (piece.dataset.row !== piece.dataset.correctRow || piece.dataset.col !== piece.dataset.correctCol) {
                isSolved = false;
            }
        });
        
        if (isSolved) {
            setTimeout(() => {
                alert('Congratulations! You solved the puzzle! 🎉');
                startConfetti();
            }, 500);
        }
    }
}

// Memory Game
function initMemoryGame() {
    const memoryBoard = document.querySelector('.memory-board');
    const pairsFoundElement = document.getElementById('pairs-found');
    const movesCountElement = document.getElementById('moves-count');
    
    let pairsFound = 0;
    let movesCount = 0;
    let firstCard = null;
    let secondCard = null;
    let canFlip = true;
    
    // Images for memory game
    const images = [
        'assests/best walpaper of shivnai.jpg',
        'assests/Shivani is Cycling.jpg',
        'assests/Last birthday of shivani.jpg',
        'assests/First Movie at Jabalpur.jpg',
        'assests/Me and Shivani Fun act.jpg',
        'assests/My give git to shivani 1.jpg',
        'assests/cool pic of shivani wtih earning.jpg',
        'assests/Cute face.jpg'
    ];
    
    // Duplicate for pairs
    const cardImages = [...images, ...images];
    
    // Shuffle cards
    for (let i = cardImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardImages[i], cardImages[j]] = [cardImages[j], cardImages[i]];
    }
    
    // Create cards
    cardImages.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card-game');
        card.dataset.cardIndex = index;
        card.dataset.imageUrl = image;
        
        const cardInner = document.createElement('div');
        cardInner.classList.add('memory-card-game-inner');
        
        const cardFront = document.createElement('div');
        cardFront.classList.add('memory-card-game-front');
        cardFront.innerHTML = '<i class="fas fa-birthday-cake"></i>';
        
        const cardBack = document.createElement('div');
        cardBack.classList.add('memory-card-game-back');
        
        const img = document.createElement('img');
        img.src = image;
        img.alt = 'Memory Card';
        
        cardBack.appendChild(img);
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        
        card.addEventListener('click', () => flipCard(card));
        
        memoryBoard.appendChild(card);
    });
    
    function flipCard(card) {
        if (!canFlip) return;
        if (card === firstCard) return;
        
        card.classList.add('flipped');
        
        if (!firstCard) {
            // First card flipped
            firstCard = card;
        } else {
            // Second card flipped
            secondCard = card;
            movesCount++;
            movesCountElement.textContent = movesCount;
            
            // Check for match
            if (firstCard.dataset.imageUrl === secondCard.dataset.imageUrl) {
                // Match found
                pairsFound++;
                pairsFoundElement.textContent = pairsFound;
                
                // Reset selection
                firstCard = null;
                secondCard = null;
                
                // Check if game completed
                if (pairsFound === images.length) {
                    setTimeout(() => {
                        alert('Congratulations! You matched all the pairs! 🎉');
                        startConfetti();
                    }, 500);
                }
            } else {
                // No match
                canFlip = false;
                setTimeout(() => {
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                    
                    // Reset selection
                    firstCard = null;
                    secondCard = null;
                    canFlip = true;
                }, 1000);
            }
        }
    }
}

// Quiz Game
function initQuizGame() {
    const quizContainer = document.querySelector('.quiz-container');
    const questionElement = document.querySelector('.quiz-question');
    const optionsElement = document.querySelector('.quiz-options');
    const resultElement = document.querySelector('.quiz-result');
    const nextButton = document.querySelector('.quiz-next');
    
    // Quiz questions
    const questions = [
        {
            question: "When was Shivani born?",
            options: ["13 May 2002", "15 May 2002", "13 May 2001", "15 May 2001"],
            answer: 0
        },
        {
            question: "What is Shivani's favorite color?",
            options: ["Blue", "Pink", "Purple", "Red"],
            answer: 1
        },
        {
            question: "Where did Shivani and you watch your first movie together?",
            options: ["Delhi", "Mumbai", "Jabalpur", "Pune"],
            answer: 2
        },
        {
            question: "What activity is Shivani doing in one of her photos?",
            options: ["Swimming", "Cycling", "Dancing", "Hiking"],
            answer: 1
        },
        {
            question: "How old is Shivani turning today?",
            options: ["21", "22", "23", "24"],
            answer: 1
        }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    
    // Show question
    function showQuestion() {
        const question = questions[currentQuestion];
        questionElement.textContent = question.question;
        
        // Clear previous options
        optionsElement.innerHTML = '';
        resultElement.textContent = '';
        resultElement.className = 'quiz-result';
        
        // Add options
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('quiz-option');
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            
            optionElement.addEventListener('click', () => selectOption(index));
            
            optionsElement.appendChild(optionElement);
        });
        
        // Hide next button initially
        nextButton.style.display = 'none';
    }
    
    function selectOption(index) {
        // Prevent selecting after answer
        if (resultElement.textContent !== '') return;
        
        const options = document.querySelectorAll('.quiz-option');
        
        // Clear previous selection
        options.forEach(option => option.classList.remove('selected'));
        
        // Select current option
        options[index].classList.add('selected');
        
        // Check answer
        const correct = index === questions[currentQuestion].answer;
        
        if (correct) {
            resultElement.textContent = '✓ Correct!';
            resultElement.classList.add('correct');
            score++;
        } else {
            resultElement.textContent = '✗ Wrong! The correct answer is: ' + 
                questions[currentQuestion].options[questions[currentQuestion].answer];
            resultElement.classList.add('wrong');
        }
        
        // Show next button
        nextButton.style.display = 'inline-block';
    }
    
    // Next question
    nextButton.addEventListener('click', () => {
        currentQuestion++;
        
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            // Quiz completed
            questionElement.textContent = `Quiz completed! Your score: ${score}/${questions.length}`;
            optionsElement.innerHTML = '';
            resultElement.textContent = '';
            nextButton.style.display = 'none';
            
            // Celebrate if good score
            if (score >= 4) {
                startConfetti();
                setTimeout(() => {
                    alert('Great job! You know Shivani very well! 🎉');
                }, 500);
            }
        }
    });
    
    // Start the quiz
    showQuestion();
}

// Init Functions
window.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursorFollower();
    initMusicToggle();
    initScrollAnimation();
    
    // Initialize games and special section
    initGames();
    initSpecialSection();
    initWishes();
    
    // Listen for any audio play events in the document
    document.addEventListener('play', function(e) {
        if (e.target.tagName === 'AUDIO') {
            // Update track info based on audio id or src
            let trackName = 'Music';
            if (e.target.id === 'background-music') {
                trackName = 'Birthday Music';
            } else if (e.target.id === 'romantic-audio') {
                trackName = 'Romantic Music';
            } else if (e.target.src) {
                // Extract filename from src
                const urlParts = e.target.src.split('/');
                trackName = urlParts[urlParts.length - 1].split('.')[0];
            }
            
            updateTrackInfo(trackName);
            showAudioController();
        }
    }, true);
    
    // Hide controller when audio is paused or ended
    document.addEventListener('pause', function(e) {
        if (e.target.tagName === 'AUDIO') {
            // Don't hide if other audio is still playing
            const allAudio = document.querySelectorAll('audio');
            let stillPlaying = false;
            
            allAudio.forEach(audio => {
                if (!audio.paused && audio !== e.target) {
                    stillPlaying = true;
                }
            });
            
            if (!stillPlaying) {
                hideAudioController();
            }
        }
    }, true);
    
    document.addEventListener('ended', function(e) {
        if (e.target.tagName === 'AUDIO') {
            // Same check as for pause
            const allAudio = document.querySelectorAll('audio');
            let stillPlaying = false;
            
            allAudio.forEach(audio => {
                if (!audio.paused && audio !== e.target) {
                    stillPlaying = true;
                }
            });
            
            if (!stillPlaying) {
                hideAudioController();
            }
        }
    }, true);
}); 