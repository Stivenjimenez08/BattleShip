import React, { useState, useEffect } from "react";
import "./index.css";

const Rows = 10;
const Cols = 10;

const generateBoard = () => {
  const board = [];
  for (let i = 0; i < Rows; i++) {
    const row = Array(Cols).fill(false);
    board.push(row);
  }
  return board;
};

export const BattleshipGame = () => {
  const [board, setBoard] = useState(generateBoard);
  const [ships, setShips] = useState(5);
  const [message, setMessage] = useState("Realiza tu disparo");
  const [shotInput, setShotInput] = useState("");

  const placeShips = () => {
    const newBoard = generateBoard();
    let shipsPlaced = 0;

    while (shipsPlaced < ships) {
      const randomRow = Math.floor(Math.random() * Rows);
      const randomCol = Math.floor(Math.random() * Cols);
      const orientation = Math.floor(Math.random() * 2);

      let validPlacement = true;

      for (let i = 0; i < 4; i++) {
        const row = orientation === 0 ? randomRow + i : randomRow;
        const col = orientation === 1 ? randomCol + i : randomCol;

        if (
          row < 0 ||
          row >= Rows ||
          col < 0 ||
          col >= Cols ||
          !newBoard[row] ||
          newBoard[row][col]
        ) {
          validPlacement = false;
          break;
        }
        if (
          (newBoard[row - 1] && newBoard[row - 1][col]) ||
          (newBoard[row + 1] && newBoard[row + 1][col]) ||
          newBoard[row][col - 1] ||
          newBoard[row][col + 1]
        ) {
          validPlacement = false;
          break;
        }
      }

      if (validPlacement) {
        for (let i = 0; i < 4; i++) {
          const row = orientation === 0 ? randomRow + i : randomRow;
          const col = orientation === 1 ? randomCol + i : randomCol;
          newBoard[row][col] = true;
        }
        shipsPlaced++;
      }
    }
    setBoard(newBoard);
    setMessage("¡Barcos colocados! Listo para jugar");
  };

  const handleShotSubmit = () => {
    const [letter, number] = shotInput.toUpperCase().split("");
    const rowIndex = letter.charCodeAt(0) - 65; // Convertir letra a índice (A=0, B=1, ..., J=9)
    const colIndex = parseInt(number, 10) - 1; // Restar 1 para obtener el índice correcto

    if (rowIndex >= 0 && rowIndex < Rows && colIndex >= 0 && colIndex < Cols) {
      handleCellShot(rowIndex, colIndex);
    } else {
      setMessage("Coordenadas inválidas. Ingresa una casilla válida.");
    }
  };

  const handleCellShot = (row, col) => {

    if (board[row][col] === true) {

      console.log("Celda clickeada:", row, col);

      const newBoard = [...board];
      newBoard[row][col] = "hit";

      let shipSunk = true;

      for (let i = 0; i < 4; i++) {

        const currentRow = row ;
        const currentCol = col + i;
        console.log(`Verificando posición ${i}:`);
        
        if (
          currentRow < Rows &&
          currentCol < Cols &&
          newBoard[currentRow][currentCol] !== "hit"
        ) {
          shipSunk = false;
          break;
        }
      }

      if (shipSunk) {
        setShips(ships - 1);

        if (ships - 1 === 0) {

          setMessage("¡Felicidades, has hundido todos los barcos! Has ganado");
        } else {

          setMessage("¡Barco hundido! Quedan " + (ships - 1) + " barcos");
        }
      } else {

        setMessage("¡Has acertado una posición, sigue intentando!");
      }

      setBoard(newBoard);
      console.log("Tablero actualizado:", newBoard);

    } else if (board[row][col] !== "hit") {
      
      setMessage("Agua, intenta de nuevo.");

      const newBoard = [...board];
      newBoard[row][col] = "miss";
      setBoard(newBoard);
    }

    setTimeout(() => {

      setMessage("Dispara de nuevo");
    }, 2000);
  };

  useEffect(() => {
    if (ships === 0) {

      setMessage("¡Felicidades, has hundido todos los barcos!");
    }
  }, [ships]);

  useEffect(() => {
    placeShips();
  }, []);

  return (
    <div className="container">
      <h2>{message}</h2>
      <div className="container-text">
        <label className="text">
          Ingresa la casilla (ejemplo: A1):
        </label>
        <input
            className="input-text"
            type="text"
            value={shotInput}
            onChange={(e) => setShotInput(e.target.value)}
          />
        <button className='btnShot' onClick={handleShotSubmit}>Disparar</button>
      </div>

      <table>
        <thead>
          <tr>
            <th></th>
            {[...Array(Cols)].map((_, index) => (
              <th key={index + 1} style={{ textAlign: "center"}}>
                {index + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(Rows)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              <td style={{ textAlign: "center" }}>
                {String.fromCharCode(65 + rowIndex)}
              </td>
              {[...Array(Cols)].map((_, colIndex) => (
                <td
                  key={colIndex}
                  style={{ textAlign: "center" }}
                  className={
                    board[rowIndex][colIndex] === "hit"
                      ? "hit"
                      : board[rowIndex][colIndex] === "miss"
                      ? "miss"
                      : ""
                  }
                >
                  {board[rowIndex][colIndex] === "hit"
                    ? "X"
                    : board[rowIndex][colIndex] === "miss"
                    ? "O"
                    : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};