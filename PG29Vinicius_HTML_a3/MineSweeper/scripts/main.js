class Cell {
    constructor(row, col, board) {
        this.row = row;
        this.col = col;
        this.board = board;
        this.mine = false;
        this.revealed = false;
        this.flagged = false;
        this.neighborMines = 0;

        // create DOM element
        this.element = document.createElement('div');
        this.element.classList.add('cell');

        // left click
        this.element.addEventListener('click', () => this.reveal());

        // right click
        this.element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.toggleFlag();
        });
    }

    // reveal this cell
    reveal() {
        if (this.revealed || this.flagged || this.board.gameOver) return;
        if (!this.board.timerInterval) this.board.startTimer();

        this.revealed = true;
        this.element.classList.add('revealed');

        if (this.mine) {
            this.element.textContent = '*';
            this.board.endGame(false);
            return;
        }

        if (this.neighborMines > 0) this.element.textContent = this.neighborMines;
        else this.board.revealNeighbors(this.row, this.col);

        this.board.revealedCount++;
        this.board.checkWin();
    }

    // toggle flag
    toggleFlag() {
        if (this.revealed || this.board.gameOver) return;
        this.flagged = !this.flagged;
        this.element.textContent = this.flagged ? '|>' : '';
        this.board.flaggedCount += this.flagged ? 1 : -1;
        this.board.updateMinesLeft();
    }
}

// Board class manages the game
class Board {
    constructor(rows = 16, cols = 16, mines = 40, selector = '.board') {
        this.rows = rows;
        this.cols = cols;
        this.mines = Math.min(mines, rows * cols - 1);
        this.selector = selector;
        this.boardElement = document.querySelector(selector);
        this.minesLeftEl = document.querySelector('.mines-left');
        this.timerEl = document.querySelector('.timer');

        this.init();
    }

    // initialize board
    init() {
        this.stopTimer();
        this.startTimer();

        this.cells = [];
        this.revealedCount = 0;
        this.flaggedCount = 0;
        this.minesLeft = this.mines;
        this.gameOver = false;
        this.updateMinesLeft();

        this.boardElement.innerHTML = '';
        this.boardElement.style.setProperty('--cols', this.cols);
        this.boardElement.style.setProperty('--rows', this.rows);

        for (let r = 0; r < this.rows; r++) {
            this.cells[r] = [];
            for (let c = 0; c < this.cols; c++) {
                const cell = new Cell(r, c, this);
                this.boardElement.appendChild(cell.element);
                this.cells[r][c] = cell;
            }
        }

        this.placeMines();
        this.calculateNumbers();
    }

    // place mines randomly
    placeMines() {
        let placed = 0;
        while (placed < this.mines) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);
            if (!this.cells[r][c].mine) {
                this.cells[r][c].mine = true;
                placed++;
            }
        }
    }

    // count neighbors
    calculateNumbers() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.cells[r][c].mine) continue;
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.cells[nr][nc].mine) count++;
                    }
                }
                this.cells[r][c].neighborMines = count;
            }
        }
    }

    // reveal empty neighbors
    revealNeighbors(r, c) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                    const cell = this.cells[nr][nc];
                    if (!cell.revealed && !cell.flagged) cell.reveal();
                }
            }
        }
    }

    // reveal all mines
    revealAllMines() {
        for (let row of this.cells) {
            for (let cell of row) {
                if (cell.mine) cell.element.textContent = '*';
            }
        }
        this.stopTimer();
    }

    // update mines left display
    updateMinesLeft() {
        const remaining = this.mines - this.flaggedCount;
        if (this.minesLeftEl) this.minesLeftEl.textContent = `Mines: ${String(remaining).padStart(3, '0')}`;
    }

    // start simple timer
    startTimer() {
        if (!this.timerEl) return;
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.startTime = Date.now();
        this.timerEl.textContent = 'Time: 0s';

        this.timerInterval = setInterval(() => {
            const seconds = Math.floor((Date.now() - this.startTime) / 1000);
            this.timerEl.textContent = `Time: ${seconds}s`;
        }, 1000);
    }

    // stop timer
    stopTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    // check win condition
    checkWin() {
        if (this.revealedCount >= this.rows * this.cols - this.mines && !this.gameOver) {
            this.endGame(true);
        }
    }

    // end game
    endGame(won) {
        this.gameOver = true;
        this.stopTimer();
        this.revealAllMines();
        setTimeout(() => alert(won ? 'You win!' : 'Game over!'), 50);
    }
}

// initialize game
document.addEventListener('DOMContentLoaded', () => {
    const rowsInput = document.querySelector('#rowsInput');
    const colsInput = document.querySelector('#colsInput');
    const minesInput = document.querySelector('#minesInput');

    let game = new Board(
        parseInt(rowsInput.value, 10),
        parseInt(colsInput.value, 10),
        parseInt(minesInput.value, 10)
    );

    // restart button
    document.querySelector('#btn-restart')?.addEventListener('click', () => {
        game.stopTimer();
        game = new Board(
            parseInt(rowsInput.value, 10),
            parseInt(colsInput.value, 10),
            parseInt(minesInput.value, 10)
        );
    });

    // difficulty buttons
    document.querySelectorAll('.button[data-diff]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.diff === 'easy') { rowsInput.value = 9; colsInput.value = 9; minesInput.value = 10; }
            else if (btn.dataset.diff === 'medium') { rowsInput.value = 16; colsInput.value = 16; minesInput.value = 40; }
            else if (btn.dataset.diff === 'hard') { rowsInput.value = 16; colsInput.value = 30; minesInput.value = 99; }
            document.querySelector('#btn-restart')?.click();
        });
    });
});
