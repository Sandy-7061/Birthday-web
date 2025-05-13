// Initialize the photo gallery when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load photos for gallery
    loadGalleryPhotos();
    
    // Initialize special content and wish cards
    initializeSpecialContent();
    initializeWishCards();
    
    // Initialize section dots and header scroll behavior
    createSectionDots();
    setupScrollHeader();
});

// Load photos for gallery
function loadGalleryPhotos() {
    const galleryContainer = document.querySelector('.gallery-container');
    
    // List of all photos with captions
    const photos = [
        {
            src: 'assests/best walpaper of shivnai.jpg',
            title: 'Beautiful Shivani',
            description: 'A gorgeous portrait capturing her radiant smile'
        },
        {
            src: 'assests/Cute face.jpg',
            title: 'Cute Moments',
            description: 'When her cute expressions melt my heart'
        },
        {
            src: 'assests/Hot shivani.jpg',
            title: 'Stunning Beauty',
            description: 'Looking absolutely gorgeous in this picture'
        },
        {
            src: 'assests/cool pic of shivani wtih earning.jpg',
            title: 'Stylish Look',
            description: 'Those beautiful earrings complement her perfectly'
        },
        {
            src: 'assests/Last birthday of shivani.jpg',
            title: 'Last Birthday',
            description: 'Celebrating her 21st birthday with joy'
        },
        {
            src: 'assests/School pic of Shivani.jpg',
            title: 'School Days',
            description: 'Sweet memories from her school days'
        },
        {
            src: 'assests/Shivani Shadow image.jpg',
            title: 'Silhouette',
            description: 'A beautiful silhouette capturing her grace'
        },
        {
            src: 'assests/Shivani is Cycling.jpg',
            title: 'Cycling Adventure',
            description: 'Enjoying the outdoors on a sunny day'
        },
        {
            src: 'assests/First Movie at Jabalpur.jpg',
            title: 'First Movie Date',
            description: 'Our first movie together in Jabalpur'
        },
        {
            src: 'assests/Me and Shivani Fun act.jpg',
            title: 'Fun Together',
            description: 'Creating silly memories together'
        },
        {
            src: 'assests/My give git to shivani 1.jpg',
            title: 'Special Gift',
            description: 'The moment I gave her a special gift'
        },
        {
            src: 'assests/Shivani wtih taddey 1.jpg',
            title: 'Teddy Love',
            description: 'Her happiness with the teddy bear gift'
        }
    ];
    
    // Create gallery items
    photos.forEach(photo => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        galleryItem.innerHTML = `
            <div class="gallery-card">
                <div class="gallery-front">
                    <img src="${photo.src}" alt="${photo.title}">
                </div>
                <div class="gallery-back">
                    <h3>${photo.title}</h3>
                    <p>${photo.description}</p>
                </div>
            </div>
        `;
        
        galleryContainer.appendChild(galleryItem);
    });
    
    // Initialize lightbox for gallery items
    initializeLightbox();
}

// Initialize lightbox for gallery
function initializeLightbox() {
    // Create lightbox if it doesn't exist
    if (!document.querySelector('.lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close-lightbox">&times;</span>
                <img class="lightbox-image">
                <div class="lightbox-caption"></div>
                <button class="lightbox-prev">&lt;</button>
                <button class="lightbox-next">&gt;</button>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Get all gallery images
        const galleryImages = document.querySelectorAll('.gallery-front img');
        let currentIndex = 0;
        
        // Add click event to open lightbox
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                currentIndex = index;
                const caption = this.closest('.gallery-card').querySelector('.gallery-back h3').textContent;
                const description = this.closest('.gallery-card').querySelector('.gallery-back p').textContent;
                openLightbox(this.src, `${caption}: ${description}`);
            });
        });
        
        // Lightbox functions
        function openLightbox(src, caption) {
            const lightboxImg = document.querySelector('.lightbox-image');
            const lightboxCaption = document.querySelector('.lightbox-caption');
            
            lightboxImg.src = src;
            lightboxCaption.textContent = caption;
            lightbox.classList.add('active');
        }
        
        // Close lightbox
        document.querySelector('.close-lightbox').addEventListener('click', function() {
            lightbox.classList.remove('active');
        });
        
        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
        
        // Navigate through images
        document.querySelector('.lightbox-next').addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            const nextImg = galleryImages[currentIndex];
            const nextCard = nextImg.closest('.gallery-card');
            const caption = nextCard.querySelector('.gallery-back h3').textContent;
            const description = nextCard.querySelector('.gallery-back p').textContent;
            openLightbox(nextImg.src, `${caption}: ${description}`);
        });
        
        document.querySelector('.lightbox-prev').addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            const prevImg = galleryImages[currentIndex];
            const prevCard = prevImg.closest('.gallery-card');
            const caption = prevCard.querySelector('.gallery-back h3').textContent;
            const description = prevCard.querySelector('.gallery-back p').textContent;
            openLightbox(prevImg.src, `${caption}: ${description}`);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'ArrowRight') {
                    document.querySelector('.lightbox-next').click();
                } else if (e.key === 'ArrowLeft') {
                    document.querySelector('.lightbox-prev').click();
                } else if (e.key === 'Escape') {
                    lightbox.classList.remove('active');
                }
            }
        });
    }
}

