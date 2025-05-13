// Animation.js - Handles birthday canvas animation and cursor follower

document.addEventListener('DOMContentLoaded', function() {
    // Initialize custom cursor
    initCustomCursor();
    
    // Initialize birthday canvas
    initBirthdayCanvas();
    
    // Initialize music player
    initMusicPlayer();
});

// Custom cursor functionality
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', function(e) {
        // Update cursor position
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        
        // Add slight delay to follower for smooth effect
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
    });
    
    // Change cursor appearance on clickable elements
    const clickables = document.querySelectorAll('a, button, .gallery-card, .game-card, .play-btn');
    
    clickables.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorFollower.classList.add('active');
        });
        
        element.addEventListener('mouseleave', () => {
            cursorFollower.classList.remove('active');
        });
    });
    
    // Handle cursor visibility when leaving/entering window
    document.addEventListener('mouseout', () => {
        cursorDot.style.display = 'none';
        cursorFollower.style.display = 'none';
    });
    
    document.addEventListener('mouseover', () => {
        cursorDot.style.display = 'block';
        cursorFollower.style.display = 'block';
    });
    
    // Hide cursor on touch devices
    if ('ontouchstart' in window) {
        cursorDot.style.display = 'none';
        cursorFollower.style.display = 'none';
        document.body.style.cursor = 'auto';
    }
}

// Birthday canvas animation
function initBirthdayCanvas() {
    const canvas = document.querySelector('.birthday-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Create particles
    const particles = [];
    const colors = ['#ff6ba9', '#b67aff', '#ffd95c', '#ff9cda', '#b28eff'];
    const shapes = ['circle', 'heart', 'star', 'cake'];
    
    // Create heart shape
    function drawHeart(ctx, x, y, size) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.scale(size, size);
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-0.5, -0.3, -1, 0.1, 0, 0.5);
        ctx.bezierCurveTo(1, 0.1, 0.5, -0.3, 0, 0);
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fill();
        ctx.restore();
    }
    
    // Create star shape
    function drawStar(ctx, x, y, size) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.scale(size, size);
        
        for (let i = 0; i < 5; i++) {
            ctx.rotate(Math.PI / 5);
            ctx.lineTo(0, -1);
            ctx.rotate(Math.PI / 5);
            ctx.lineTo(0, -0.4);
        }
        
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fill();
        ctx.restore();
    }
    
    // Create cake shape
    function drawCake(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size, size);
        
        // Cake base
        ctx.fillStyle = colors[0];
        ctx.fillRect(-0.5, -0.2, 1, 0.5);
        
        // Cake top
        ctx.fillStyle = colors[1];
        ctx.fillRect(-0.4, -0.4, 0.8, 0.2);
        
        // Candle
        ctx.fillStyle = colors[2];
        ctx.fillRect(-0.05, -0.7, 0.1, 0.3);
        
        // Flame
        ctx.beginPath();
        ctx.arc(0, -0.7, 0.1, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        
        ctx.restore();
    }
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.size = Math.random() * 10 + 5;
            this.speedY = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.shape = shapes[Math.floor(Math.random() * shapes.length)];
            this.rotation = 0;
            this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        }
        
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            
            // Reset if out of screen
            if (this.y < -this.size * 2) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            switch(this.shape) {
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                    break;
                    
                case 'heart':
                    drawHeart(ctx, 0, 0, this.size / 10);
                    break;
                    
                case 'star':
                    drawStar(ctx, 0, 0, this.size / 10);
                    break;
                    
                case 'cake':
                    drawCake(ctx, 0, 0, this.size / 5);
                    break;
            }
            
            ctx.restore();
        }
    }
    
    // Initialize particles
    function initParticles() {
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    initParticles();
    animate();
}

// Music player functionality
function initMusicPlayer() {
    const musicToggle = document.querySelector('.music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    let isPlaying = false;
    
    // Toggle music play/pause
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            backgroundMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            musicToggle.classList.remove('playing');
        } else {
            backgroundMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            musicToggle.classList.add('playing');
        }
        
        isPlaying = !isPlaying;
    });
    
    // List of birthday songs
    const birthdaySongs = [
        {
            name: "Happy Birthday Song",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        },
        {
            name: "Birthday Party",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        },
        {
            name: "Celebration Music",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
        }
    ];
    
    // Change song every minute
    let currentSongIndex = 0;
    
    function changeSong() {
        currentSongIndex = (currentSongIndex + 1) % birthdaySongs.length;
        const newSong = birthdaySongs[currentSongIndex];
        
        backgroundMusic.src = newSong.url;
        document.querySelector('.track-name').textContent = newSong.name;
        
        if (isPlaying) {
            backgroundMusic.play();
        }
    }
    
    // Set initial song
    document.querySelector('.track-name').textContent = birthdaySongs[currentSongIndex].name;
    
    // Change song periodically
    setInterval(changeSong, 60000);
    
    // Show track info on hover
    const musicPlayer = document.querySelector('.music-player');
    const trackInfo = document.querySelector('.track-info');
    
    musicPlayer.addEventListener('mouseenter', function() {
        trackInfo.style.display = 'block';
    });
    
    musicPlayer.addEventListener('mouseleave', function() {
        if (!isPlaying) {
            trackInfo.style.display = 'none';
        }
    });
} 