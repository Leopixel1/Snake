# Snake Game - Cross Platform

A responsive, cross-platform Snake game built with HTML5, CSS3, and vanilla JavaScript. Play it on desktop, tablet, or mobile devices with optimized controls for each platform.

## 🎮 Features

- **Cross-Platform Compatibility**: Runs on desktop, tablet, and mobile browsers
- **Responsive Design**: Automatically adapts to different screen sizes and orientations
- **Touch Controls**: On-screen buttons for mobile and tablet devices
- **Keyboard Controls**: Arrow keys and WASD support for desktop
- **Progressive Web App (PWA)**: Install on your device for offline play
- **High Score Persistence**: Your best score is saved locally
- **Adaptive Difficulty**: Game speed increases as your score grows
- **Mobile Optimizations**: Vibration feedback, visibility change handling

## 🕹️ How to Play

### Desktop
- Use arrow keys (↑↓←→) or WASD keys to control the snake
- Press spacebar to pause/resume the game

### Mobile/Tablet
- Tap the on-screen arrow buttons to control the snake
- Tap any arrow button to start the game

## 🚀 Getting Started

### Play Online
The game is hosted on GitHub Pages and can be played directly at:
**[https://leopixel1.github.io/Snake/](https://leopixel1.github.io/Snake/)**

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Leopixel1/Snake.git
   cd Snake
   ```

2. Open `index.html` in your browser or serve it using a web server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. Navigate to `http://localhost:8000` and start playing!

## 📱 PWA Installation

The game can be installed as a Progressive Web App:

1. Open the game in a supported browser (Chrome, Firefox, Safari, Edge)
2. Look for the "Install" prompt in your browser
3. Click "Install" to add it to your home screen/desktop
4. Launch it like any other app for a native-like experience

## 🛠️ Technical Features

- **HTML5 Canvas**: Smooth rendering with high DPI support
- **CSS Grid & Flexbox**: Responsive layout system
- **Service Worker**: Offline functionality and caching
- **Web Manifest**: PWA metadata for installation
- **Local Storage**: High score persistence
- **Viewport Meta Tags**: Mobile optimization
- **Touch Events**: Native mobile controls

## 🚀 Deployment

### GitHub Pages
This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment workflow:

1. **Automatic Deployment**: Triggered on every push to the `main` branch
2. **Manual Deployment**: Can be triggered manually from the GitHub Actions tab
3. **Static Hosting**: Serves all files directly without any build process
4. **PWA Support**: Full Progressive Web App functionality maintained

To enable GitHub Pages for your fork:
1. Go to your repository settings
2. Navigate to "Pages" section
3. Select "GitHub Actions" as the source
4. The workflow will automatically deploy on the next push to `main`

## 🌐 Browser Compatibility

- ✅ Chrome/Chromium (desktop & mobile)
- ✅ Firefox (desktop & mobile)  
- ✅ Safari (desktop & mobile)
- ✅ Edge (desktop & mobile)
- ✅ Samsung Internet
- ✅ Other modern browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.