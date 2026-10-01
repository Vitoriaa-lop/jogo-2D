const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let faseAtual = 0;

// Jogador 1 (Fantasma Verde) e Jogador 2 (Fantasma Roxo)
const player1 = { 
  x: 50, y: 500, width: 28, height: 38, 
  colorMain: '#2ed573', colorSecondary: '#7bed9f', glowColor: 'rgba(46, 213, 115, 0.6)',
  eyeColor: '#ffffff', pupilColor: '#1e272e', vx: 0, vy: 0, 
  speed: 5, jump: -12, grounded: false, element: 'green' 
};

const player2 = { 
  x: 90, y: 500, width: 28, height: 38, 
  colorMain: '#8e44ad', colorSecondary: '#9b59b6', glowColor: 'rgba(142, 68, 173, 0.6)',
  eyeColor: '#ffffff', pupilColor: '#1e272e', vx: 0, vy: 0, 
  speed: 5, jump: -12, grounded: false, element: 'purple' 
};

const gravity = 0.5;
const keys = {};

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// 5 Fases do Jogo
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
    bgImage: 'url("img/outro fundo.jpeg")',
    platforms: [
      { x: 0, y: 560, w: 800, h: 40, color: '#2c3e50', topColor: '#16a085' },
      { x: 150, y: 460, w: 150, h: 20, color: '#2c3e50', topColor: '#16a085' },
      { x: 500, y: 460, w: 150, h: 20, color: '#2c3e50', topColor: '#16a085' },
      { x: 325, y: 350, w: 150, h: 20, color: '#2c3e50', topColor: '#16a085' },
      { x: 100, y: 240, w: 600, h: 20, color: '#2c3e50', topColor: '#16a085' }
    ],
    hazards: [
      { x: 200, y: 550, w: 400, h: 10, type: 'toxic', color: '#ff4757' },
      { x: 200, y: 450, w: 50, h: 10, type: 'green', color: '#2ed573' }
    ],
    doors: { p1: { x: 150, y: 180, w: 32, h: 60 }, p2: { x: 620, y: 180, w: 32, h: 60 } }
  },
  {
    bgImage: 'url("img/fundo.jpg")',
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
    bgImage: 'url("img/outro fundo.jpeg")',
    platforms: [
      { x: 0, y: 560, w: 800, h: 40, color: '#2c3e50', topColor: '#16a085' },
      { x: 50, y: 450, w: 200, h: 20, color: '#2c3e50', topColor: '#16a085' },
      { x: 550, y: 450, w: 200, h: 20, color: '#2c3e50', topColor: '#16a085' },
      { x: 300, y: 340, w: 200, h: 20, color: '#2c3e50', topColor: '#16a085' },
      { x: 100, y: 220, w: 600, h: 20, color: '#2c3e50', topColor: '#16a085' }
    ],
    hazards: [
      { x: 100, y: 550, w: 600, h: 10, type: 'purple', color: '#9b59b6' },
      { x: 350, y: 330, w: 100, h: 10, type: 'toxic', color: '#ff4757' }
    ],
    doors: { p1: { x: 120, y: 160, w: 32, h: 60 }, p2: { x: 650, y: 160, w: 32, h: 60 } }
  },
  {
    bgImage: 'url("img/fundo.jpg")',
    platforms: [
      { x: 0, y: 560, w: 150, h: 40, color: '#3d271d', topColor: '#2d6a4f' },
      { x: 650, y: 560, w: 150, h: 40, color: '#3d271d', topColor: '#2d6a4f' },
      { x: 200, y: 460, w: 120, h: 20, color: '#3d271d', topColor: '#2d6a4f' },
      { x: 480, y: 460, w: 120, h: 20, color: '#3d271d', topColor: '#2d6a4f' },
      { x: 340, y: 350, w: 120, h: 20, color: '#3d271d', topColor: '#2d6a4f' },
      { x: 100, y: 230, w: 600, h: 20, color: '#3d271d', topColor: '#2d6a4f' }
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
  player2.x = 90; player2.y = 480; player2.vx = 0; player2.vy = 0;
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

// Desenhar os Personagens em formato de Fantasma
function drawPlayer(p) {
  ctx.save();

  // Brilho místico
  ctx.shadowColor = p.glowColor;
  ctx.shadowBlur = 12;

  // Gradiente do corpo
  let grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
  grad.addColorStop(0, p.colorSecondary);
  grad.addColorStop(1, p.colorMain);
  ctx.fillStyle = grad;

  // Desenhar corpo de fantasma (Cabeça redonda + base ondulada)
  const radius = p.width / 2;
  const bottomY = p.y + p.height - 6;

  ctx.beginPath();
  // Cabeça (arco superior)
  ctx.arc(p.x + radius, p.y + radius, radius, Math.PI, 0, false);
  // Lado direito
  ctx.lineTo(p.x + p.width, bottomY);
  // Ondas na parte inferior do fantasma
  ctx.quadraticCurveTo(p.x + p.width * 0.83, p.y + p.height, p.x + p.width * 0.66, bottomY);
  ctx.quadraticCurveTo(p.x + p.width * 0.5, p.y + p.height - 10, p.x + p.width * 0.33, bottomY);
  ctx.quadraticCurveTo(p.x + p.width * 0.17, p.y + p.height, p.x, bottomY);
  // Lado esquerdo
  ctx.lineTo(p.x, p.y + radius);
  ctx.closePath();
  ctx.fill();

  // Olhos expressivos do fantasma
  ctx.shadowBlur = 0;

  let eyeOffsetX = p.vx < 0 ? -2 : (p.vx > 0 ? 2 : 0);

  // Fundo dos olhos (Branco)
  ctx.fillStyle = p.eyeColor;
  ctx.beginPath();
  ctx.ellipse(p.x + 9 + eyeOffsetX, p.y + 14, 4, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(p.x + 19 + eyeOffsetX, p.y + 14, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupilas do fantasma
  ctx.fillStyle = p.pupilColor;
  ctx.beginPath();
  ctx.arc(p.x + 9 + eyeOffsetX + (p.vx < 0 ? -1 : p.vx > 0 ? 1 : 0), p.y + 14, 2, 0, Math.PI * 2);
  ctx.arc(p.x + 19 + eyeOffsetX + (p.vx < 0 ? -1 : p.vx > 0 ? 1 : 0), p.y + 14, 2, 0, Math.PI * 2);
  ctx.fill();

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

  // Portais de saída
  drawDoor(currentFase.doors.p1, '#2ed573', '🍃');
  drawDoor(currentFase.doors.p2, '#9b59b6', '🔮');

  // Desenhar personagens fantasmas
  drawPlayer(player1);
  drawPlayer(player2);

  requestAnimationFrame(gameLoop);
}

gameLoop();