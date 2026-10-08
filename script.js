const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let faseAtual = 0;

// Jogador 1 (Verde) e Jogador 2 (Roxo) desenhados via Canvas
const player1 = { 
  x: 50, y: 435, width: 40, height: 60, 
  color: '#2ed573', glowColor: 'rgba(46, 213, 115, 0.8)',
  vx: 0, vy: 0, 
  speed: 5, jump: -12, grounded: false, element: 'green',
  facing: 'right'
};

const player2 = { 
  x: 140, y: 435, width: 40, height: 60, 
  color: '#9b59b6', glowColor: 'rgba(155, 89, 182, 0.8)',
  vx: 0, vy: 0, 
  speed: 5, jump: -12, grounded: false, element: 'purple',
  facing: 'right'
};

const gravity = 0.5;
const keys = {};

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// Fases do Jogo
const fases = [
  {
    bgImage: 'url("img/fundo.jpg")',
    platforms: [
      { x: 0, y: 560, w: 800, h: 40, color: '#3d271d', topColor: '#2d6a4f' },
      { x: 300, y: 470, w: 200, h: 20, color: '#3d271d', topColor: '#2d6a4f' },
      { x: 100, y: 360, w: 200, h: 20, color: '#3d271d', topColor: '#2d6a4f' },
      { x: 500, y: 360, w: 200, h: 20, color: '#3d271d', topColor: '#2d6a4f' },
      { x: 300, y: 240, w: 200, h: 20, color: '#3d271d', topColor: '#2d6a4f' }
    ],
    hazards: [
      { x: 350, y: 550, w: 100, h: 10, type: 'green', color: '#2ed573' },
      { x: 350, y: 460, w: 80, h: 10, type: 'purple', color: '#9b59b6' }
    ],
    doors: { p1: { x: 340, y: 150, w: 50, h: 90 }, p2: { x: 420, y: 150, w: 50, h: 90 } }
  },
  {
    bgImage: 'url("img/fundo da fase doiss.jpeg")',
    platforms: [
      { x: 0, y: 560, w: 800, h: 40, color: '#2b3a24', topColor: '#4d7c38' },
      { x: 150, y: 460, w: 160, h: 20, color: '#2b3a24', topColor: '#4d7c38' },
      { x: 490, y: 460, w: 160, h: 20, color: '#2b3a24', topColor: '#4d7c38' },
      { x: 320, y: 350, w: 160, h: 20, color: '#2b3a24', topColor: '#4d7c38' },
      { x: 100, y: 240, w: 600, h: 20, color: '#2b3a24', topColor: '#4d7c38' }
    ],
    hazards: [
      { x: 200, y: 550, w: 400, h: 10, type: 'toxic', color: '#ff4757' },
      { x: 200, y: 450, w: 60, h: 10, type: 'green', color: '#2ed573' }
    ],
    doors: { p1: { x: 150, y: 150, w: 50, h: 90 }, p2: { x: 610, y: 150, w: 50, h: 90 } }
  },
  {
    bgImage: 'url("img/funo da fase trê.jpeg")',
    platforms: [
      { x: 0, y: 560, w: 200, h: 40, color: '#3d271d', topColor: '#2d6a4f' },
      { x: 600, y: 560, w: 200, h: 40, color: '#3d271d', topColor: '#2d6a4f' },
      { x: 250, y: 460, w: 300, h: 20, color: '#3d271d', topColor: '#2d6a4f' },
      { x: 100, y: 350, w: 180, h: 20, color: '#3d271d', topColor: '#2d6a4f' },
      { x: 520, y: 350, w: 180, h: 20, color: '#3d271d', topColor: '#2d6a4f' },
      { x: 300, y: 230, w: 200, h: 20, color: '#3d271d', topColor: '#2d6a4f' }
    ],
    hazards: [
      { x: 200, y: 580, w: 400, h: 20, type: 'green', color: '#2ed573' },
      { x: 300, y: 450, w: 200, h: 10, type: 'green', color: '#2ed573' },
      { x: 130, y: 340, w: 50, h: 10, type: 'purple', color: '#9b59b6' }
    ],
    doors: { p1: { x: 330, y: 140, w: 50, h: 90 }, p2: { x: 430, y: 140, w: 50, h: 90 } }
  },
  {
    bgImage: 'url("img/fundo da fase quatro.jpeg")',
    platforms: [
      { x: 0, y: 560, w: 800, h: 40, color: '#2b3a24', topColor: '#4d7c38' },
      { x: 50, y: 450, w: 200, h: 20, color: '#2b3a24', topColor: '#4d7c38' },
      { x: 550, y: 450, w: 200, h: 20, color: '#2b3a24', topColor: '#4d7c38' },
      { x: 300, y: 340, w: 200, h: 20, color: '#2b3a24', topColor: '#4d7c38' },
      { x: 100, y: 220, w: 600, h: 20, color: '#2b3a24', topColor: '#4d7c38' }
    ],
    hazards: [
      { x: 100, y: 550, w: 600, h: 10, type: 'purple', color: '#9b59b6' },
      { x: 350, y: 330, w: 100, h: 10, type: 'toxic', color: '#ff4757' }
    ],
    doors: { p1: { x: 120, y: 130, w: 50, h: 90 }, p2: { x: 640, y: 130, w: 50, h: 90 } }
  },
  {
    bgImage: 'url("img/fundo da fase sinco.jpeg")',
    platforms: [
      { x: 0, y: 560, w: 150, h: 40, color: '#1b2a1a', topColor: '#3d6c28' },
      { x: 650, y: 560, w: 150, h: 40, color: '#1b2a1a', topColor: '#3d6c28' },
      { x: 200, y: 460, w: 120, h: 20, color: '#1b2a1a', topColor: '#3d6c28' },
      { x: 480, y: 460, w: 120, h: 20, color: '#1b2a1a', topColor: '#3d6c28' },
      { x: 340, y: 350, w: 120, h: 20, color: '#1b2a1a', topColor: '#3d6c28' },
      { x: 100, y: 230, w: 600, h: 20, color: '#1b2a1a', topColor: '#3d6c28' }
    ],
    hazards: [
      { x: 150, y: 580, w: 500, h: 20, type: 'toxic', color: '#ff4757' },
      { x: 220, y: 450, w: 80, h: 10, type: 'green', color: '#2ed573' },
      { x: 500, y: 450, w: 80, h: 10, type: 'purple', color: '#9b59b6' }
    ],
    doors: { p1: { x: 350, y: 140, w: 50, h: 90 }, p2: { x: 410, y: 140, w: 50, h: 90 } }
  }
];

