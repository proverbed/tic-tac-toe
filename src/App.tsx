import { useState } from "react";
import Gameboard, { Nullable } from "./components/Gameboard";
import Player from "./components/Player";
import { WINNING_COMBINATIONS } from "./components/winning-combinations";
import GameOver from "./components/GameOver";

export type GameTurn = {
  player: XOEnum;
  square: {
    row: number;
    col: number;
  };
};

type typePlayers = {
  X: string;
  O: string;
};

export enum XOEnum {
  X = "X",
  O = "O",
}

const INITIAL_GAMEBOARD: Nullable<XOEnum>[][] = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const PLAYERS: typePlayers = {
  X: "Player 1",
  O: "Player 2",
};

const deriveActivePlayer = (gameTurns: GameTurn[]) => {
  let activePlayer = XOEnum.X;
  if (gameTurns.length > 0 && gameTurns[0].player === XOEnum.X) {
    activePlayer = XOEnum.O;
  }
  return activePlayer;
};

function App() {
  const [gameTurns, setGameTurns] = useState<GameTurn[]>([]);
  const [players, setPlayers] = useState<typePlayers>(PLAYERS);
  let activePlayer = deriveActivePlayer(gameTurns);
  let gameboard: Nullable<XOEnum>[][] = [
    ...INITIAL_GAMEBOARD.map((item) => [...item]),
  ];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameboard[row][col] = player;
  }
  let winner: string | undefined = undefined;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameboard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameboard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameboard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }

  const hasDraw = gameTurns.length === 9 && winner === undefined;

  const handleSelectSquare = (rowIndex: number, colIndex: number) => {
    setGameTurns((prevState) => {
      let currentPlayer = deriveActivePlayer(prevState);

      const updatedTurns = [
        {
          square: {
            row: rowIndex,
            col: colIndex,
          },
          player: currentPlayer,
        },
        ...prevState,
      ];

      return updatedTurns;
    });
  };

  const handleRestart = () => {
    setGameTurns([]);
  };

  const handlePlayerNameChange = (symbol: XOEnum, newName: string) => {
    setPlayers((prevState) => {
      let newState = { ...prevState };
      newState[symbol] = newName;

      return newState;
    });
  };

  return (
    <>
      <main>
        <div id="game-container">
          <ol id="players" className="highlight-player">
            <Player
              name={PLAYERS.X}
              symbol={XOEnum.X}
              isActive={activePlayer === XOEnum.X}
              onChangeName={handlePlayerNameChange}
            />
            <Player
              name={PLAYERS.O}
              symbol={XOEnum.O}
              isActive={activePlayer === XOEnum.O}
              onChangeName={handlePlayerNameChange}
            />
          </ol>
          {(winner || hasDraw) && (
            <GameOver winner={winner} onRestart={handleRestart} />
          )}
          <Gameboard onSelectSquare={handleSelectSquare} board={gameboard} />
        </div>
      </main>
    </>
  );
}

export default App;
