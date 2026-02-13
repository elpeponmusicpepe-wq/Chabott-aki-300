class ChessGame {
    constructor() {
        this.modal = document.getElementById('chess-modal');
        this.boardElement = document.getElementById('chess-board');
        this.statusElement = document.getElementById('chess-status');
        this.closeBtn = document.getElementById('close-chess');
        this.restartBtn = document.getElementById('restart-chess-btn');
        this.gameTabChess = document.getElementById('game-tab-chess');
        this.gameTabHangman = document.getElementById('game-tab-hangman');
        this.gameTabPacman = document.getElementById('game-tab-pacman');
        this.chessPanel = document.getElementById('chess-game-panel');
        this.hangmanPanel = document.getElementById('hangman-game-panel');
        this.pacmanPanel = document.getElementById('pacman-game-panel');

        this.hangmanStatusElement = document.getElementById('hangman-status');
        this.hangmanWordElement = document.getElementById('hangman-word');
        this.hangmanHintElement = document.getElementById('hangman-hint');
        this.hangmanWrongElement = document.getElementById('hangman-wrong');
        this.hangmanLivesElement = document.getElementById('hangman-lives');
        this.hangmanKeyboardElement = document.getElementById('hangman-keyboard');
        this.restartHangmanBtn = document.getElementById('restart-hangman-btn');

        this.pacmanCanvas = document.getElementById('pacman-canvas');
        this.pacmanCtx = this.pacmanCanvas ? this.pacmanCanvas.getContext('2d') : null;
        this.pacmanStatusElement = document.getElementById('pacman-status');
        this.pacmanScoreElement = document.getElementById('pacman-score');
        this.restartPacmanBtn = document.getElementById('restart-pacman-btn');

        this.pieceSymbols = {
            w: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
            b: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
        };

        this.pieceValues = {
            king: 100,
            queen: 9,
            rook: 5,
            bishop: 3,
            knight: 3,
            pawn: 1
        };

        this.selected = null;
        this.targets = [];
        this.turn = 'w';
        this.gameOver = false;
        this.board = [];

        this.medicalWords = [
            { word: 'FARMACIA', hint: 'Lugar donde se dispensan medicamentos' },
            { word: 'PEDIATRIA', hint: 'Especialidad médica infantil' },
            { word: 'KINESIOLOGIA', hint: 'Terapia física y rehabilitación' },
            { word: 'CIRUGIA', hint: 'Especialidad de intervenciones quirúrgicas' },
            { word: 'RECETA', hint: 'Documento para indicar medicamentos' },
            { word: 'DIAGNOSTICO', hint: 'Conclusión médica sobre una enfermedad' },
            { word: 'INSULINA', hint: 'Hormona usada en tratamiento de diabetes' },
            { word: 'VACUNA', hint: 'Prevención inmunológica de enfermedades' },
            { word: 'ANALISIS', hint: 'Estudio de laboratorio clínico' },
            { word: 'CONSULTA', hint: 'Atención médica con profesional de salud' }
        ];

        this.hangmanWord = '';
        this.hangmanHint = '';
        this.hangmanGuessed = new Set();
        this.hangmanWrong = [];
        this.hangmanLives = 6;
        this.hangmanOver = false;

        this.pacmanMapTemplate = [
            '#####################',
            '#P.......#.......G..#',
            '#.###.##.#.##.###...#',
            '#.....##...##.......#',
            '#.###.#####.###.###.#',
            '#.....#...#.....#...#',
            '#.###.#.#.#.###.#.#.#',
            '#...#...#...#...#...#',
            '#.#.#####.#####.#.#.#',
            '#...................#',
            '#####################'
        ];
        this.pacmanMap = [];
        this.pacmanPellets = 0;
        this.pacmanPlayer = { x: 1, y: 1, dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 } };
        this.pacmanGhost = { x: 18, y: 1, dir: { x: -1, y: 0 } };
        this.pacmanScore = 0;
        this.pacmanOver = false;
        this.pacmanLoop = null;
        this.pacmanCell = 20;
        this.pacmanTick = 0;
        this.pacmanKeyHandler = (event) => this.handlePacmanKeydown(event);

        this.setupListeners();
        this.resetGame();
        this.startHangman();
        this.initPacman(true);
    }

    setupListeners() {
        if (!this.modal) return;

        this.closeBtn?.addEventListener('click', () => this.close());
        this.restartBtn?.addEventListener('click', () => this.resetGame());
        this.restartHangmanBtn?.addEventListener('click', () => this.startHangman());
        this.restartPacmanBtn?.addEventListener('click', () => this.initPacman(true));
        this.gameTabChess?.addEventListener('click', () => this.switchGame('chess'));
        this.gameTabHangman?.addEventListener('click', () => this.switchGame('hangman'));
        this.gameTabPacman?.addEventListener('click', () => this.switchGame('pacman'));

        this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        });

        this.boardElement?.addEventListener('click', (event) => {
            const square = event.target.closest('.chess-square');
            if (!square || this.gameOver || this.turn !== 'w') return;

            const row = Number(square.dataset.row);
            const col = Number(square.dataset.col);
            this.onSquareClick(row, col);
        });

        document.addEventListener('keydown', this.pacmanKeyHandler);
    }

    open() {
        if (!this.modal) return;
        this.switchGame('chess');
        this.modal.classList.add('open');
    }

    close() {
        if (!this.modal) return;
        this.stopPacmanLoop();
        this.modal.classList.remove('open');
    }

    switchGame(game) {
        const showChess = game === 'chess';
        const showHangman = game === 'hangman';
        const showPacman = game === 'pacman';

        this.gameTabChess?.classList.toggle('active', showChess);
        this.gameTabHangman?.classList.toggle('active', showHangman);
        this.gameTabPacman?.classList.toggle('active', showPacman);
        this.chessPanel?.classList.toggle('active', showChess);
        this.hangmanPanel?.classList.toggle('active', showHangman);
        this.pacmanPanel?.classList.toggle('active', showPacman);

        if (showPacman) {
            this.startPacmanLoop();
        } else {
            this.stopPacmanLoop();
        }
    }

    resetGame() {
        this.board = this.createInitialBoard();
        this.selected = null;
        this.targets = [];
        this.turn = 'w';
        this.gameOver = false;
        this.setStatus('Tu turno (blancas)');
        this.renderBoard();
    }

    createInitialBoard() {
        return [
            [this.piece('b', 'rook'), this.piece('b', 'knight'), this.piece('b', 'bishop'), this.piece('b', 'queen'), this.piece('b', 'king'), this.piece('b', 'bishop'), this.piece('b', 'knight'), this.piece('b', 'rook')],
            [this.piece('b', 'pawn'), this.piece('b', 'pawn'), this.piece('b', 'pawn'), this.piece('b', 'pawn'), this.piece('b', 'pawn'), this.piece('b', 'pawn'), this.piece('b', 'pawn'), this.piece('b', 'pawn')],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [this.piece('w', 'pawn'), this.piece('w', 'pawn'), this.piece('w', 'pawn'), this.piece('w', 'pawn'), this.piece('w', 'pawn'), this.piece('w', 'pawn'), this.piece('w', 'pawn'), this.piece('w', 'pawn')],
            [this.piece('w', 'rook'), this.piece('w', 'knight'), this.piece('w', 'bishop'), this.piece('w', 'queen'), this.piece('w', 'king'), this.piece('w', 'bishop'), this.piece('w', 'knight'), this.piece('w', 'rook')]
        ];
    }

    piece(color, type) {
        return { color, type };
    }

    setStatus(text) {
        if (this.statusElement) {
            this.statusElement.textContent = text;
        }
    }

    renderBoard() {
        if (!this.boardElement) return;

        const targetSet = new Set(this.targets.map((move) => `${move.toRow}-${move.toCol}`));

        this.boardElement.innerHTML = this.board
            .map((row, rowIndex) => row
                .map((square, colIndex) => {
                    const colorClass = (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark';
                    const isSelected = this.selected && this.selected.row === rowIndex && this.selected.col === colIndex;
                    const isTarget = targetSet.has(`${rowIndex}-${colIndex}`);
                    const selectedClass = isSelected ? ' selected' : '';
                    const targetClass = isTarget ? ' target' : '';
                    const symbol = square ? this.pieceSymbols[square.color][square.type] : '';
                    const aria = square ? `${square.type} ${square.color === 'w' ? 'blancas' : 'negras'}` : 'casilla vacía';

                    return `<button class="chess-square ${colorClass}${selectedClass}${targetClass}" data-row="${rowIndex}" data-col="${colIndex}" aria-label="${aria}">${symbol}</button>`;
                })
                .join(''))
            .join('');
    }

    onSquareClick(row, col) {
        const piece = this.board[row][col];

        if (this.selected) {
            const move = this.targets.find((targetMove) => targetMove.toRow === row && targetMove.toCol === col);
            if (move) {
                this.applyMove(move);
                return;
            }
        }

        if (piece && piece.color === 'w') {
            this.selected = { row, col };
            this.targets = this.getLegalMoves(row, col);
        } else {
            this.selected = null;
            this.targets = [];
        }

        this.renderBoard();
    }

    applyMove(move) {
        const movingPiece = this.board[move.fromRow][move.fromCol];
        const capturedPiece = this.board[move.toRow][move.toCol];

        this.board[move.toRow][move.toCol] = movingPiece;
        this.board[move.fromRow][move.fromCol] = null;

        if (movingPiece.type === 'pawn' && (move.toRow === 0 || move.toRow === 7)) {
            this.board[move.toRow][move.toCol] = this.piece(movingPiece.color, 'queen');
        }

        this.selected = null;
        this.targets = [];
        this.renderBoard();

        if (capturedPiece && capturedPiece.type === 'king') {
            this.gameOver = true;
            this.setStatus(movingPiece.color === 'w' ? '¡Ganaste! Derrotaste a AKI 🎉' : 'AKI ganó la partida');
            return;
        }

        this.turn = this.turn === 'w' ? 'b' : 'w';

        if (this.turn === 'b') {
            this.setStatus('Turno de AKI...');
            setTimeout(() => this.playAIMove(), 450);
        } else {
            this.setStatus('Tu turno (blancas)');
        }
    }

    playAIMove() {
        if (this.gameOver || this.turn !== 'b') return;

        const allMoves = this.getAllMoves('b');
        if (allMoves.length === 0) {
            this.gameOver = true;
            this.setStatus('No hay más movimientos para AKI. ¡Empate!');
            return;
        }

        const captureMoves = allMoves.filter((move) => move.capture);
        let selectedMove = null;

        if (captureMoves.length > 0) {
            selectedMove = captureMoves.sort((a, b) => (this.pieceValues[b.capture.type] || 0) - (this.pieceValues[a.capture.type] || 0))[0];
        } else {
            selectedMove = allMoves[Math.floor(Math.random() * allMoves.length)];
        }

        this.applyMove(selectedMove);
    }

    getAllMoves(color) {
        const moves = [];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    moves.push(...this.getLegalMoves(row, col));
                }
            }
        }

        return moves;
    }

    getLegalMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];

        const moves = [];

        if (piece.type === 'pawn') {
            const direction = piece.color === 'w' ? -1 : 1;
            const startRow = piece.color === 'w' ? 6 : 1;

            const nextRow = row + direction;
            if (this.inBounds(nextRow, col) && !this.board[nextRow][col]) {
                moves.push(this.move(row, col, nextRow, col));

                const doubleRow = row + direction * 2;
                if (row === startRow && !this.board[doubleRow][col]) {
                    moves.push(this.move(row, col, doubleRow, col));
                }
            }

            for (const offset of [-1, 1]) {
                const targetCol = col + offset;
                if (!this.inBounds(nextRow, targetCol)) continue;

                const targetPiece = this.board[nextRow][targetCol];
                if (targetPiece && targetPiece.color !== piece.color) {
                    moves.push(this.move(row, col, nextRow, targetCol, targetPiece));
                }
            }
        }

        if (piece.type === 'knight') {
            const jumps = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1]
            ];

            jumps.forEach(([rowStep, colStep]) => {
                const toRow = row + rowStep;
                const toCol = col + colStep;
                if (!this.inBounds(toRow, toCol)) return;

                const target = this.board[toRow][toCol];
                if (!target || target.color !== piece.color) {
                    moves.push(this.move(row, col, toRow, toCol, target || null));
                }
            });
        }

        if (piece.type === 'bishop' || piece.type === 'rook' || piece.type === 'queen') {
            const directions = [];

            if (piece.type === 'bishop' || piece.type === 'queen') {
                directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
            }
            if (piece.type === 'rook' || piece.type === 'queen') {
                directions.push([-1, 0], [1, 0], [0, -1], [0, 1]);
            }

            directions.forEach(([rowStep, colStep]) => {
                let toRow = row + rowStep;
                let toCol = col + colStep;

                while (this.inBounds(toRow, toCol)) {
                    const target = this.board[toRow][toCol];
                    if (!target) {
                        moves.push(this.move(row, col, toRow, toCol));
                    } else {
                        if (target.color !== piece.color) {
                            moves.push(this.move(row, col, toRow, toCol, target));
                        }
                        break;
                    }
                    toRow += rowStep;
                    toCol += colStep;
                }
            });
        }

        if (piece.type === 'king') {
            for (let rowStep = -1; rowStep <= 1; rowStep++) {
                for (let colStep = -1; colStep <= 1; colStep++) {
                    if (rowStep === 0 && colStep === 0) continue;

                    const toRow = row + rowStep;
                    const toCol = col + colStep;
                    if (!this.inBounds(toRow, toCol)) continue;

                    const target = this.board[toRow][toCol];
                    if (!target || target.color !== piece.color) {
                        moves.push(this.move(row, col, toRow, toCol, target || null));
                    }
                }
            }
        }

        return moves;
    }

    move(fromRow, fromCol, toRow, toCol, capture = null) {
        return { fromRow, fromCol, toRow, toCol, capture };
    }

    inBounds(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    startHangman() {
        const selected = this.medicalWords[Math.floor(Math.random() * this.medicalWords.length)];
        this.hangmanWord = selected.word;
        this.hangmanHint = selected.hint;
        this.hangmanGuessed = new Set();
        this.hangmanWrong = [];
        this.hangmanLives = 6;
        this.hangmanOver = false;

        this.renderHangman();
    }

    renderHangman() {
        if (!this.hangmanWordElement) return;

        const masked = this.hangmanWord
            .split('')
            .map((char) => (this.hangmanGuessed.has(char) ? char : '_'))
            .join(' ');

        this.hangmanWordElement.textContent = masked;
        this.hangmanHintElement.textContent = `Pista: ${this.hangmanHint}`;
        this.hangmanWrongElement.textContent = `Letras incorrectas: ${this.hangmanWrong.join(', ') || '-'}`;
        this.hangmanLivesElement.textContent = `Intentos restantes: ${this.hangmanLives}`;

        if (this.hangmanOver) {
            this.hangmanStatusElement.textContent = this.hangmanLives > 0
                ? '¡Ganaste! Excelente diagnóstico médico 🩺'
                : `Perdiste. La palabra era: ${this.hangmanWord}`;
        } else {
            this.hangmanStatusElement.textContent = 'Adivina la palabra médica de AKI';
        }

        this.renderHangmanKeyboard();
    }

    renderHangmanKeyboard() {
        if (!this.hangmanKeyboardElement) return;

        const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

        this.hangmanKeyboardElement.innerHTML = letters
            .map((letter) => {
                const used = this.hangmanGuessed.has(letter) || this.hangmanWrong.includes(letter) || this.hangmanOver;
                return `<button class="hangman-key" data-letter="${letter}" ${used ? 'disabled' : ''}>${letter}</button>`;
            })
            .join('');

        this.hangmanKeyboardElement.querySelectorAll('.hangman-key').forEach((key) => {
            key.addEventListener('click', () => this.guessHangmanLetter(key.dataset.letter));
        });
    }

    guessHangmanLetter(letter) {
        if (this.hangmanOver) return;

        if (this.hangmanWord.includes(letter)) {
            this.hangmanGuessed.add(letter);
        } else if (!this.hangmanWrong.includes(letter)) {
            this.hangmanWrong.push(letter);
            this.hangmanLives -= 1;
        }

        const allGuessed = this.hangmanWord
            .split('')
            .every((char) => this.hangmanGuessed.has(char));

        if (allGuessed || this.hangmanLives <= 0) {
            this.hangmanOver = true;
        }

        this.renderHangman();
    }

    initPacman(resetScore = false) {
        this.pacmanMap = this.pacmanMapTemplate.map((row) => row.split(''));
        this.pacmanPellets = 0;

        if (this.pacmanCanvas) {
            const cols = this.pacmanMapTemplate[0].length;
            const rows = this.pacmanMapTemplate.length;
            this.pacmanCanvas.width = cols * this.pacmanCell;
            this.pacmanCanvas.height = rows * this.pacmanCell;
        }

        for (let y = 0; y < this.pacmanMap.length; y++) {
            for (let x = 0; x < this.pacmanMap[y].length; x++) {
                const cell = this.pacmanMap[y][x];
                if (cell === '.') this.pacmanPellets += 1;
                if (cell === 'P') {
                    this.pacmanPlayer = { x, y, dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 } };
                    this.pacmanMap[y][x] = ' ';
                }
                if (cell === 'G') {
                    this.pacmanGhost = { x, y, dir: { x: -1, y: 0 } };
                    this.pacmanMap[y][x] = ' ';
                }
            }
        }

        if (resetScore) {
            this.pacmanScore = 0;
        }

        this.pacmanOver = false;
        this.setPacmanStatus('Usa flechas para mover a AKI-Pacman');
        this.renderPacman();
    }

    setPacmanStatus(text) {
        if (this.pacmanStatusElement) {
            this.pacmanStatusElement.textContent = text;
        }
    }

    startPacmanLoop() {
        if (!this.pacmanCanvas) return;
        if (this.pacmanLoop) return;

        this.pacmanLoop = setInterval(() => {
            this.tickPacman();
        }, 120);
    }

    stopPacmanLoop() {
        if (this.pacmanLoop) {
            clearInterval(this.pacmanLoop);
            this.pacmanLoop = null;
        }
    }

    handlePacmanKeydown(event) {
        if (!this.modal?.classList.contains('open')) return;
        if (!this.pacmanPanel?.classList.contains('active')) return;

        const keyMap = {
            ArrowUp: { x: 0, y: -1 },
            ArrowDown: { x: 0, y: 1 },
            ArrowLeft: { x: -1, y: 0 },
            ArrowRight: { x: 1, y: 0 }
        };

        const dir = keyMap[event.key];
        if (!dir) return;

        event.preventDefault();
        this.pacmanPlayer.nextDir = dir;
    }

    tickPacman() {
        if (this.pacmanOver) return;

        this.pacmanTick += 1;

        this.movePacmanPlayer();
        this.movePacmanGhost();
        this.checkPacmanCollision();
        this.renderPacman();
    }

    movePacmanPlayer() {
        const next = this.pacmanPlayer.nextDir;
        if (next && !this.isPacmanWall(this.pacmanPlayer.x + next.x, this.pacmanPlayer.y + next.y)) {
            this.pacmanPlayer.dir = next;
        }

        const dir = this.pacmanPlayer.dir;
        if (!dir) return;

        const targetX = this.pacmanPlayer.x + dir.x;
        const targetY = this.pacmanPlayer.y + dir.y;
        if (this.isPacmanWall(targetX, targetY)) return;

        this.pacmanPlayer.x = targetX;
        this.pacmanPlayer.y = targetY;

        if (this.pacmanMap[targetY][targetX] === '.') {
            this.pacmanMap[targetY][targetX] = ' ';
            this.pacmanScore += 10;
            this.pacmanPellets -= 1;

            if (this.pacmanPellets <= 0) {
                this.pacmanOver = true;
                this.setPacmanStatus('¡Ganaste! Limpiaste todo el tablero 👑');
                this.stopPacmanLoop();
            }
        }
    }

    movePacmanGhost() {
        const options = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 }
        ].filter((dir) => !this.isPacmanWall(this.pacmanGhost.x + dir.x, this.pacmanGhost.y + dir.y));

        if (options.length === 0) return;

        let selected = options[Math.floor(Math.random() * options.length)];
        const towardPlayer = options.sort((a, b) => {
            const da = Math.abs((this.pacmanGhost.x + a.x) - this.pacmanPlayer.x) + Math.abs((this.pacmanGhost.y + a.y) - this.pacmanPlayer.y);
            const db = Math.abs((this.pacmanGhost.x + b.x) - this.pacmanPlayer.x) + Math.abs((this.pacmanGhost.y + b.y) - this.pacmanPlayer.y);
            return da - db;
        });

        if (Math.random() < 0.65) {
            selected = towardPlayer[0];
        }

        this.pacmanGhost.x += selected.x;
        this.pacmanGhost.y += selected.y;
        this.pacmanGhost.dir = selected;
    }

    checkPacmanCollision() {
        if (this.pacmanPlayer.x === this.pacmanGhost.x && this.pacmanPlayer.y === this.pacmanGhost.y) {
            this.pacmanOver = true;
            this.setPacmanStatus('AKI fantasma te atrapó 👻');
            this.stopPacmanLoop();
        }
    }

    isPacmanWall(x, y) {
        if (y < 0 || y >= this.pacmanMap.length || x < 0 || x >= this.pacmanMap[0].length) {
            return true;
        }
        return this.pacmanMap[y][x] === '#';
    }

    renderPacman() {
        if (!this.pacmanCtx || !this.pacmanCanvas) return;

        const rows = this.pacmanMap.length;
        const cols = this.pacmanMap[0].length;
        const cellW = this.pacmanCanvas.width / cols;
        const cellH = this.pacmanCanvas.height / rows;
        const cell = Math.min(cellW, cellH);

        this.pacmanCtx.clearRect(0, 0, this.pacmanCanvas.width, this.pacmanCanvas.height);

        const bgGradient = this.pacmanCtx.createLinearGradient(0, 0, this.pacmanCanvas.width, this.pacmanCanvas.height);
        bgGradient.addColorStop(0, '#0b1230');
        bgGradient.addColorStop(1, '#070d22');
        this.pacmanCtx.fillStyle = bgGradient;
        this.pacmanCtx.fillRect(0, 0, this.pacmanCanvas.width, this.pacmanCanvas.height);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = this.pacmanMap[y][x];
                const px = x * cellW;
                const py = y * cellH;

                if (cell === '#') {
                    this.pacmanCtx.fillStyle = '#1d4ed8';
                    this.pacmanCtx.strokeStyle = '#67e8f9';
                    this.pacmanCtx.lineWidth = 1.2;
                    this.pacmanCtx.beginPath();
                    this.pacmanCtx.roundRect(px + 1, py + 1, cellW - 2, cellH - 2, 4);
                    this.pacmanCtx.fill();
                    this.pacmanCtx.stroke();
                }

                if (cell === '.') {
                    this.pacmanCtx.fillStyle = '#fde68a';
                    this.pacmanCtx.shadowColor = '#fde68a';
                    this.pacmanCtx.shadowBlur = 8;
                    this.pacmanCtx.beginPath();
                    this.pacmanCtx.arc(px + cellW / 2, py + cellH / 2, Math.min(cellW, cellH) * 0.14, 0, Math.PI * 2);
                    this.pacmanCtx.fill();
                    this.pacmanCtx.shadowBlur = 0;
                }
            }
        }

        const playerCenterX = this.pacmanPlayer.x * cellW + cellW / 2;
        const playerCenterY = this.pacmanPlayer.y * cellH + cellH / 2;
        const playerRadius = cell * 0.38;
        const mouthOpen = 0.16 + Math.abs(Math.sin(this.pacmanTick * 0.45)) * 0.42;
        const playerDir = this.pacmanPlayer.dir || { x: 1, y: 0 };
        const dirAngle = this.getDirectionAngle(playerDir);

        this.pacmanCtx.fillStyle = '#facc15';
        this.pacmanCtx.shadowColor = '#facc15';
        this.pacmanCtx.shadowBlur = 14;
        this.pacmanCtx.beginPath();
        this.pacmanCtx.arc(playerCenterX, playerCenterY, playerRadius, dirAngle + mouthOpen, dirAngle + (Math.PI * 2) - mouthOpen);
        this.pacmanCtx.lineTo(playerCenterX, playerCenterY);
        this.pacmanCtx.fill();
        this.pacmanCtx.shadowBlur = 0;

        const ghostX = this.pacmanGhost.x * cellW + cellW / 2;
        const ghostY = this.pacmanGhost.y * cellH + cellH / 2;
        const ghostR = cell * 0.34;

        this.pacmanCtx.fillStyle = '#f43f5e';
        this.pacmanCtx.shadowColor = '#f43f5e';
        this.pacmanCtx.shadowBlur = 12;
        this.pacmanCtx.beginPath();
        this.pacmanCtx.arc(ghostX, ghostY - ghostR * 0.05, ghostR, Math.PI, 0);
        this.pacmanCtx.lineTo(ghostX + ghostR, ghostY + ghostR);
        this.pacmanCtx.lineTo(ghostX + ghostR * 0.5, ghostY + ghostR * 0.68);
        this.pacmanCtx.lineTo(ghostX, ghostY + ghostR);
        this.pacmanCtx.lineTo(ghostX - ghostR * 0.5, ghostY + ghostR * 0.68);
        this.pacmanCtx.lineTo(ghostX - ghostR, ghostY + ghostR);
        this.pacmanCtx.closePath();
        this.pacmanCtx.fill();
        this.pacmanCtx.shadowBlur = 0;

        this.pacmanCtx.fillStyle = '#ffffff';
        this.pacmanCtx.beginPath();
        this.pacmanCtx.arc(ghostX - ghostR * 0.35, ghostY - ghostR * 0.15, ghostR * 0.22, 0, Math.PI * 2);
        this.pacmanCtx.arc(ghostX + ghostR * 0.35, ghostY - ghostR * 0.15, ghostR * 0.22, 0, Math.PI * 2);
        this.pacmanCtx.fill();

        this.pacmanCtx.fillStyle = '#0f172a';
        this.pacmanCtx.beginPath();
        this.pacmanCtx.arc(ghostX - ghostR * 0.3, ghostY - ghostR * 0.15, ghostR * 0.1, 0, Math.PI * 2);
        this.pacmanCtx.arc(ghostX + ghostR * 0.4, ghostY - ghostR * 0.15, ghostR * 0.1, 0, Math.PI * 2);
        this.pacmanCtx.fill();

        if (this.pacmanScoreElement) {
            this.pacmanScoreElement.textContent = `Puntaje: ${this.pacmanScore} · Puntos restantes: ${this.pacmanPellets}`;
        }
    }

    getDirectionAngle(direction) {
        if (!direction) return 0;
        if (direction.x === 1) return 0;
        if (direction.x === -1) return Math.PI;
        if (direction.y === -1) return -Math.PI / 2;
        if (direction.y === 1) return Math.PI / 2;
        return 0;
    }
}

let chessGame = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        chessGame = new ChessGame();
        window.chessGame = chessGame;
    });
} else {
    chessGame = new ChessGame();
    window.chessGame = chessGame;
}
