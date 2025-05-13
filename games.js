// Initialize games when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    setupGameLaunchers();
});

// Set up game launchers
function setupGameLaunchers() {
    // Get modal elements
    const modal = document.getElementById('game-modal');
    const gameContainer = document.getElementById('game-container');
    const closeBtn = document.querySelector('.close-modal');
    
    // Set up event listeners for game buttons
    document.querySelectorAll('.play-btn').forEach(button => {
        button.addEventListener('click', function() {
            const gameType = this.parentElement.id;
            openGameModal(gameType);
        });
    });
    
    // Close modal when clicking the X
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        
        // Stop any game music and return to background music if music is on
        if (window.AudioManager) {
            AudioManager.stopTrack('puzzleGame');
            AudioManager.stopTrack('memoryGame');
            
            // Return to background music if music toggle is playing
            if (document.querySelector('.music-toggle.playing')) {
                AudioManager.playTrack('backgroundMusic', true);
            }
        }
    });
    
    // Close modal when clicking outside the content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            
            // Stop any game music and return to background music if music is on
            if (window.AudioManager) {
                AudioManager.stopTrack('puzzleGame');
                AudioManager.stopTrack('memoryGame');
                
                // Return to background music if music toggle is playing
                if (document.querySelector('.music-toggle.playing')) {
                    AudioManager.playTrack('backgroundMusic', true);
                }
            }
        }
    });
    
    // Open game modal and load the selected game
    function openGameModal(gameType) {
        gameContainer.innerHTML = '';
        
        // Prepare to transition audio
        if (window.AudioManager && AudioManager.currentTrack === 'backgroundMusic') {
            // We'll stop the background music when the specific game music starts
            // Each game function will handle this
        }
        
        switch(gameType) {
            case 'puzzle-game':
                loadPuzzleGame();
                break;
            case 'memory-game':
                loadMemoryGame();
                break;
            case 'quiz-game':
                loadQuizGame();
                break;
            case 'balloon-game-card':
                // Close the modal since balloon game uses its own UI
                modal.style.display = 'none';
                // Start balloon game
                startBalloonGame();
                return; // Return early to avoid showing the modal
        }
        
        modal.style.display = 'block';
    }
}

// Load the puzzle game
function loadPuzzleGame() {
    const gameContainer = document.getElementById('game-container');
    
    // Create game UI
    gameContainer.innerHTML = `
        <h2>Birthday Puzzle</h2>
        <p>Drag and arrange the pieces to complete Shivani's photo!</p>
        <div class="puzzle-controls">
            <button id="start-puzzle">Start Game</button>
            <select id="puzzle-difficulty">
                <option value="3">Easy (3x3)</option>
                <option value="4" selected>Medium (4x4)</option>
                <option value="5">Hard (5x5)</option>
            </select>
            <select id="puzzle-image">
                <option value="assests/best walpaper of shivnai.jpg">Beautiful Shivani</option>
                <option value="assests/Hot shivani.jpg">Gorgeous Shivani</option>
                <option value="assests/cool pic of shivani wtih earning.jpg">Stylish Shivani</option>
                <option value="assests/Cute face.jpg">Cute Shivani</option>
            </select>
        </div>
        <div class="puzzle-container">
            <div class="puzzle-game-area">
                <div class="puzzle-board"></div>
                <div class="puzzle-stats">
                    <p>Moves: <span id="puzzle-moves">0</span></p>
                    <p>Time: <span id="puzzle-time">00:00</span></p>
                </div>
            </div>
            <div class="puzzle-preview">
                <h3>Preview</h3>
                <img id="puzzle-preview-img" src="assests/best walpaper of shivnai.jpg" alt="Puzzle Preview">
                <div class="puzzle-instructions">
                    <h4>How to play:</h4>
                    <p>Click on a piece next to the empty space to move it. Arrange all pieces to complete the picture.</p>
                    <p>The faster you solve with fewer moves, the better your score!</p>
                </div>
            </div>
        </div>
    `;
    
    // Add CSS for puzzle game
    addGameStyles('puzzle');
    
    // Update preview when selecting different image
    document.getElementById('puzzle-image').addEventListener('change', function() {
        const selectedImage = this.value;
        document.getElementById('puzzle-preview-img').src = selectedImage;
    });
    
    // Initialize puzzle game
    document.getElementById('start-puzzle').addEventListener('click', function() {
        const difficulty = parseInt(document.getElementById('puzzle-difficulty').value);
        const selectedImage = document.getElementById('puzzle-image').value;
        startPuzzleGame(difficulty, selectedImage);
    });
}

