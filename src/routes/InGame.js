import { useState } from "react";
import { Link } from "react-router-dom";

function InGame() {
  const [gameData, setGameData] = useState({
    dices: [0, 0, 0, 0, 0],
  });

  const createDicesList = () => {
    let n = gameData.dices[0] + 1;
    setGameData({ ...gameData, dices: [n, n, n, n, n] });
  };

  return (
    <div className="InGame">
      <Link to="/">
        <button
          type="button"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          home
        </button>
      </Link>
      <div>
        dices: {JSON.stringify(gameData.dices)}
        <button
          type="button"
          className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={createDicesList}
        >
          roll
        </button>
      </div>
    </div>
  );
}

export default InGame;
