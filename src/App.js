/*Se importa la función de React llamada useState para 
permitir al componente recordar cosas*/
import { useState } from 'react';

//Se crea la función que 
  //Usa props para pasar el valor que recibe 
  //onSquareClick para saber que se hizo clic
function Square({ value, onSquareClick }) {
  //regresa un botón o casilla del juego
  return (
    //El botón recibe el valor y la variable va dentro de llaves
      //se asigna el oyente onClick
   <button className="square" onClick={onSquareClick}>
      {value} 
    </button>
  );
}

//Función Board que crea todas las casillas
function Board({ xIsNext, squares, onPlay }) {

  //se crea la funcion handleClick que recibe el índice del cuadrado que debe actualizarse
  function handleClick(i) {
    /*Condiciona sí un jugador a ganado con calculateWinner(squares) 
    o si la casilla ya se selecciono con squares[i]*/
    if (calculateWinner(squares) || squares[i]) {
      //regresa
      return;
    }
    //se crea una copia del array con la función .slice()
    const nextSquares = squares.slice();
    // si es el siguiente jugador
    if (xIsNext) {
      //agrega una X en la casilla
      nextSquares[i] = 'X';
      //sino
    } else {
      //agrega un O en la casilla
      nextSquares[i] = 'O';
    }
    //actualiza con onPlay
    onPlay(nextSquares);
  }

  //ESTADO
  //winner guarda si ha ganado
  const winner = calculateWinner(squares);

  //se declara una variable status
  let status;
  //si hay un ganador
  if (winner) {
    //Dice quien es el que gano 
    status = 'Winner: ' + winner;
  //sino
  } else {
    //devuelve si el siguiente turno de jugador es X o O
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    //Se crean las 9 casillas llamando a la función Square
    <>
      {/*Para mostrar el texto del estado*/}
      <div className="status">{status}</div>

      {/*estan en un div dado que son 3 filas de 3 columnas*/}
      <div className="board-row">
        {/*Cada casilla se asigna su numero propio
            Crea onSquareClick para asignarle un numero
            que le pasa a la función handleClick */}
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

/*componente Game para mostrar una lista de movimientos realizados.
lo usa como componente de nivel superior al Board*/
export default function Game() {

  /*se almacenan las matrices anteriores en la nueva matriz history
  rastreando el historial de movimientos*/
  const [history, setHistory] = useState([Array(9).fill(null)]);

  //currentMove rastrea el paso en el que va el usuario y por defecto es 0
  const [currentMove, setCurrentMove] = useState(0);

  //xIsNext rastrea que jugador es el siguiente
   //% 2 === 0 inidca que es par
  const xIsNext = currentMove % 2 === 0;

  //ultimo movimiento actual del historial
  const currentSquares = history[currentMove];

  
  //handlePlay actualiza el ultimo movimiento
  function handlePlay(nextSquares) {
    //nextHistory mantiene el historial hasta el nuevo movimiento
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    //actualización del numero de movimiento
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  //regresa 
  return (

    <div className="game">
      {/*div para el Board*/}
      <div className="game-board">
        {/*representa el componente Board*/}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      {/*representa info delos movimientos*/}
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

//funcion para saber el ganador y que no haya más turnos
  //no es especifica de React
function calculateWinner(squares) {
  //toma la matriz
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    //evalua 
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      //devuelve x o O
      return squares[a];
    }
  }
  return null;
}
