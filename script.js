const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const faseSpan = document.getElementById('faseNum');

let faseAtual = 0;

// Definição do Jogador 1 (Fogo / Vermelho) e Jogador 2 (Água / Azul)
const player1 = { 
  x: 50, y: 500, width: 25, height: 35, 
  color: '#ff4757', vx: 0, vy: 0, 
  speed: 4, jump: -10, grounded: false, element: 'fire' 
};

const player2 = { 
  x: 90, y: 500, width: 25, height: 35, 
  color: '#1e90ff', vx: 0, vy: 0, 
  speed: 4, jump: -10, grounded: false, element: 'water' 
};

const gravity = 0.5;
const keys = {};

// Captura de teclas pressionadas
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// 5 FASES com troca de imagem de fundo em tela cheia e obstáculos
const fases = [
  {
    bgImage: 'url("img/fundo.jpg")',
    platforms: [
      { x: 0, y: 560, w: 800, h: 40, color: '#7f8c8d' },
      { x: 200, y: 440, w: 400, h: 20, color: '#7f8c8d' },
      { x: 100, y: 320, w: 200, h: 20, color: '#7f8c8d' },
      { x: 500, y: 320, w: 200, h: 20, color: '#7f8c8d' },
      { x: 300, y: 200, w: 200, h: 20, color: '#7f8c8d' }
    ],
    hazards: [
      { x: 350, y: 550, w: 100, h: 10, type: 'fire', color: '#ff4757' },
      { x: 250, y: 430, w: 80, h: 10, type: 'water', color: '#1e90ff' }
    ],
    doors: { p1: { x: 350, y: 140, w: 30, h: 60 }, p2: { x: 420, y: 140, w: 30, h: 60 } }
  },
  {
    bgImage: 'url("img/outro fundo.jpeg")',
    platforms: [
      { x: 0, y: 560, w: 800, h: 40, color: '#227093' },
      { x: 150, y: 450, w: 150, h: 20, color: '#227093' },
      { x: 500, y: 450, w: 150, h: 20, color: '#227093' },
      { x: 325, y: 330, w: 150, h: 20, color: '#227093' },
      { x: 100, y: 200, w: 600, h: 20, color: '#227093' }
    ],
    hazards: [
      { x: 200, y: 550, w: 400, h: 10, type: 'toxic', color: '#2ecc71' },
      { x: 200, y: 440, w: 50, h: 10, type: 'fire', color: '#ff4757' }
    ],
    doors: { p1: { x: 150, y: 140, w: 30, h: 60 }, p2: { x: 620, y: 140, w: 30, h: 60 } }
  },
  {
    bgImage: 'url("img/fundo.jpg")',
    platforms: [
      { x: 0, y: 560, w: 200, h: 40, color: '#d35400' },
      { x: 600, y: 560, w: 200, h: 40, color: '#d35400' },
      { x: 250, y: 450, w: 300, h: 20, color: '#d35400' },
      { x: 100, y: 320, w: 150, h: 20, color: '#d35400' },
      { x: 550, y: 320, w: 150, h: 20, color: '#d35400' },
      { x: 300, y: 180, w: 200, h: 20, color: '#d35400' }
    ],
    hazards: [
      { x: 200, y: 580, w: 400, h: 20, type: 'fire', color: '#ff4757' },
      { x: 300, y: 440, w: 200, h: 10, type: 'fire', color: '#ff4757' },
      { x: 130, y: 310, w: 50, h: 10, type: 'water', color: '#1e90ff' }
    ],
    doors: { p1: { x: 340, y: 120, w: 30, h: 60 }, p2: { x: 420, y: 120, w: 30, h: 60 } }
  },
  {
    bgImage: 'url("img/outro fundo.jpeg")',
    platforms: [
      { x: 0, y: 560, w: 800, h: 40, color: '#2980b9' },
      { x: 50, y: 420, w: 200, h: 20, color: '#2980b9' },
      { x: 550, y: 420, w: 200, h: 20, color: '#2980b9' },
      { x: 300, y: 300, w: 200, h: 20, color: '#2980b9' },
      { x: 100, y: 180, w: 600, h: 20, color: '#2980b9' }
    ],
    hazards: [
      { x: 100, y: 550, w: 600, h: 10, type: 'water', color: '#1e90ff' },
      { x: 350, y: 290, w: 100, h: 10, type: 'toxic', color: '#2ecc71' }
    ],
    doors: { p1: { x: 120, y: 120, w: 30, h: 60 }, p2: { x: 650, y: 120, w: 30, h: 60 } }
  },
  {
    bgImage: 'url("img/fundo.jpg")',
    platforms: [
      { x: 0, y: 560, w: 150, h: 40, color: '#8e44ad' },
      { x: 650, y: 560, w: 150, h: 40, color: '#8e44ad' },
      { x: 200, y: 460, w: 120, h: 20, color: '#8e44ad' },
      { x: 480, y: 460, w: 120, h: 20, color: '#8e44ad' },
      { x: 340, y: 340, w: 120, h: 20, color: '#8e44ad' },
      { x: 100, y: 220, w: 600, h: 20, color: '#8e44ad' }
    ],
    hazards: [
      { x: 150, y: 580, w: 500, h: 20, type: 'toxic', color: '#2ecc71' },
      { x: 220, y: 450, w: 80, h: 10, type: 'fire', color: '#ff4757' },
      { x: 500, y: 450, w: 80, h: 10, type: 'water', color: '#1e90ff' }
    ],
    doors: { p1: { x: 360, y: 160, w: 30, h: 60 }, p2: { x: 410, y: 160, w: 30, h: 60 } }
  }
];

function resetPlayerPos() {
  player1.x = 50; player1.y = 480; player1.vx = 0; player1.vy = 0;
  player2.x = 90; player2.y = 480; player2.vx = 0; player2.vy = 0;
}

function updateControls() {
  // P1 (Fogo) - W, A, D
  if (keys['KeyA']) player1.vx = -player1.speed;
  else if (keys['KeyD']) player1.vx = player1.speed;
  else player1.vx = 0;

  if (keys['KeyW'] && player1.grounded) {
    player1.vy = player1.jump;
    player1.grounded = false;
  }

  // P2 (Água) - Setas
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
      if (h.type === 'fire' && p.element !== 'fire') resetPlayerPos();
      if (h.type === 'water' && p.element !== 'water') resetPlayerPos();
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
      faseSpan.textContent = faseAtual + 1;
      resetPlayerPos();
    } else {
      alert("Parabéns! Vocês completaram todas as 5 fases!");
      faseAtual = 0;
      faseSpan.textContent = 1;
      resetPlayerPos();
    }
  }
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

  // Desenha as Plataformas
  for (let plat of currentFase.platforms) {
    ctx.fillStyle = plat.color;
    ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
  }

  // Desenha os Obstáculos
  for (let h of currentFase.hazards) {
    ctx.fillStyle = h.color;
    ctx.fillRect(h.x, h.y, h.w, h.h);
  }

  // Desenha as Portas
  ctx.fillStyle = '#ff4757';
  ctx.fillRect(currentFase.doors.p1.x, currentFase.doors.p1.y, currentFase.doors.p1.w, currentFase.doors.p1.h);
  ctx.fillStyle = '#1e90ff';
  ctx.fillRect(currentFase.doors.p2.x, currentFase.doors.p2.y, currentFase.doors.p2.w, currentFase.doors.p2.h);

  // Desenha os Jogadores
  ctx.fillStyle = player1.color;
  ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

  ctx.fillStyle = player2.color;
  ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

  requestAnimationFrame(gameLoop);
}

gameLoop();