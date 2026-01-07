const canvas = document.getElementById("game");
if (!canvas) {
    throw new Error("Canvas not found");
}
const ctx = canvas.getContext("2d");
if (!ctx) {
    throw new Error("2D context not available");
}
const statsEl = document.getElementById("stats");
const towerListEl = document.getElementById("towerList");
const startWaveBtn = document.getElementById("startWave");
const resetBtn = document.getElementById("resetGame");
const toggleSoundBtn = document.getElementById("toggleSound");
const defeatModal = document.getElementById("defeatModal");
const defeatReset = document.getElementById("defeatReset");
const factionLabel = document.getElementById("factionLabel");
if (!statsEl ||
    !towerListEl ||
    !startWaveBtn ||
    !resetBtn ||
    !toggleSoundBtn ||
    !defeatModal ||
    !defeatReset ||
    !factionLabel) {
    throw new Error("HUD elements missing");
}
const grid = { cols: 16, rows: 9 };
const gameState = {
    gold: 140,
    lives: 15,
    wave: 1,
    towers: [],
    enemies: [],
    projectiles: [],
    selectedTower: null,
    waves: [],
    isCountingDown: false,
    countdownRemaining: 0,
    elapsed: 0,
    soundEnabled: true,
};
const towerTypes = [
    {
        id: "mage",
        name: "Arcane Tower",
        cost: 60,
        range: 2.3,
        rate: 0.9,
        damage: 14,
        color: "#7fd1b9",
        description: "Magic bolts, long range.",
    },
    {
        id: "archer",
        name: "Elven Archer",
        cost: 45,
        range: 1.9,
        rate: 0.6,
        damage: 8,
        color: "#e7c27d",
        description: "Fast arrows.",
    },
    {
        id: "blade",
        name: "Sword Guard",
        cost: 35,
        range: 1.4,
        rate: 0.5,
        damage: 11,
        color: "#d16f7a",
        description: "Short reach, hard hit.",
    },
];
const pathPoints = [
    { x: 0, y: 4 },
    { x: 4, y: 4 },
    { x: 4, y: 2 },
    { x: 9, y: 2 },
    { x: 9, y: 6 },
    { x: 14, y: 6 },
    { x: 15, y: 7 },
];
const pathTiles = new Set();
for (let i = 0; i < pathPoints.length - 1; i += 1) {
    const start = pathPoints[i];
    const end = pathPoints[i + 1];
    const dx = Math.sign(end.x - start.x);
    const dy = Math.sign(end.y - start.y);
    let x = start.x;
    let y = start.y;
    pathTiles.add(`${x},${y}`);
    while (x !== end.x || y !== end.y) {
        x += dx;
        y += dy;
        pathTiles.add(`${x},${y}`);
    }
}
const enemySprites = {
    humans: {
        pixels: [
            "..ss....",
            ".sppp...",
            "spppps..",
            "spccps..",
            ".sppp...",
            "..ss....",
            ".s..s...",
            "s....s..",
        ],
        colors: {
            s: "#c7c0b5",
            p: "#7a6b62",
            c: "#c14a3f",
        },
    },
    orcs: {
        pixels: [
            "..gg....",
            ".gllg...",
            "gllllg..",
            "gkllkg..",
            ".gggg...",
            "..gg....",
            ".g..g...",
            "g....g..",
        ],
        colors: {
            g: "#5f8f4a",
            l: "#2f2a25",
            k: "#c14a3f",
        },
    },
    elves: {
        pixels: [
            "..ee....",
            ".eppp...",
            "eppppe..",
            "epffee..",
            ".eppp...",
            "..ee....",
            ".e..e...",
            "e....e..",
        ],
        colors: {
            e: "#6aa88f",
            p: "#e7e1d6",
            f: "#cfa94a",
        },
    },
    undead: {
        pixels: [
            "..uu....",
            ".uqqq...",
            "uqqqqu..",
            "uqrrqu..",
            ".uqqq...",
            "..uu....",
            ".u..u...",
            "u....u..",
        ],
        colors: {
            u: "#6e8a8f",
            q: "#2b3a3d",
            r: "#9fc4c9",
        },
    },
    dwarves: {
        pixels: [
            "..dd....",
            ".dppp...",
            "dppppd..",
            "dpbbpd..",
            ".dppp...",
            "..dd....",
            ".d..d...",
            "d....d..",
        ],
        colors: {
            d: "#b07a4a",
            p: "#f0dfc2",
            b: "#5a4b40",
        },
    },
    spirits: {
        pixels: [
            "..ss....",
            ".swws...",
            "swwwws..",
            "swttws..",
            ".swws...",
            "..ss....",
            ".s..s...",
            "s....s..",
        ],
        colors: {
            s: "#9bd2ff",
            w: "#e7f4ff",
            t: "#6aa6d6",
        },
    },
    demons: {
        pixels: [
            "..dd....",
            ".drrd...",
            "drrrrd..",
            "drkkrd..",
            ".drrd...",
            "..dd....",
            ".d..d...",
            "d....d..",
        ],
        colors: {
            d: "#b12c2c",
            r: "#f2b0a0",
            k: "#4a1c1c",
        },
    },
    dragons: {
        pixels: [
            "..gg....",
            ".gddg...",
            "gddddg..",
            "gdffdg..",
            ".gddg...",
            "..gg....",
            ".g..g...",
            "g....g..",
        ],
        colors: {
            g: "#cf8a3d",
            d: "#f2d5a0",
            f: "#6b3c1d",
        },
    },
};
const towerSprites = {
    mage: {
        pixels: [
            "..nn....",
            ".nppn...",
            "nppppn..",
            "npccpn..",
            ".nppn...",
            "..bb....",
            ".b..b...",
            "b....b..",
        ],
        colors: {
            n: "#6d5a94",
            p: "#f4efe6",
            c: "#7fd1b9",
            b: "#3c6e63",
        },
    },
    archer: {
        pixels: [
            "..yy....",
            ".yppp...",
            "yppppy..",
            "ypggpy..",
            ".yppp...",
            "..gg....",
            ".g..g...",
            "g....g..",
        ],
        colors: {
            y: "#e7c27d",
            p: "#f4efe6",
            g: "#6a8754",
        },
    },
    blade: {
        pixels: [
            "..rr....",
            ".rppp...",
            "rppppr..",
            "rpqqpr..",
            ".rppp...",
            "..ss....",
            ".s..s...",
            "s....s..",
        ],
        colors: {
            r: "#d16f7a",
            p: "#f4efe6",
            s: "#7a6b62",
            q: "#c7c0b5",
        },
    },
};
const factionProgression = [
    { id: "humans", name: "Human Vanguard", start: 1, end: 10 },
    { id: "orcs", name: "Orc Marauders", start: 11, end: 20 },
    { id: "elves", name: "Elven Raiders", start: 21, end: 30 },
    { id: "undead", name: "Undead Legion", start: 31, end: 40 },
    { id: "dwarves", name: "Dwarven Reavers", start: 41, end: 50 },
    { id: "spirits", name: "Spirit Host", start: 51, end: 60 },
    { id: "demons", name: "Demonic Horde", start: 61, end: 70 },
    { id: "dragons", name: "Dragonkin", start: 71, end: 9999 },
];
function getFactionForWave(waveNumber) {
    return (factionProgression.find((faction) => waveNumber >= faction.start && waveNumber <= faction.end) ??
        factionProgression[factionProgression.length - 1]);
}
function updateFactionLabel() {
    const faction = getFactionForWave(gameState.wave);
    factionLabel.textContent = `Enemy Faction: ${faction.name}`;
}
function drawPixelSprite(centerX, centerY, pixels, colors, pixelSize) {
    const height = pixels.length;
    const width = pixels[0]?.length ?? 0;
    const startX = centerX - (width * pixelSize) / 2;
    const startY = centerY - (height * pixelSize) / 2;
    for (let row = 0; row < height; row += 1) {
        const line = pixels[row];
        for (let col = 0; col < width; col += 1) {
            const key = line[col];
            if (key === "." || !key)
                continue;
            const color = colors[key];
            if (!color)
                continue;
            ctx.fillStyle = color;
            ctx.fillRect(startX + col * pixelSize, startY + row * pixelSize, pixelSize, pixelSize);
        }
    }
}
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
function tileSize() {
    return Math.min(canvas.clientWidth / grid.cols, canvas.clientHeight / grid.rows);
}
function tileCenter(col, row) {
    const size = tileSize();
    return {
        x: col * size + size * 0.5,
        y: row * size + size * 0.5,
    };
}
function screenToGrid(x, y) {
    const size = tileSize();
    return {
        col: Math.floor(x / size),
        row: Math.floor(y / size),
    };
}
function canPlaceTower(col, row) {
    if (col < 0 || row < 0 || col >= grid.cols || row >= grid.rows)
        return false;
    if (pathTiles.has(`${col},${row}`))
        return false;
    return !gameState.towers.some((tower) => tower.col === col && tower.row === row);
}
function addTower(col, row, type) {
    gameState.towers.push({
        id: crypto.randomUUID(),
        col,
        row,
        type,
        cooldown: 0,
    });
}
let audioCtx = null;
let isLoading = false;
let isDefeated = false;
const STORAGE_KEY = "fantasy-td-save";
function saveGame() {
    const data = {
        gold: gameState.gold,
        lives: gameState.lives,
        wave: gameState.wave,
        soundEnabled: gameState.soundEnabled,
        selectedTowerId: gameState.selectedTower ? gameState.selectedTower.id : null,
        towers: gameState.towers.map((tower) => ({
            col: tower.col,
            row: tower.row,
            typeId: tower.type.id,
        })),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function loadGame() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
        return;
    try {
        const data = JSON.parse(raw);
        gameState.gold = data.gold ?? gameState.gold;
        gameState.lives = data.lives ?? gameState.lives;
        gameState.wave = data.wave ?? gameState.wave;
        gameState.soundEnabled = data.soundEnabled ?? gameState.soundEnabled;
        gameState.towers = Array.isArray(data.towers)
            ? data.towers
                .map((tower) => {
                const type = towerTypes.find((t) => t.id === tower.typeId);
                if (!type)
                    return null;
                return {
                    id: crypto.randomUUID(),
                    col: tower.col,
                    row: tower.row,
                    type,
                    cooldown: 0,
                };
            })
                .filter((tower) => tower !== null)
            : [];
        const selectedId = data.selectedTowerId;
        if (selectedId) {
            setSelectedTower(selectedId);
        }
    }
    catch (error) {
        console.warn("Failed to load save", error);
    }
}
function unlockAudio() {
    if (!audioCtx) {
        const WebkitAudioContext = window
            .webkitAudioContext;
        audioCtx = window.AudioContext ? new AudioContext() : WebkitAudioContext ? new WebkitAudioContext() : null;
    }
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
}
function playTone({ freq, duration, type, gain }) {
    if (!gameState.soundEnabled)
        return;
    if (!audioCtx)
        return;
    const oscillator = audioCtx.createOscillator();
    const volume = audioCtx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = freq;
    volume.gain.value = gain;
    oscillator.connect(volume);
    volume.connect(audioCtx.destination);
    oscillator.start();
    volume.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    oscillator.stop(audioCtx.currentTime + duration);
}
function playDamageSound(towerTypeId) {
    const base = {
        mage: { freq: 520, type: "triangle", gain: 0.06 },
        archer: { freq: 740, type: "square", gain: 0.05 },
        blade: { freq: 360, type: "square", gain: 0.07 },
    };
    const tone = base[towerTypeId];
    if (!tone)
        return;
    playTone({ ...tone, duration: 0.08 });
}
function spawnEnemy(wave) {
    const hp = 32 + wave.waveNumber * 6;
    const speed = 0.6 + wave.waveNumber * 0.03;
    const faction = getFactionForWave(wave.waveNumber);
    gameState.enemies.push({
        id: crypto.randomUUID(),
        hp,
        maxHp: hp,
        speed,
        waveId: wave.id,
        faction: faction.id,
        targetIndex: 1,
    });
    wave.remainingEnemies += 1;
}
function startNewWave() {
    const waveNumber = gameState.wave;
    const wave = {
        id: crypto.randomUUID(),
        waveNumber,
        spawnTimer: 0.2,
        spawnIndex: 0,
        totalSpawns: 12 + waveNumber * 2,
        remainingEnemies: 0,
    };
    gameState.waves.push(wave);
    gameState.wave += 1;
    saveGame();
}
function updateWaves(dt) {
    for (let i = gameState.waves.length - 1; i >= 0; i -= 1) {
        const wave = gameState.waves[i];
        wave.spawnTimer -= dt;
        if (wave.spawnTimer <= 0 && wave.spawnIndex < wave.totalSpawns) {
            spawnEnemy(wave);
            wave.spawnIndex += 1;
            wave.spawnTimer = 0.7;
        }
        if (wave.spawnIndex >= wave.totalSpawns && wave.remainingEnemies <= 0) {
            gameState.waves.splice(i, 1);
            gameState.gold += 40;
            saveGame();
        }
    }
}
function updateCountdown(dt) {
    if (!gameState.isCountingDown)
        return;
    gameState.countdownRemaining -= dt;
    if (gameState.countdownRemaining <= 0) {
        gameState.isCountingDown = false;
        gameState.countdownRemaining = 0;
    }
}
function updateEnemies(dt) {
    const size = tileSize();
    const turnStrength = 10;
    const waypoint = (index) => ({
        x: pathPoints[index].x * size + size * 0.5,
        y: pathPoints[index].y * size + size * 0.5,
    });
    for (const enemy of gameState.enemies) {
        if (enemy.x === undefined || enemy.y === undefined) {
            const start = waypoint(0);
            enemy.x = start.x;
            enemy.y = start.y;
            enemy.vx = 1;
            enemy.vy = 0;
        }
        const next = pathPoints[enemy.targetIndex];
        if (!next) {
            enemy.reachedEnd = true;
            continue;
        }
        const target = waypoint(enemy.targetIndex);
        const dx = target.x - enemy.x;
        const dy = target.y - enemy.y;
        const dist = Math.hypot(dx, dy);
        if (dist < size * 0.2) {
            enemy.targetIndex += 1;
        }
        const desiredX = dist === 0 ? 0 : dx / dist;
        const desiredY = dist === 0 ? 0 : dy / dist;
        enemy.vx = (enemy.vx ?? desiredX) + (desiredX - (enemy.vx ?? 0)) * Math.min(turnStrength * dt, 1);
        enemy.vy = (enemy.vy ?? desiredY) + (desiredY - (enemy.vy ?? 0)) * Math.min(turnStrength * dt, 1);
        const speed = enemy.speed * size;
        enemy.x += (enemy.vx ?? 0) * speed * dt;
        enemy.y += (enemy.vy ?? 0) * speed * dt;
    }
    for (let i = gameState.enemies.length - 1; i >= 0; i -= 1) {
        const enemy = gameState.enemies[i];
        if (enemy.reachedEnd) {
            gameState.enemies.splice(i, 1);
            gameState.lives -= 1;
            const wave = gameState.waves.find((item) => item.id === enemy.waveId);
            if (wave) {
                wave.remainingEnemies = Math.max(0, wave.remainingEnemies - 1);
            }
            saveGame();
        }
        else if (enemy.hp <= 0) {
            gameState.enemies.splice(i, 1);
            gameState.gold += 8;
            const wave = gameState.waves.find((item) => item.id === enemy.waveId);
            if (wave) {
                wave.remainingEnemies = Math.max(0, wave.remainingEnemies - 1);
            }
            saveGame();
        }
    }
}
function updateTowers(dt) {
    const size = tileSize();
    for (const tower of gameState.towers) {
        tower.cooldown -= dt;
        if (tower.cooldown > 0)
            continue;
        const center = tileCenter(tower.col, tower.row);
        const range = tower.type.range * size;
        let target = null;
        let bestDist = Infinity;
        for (const enemy of gameState.enemies) {
            if (enemy.x === undefined || enemy.y === undefined)
                continue;
            const dx = enemy.x - center.x;
            const dy = enemy.y - center.y;
            const dist = Math.hypot(dx, dy);
            if (dist <= range && dist < bestDist) {
                bestDist = dist;
                target = enemy;
            }
        }
        if (!target)
            continue;
        tower.cooldown = tower.type.rate;
        const maxRange = tower.type.range * size;
        gameState.projectiles.push({
            x: center.x,
            y: center.y,
            target,
            speed: 4.5 * size,
            damage: tower.type.damage,
            color: tower.type.color,
            towerTypeId: tower.type.id,
            originX: center.x,
            originY: center.y,
            maxRange,
        });
    }
}
function updateProjectiles(dt) {
    for (let i = gameState.projectiles.length - 1; i >= 0; i -= 1) {
        const bolt = gameState.projectiles[i];
        if (!bolt.target || bolt.target.hp <= 0) {
            gameState.projectiles.splice(i, 1);
            continue;
        }
        if (bolt.target.x === undefined || bolt.target.y === undefined) {
            gameState.projectiles.splice(i, 1);
            continue;
        }
        const rangeDx = bolt.target.x - bolt.originX;
        const rangeDy = bolt.target.y - bolt.originY;
        if (Math.hypot(rangeDx, rangeDy) > bolt.maxRange) {
            gameState.projectiles.splice(i, 1);
            continue;
        }
        const dx = bolt.target.x - bolt.x;
        const dy = bolt.target.y - bolt.y;
        const dist = Math.hypot(dx, dy);
        const step = bolt.speed * dt;
        if (dist <= step) {
            bolt.target.hp -= bolt.damage;
            playDamageSound(bolt.towerTypeId);
            gameState.projectiles.splice(i, 1);
            continue;
        }
        bolt.x += (dx / dist) * step;
        bolt.y += (dy / dist) * step;
    }
}
function drawGrid(size) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
    for (let c = 0; c <= grid.cols; c += 1) {
        ctx.beginPath();
        ctx.moveTo(c * size, 0);
        ctx.lineTo(c * size, grid.rows * size);
        ctx.stroke();
    }
    for (let r = 0; r <= grid.rows; r += 1) {
        ctx.beginPath();
        ctx.moveTo(0, r * size);
        ctx.lineTo(grid.cols * size, r * size);
        ctx.stroke();
    }
}
function drawPath(size) {
    ctx.fillStyle = "rgba(126, 94, 74, 0.85)";
    for (const tile of pathTiles) {
        const [col, row] = tile.split(",").map(Number);
        ctx.fillRect(col * size, row * size, size, size);
    }
}
function drawTowers(size) {
    for (const tower of gameState.towers) {
        const center = tileCenter(tower.col, tower.row);
        const sprite = towerSprites[tower.type.id];
        const pixelSize = size * 0.07;
        if (sprite) {
            drawPixelSprite(center.x, center.y, sprite.pixels, sprite.colors, pixelSize);
        }
        else {
            ctx.fillStyle = tower.type.color;
            ctx.beginPath();
            ctx.arc(center.x, center.y, size * 0.28, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.arc(center.x, center.y, tower.type.range * size, 0, Math.PI * 2);
        ctx.stroke();
    }
}
function drawEnemies(size) {
    for (const enemy of gameState.enemies) {
        if (enemy.x === undefined || enemy.y === undefined)
            continue;
        const sprite = enemySprites[enemy.faction] ?? enemySprites.orcs;
        drawPixelSprite(enemy.x, enemy.y, sprite.pixels, sprite.colors, size * 0.07);
        const hpWidth = size * 0.5;
        const hpHeight = 4;
        const hpX = enemy.x - hpWidth / 2;
        const hpY = enemy.y - size * 0.35;
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(hpX, hpY, hpWidth, hpHeight);
        ctx.fillStyle = "#89d185";
        ctx.fillRect(hpX, hpY, (hpWidth * Math.max(enemy.hp, 0)) / enemy.maxHp, hpHeight);
    }
}
function drawProjectiles() {
    for (const bolt of gameState.projectiles) {
        const pixelSize = 3;
        ctx.fillStyle = bolt.color;
        ctx.fillRect(bolt.x - pixelSize / 2, bolt.y - pixelSize / 2, pixelSize, pixelSize);
    }
}
function draw() {
    const size = tileSize();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.fillStyle = "#1f1a18";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    drawPath(size);
    drawGrid(size);
    drawTowers(size);
    drawEnemies(size);
    drawProjectiles();
}
function updateStats() {
    statsEl.innerHTML = `Gold: ${gameState.gold} | Lives: ${gameState.lives} | Wave: ${gameState.wave}`;
}
function resetGame() {
    gameState.gold = 140;
    gameState.lives = 15;
    gameState.wave = 1;
    gameState.towers = [];
    gameState.enemies = [];
    gameState.projectiles = [];
    gameState.waves = [];
    gameState.isCountingDown = false;
    gameState.countdownRemaining = 0;
    gameState.elapsed = 0;
    isDefeated = false;
    hideDefeatModal();
    saveGame();
}
function startWave() {
    if (gameState.isCountingDown || isDefeated)
        return;
    startNewWave();
    gameState.isCountingDown = true;
    gameState.countdownRemaining = 5;
}
function showDefeatModal() {
    defeatModal.classList.add("open");
    defeatModal.setAttribute("aria-hidden", "false");
}
function hideDefeatModal() {
    defeatModal.classList.remove("open");
    defeatModal.setAttribute("aria-hidden", "true");
}
function updateSoundButton() {
    toggleSoundBtn.textContent = `Sound: ${gameState.soundEnabled ? "On" : "Off"}`;
}
function updateWaveButton() {
    if (gameState.isCountingDown) {
        startWaveBtn.disabled = true;
        const seconds = Math.ceil(gameState.countdownRemaining);
        startWaveBtn.textContent = `Next wave (${Math.max(seconds, 1)})`;
    }
    else {
        startWaveBtn.disabled = false;
        startWaveBtn.textContent = "Start Wave";
    }
}
function setSelectedTower(id) {
    gameState.selectedTower = towerTypes.find((tower) => tower.id === id) || null;
    for (const card of document.querySelectorAll(".tower-card")) {
        card.classList.toggle("active", card.dataset.towerId === id);
    }
    if (!isLoading) {
        saveGame();
    }
}
function buildTowerList() {
    towerListEl.innerHTML = "";
    for (const tower of towerTypes) {
        const card = document.createElement("div");
        card.className = "tower-card";
        card.dataset.towerId = tower.id;
        card.innerHTML = `
      <h4>${tower.name}</h4>
      <p>${tower.description} (${tower.cost}g)</p>
    `;
        card.addEventListener("click", () => setSelectedTower(tower.id));
        towerListEl.appendChild(card);
    }
    setSelectedTower(towerTypes[0].id);
}
function handlePointer(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const { col, row } = screenToGrid(x, y);
    if (!gameState.selectedTower)
        return;
    if (!canPlaceTower(col, row))
        return;
    if (gameState.gold < gameState.selectedTower.cost)
        return;
    addTower(col, row, gameState.selectedTower);
    gameState.gold -= gameState.selectedTower.cost;
    saveGame();
}
canvas.addEventListener("pointerdown", (event) => {
    unlockAudio();
    canvas.setPointerCapture(event.pointerId);
    handlePointer(event);
});
startWaveBtn.addEventListener("click", () => {
    unlockAudio();
    startWave();
    updateWaveButton();
});
resetBtn.addEventListener("click", () => {
    unlockAudio();
    resetGame();
    updateStats();
});
toggleSoundBtn.addEventListener("click", () => {
    unlockAudio();
    gameState.soundEnabled = !gameState.soundEnabled;
    updateSoundButton();
    saveGame();
});
defeatReset.addEventListener("click", () => {
    resetGame();
    updateStats();
});
let lastTime = 0;
function loop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05) || 0;
    lastTime = timestamp;
    if (gameState.lives <= 0) {
        if (!isDefeated) {
            isDefeated = true;
            showDefeatModal();
            saveGame();
        }
        draw();
        updateStats();
        requestAnimationFrame(loop);
        return;
    }
    updateCountdown(dt);
    updateWaves(dt);
    updateEnemies(dt);
    updateTowers(dt);
    updateProjectiles(dt);
    draw();
    updateStats();
    updateFactionLabel();
    updateWaveButton();
    requestAnimationFrame(loop);
}
isLoading = true;
buildTowerList();
loadGame();
isLoading = false;
updateStats();
updateFactionLabel();
updateSoundButton();
updateWaveButton();
requestAnimationFrame(loop);