function resetPlayerPos() {
  player1.x = 50; player1.y = 435; player1.vx = 0; player1.vy = 0; player1.facing = 'right';
  player2.x = 140; player2.y = 435; player2.vx = 0; player2.vy = 0; player2.facing = 'right';
}

function updateControls() {
  // Controle Player 1 (Verde: A / D)
  if (keys['KeyA']) {
    player1.vx = -player1.speed;
    player1.facing = 'left';
  } else if (keys['KeyD']) {
    player1.vx = player1.speed;
    player1.facing = 'right';
  } else {
    player1.vx = 0;
  }

  if (keys['KeyW'] && player1.grounded) {
    player1.vy = player1.jump;
    player1.grounded = false;
  }

  // Controle Player 2 (Roxo: Setas)
  if (keys['ArrowLeft']) {
    player2.vx = -player2.speed;
    player2.facing = 'left';
  } else if (keys['ArrowRight']) {
    player2.vx = player2.speed;
    player2.facing = 'right';
  } else {
    player2.vx = 0;
  }

  if (keys['ArrowUp'] && player2.grounded) {
    player2.vy = player2.jump;
    player2.grounded = false;
  }
}

function applyPhysics(p) {
  p.vy += gravity;
  p.x += p.vx;
  p.y += p.vy;

  p.grounded = false;
  const currentFase = fases[faseAtual];

  for (let plat of currentFase.platforms) {
    if (p.x < plat.x + plat.w && p.x + p.width > plat.x &&
        p.y < plat.y + plat.h && p.y + p.height > plat.y) {
      if (p