// Initialize special content section
function initializeSpecialContent() {
    // Password check function
    window.checkPassword = function() {
        const password = document.getElementById('special-password').value;
        const specialContent = document.getElementById('special-content');
        
        if (password === '07092023') {
            specialContent.classList.remove('hidden');
            loadSpecialContent();
            
            // Add celebration effect
            createCelebration();
            
            // Scroll to content
            setTimeout(() => {
                specialContent.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        } else {
            alert('Incorrect password. Hint: Try Shivani\'s birthdate in DDMMYYYY format.');
            
            // Shake effect for wrong password
            const passwordInput = document.getElementById('special-password');
            passwordInput.classList.add('shake-animation');
            setTimeout(() => {
                passwordInput.classList.remove('shake-animation');
            }, 500);
        }
    };
    
    // Create celebration effect
    function createCelebration() {
        const specialSection = document.querySelector('.special-section');
        
        // Create fireworks
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.left = `${Math.random() * 100}%`;
                firework.style.top = `${Math.random() * 100}%`;
                
                specialSection.appendChild(firework);
                
                // Remove firework after animation
                setTimeout(() => {
                    firework.remove();
                }, 1000);
            }, i * 300);
        }
        
        // Add firework animation style
        if (!document.getElementById('firework-style')) {
            const style = document.createElement('style');
            style.id = 'firework-style';
            style.textContent = `
                .firework {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: radial-gradient(circle, var(--primary-color), var(--secondary-color));
                    animation: firework 1s ease-out forwards;
                    z-index: 10;
                }
                
                @keyframes firework {
                    0% {
                        transform: scale(0.1);
                        opacity: 1;
                        box-shadow: 0 0 0 0px rgba(255, 107, 169, 0.5);
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                        box-shadow: 0 0 0 50px rgba(255, 107, 169, 0);
                    }
                }
                
                .shake-animation {
                    animation: shake 0.5s ease-in-out;
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-5px); }
                    40%, 80% { transform: translateX(5px); }
                }
                
                .hidden {
                    display: none;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Load special content
    function loadSpecialContent() {
        const specialContent = document.getElementById('special-content');
        
        // Clear existing content
        specialContent.innerHTML = '';
        
        // Special photos and videos with captions
        const specialMedia = [
            {
                type: 'image',
                src: 'assests/Password/Special pic of Shivni.jpg',
                title: 'Our Special Moment',
                description: 'A treasured memory that will forever be etched in my heart. Your smile in this picture makes my world brighter.'
            },
            {
                type: 'image',
                src: 'assests/Password/more special pic of shivani.jpg',
                title: 'My Precious',
                description: 'This beautiful smile is the reason for my happiness every day. You light up my world in ways no one else can.'
            },
            {
                type: 'video',
                src: 'assests/Password/video personal.mp4',
                title: 'Our Little Secret',
                description: 'A special video that captures our beautiful bond. Every moment with you feels like a dream come true.'
            }
        ];
        
        // Create special content items with staggered animation
        specialMedia.forEach((item, index) => {
            const specialItem = document.createElement('div');
            specialItem.className = 'special-item';
            specialItem.style.animationDelay = `${index * 0.2}s`;
            
            if (item.type === 'image') {
                specialItem.innerHTML = `
                    <img src="${item.src}" alt="${item.title}">
                    <div class="special-caption">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <div class="special-hearts">
                            <span>❤️</span><span>❤️</span><span>❤️</span>
                        </div>
                    </div>
                `;
            } else if (item.type === 'video') {
                specialItem.innerHTML = `
                    <video controls loop>
                        <source src="${item.src}" type="video/mp4">
                    </video>
                    <div class="special-caption">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <div class="special-hearts">
                            <span>❤️</span><span>❤️</span><span>❤️</span>
                        </div>
                    </div>
                `;
                
                // Add autoplay on hover
                const video = specialItem.querySelector('video');
                specialItem.addEventListener('mouseenter', () => {
                    video.play();
                });
                specialItem.addEventListener('mouseleave', () => {
                    video.pause();
                });
            }
            
            specialContent.appendChild(specialItem);
        });
        
        // Add style for special hearts
        if (!document.getElementById('special-hearts-style')) {
            const style = document.createElement('style');
            style.id = 'special-hearts-style';
            style.textContent = `
                .special-hearts {
                    margin-top: 15px;
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                }
                
                .special-hearts span {
                    display: inline-block;
                    animation: heartbeat 1.5s infinite;
                }
                
                .special-hearts span:nth-child(2) {
                    animation-delay: 0.5s;
                }
                
                .special-hearts span:nth-child(3) {
                    animation-delay: 1s;
                }
                
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize wish cards
function initializeWishCards() {
    const wishesContainer = document.querySelector('.wishes-container');
    
    // Birthday wishes
    const wishes = [
        "Happy Birthday Shivani! Your smile brightens everyone's day!",
        "Wishing you a day filled with happiness and a year filled with joy!",
        "May your special day be surrounded by happiness, filled with laughter, wrapped with pleasure, and decorated with love!",
        "Happy 23rd Birthday! May this year bring new adventures and opportunities!",
        "On your birthday, I wish you abundant happiness and love!",
        "May your birthday be as special as you are!",
        "Sending you smiles for every moment of your special day!",
        "Happy Birthday to the most amazing person I know!",
        "Warmest wishes on your 23rd birthday. May your day be filled with happiness and your year with joy!"
    ];
    
    // Create and animate wish cards
    wishes.forEach((wish, index) => {
        setTimeout(() => {
            const wishCard = document.createElement('div');
            wishCard.className = 'wish-card';
            wishCard.textContent = wish;
            wishCard.style.animationDelay = `${index * 1.5}s`; // Stagger the animations
            
            // Set random positions
            wishCard.style.left = `${Math.random() * 60 + 20}%`;
            
            wishesContainer.appendChild(wishCard);
            
            // Remove card after animation completes
            wishCard.addEventListener('animationend', () => {
                wishCard.remove();
                
                // Add the card back to keep the animation going
                setTimeout(() => {
                    wishesContainer.appendChild(wishCard);
                }, wishes.length * 1500 - 500);
            });
        }, index * 1500);
    });
}

// Create section dots
function createSectionDots() {
    const sections = document.querySelectorAll('section');
    const dotsContainer = document.querySelector('.section-dots');
    
    if (!dotsContainer) return;
    
    // Clear existing dots
    dotsContainer.innerHTML = '';
    
    sections.forEach((section, index) => {
        const dot = document.createElement('div');
        dot.className = 'section-dot';
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            section.scrollIntoView({ behavior: 'smooth' });
        });
        
        dotsContainer.appendChild(dot);
    });
    
    // Update active dot on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const dots = document.querySelectorAll('.section-dot');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                dots.forEach(dot => dot.classList.remove('active'));
                if (dots[index]) dots[index].classList.add('active');
            }
        });
    });
}

// Setup scroll header
function setupScrollHeader() {
    const scrollHeader = document.querySelector('.scrollable-header');
    
    if (!scrollHeader) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollHeader.classList.add('visible');
        } else {
            scrollHeader.classList.remove('visible');
        }
    });
} 