// Start puzzle game with selected difficulty
function startPuzzleGame(size = 4, imageSrc = 'assests/best walpaper of shivnai.jpg') {
    const puzzleBoard = document.querySelector('.puzzle-board');
    puzzleBoard.innerHTML = '';
    puzzleBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    
    // Play puzzle game music
    if (window.AudioManager) {
        // Stop any current track before playing puzzle game music
        if (AudioManager.currentTrack) {
            AudioManager.stopTrack(AudioManager.currentTrack);
        }
        AudioManager.playTrack('puzzleGame', true);
    }
    
    // Load the selected image
    const image = new Image();
    image.src = imageSrc;
    
    image.onload = function() {
        // Create puzzle pieces
        const pieces = [];
        for (let i = 0; i < size * size; i++) {
            pieces.push(i);
        }
        
        // Remove the last piece (empty space)
        const emptyIndex = pieces.pop();
        
        // Shuffle pieces
        shuffleArray(pieces);
        pieces.push(emptyIndex); // Add empty space back at the end
        
        // Create the puzzle board
        pieces.forEach((piece, index) => {
            const pieceElement = document.createElement('div');
            pieceElement.className = 'puzzle-piece';
            pieceElement.dataset.index = index;
            
            if (piece < size * size - 1) {
                pieceElement.style.backgroundImage = `url('${imageSrc}')`;
                pieceElement.style.backgroundSize = `${size * 100}% ${size * 100}%`;
                
                const row = Math.floor(piece / size);
                const col = piece % size;
                pieceElement.style.backgroundPosition = `-${col * 100}% -${row * 100}%`;
                
                pieceElement.addEventListener('click', function() {
                    movePuzzlePiece(this, size);
                });
            } else {
                pieceElement.className += ' empty-piece';
            }
            
            puzzleBoard.appendChild(pieceElement);
        });
        
        // Start timer
        let moves = 0;
        let seconds = 0;
        const movesElement = document.getElementById('puzzle-moves');
        const timeElement = document.getElementById('puzzle-time');
        
        const timer = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timeElement.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
        
        // Move puzzle piece function
        function movePuzzlePiece(piece, size) {
            const index = parseInt(piece.dataset.index);
            const emptyPiece = document.querySelector('.empty-piece');
            const emptyIndex = parseInt(emptyPiece.dataset.index);
            
            // Check if the piece is adjacent to the empty space
            const isAdjacent = (
                (Math.abs(index - emptyIndex) === 1 && Math.floor(index / size) === Math.floor(emptyIndex / size)) || 
                (Math.abs(index - emptyIndex) === size)
            );
            
            if (isAdjacent) {
                // Swap piece with empty space
                const tempBackground = piece.style.backgroundImage;
                const tempPosition = piece.style.backgroundPosition;
                
                piece.style.backgroundImage = '';
                piece.style.backgroundPosition = '';
                piece.classList.add('empty-piece');
                
                emptyPiece.style.backgroundImage = tempBackground;
                emptyPiece.style.backgroundPosition = tempPosition;
                emptyPiece.classList.remove('empty-piece');
                
                // Update move counter
                moves++;
                movesElement.textContent = moves;
                
                // Check if puzzle is solved
                checkPuzzleSolution(size);
            }
        }
        
        // Check if puzzle is solved
        function checkPuzzleSolution(size) {
            const pieces = document.querySelectorAll('.puzzle-piece:not(.empty-piece)');
            let solved = true;
            
            pieces.forEach((piece, index) => {
                const row = Math.floor(index / size);
                const col = index % size;
                const expectedPosition = `-${col * 100}% -${row * 100}%`;
                
                if (piece.style.backgroundPosition !== expectedPosition) {
                    solved = false;
                }
            });
            
            if (solved) {
                clearInterval(timer);
                
                // Play success sound
                if (window.AudioManager) {
                    // Don't stop the puzzle game music here - just play the unlock sound on top
                    AudioManager.playTrack('specialMemoryUnlock');
                }
                
                // Show victory message
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'game-confetti';
                    gameContainer.appendChild(confetti);
                    
                    for (let i = 0; i < 100; i++) {
                        createConfettiPiece(confetti);
                    }
                    
                    // Add confetti animation
                    const style = document.createElement('style');
                    style.textContent = `
                        .game-confetti {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            pointer-events: none;
                            z-index: 10;
                        }
                        .confetti-piece {
                            position: absolute;
                            animation: confettiFall linear forwards;
                        }
                        @keyframes confettiFall {
                            0% {
                                transform: translateY(-10px) rotate(0);
                                opacity: 1;
                            }
                            100% {
                                transform: translateY(100vh) rotate(360deg);
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                    
                    // Show message
                    alert(`Congratulations! You solved the puzzle in ${moves} moves and ${timeElement.textContent}!`);
                    
                    // Remove confetti after 5 seconds
                    setTimeout(() => {
                        if (confetti.parentNode) {
                            confetti.parentNode.removeChild(confetti);
                        }
                    }, 5000);
                }, 500);
            }
        }
        
        function createConfettiPiece(container) {
            const colors = ['#ff6ba9', '#b67aff', '#ffd95c', '#ff9cda', '#b28eff'];
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.width = `${size}px`;
            piece.style.height = `${size}px`;
            piece.style.backgroundColor = color;
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            piece.style.animationDuration = `${Math.random() * 3 + 2}s`;
            
            container.appendChild(piece);
        }
    };
}

// Load the memory game
function loadMemoryGame() {
    const gameContainer = document.getElementById('game-container');
    
    // Create game UI
    gameContainer.innerHTML = `
        <h2>Memory Match Challenge</h2>
        <p>Find all matching pairs of Shivani's photos!</p>
        <div class="memory-controls">
            <button id="start-memory">Start Game</button>
            <select id="memory-difficulty">
                <option value="6">Easy (6 pairs)</option>
                <option value="8" selected>Medium (8 pairs)</option>
                <option value="10">Hard (10 pairs)</option>
            </select>
        </div>
        <div class="memory-container">
            <div class="memory-game-area">
                <div class="memory-board"></div>
                <div class="memory-stats">
                    <p>Pairs Found: <span id="memory-pairs">0</span>/<span id="memory-total">0</span></p>
                    <p>Time: <span id="memory-time">00:00</span></p>
                    <p>Flips: <span id="memory-flips">0</span></p>
                </div>
            </div>
            <div class="memory-preview">
                <h3>How to Play</h3>
                <div class="memory-instructions">
                    <p>Click on cards to flip them and find matching pairs.</p>
                    <p>Remember the locations to match all pairs with fewer flips!</p>
                    <p>Find all the pairs as quickly as possible to win.</p>
                </div>
                <div class="memory-example">
                    <img src="assests/best walpaper of shivnai.jpg" alt="Memory Game Example">
                    <p>Match beautiful photos of Shivani to complete the game!</p>
                </div>
            </div>
        </div>
    `;
    
    // Add CSS for memory game
    addGameStyles('memory');
    
    // Initialize memory game
    document.getElementById('start-memory').addEventListener('click', function() {
        const difficulty = parseInt(document.getElementById('memory-difficulty').value);
        startMemoryGame(difficulty);
    });
}

// Start memory game with selected difficulty
function startMemoryGame(pairs = 8) {
    const memoryBoard = document.querySelector('.memory-board');
    memoryBoard.innerHTML = '';
    
    // Play memory game music
    if (window.AudioManager) {
        // Stop any current track before playing memory game music
        if (AudioManager.currentTrack) {
            AudioManager.stopTrack(AudioManager.currentTrack);
        }
        AudioManager.playTrack('memoryGame', true);
    }
    
    // Set grid size based on number of pairs
    const columns = pairs <= 6 ? 3 : (pairs <= 8 ? 4 : 5);
    memoryBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    
    // Define images to use from assets
    const imageList = [
        'assests/best walpaper of shivnai.jpg',
        'assests/Hot shivani.jpg',
        'assests/cool pic of shivani wtih earning.jpg',
        'assests/Cute face.jpg',
        'assests/Shivani Shadow image.jpg',
        'assests/First Movie at Jabalpur.jpg',
        'assests/Me and Shivani Fun act.jpg',
        'assests/My give git to shivani 1.jpg',
        'assests/Shivani is Cycling.jpg',
        'assests/Last birthday of shivani.jpg'
    ];
    
    // Select images based on pairs count
    const selectedImages = imageList.slice(0, pairs);
    
    // Create cards array with pairs
    const cards = [];
    selectedImages.forEach((image, index) => {
        cards.push(index, index); // Add each card twice (pairs)
    });
    
    // Shuffle cards
    shuffleArray(cards);
    
    // Create card elements
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.card = card;
        cardElement.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-card-front"></div>
                <div class="memory-card-back">
                    <img src="${selectedImages[card]}" alt="Card ${card}">
                </div>
            </div>
        `;
        
        cardElement.addEventListener('click', function() {
            flipCard(this);
        });
        
        memoryBoard.appendChild(cardElement);
    });
    
    // Game state variables
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let seconds = 0;
    let canFlip = true;
    
    const pairsFoundElement = document.getElementById('memory-pairs');
    const movesElement = document.getElementById('memory-flips');
    const timeElement = document.getElementById('memory-time');
    
    // Update total pairs display
    document.getElementById('memory-total').textContent = pairs;
    
    // Start timer
    const timer = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timeElement.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
    
    // Flip card function
    function flipCard(card) {
        if (!canFlip || card.classList.contains('flipped') || flippedCards.length >= 2) return;
        
        card.classList.add('flipped');
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
            // Increase moves counter
            moves++;
            movesElement.textContent = moves;
            
            // Check for match
            const card1 = flippedCards[0].dataset.card;
            const card2 = flippedCards[1].dataset.card;
            
            if (card1 === card2) {
                // Match found
                matchedPairs++;
                pairsFoundElement.textContent = matchedPairs;
                
                // Reset flipped cards
                flippedCards = [];
                
                // Check if game is complete
                if (matchedPairs === pairs) {
                    clearInterval(timer);
                    
                    // Play victory sound
                    if (window.AudioManager) {
                        // Don't stop the memory game music here - just play the unlock sound on top
                        AudioManager.playTrack('specialMemoryUnlock');
                    }
                    
                    // Show victory message
                    setTimeout(() => {
                        const confetti = document.createElement('div');
                        confetti.className = 'game-confetti';
                        gameContainer.appendChild(confetti);
                        
                        for (let i = 0; i < 100; i++) {
                            createConfettiPiece(confetti);
                        }
                        
                        // Add confetti animation
                        const style = document.createElement('style');
                        style.textContent = `
                            .game-confetti {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                pointer-events: none;
                                z-index: 10;
                            }
                            .confetti-piece {
                                position: absolute;
                                animation: confettiFall linear forwards;
                            }
                            @keyframes confettiFall {
                                0% {
                                    transform: translateY(-10px) rotate(0);
                                    opacity: 1;
                                }
                                100% {
                                    transform: translateY(100vh) rotate(360deg);
                                    opacity: 0;
                                }
                            }
                        `;
                        document.head.appendChild(style);
                        
                        // Show message
                        alert(`Congratulations! You found all pairs in ${moves} moves and ${timeElement.textContent}!`);
                        
                        // Remove confetti after 5 seconds
                        setTimeout(() => {
                            if (confetti.parentNode) {
                                confetti.parentNode.removeChild(confetti);
                            }
                        }, 5000);
                    }, 500);
                }
            } else {
                // No match, flip cards back
                canFlip = false;
                setTimeout(() => {
                    flippedCards.forEach(card => {
                        card.classList.remove('flipped');
                    });
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }
    }
    
    function createConfettiPiece(container) {
        const colors = ['#ff6ba9', '#b67aff', '#ffd95c', '#ff9cda', '#b28eff'];
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;
        piece.style.backgroundColor = color;
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        piece.style.animationDuration = `${Math.random() * 3 + 2}s`;
        
        container.appendChild(piece);
    }
}

// Load the quiz game
function loadQuizGame() {
    const gameContainer = document.getElementById('game-container');
    
    // Create game UI
    gameContainer.innerHTML = `
        <h2>Birthday Quiz Challenge</h2>
        <p>Test your knowledge about Shivani!</p>
        <div class="quiz-controls">
            <button id="quiz-start">Start Quiz</button>
        </div>
        <div class="quiz-container-wrapper">
            <div class="quiz-main-area">
                <div class="quiz-container">
                    <div class="quiz-progress">
                        <div class="quiz-progress-bar"></div>
                    </div>
                    <div class="quiz-content">
                        <div class="quiz-intro active">
                            <h3>How well do you know Shivani?</h3>
                            <p>This quiz will test your knowledge about Shivani's likes, interests, and memories.</p>
                            <p>Answer all questions correctly to prove you're her biggest fan!</p>
                        </div>
                        <div class="quiz-question-section hidden">
                            <div class="quiz-question"></div>
                            <div class="quiz-image"></div>
                            <div class="quiz-options"></div>
                            <div class="quiz-message hidden"></div>
                            <button id="quiz-next" class="hidden">Next Question</button>
                        </div>
                        <div class="quiz-result hidden">
                            <h3>Quiz Completed!</h3>
                            <div class="result-score"></div>
                            <div class="result-message"></div>
                            <div class="result-image">
                                <img src="assests/Cute face.jpg" alt="Result">
                            </div>
                            <button class="quiz-restart">Try Again</button>
                        </div>
                    </div>
                </div>
                <div class="quiz-stats">
                    <p>Question: <span id="current-question">0</span>/<span id="total-questions">10</span></p>
                    <p>Score: <span id="quiz-score">0</span> points</p>
                    <p>Time: <span id="quiz-time">00:00</span></p>
                </div>
            </div>
            <div class="quiz-sidebar">
                <h3>Quiz Instructions</h3>
                <div class="quiz-instructions">
                    <p>Answer each question about Shivani to the best of your knowledge.</p>
                    <p>Select one answer from the available options for each question.</p>
                    <p>Try to answer correctly to get more points!</p>
                    <p>Enjoy the photos and reminisce about beautiful memories with Shivani.</p>
                </div>
                <div class="quiz-preview">
                    <img src="assests/best walpaper of shivnai.jpg" alt="Quiz Preview">
                    <p>Happy 23rd Birthday, Shivani!</p>
                </div>
            </div>
        </div>
    `;
    
    // Add CSS for quiz game
    addGameStyles('quiz');
    
    // Initialize quiz
    document.getElementById('quiz-start').addEventListener('click', function() {
        startQuizGame();
    });
}

// Start the quiz game
function startQuizGame() {
    // Hide intro and show question section
    document.querySelector('.quiz-intro').classList.remove('active');
    document.querySelector('.quiz-intro').classList.add('hidden');
    
    const questionSection = document.querySelector('.quiz-question-section');
    questionSection.classList.remove('hidden');
    questionSection.classList.add('active');
    
    // Play quiz game music (using memory game track)
    if (window.AudioManager) {
        // Stop any current track before playing memory game music
        if (AudioManager.currentTrack) {
            AudioManager.stopTrack(AudioManager.currentTrack);
        }
        AudioManager.playTrack('memoryGame', true);
    }
    
    // Define quiz questions
    const questions = [
        {
            question: "What is Shivani's favorite color?",
            options: ["Purple", "Blue", "Pink", "Green"],
            correctIndex: 2,
            image: "assests/Shivani Shadow image.jpg"
        },
        {
            question: "What is Shivani's favorite movie genre?",
            options: ["Comedy", "Romance", "Action", "Horror"],
            correctIndex: 1,
            image: "assests/First Movie at Jabalpur.jpg"
        },
        {
            question: "What hobby does Shivani enjoy the most?",
            options: ["Reading", "Cooking", "Dancing", "Photography"],
            correctIndex: 1,
            image: "assests/cool pic of shivani wtih earning.jpg"
        },
        {
            question: "What pet would Shivani most like to have?",
            options: ["Dog", "Cat", "Rabbit", "Fish"],
            correctIndex: 0,
            image: "assests/cool pic of shivani wtih earning.jpg"
        },
        {
            question: "What is Shivani turning this birthday?",
            options: ["21", "22", "23", "24"],
            correctIndex: 2,
            image: "assests/Cute face.jpg"
        },
        {
            question: "What is Shivani's favorite season?",
            options: ["Spring", "Summer", "Autumn", "Winter"],
            correctIndex: 3,
            image: "assests/best walpaper of shivnai.jpg"
        },
        {
            question: "What's Shivani's favorite dessert?",
            options: ["Chocolate Cake", "Ice Cream", "Cheesecake", "Cookies"],
            correctIndex: 0,
            image: "assests/Hot shivani.jpg"
        }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    let answered = false;
    
    // Get elements
    const questionElement = document.querySelector('.quiz-question');
    const optionsElement = document.querySelector('.quiz-options');
    const messageElement = document.querySelector('.quiz-message');
    const nextButton = document.getElementById('quiz-next');
    const scoreElement = document.getElementById('quiz-score');
    const currentQuestionElement = document.getElementById('current-question');
    const totalQuestionsElement = document.getElementById('total-questions');
    const progressBar = document.querySelector('.quiz-progress-bar');
    const timeElement = document.getElementById('quiz-time');
    
    // Set total questions
    totalQuestionsElement.textContent = questions.length;
    
    // Start timer
    let seconds = 0;
    const timer = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timeElement.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
    
    // Show the first question
    showQuestion();
    
    // Add event listener to next button
    nextButton.addEventListener('click', () => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    });
    
    // Function to show the current question
    function showQuestion() {
        const question = questions[currentQuestion];
        answered = false;
        
        // Update question number
        currentQuestionElement.textContent = currentQuestion + 1;
        
        // Update progress bar
        progressBar.style.width = `${((currentQuestion) / questions.length) * 100}%`;
        
        // Show question
        questionElement.textContent = question.question;
        
        // Show image if available
        const imageElement = document.querySelector('.quiz-image');
        if (question.image) {
            imageElement.innerHTML = `<img src="${question.image}" alt="Question Image">`;
        } else {
            imageElement.innerHTML = '';
        }
        
        // Create options
        optionsElement.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            optionElement.addEventListener('click', () => {
                if (!answered) {
                    checkAnswer(index);
                }
            });
            optionsElement.appendChild(optionElement);
        });
        
        // Hide message and next button
        messageElement.className = 'quiz-message hidden';
        nextButton.className = 'hidden';
        nextButton.disabled = true;
    }
    
    // Function to check the selected answer
    function checkAnswer(selectedIndex) {
        const question = questions[currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        
        // Mark answer as processed
        answered = true;
        
        // Highlight correct and incorrect answers
        options.forEach((option, index) => {
            if (index === question.correctIndex) {
                option.classList.add('correct');
            } else if (index === selectedIndex) {
                option.classList.add('incorrect');
            }
        });
        
        // Show message
        messageElement.className = 'quiz-message';
        if (selectedIndex === question.correctIndex) {
            messageElement.textContent = 'Correct! 😊';
            messageElement.className += ' correct';
            score++;
        } else {
            messageElement.textContent = 'Incorrect! The correct answer is: ' + question.options[question.correctIndex];
            messageElement.className += ' incorrect';
        }
        
        // Update score
        scoreElement.textContent = score;
        
        // Enable next button
        nextButton.classList.remove('hidden');
        nextButton.disabled = false;
    }
    
    // Function to show the final result
    function showResult() {
        clearInterval(timer);
        
        // Play success sound
        if (window.AudioManager) {
            AudioManager.stopTrack('memoryGame');
            AudioManager.playTrack('specialMemoryUnlock');
        }
        
        // Calculate percentage
        const percentage = Math.round((score / questions.length) * 100);
        
        // Show result
        const resultHTML = `
            <div class="quiz-result">
                <h2>Quiz Completed!</h2>
                <div class="quiz-score-display">
                    <div class="score-circle" style="background: conic-gradient(var(--primary-color) ${percentage}%, #e0e0e0 0);">
                        <span>${percentage}%</span>
                    </div>
                </div>
                <p>You got ${score} out of ${questions.length} questions correct!</p>
                <p>Time taken: ${timeElement.textContent}</p>
                <div class="quiz-message ${percentage >= 70 ? 'correct' : 'incorrect'}">
                    ${percentage >= 70 ? 'Great job! You know Shivani well! 🎉' : 'You can get to know Shivani better! 😊'}
                </div>
                <button id="quiz-restart" class="quiz-button">Play Again</button>
            </div>
        `;
        
        // Replace content
        document.querySelector('.quiz-content').innerHTML = resultHTML;
        
        // Add confetti for good scores
        if (percentage >= 70) {
            const confetti = document.createElement('div');
            confetti.className = 'game-confetti';
            document.querySelector('.quiz-result').appendChild(confetti);
            
            for (let i = 0; i < 100; i++) {
                createConfettiPiece(confetti);
            }
            
            // Add confetti animation
            const style = document.createElement('style');
            style.textContent = `
                .game-confetti {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 10;
                }
                .confetti-piece {
                    position: absolute;
                    animation: confettiFall linear forwards;
                }
                @keyframes confettiFall {
                    0% {
                        transform: translateY(-10px) rotate(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Remove confetti after 5 seconds
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }
        
        // Add restart button functionality
        document.getElementById('quiz-restart').addEventListener('click', () => {
            loadQuizGame();
        });
    }
    
    function createConfettiPiece(container) {
        const colors = ['#ff6ba9', '#b67aff', '#ffd95c', '#ff9cda', '#b28eff'];
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;
        piece.style.backgroundColor = color;
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        piece.style.animationDuration = `${Math.random() * 3 + 2}s`;
        
        container.appendChild(piece);
    }
}

// Helper function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Add CSS styles for games
function addGameStyles(gameType) {
    // Remove any existing game styles
    const existingStyle = document.getElementById('game-style');
    if (existingStyle) {
        existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = 'game-style';
    
    switch(gameType) {
        case 'puzzle':
            style.textContent = `
                .puzzle-controls {
                    margin-bottom: 20px;
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                
                .puzzle-container {
                    display: flex;
                    width: 100%;
                    gap: 30px;
                    margin-bottom: 20px;
                    justify-content: center;
                    align-items: flex-start;
                    height: calc(100vh - 200px);
                }
                
                .puzzle-game-area {
                    flex: 3;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                }
                
                .puzzle-board {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2px;
                    width: 100%;
                    max-width: 700px;
                    aspect-ratio: 1;
                    background-color: rgba(255, 107, 169, 0.1);
                    border: 2px solid rgba(255, 107, 169, 0.3);
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }
                
                .puzzle-piece {
                    width: 100%;
                    height: 100%;
                    background-color: #fff;
                    cursor: pointer;
                    transition: transform 0.2s;
                    border-radius: 3px;
                }
                
                .puzzle-piece:hover {
                    transform: scale(0.98);
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
                }
                
                .empty-piece {
                    background-color: rgba(255, 107, 169, 0.2) !important;
                    background-image: none !important;
                }
                
                .puzzle-preview {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                    background-color: rgba(255, 255, 255, 0.9);
                    border-radius: 15px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    max-width: 350px;
                    height: 100%;
                    overflow-y: auto;
                }
                
                .puzzle-preview h3 {
                    margin-bottom: 15px;
                    color: var(--primary-color);
                }
                
                .puzzle-preview img {
                    width: 100%;
                    border: 1px solid rgba(255, 107, 169, 0.3);
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    margin-bottom: 20px;
                }
                
                .puzzle-instructions {
                    text-align: left;
                    margin-top: 20px;
                    padding: 15px;
                    background-color: rgba(255, 107, 169, 0.05);
                    border-radius: 10px;
                }
                
                .puzzle-instructions h4 {
                    color: var(--primary-color);
                    margin-bottom: 10px;
                }
                
                .puzzle-stats {
                    display: flex;
                    justify-content: space-around;
                    width: 100%;
                    max-width: 500px;
                    margin: 20px auto 0;
                    font-weight: bold;
                    color: var(--primary-color);
                    background-color: rgba(255, 255, 255, 0.9);
                    padding: 10px 20px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                #start-puzzle, #puzzle-difficulty, #puzzle-image {
                    padding: 8px 15px;
                    border-radius: 20px;
                    border: none;
                    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
                    color: white;
                    cursor: pointer;
                    font-weight: bold;
                }
                
                #puzzle-difficulty, #puzzle-image {
                    background: white;
                    color: var(--primary-color);
                    border: 1px solid var(--primary-color);
                }
                
                /* Mobile responsive styles */
                @media (max-width: 768px) {
                    .puzzle-container {
                        flex-direction: column;
                        align-items: center;
                        height: auto;
                    }
                    
                    .puzzle-preview {
                        max-width: 100%;
                        margin-top: 20px;
                    }
                    
                    .puzzle-controls {
                        flex-direction: column;
                        width: 100%;
                    }
                    
                    #start-puzzle, #puzzle-difficulty, #puzzle-image {
                        width: 100%;
                        max-width: 300px;
                        margin: 0 auto;
                    }
                    
                    .puzzle-board {
                        max-width: 90%;
                    }
                }
                
                @media (max-width: 480px) {
                    .puzzle-board {
                        max-width: 100%;
                    }
                }
            `;
            break;
            
        case 'memory':
            style.textContent = `
                .memory-controls {
                    margin-bottom: 20px;
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                
                .memory-container {
                    display: flex;
                    width: 100%;
                    gap: 30px;
                    margin-bottom: 20px;
                    justify-content: center;
                    align-items: flex-start;
                    height: calc(100vh - 200px);
                }
                
                .memory-game-area {
                    flex: 3;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                }
                
                .memory-board {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                    margin: 0 auto 20px;
                    width: 100%;
                    max-width: 700px;
                    background-color: rgba(255, 107, 169, 0.05);
                    padding: 20px;
                    border-radius: 15px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }
                
                .memory-card {
                    aspect-ratio: 1;
                    perspective: 1000px;
                    cursor: pointer;
                }
                
                .memory-card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.6s;
                    transform-style: preserve-3d;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                
                .memory-card.flipped .memory-card-inner {
                    transform: rotateY(180deg);
                }
                
                .memory-card-front, .memory-card-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    overflow: hidden;
                }
                
                .memory-card-front {
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    color: white;
                    font-size: 2rem;
                    font-weight: bold;
                }
                
                .memory-card-front::after {
                    content: '?';
                    font-size: 2rem;
                    font-weight: bold;
                    color: white;
                }
                
                .memory-card-back {
                    background-color: white;
                    transform: rotateY(180deg);
                }
                
                .memory-card-back img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .memory-card.matched .memory-card-inner {
                    box-shadow: 0 0 15px var(--accent-color);
                }
                
                .memory-stats {
                    display: flex;
                    justify-content: space-around;
                    width: 100%;
                    max-width: 500px;
                    margin: 20px auto 0;
                    font-weight: bold;
                    color: var(--primary-color);
                    background-color: rgba(255, 255, 255, 0.9);
                    padding: 10px 20px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                .memory-preview {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                    background-color: rgba(255, 255, 255, 0.9);
                    border-radius: 15px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    max-width: 350px;
                    height: 100%;
                    overflow-y: auto;
                }
                
                .memory-preview h3 {
                    margin-bottom: 15px;
                    color: var(--primary-color);
                }
                
                .memory-instructions {
                    text-align: left;
                    margin-top: 10px;
                    padding: 15px;
                    background-color: rgba(255, 107, 169, 0.05);
                    border-radius: 10px;
                    margin-bottom: 20px;
                }
                
                .memory-example {
                    width: 100%;
                    text-align: center;
                }
                
                .memory-example img {
                    width: 100%;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    margin-bottom: 10px;
                }
                
                #start-memory, #memory-difficulty {
                    padding: 8px 15px;
                    border-radius: 20px;
                    border: none;
                    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
                    color: white;
                    cursor: pointer;
                    font-weight: bold;
                }
                
                #memory-difficulty {
                    background: white;
                    color: var(--primary-color);
                    border: 1px solid var(--primary-color);
                }
                
                /* Mobile responsive styles */
                @media (max-width: 768px) {
                    .memory-container {
                        flex-direction: column;
                        align-items: center;
                        height: auto;
                    }
                    
                    .memory-preview {
                        max-width: 100%;
                        margin-top: 20px;
                    }
                    
                    .memory-board {
                        grid-template-columns: repeat(4, 1fr);
                        max-width: 100%;
                    }
                }
                
                @media (max-width: 480px) {
                    .memory-board {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
            `;
            break;
            
        case 'quiz':
            style.textContent = `
                .quiz-controls {
                    margin-bottom: 20px;
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                }
                
                .quiz-container-wrapper {
                    display: flex;
                    width: 100%;
                    gap: 30px;
                    margin-bottom: 20px;
                    justify-content: center;
                    align-items: flex-start;
                    height: calc(100vh - 200px);
                    overflow-y: auto;
                }
                
                .quiz-main-area {
                    flex: 3;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    min-height: 500px;
                }
                
                .quiz-container {
                    margin: 0 auto 20px;
                    width: 100%;
                    max-width: 700px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 15px;
                    padding: 25px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    position: relative;
                    overflow: visible;
                }
                
                .quiz-sidebar {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                    background-color: rgba(255, 255, 255, 0.9);
                    border-radius: 15px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    max-width: 350px;
                    height: 100%;
                    overflow-y: auto;
                }
                
                .quiz-sidebar h3 {
                    margin-bottom: 15px;
                    color: var(--primary-color);
                }
                
                .quiz-instructions {
                    text-align: left;
                    margin-top: 10px;
                    padding: 15px;
                    background-color: rgba(255, 107, 169, 0.05);
                    border-radius: 10px;
                    margin-bottom: 20px;
                }
                
                .quiz-preview {
                    width: 100%;
                    text-align: center;
                }
                
                .quiz-preview img {
                    width: 100%;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    margin-bottom: 10px;
                }
                
                .quiz-progress {
                    height: 10px;
                    background-color: rgba(255, 107, 169, 0.2);
                    border-radius: 5px;
                    margin-bottom: 20px;
                    overflow: hidden;
                }
                
                .quiz-progress-bar {
                    height: 100%;
                    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
                    width: 0;
                    transition: width 0.3s ease;
                }
                
                .quiz-question {
                    font-size: 1.2rem;
                    margin-bottom: 20px;
                    font-weight: bold;
                    color: var(--text-color);
                    text-align: center;
                }
                
                .quiz-image {
                    margin-bottom: 15px;
                    text-align: center;
                }
                
                .quiz-image img {
                    max-width: 100%;
                    max-height: 250px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                .quiz-options {
                    display: grid;
                    gap: 15px;
                    margin-bottom: 20px;
                    width: 100%;
                }
                
                .quiz-option {
                    padding: 15px;
                    background-color: white;
                    border: 2px solid rgba(255, 107, 169, 0.3);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                    font-size: 1.1rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                }
                
                .quiz-option:before {
                    content: "";
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255, 107, 169, 0.5);
                    border-radius: 50%;
                    margin-right: 10px;
                    flex-shrink: 0;
                }
                
                .quiz-option:hover {
                    background-color: rgba(255, 107, 169, 0.1);
                    border-color: var(--primary-color);
                    transform: translateY(-2px);
                }
                
                .quiz-option.correct {
                    background-color: rgba(76, 175, 80, 0.2);
                    border-color: #4CAF50;
                }
                
                .quiz-option.correct:before {
                    background-color: #4CAF50;
                    content: "✓";
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                }
                
                .quiz-option.incorrect {
                    background-color: rgba(244, 67, 54, 0.2);
                    border-color: #f44336;
                }
                
                .quiz-option.incorrect:before {
                    background-color: #f44336;
                    content: "✕";
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                }
                
                .quiz-stats {
                    display: flex;
                    justify-content: space-around;
                    width: 100%;
                    max-width: 500px;
                    margin: 20px auto 0;
                    font-weight: bold;
                    color: var(--primary-color);
                    background-color: rgba(255, 255, 255, 0.9);
                    padding: 10px 20px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                .quiz-message {
                    margin: 15px 0;
                    padding: 10px;
                    border-radius: 10px;
                    font-weight: bold;
                    text-align: center;
                }
                
                .quiz-message.correct {
                    background-color: rgba(76, 175, 80, 0.2);
                    color: #155724;
                }
                
                .quiz-message.incorrect {
                    background-color: rgba(244, 67, 54, 0.2);
                    color: #721c24;
                }
                
                .quiz-intro {
                    text-align: center;
                    margin-bottom: 20px;
                }
                
                .quiz-intro h3 {
                    color: var(--primary-color);
                    margin-bottom: 15px;
                    font-size: 1.5rem;
                }
                
                .hidden {
                    display: none !important;
                }
                
                .active {
                    display: block !important;
                }
                
                #quiz-start, #quiz-next {
                    padding: 10px 20px;
                    border-radius: 20px;
                    border: none;
                    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
                    color: white;
                    cursor: pointer;
                    font-weight: bold;
                    display: block;
                    margin: 15px auto;
                    min-width: 150px;
                }
                
                .quiz-restart {
                    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 20px;
                    margin-top: 15px;
                    cursor: pointer;
                    font-weight: bold;
                }
                
                .quiz-result {
                    text-align: center;
                }
                
                .result-image {
                    margin: 20px auto;
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    overflow: hidden;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                }
                
                .result-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                /* Ensure quiz content is completely visible */
                .quiz-question-section {
                    padding: 15px 0;
                    min-height: 400px;
                    display: flex;
                    flex-direction: column;
                }
                
                .quiz-content {
                    min-height: 400px;
                    overflow-y: visible;
                }
                
                /* Mobile responsive styles */
                @media (max-width: 768px) {
                    .quiz-container-wrapper {
                        flex-direction: column;
                        align-items: center;
                        height: auto;
                        overflow-y: auto;
                    }
                    
                    .quiz-main-area {
                        min-height: auto;
                    }
                    
                    .quiz-sidebar {
                        max-width: 100%;
                        margin-top: 20px;
                    }
                    
                    .quiz-container {
                        padding: 15px;
                        max-width: 95%;
                    }
                    
                    .quiz-question {
                        font-size: 1.1rem;
                    }
                    
                    .quiz-option {
                        padding: 12px;
                        font-size: 1rem;
                    }
                    
                    .quiz-option:before {
                        width: 18px;
                        height: 18px;
                        margin-right: 8px;
                    }
                }
                
                @media (max-width: 480px) {
                    .quiz-container {
                        padding: 10px;
                    }
                    
                    .quiz-option {
                        padding: 10px;
                        font-size: 0.95rem;
                    }
                    
                    .quiz-option:before {
                        width: 16px;
                        height: 16px;
                        margin-right: 6px;
                    }
                    
                    .result-image {
                        width: 150px;
                        height: 150px;
                    }
                }
                
                /* Confetti Animation */
                @keyframes fall {
                    0% {
                        transform: translateY(-10px) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(1000px) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            break;
    }
    
    document.head.appendChild(style);
} 