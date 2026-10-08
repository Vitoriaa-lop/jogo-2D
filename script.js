const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let faseAtual = 0;

// Jogador 1 (Fantasma Verde) e Jogador 2 (Fantasma Roxo)
const player1 = { 
  x: 50, y: 480, width: 32, height: 42, 
  color: '#2ed573', eyeColor: '#ffffff',
  glowColor: 'rgba(46, 213, 115, 0.7)',
  vx: 0, vy: 0, 
  speed: 5, jump: -12, grounded: false, element: 'green'
};

const player2 = { 
  x: 100, y: 480, width: 32, height: 42, 
  color: '#9b59b6', eyeColor: '#ffffff',
  glowColor: 'rgba(155, 89, 182, 0.7)',
  vx: 0, vy: 0, 
  speed: 5, jump: -12, grounded: false, element: 'purple'
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
    doors: { p1: { x: 350, y: 180, w: 32, h: 60 }, p2: { x: 420, y: 180, w: 32, h: 60 } }
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
    doors: { p1: { x: 150, y: 180, w: 32, h: 60 }, p2: { x: 620, y: 180, w: 32, h: 60 } }
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
    doors: { p1: { x: 340, y: 170, w: 32, h: 60 }, p2: { x: 420, y: 170, w: 32, h: 60 } }
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
    doors: { p1: { x: 120, y: 160, w: 32, h: 60 }, p2: { x: 650, y: 160, w: 32, h: 60 } }
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
    doors: { p1: { x: 360, y: 170, w: 32, h: 60 }, p2: { x: 410, y: 170, w: 32, h: 60 } }
  }
];

function resetPlayerPos() {
  player1.x = 50; player1.y = 480; player1.vx = 0; player1.vy = 0;
  player2.x = 100; player2.y = 480; player2.vx = 0; player2.vy = 0;
}

function updateControls() {
  if (keys['KeyA']) player1.vx = -player1.speed;
  else if (keys['KeyD']) player1.vx = player1.speed;
  else player1.vx = 0;

  if (keys['KeyW'] && player1.grounded) {
    player1.vy = player1.jump;
    player1.grounded = false;
  }

  if (keys['ArrowLeft']) player2.vx = -player2.speed;
  else if (keys['ArrowRight']) player2.vx = player2.speed;
  else player2.vx = 0;

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
      if (p.vy > 0 && p.y + p.height - p.vy <= plat.y) {
        p.y = plat.y - p.height;
        p.vy = 0;
        p.grounded = true;
      }
    }
  }

  if (p.x < 0) p.x = 0;
  if (p.x + p.width > canvas.width) p.x = canvas.width - p.width;
}

function checkHazards(p) {
  const currentFase = fases[faseAtual];
  for (let h of currentFase.hazards) {
    if (p.x < h.x + h.w && p.x + p.width > h.x &&
        p.y < h.y + h.h && p.y + p.height > h.y) {
      if (h.type === 'toxic') resetPlayerPos();
      if (h.type === 'green' && p.element !== 'green') resetPlayerPos();
      if (h.type === 'purple' && p.element !== 'purple') resetPlayerPos();
    }
  }
}

function checkWin() {
  const doors = fases[faseAtual].doors;

  const p1InDoor = (player1.x < doors.p1.x + doors.p1.w && player1.x + player1.width > doors.p1.x &&
                    player1.y < doors.p1.y + doors.p1.h && player1.y + player1.height > doors.p1.y);

  const p2InDoor = (player2.x < doors.p2.x + doors.p2.w && player2.x + player2.width > doors.p2.x &&
                    player2.y < doors.p2.y + doors.p2.h && player2.y + player2.height > doors.p2.y);

  if (p1InDoor && p2InDoor) {
    if (faseAtual < fases.length - 1) {
      faseAtual++;
      resetPlayerPos();
    } else {
      alert("Parabéns! Completaram todas as fases!");
      faseAtual = 0;
      resetPlayerPos();
    }
  }
}

// Desenhar Fantasmas em Canvas (Sem Fundo)
function drawPlayer(p) {
  ctx.save();
  ctx.shadowColor = p.glowColor;
  ctx.shadowBlur = 12;

  // Corpo do Fantasma
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(p.x + p.width / 2, p.y + 16, p.width / 2, Math.PI, 0, false);
  ctx.fillRect(p.x, p.y + 16, p.width, p.height - 24);

  // Ondas na parte inferior
  ctx.lineTo(p.x + p.width, p.y + p.height);
  ctx.lineTo(p.x + (p.width * 0.75), p.y + p.height - 6);
  ctx.lineTo(p.x + (p.width * 0.5), p.y + p.height);
  ctx.lineTo(p.x + (p.width * 0.25), p.y + p.height - 6);
  ctx.lineTo(p.x, p.y + p.height);
  ctx.closePath();
  ctx.fill();

  // Olhos
  ctx.fillStyle = p.eyeColor;
  const eyeOffset = p.vx < 0 ? -3 : (p.vx > 0 ? 3 : 0);
  ctx.fillRect(p.x + 8 + eyeOffset, p.y + 12, 6, 8);
  ctx.fillRect(p.x + 18 + eyeOffset, p.y + 12, 6, 8);

  // Pupilas
  ctx.fillStyle = '#000000';
  ctx.fillRect(p.x + 10 + eyeOffset, p.y + 14, 3, 4);
  ctx.fillRect(p.x + 20 + eyeOffset, p.y + 14, 3, 4);

  ctx.restore();
}

function drawDoor(door, color, symbol) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;

  ctx.fillStyle = '#1e272e';
  ctx.fillRect(door.x, door.y, door.w, door.h);

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(door.x + 2, door.y + 2, door.w - 4, door.h - 4);

  ctx.fillStyle = color;
  ctx.font = '16px sans-serif';
  ctx.fillText(symbol, door.x + 8, door.y + 35);
  ctx.restore();
}

function gameLoop() {
  const currentFase = fases[faseAtual];

  if (currentFase.bgImage) {
    document.body.style.backgroundImage = currentFase.bgImage;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateControls();
  applyPhysics(player1);
  applyPhysics(player2);

  checkHazards(player1);
  checkHazards(player2);

  checkWin();

  // Plataformas
  for (let plat of currentFase.platforms) {
    ctx.fillStyle = plat.color;
    ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
    
    ctx.fillStyle = plat.topColor;
    ctx.fillRect(plat.x, plat.y, plat.w, 4);
  }

  // Obstáculos
  for (let h of currentFase.hazards) {
    ctx.save();
    ctx.shadowColor = h.color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = h.color;
    ctx.fillRect(h.x, h.y, h.w, h.h);
    ctx.restore();
  }

  // Portais
  drawDoor(currentFase.doors.p1, '#2ed573', '🍃');
  drawDoor(currentFase.doors.p2, '#9b59b6', '🔮');

  // Desenhar Fantasmas
  drawPlayer(player1);
  drawPlayer(player2);

  requestAnimationFrame(gameLoop);
}

gameLoop();