# Shivani's 23rd Birthday Website

A beautiful interactive birthday website created for Shivani Gupta's 23rd birthday celebration.

## Features

- **Interactive 3D Birthday Cake**: A detailed 3D cake with candles that can be blown out
- **Photo Gallery**: Flip-style gallery with beautiful memories
- **Birthday Games**: Three fun games including puzzle, memory match, and birthday quiz
- **Flying Birthday Wishes**: Animated birthday messages floating across the screen
- **Password-Protected Special Section**: A special section unlocked with Shivani's birthdate
- **Memories Timeline**: A separate page showcasing memories throughout the years

## Setup Instructions

1. **File Structure**: Ensure all files are in the correct structure:
   ```
   ├── index.html          # Main page
   ├── styles.css          # Main stylesheet
   ├── script.js           # 3D cake and main functionality
   ├── gallery.js          # Photo gallery functionality
   ├── games.js            # Birthday games
   ├── memories.html       # Additional memories page
   ├── assets/             # Directory for images and videos
   │   ├── gallery1.jpg    # Gallery images
   │   ├── gallery2.jpg
   │   ├── ...
   │   ├── memory1.jpg     # Memory page images
   │   ├── memory2.jpg
   │   ├── ...
   │   ├── puzzle_image.jpg # Puzzle game image
   │   ├── memory1.jpg     # Memory game cards
   │   ├── memory2.jpg
   │   ├── ...
   │   ├── special1.jpg    # Password-protected section
   │   ├── special2.jpg
   │   ├── ...
   │   ├── video1.mp4      # Video messages
   │   ├── video2.mp4
   │   ├── ...
   ```

2. **Image Preparation**:
   - Add all the necessary images to the `assets` directory
   - For the memory game, prepare images named `memory1.jpg` through `memory12.jpg`
   - For the special section, prepare images named `special1.jpg` through `special9.jpg`
   - Prepare a nice photo of Shivani for the puzzle game as `puzzle_image.jpg`

3. **Customization**:
   - Update quiz questions in the `games.js` file with actual information about Shivani
   - Modify birthday wishes in the `script.js` file to include personal messages
   - Update the timeline in `memories.html` with actual significant dates and events from Shivani's life

4. **Hosting**:
   - You can host this website on any web server or hosting service
   - For a simple local test, you can use a local server like Python's SimpleHTTPServer:
     ```
     python -m http.server
     ```
   - Then access the website at `http://localhost:8000`

## Technical Requirements

- Modern web browser with JavaScript enabled (Chrome, Firefox, Safari, Edge recommended)
- WebGL support for the 3D cake (available in all modern browsers)
- Minimum screen resolution of 768px for optimal experience (responsive design adapts to smaller screens)

## Password

The password for the special section is Shivani's birthdate: `07092023`

## Credits

Created with love for Shivani Gupta's 23rd birthday on May 13, 2024.

Enjoy celebrating Shivani's special day with this interactive website! 