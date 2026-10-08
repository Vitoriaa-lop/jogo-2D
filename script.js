const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let faseAtual = 0;

// Função para remover 100% do fundo xadrez/cinzento dos sprites
function removeImageBackground(img) {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  
  tempCtx.drawImage(img, 0, 0);
  const imgData = tempCtx.getImageData(0, 0, img.width, img.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(b - r));
    
    const isGreenish = (g > r + 10 && g > b + 10);
    const isPurplish = (r > g + 10 && b > g + 10);

    if (!isGreenish && !isPurplish) {
      data[i + 3] = 0;
    } else if (maxDiff < 25 && (r < 180 && g < 180 && b < 180)) {
      data[i + 3] = 0;
    }
  }

  tempCtx.putImageData(imgData, 0, 0);
  return tempCanvas;
}

let canvasP1 = null;
let canvasP2 = null;

// Carregar Imagens dos Personagens (.jpeg)
const imgPlayer1 = new Image();
imgPlayer1.src = 'img/personagem verde.jpeg';
imgPlayer1.onload = () => {
  canvasP1 = removeImageBackground(imgPlayer1);
};

const imgPlayer2 = new Image();
imgPlayer2.src = 'img/personagem roxo.jpeg';
imgPlayer2.onload = () => {
  canvasP2 = removeImageBackground(imgPlayer2);
};

// Jogadores com direção inicial 'right'
const player1 = { 
  x: 50, y: 435, width: 80, height: 100, 
  glowColor: 'rgba(46, 213, 115, 0.8)',
  vx: 0, vy: 0, 
  speed: 5, jump: -12, grounded: false, element: 'green',
  facing: 'right'
};

const player2 = { 
  x: 140, y: 435, width: 80, height: 100, 
  glowColor: 'rgba(155, 89, 182, 0.8)',
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
  // Controle Player 1 (Verde)
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

  // Controle Player 2 (Roxo)
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

// Desenhar o personagem virando para Esquerda ou Direita
function drawPlayer(p, imgCanvas) {
  if (!imgCanvas) return;

  ctx.save();
  ctx.shadowColor = p.glowColor;
  ctx.shadowBlur = 8;

  // Se estiver virado para a esquerda, espelha a imagem original
  if (p.facing === 'left') {
    ctx.translate(p.x + p.width, p.y);
    ctx.scale(-1, 1);
    ctx.drawImage(imgCanvas, 0, 0, p.width, p.height);
  } else {
    ctx.drawImage(imgCanvas, p.x, p.y, p.width, p.height);
  }

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
  ctx.font = '24px sans-serif';
  ctx.fillText(symbol, door.x + 12, door.y + 52);
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

  // Desenhar os personagens
  drawPlayer(player1, canvasP1);
  drawPlayer(player2, canvasP2);

  requestAnimationFrame(gameLoop);
}

gameLoop();