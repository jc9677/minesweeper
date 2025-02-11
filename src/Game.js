import React, { useState, useEffect } from 'react';

const Game = ({ rows, columns }) => {
  const [grid, setGrid] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');

  useEffect(() => {
    const savedGame = localStorage.getItem('minesweeper');
    if (savedGame) {
      const { savedGrid, savedStatus } = JSON.parse(savedGame);
      setGrid(savedGrid);
      setGameStatus(savedStatus);
    } else {
      generateGrid();
    }
  }, [rows, columns]);

  useEffect(() => {
    localStorage.setItem('minesweeper', JSON.stringify({ savedGrid: grid, savedStatus: gameStatus }));
  }, [grid, gameStatus]);

  const generateGrid = () => {
    const newGrid = Array.from({ length: rows }, () => Array(columns).fill({ revealed: false, mine: false, flag: false, adjacentMines: 0 }));

    // Add mines
    const mineCount = Math.floor(rows * columns * 0.15);
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * columns);
      if (!newGrid[row][col].mine) {
        newGrid[row][col].mine = true;
        minesPlaced++;
      }
    }

    // Calculate adjacent mines
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if (!newGrid[row][col].mine) {
          let adjacentMines = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns && newGrid[newRow][newCol].mine) {
                adjacentMines++;
              }
            }
          }
          newGrid[row][col].adjacentMines = adjacentMines;
        }
      }
    }

    setGrid(newGrid);
  };

  const handleCellClick = (row, col) => {
    if (grid[row][col].revealed || grid[row][col].flag || gameStatus !== 'playing') return;

    const newGrid = [...grid];
    newGrid[row][col].revealed = true;

    if (newGrid[row][col].mine) {
      setGameStatus('lost');
    } else {
      if (newGrid[row][col].adjacentMines === 0) {
        revealAdjacentCells(newGrid, row, col);
      }
      if (checkWin(newGrid)) {
        setGameStatus('won');
      }
    }

    setGrid(newGrid);
  };

  const handleCellRightClick = (e, row, col) => {
    e.preventDefault();
    if (grid[row][col].revealed || gameStatus !== 'playing') return;

    const newGrid = [...grid];
    newGrid[row][col].flag = !newGrid[row][col].flag;
    setGrid(newGrid);
  };

  const revealAdjacentCells = (grid, row, col) => {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns && !grid[newRow][newCol].revealed && !grid[newRow][newCol].mine) {
          grid[newRow][newCol].revealed = true;
          if (grid[newRow][newCol].adjacentMines === 0) {
            revealAdjacentCells(grid, newRow, newCol);
          }
        }
      }
    }
  };

  const checkWin = (grid) => {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if (!grid[row][col].mine && !grid[row][col].revealed) {
          return false;
        }
      }
    }
    return true;
  };

  return (
    <div>
      <h2>Game Status: {gameStatus}</h2>
      <div>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleCellRightClick(e, rowIndex, colIndex)}
                style={{
                  width: 30,
                  height: 30,
                  border: '1px solid black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: cell.revealed ? '#ddd' : '#fff',
                }}
              >
                {cell.revealed && cell.mine ? '💣' : cell.revealed ? cell.adjacentMines : cell.flag ? '🚩' : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game;
