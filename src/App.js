import React, { useState } from 'react';
import Game from './Game';

const App = () => {
  const [rows, setRows] = useState(10);
  const [columns, setColumns] = useState(10);

  const handleRowsChange = (e) => {
    setRows(e.target.value);
  };

  const handleColumnsChange = (e) => {
    setColumns(e.target.value);
  };

  return (
    <div>
      <h1>Minesweeper</h1>
      <label>
        Rows:
        <input type="number" value={rows} onChange={handleRowsChange} />
      </label>
      <label>
        Columns:
        <input type="number" value={columns} onChange={handleColumnsChange} />
      </label>
      <Game rows={rows} columns={columns} />
    </div>
  );
};

export default App;
