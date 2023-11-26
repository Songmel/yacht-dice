import { useState, useEffect } from "react";
//import { Link } from "react-router-dom";

//svg 파일들 임포트
import { ReactComponent as Dice1 } from "../assets/Dice1.svg";
import { ReactComponent as Dice2 } from "../assets/Dice2.svg";
import { ReactComponent as Dice3 } from "../assets/Dice3.svg";
import { ReactComponent as Dice4 } from "../assets/Dice4.svg";
import { ReactComponent as Dice5 } from "../assets/Dice5.svg";
import { ReactComponent as Dice6 } from "../assets/Dice6.svg";
import { ReactComponent as Timer } from "../assets/Timer.svg";

function InGame() {
  const [result, setResult] = useState(null);
  const [gameData, setGameData] = useState({
    myName: "myname",
    oppName: "oppname",
    turn: "host",
    rollCount: 3,
    dices: [0, 0, 0, 0, 0],
    myTable: {
      aces: null,
      twos: null,
      threes: null,
      fours: null,
      fives: null,
      sixes: null,
      choice: null,
      fourK: null,
      fullH: null,
      sStr: null,
      lStr: null,
      yacht: null,
      total: 0,
    },
    oppTable: {
      aces: 0,
      twos: 0,
      threes: 0,
      fours: 0,
      fives: 0,
      sixes: 0,
      choice: 0,
      fourK: 0,
      fullH: 0,
      sStr: 0,
      lStr: 0,
      yacht: 0,
      total: 0,
    },
    tempTable: {
      aces: 0,
      twos: 0,
      threes: 0,
      fours: 0,
      fives: 0,
      sixes: 0,
      choice: 0,
      fourK: 0,
      fullH: 0,
      sStr: 0,
      lStr: 0,
      yacht: 0,
    },
  });

  useEffect(() => {
    setupGame();
  }, []);

  useEffect(() => {
    if (checkWin()) {
      if (gameData.myTable.total > gameData.oppTable.total) {
        setResult(1);
      } else if (gameData.myTable.total == gameData.oppTable.total) {
        setResult(2);
      } else if (gameData.myTable.total < gameData.oppTable.total) {
        setResult(0);
      }
    }
  }, [gameData]);

  const setupGame = () => {
    setGameData({ ...gameData, myName: localStorage.getItem("nickname") });
  };

  const checkWin = () => {
    for (let key in gameData.myTable) {
      if (gameData.myTable[key] === null) {
        return false;
      }
    }
    for (let key in gameData.oppTable) {
      if (gameData.oppTable[key] === null) {
        return false;
      }
    }
    return true;
  };

  const onRoll = () => {
    let newRandomDices = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) {
      newRandomDices[i] = Math.ceil(Math.random() * 6);
    }

    //비동기 오류로 dice 값까지 한번에 state 변경함
    setGameData({
      ...gameData,
      dices: [...newRandomDices],
      tempTable: calcTempTable(newRandomDices),
    });
  };

  const calcTempTable = (newRandomDices) => {
    const values = newRandomDices;
    const singleMaker = (num) => {
      let newValue = values.filter((value) => value === num);
      return newValue.reduce((a, b) => a + b, 0);
    };

    const choiceMaker = () => {
      let newValue = values;
      return newValue.reduce((a, b) => a + b, 0);
    };

    const fourKMaker = () => {
      let newValue = values;
      const result = newValue.reduce((a, b) => {
        a[b] = (a[b] || 0) + 1;
        return a;
      }, {});
      for (let key in result) {
        if (parseInt(result[key]) === 4) {
          return parseInt(key) * 4;
        }
      }
      return 0;
    };

    const fullHMaker = () => {
      let newValue = values;
      const result = newValue.reduce((a, b) => {
        a[b] = (a[b] || 0) + 1;
        return a;
      }, {});
      if (
        Object.keys(result).length === 2 &&
        (result[Object.keys(result)[0]] === 2 ||
          result[Object.keys(result)[0]] === 3)
      ) {
        return newValue.reduce((a, b) => a + b, 0);
      }
      return 0;
    };

    const sStrMaker = () => {
      let newValue = values;
      newValue = newValue.sort();
      let check = 0;
      for (let i = 0; i < newValue.length; i++) {
        if (newValue[i + 1] - newValue[i] === 1) {
          check += 1;
        }
      }
      if (check === 3) {
        return 15;
      }
      return 0;
    };

    const lStrMaker = () => {
      let newValue = values;
      newValue = newValue.sort();
      let check = 0;
      for (let i = 0; i < newValue.length; i++) {
        if (newValue[i + 1] - newValue[i] === 1) {
          check += 1;
        }
      }
      if (check === 4) {
        return 30;
      }
      return 0;
    };

    const newTempTable = {
      aces: singleMaker(1),
      twos: singleMaker(2),
      threes: singleMaker(3),
      fours: singleMaker(4),
      fives: singleMaker(5),
      sixes: singleMaker(6),
      bonus: 0,
      choice: choiceMaker(),
      fourK: fourKMaker(),
      fullH: fullHMaker(),
      sStr: sStrMaker(),
      lStr: lStrMaker(),
      yacht: 0,
    };

    return newTempTable;
  };

  const setTable = (scorename) => {
    setGameData({
      ...gameData,
      turn: "guest",
      myTable: {
        ...gameData.myTable,
        [scorename]: gameData.tempTable[scorename],
        total: gameData.myTable.total + gameData.tempTable[scorename],
      },
    });
  };

  //컴포넌트로 num을 props로 받아서 사용
  const CreateDice = ({ num }) => {
    switch (num) {
      default:
        return <Dice1 width={70} height={70} />;
      case 1:
        return <Dice1 width={70} height={70} />;
      case 2:
        return <Dice2 width={70} height={70} />;
      case 3:
        return <Dice3 width={70} height={70} />;
      case 4:
        return <Dice4 width={70} height={70} />;
      case 5:
        return <Dice5 width={70} height={70} />;
      case 6:
        return <Dice6 width={70} height={70} />;
    }
  };

  const TableCellMy = ({ scorename }) => {
    return (
      <div className="flex flex-col">
        <div className="flex flex-row w-full h-10">
          <div className="flex flex-row justify-center items-center bg-primary w-1/2 text-secondary">
            {scorename}
          </div>
          {gameData.myTable[scorename] === null && gameData.turn === "host" ? (
            <button
              type="button"
              className="flex flex-row justify-center items-center bg-gray-200 w-1/2 text-secondary hover:bg-primaryHover"
              onClick={() => {
                setTable(scorename);
              }}
            >
              {gameData.tempTable[scorename]}
            </button>
          ) : (
            <div className="flex flex-row justify-center items-center bg-green-200 w-1/2 text-secondary">
              {gameData.myTable[scorename]}
            </div>
          )}
        </div>
      </div>
    );
  };

  const TableCellOpp = ({ scorename }) => {
    return (
      <div className="flex flex-col">
        <div className="flex flex-row w-full h-10">
          <div className="flex flex-row justify-center items-center bg-primary w-1/2 text-secondary">
            {scorename}
          </div>
          {gameData.oppTable[scorename] === null ? (
            <div className="flex flex-row justify-center items-center bg-gray-200 w-1/2 text-secondary">
              {null}
            </div>
          ) : (
            <div className="flex flex-row justify-center items-center bg-green-200 w-1/2 text-secondary">
              {gameData.oppTable[scorename]}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-row justify-between items-center w-280 h-160 p-5 bg-white rounded-3xl shadow-2xl">
      <div className="bg-secondary w-52 h-full rounded-2xl shadow-2xl text-xl font-semibold leading-6 text-white">
        <div className="flex flex-row justify-evenly items-center h-16 w-full">
          <div className="w-10 h-10 rounded-full bg-gray-400"></div>
          {gameData.myName}
        </div>
        <TableCellMy scorename={"aces"} />
        <TableCellMy scorename={"twos"} />
        <TableCellMy scorename={"threes"} />
        <TableCellMy scorename={"fours"} />
        <TableCellMy scorename={"fives"} />
        <TableCellMy scorename={"sixes"} />
        <TableCellMy scorename={"choice"} />
        <TableCellMy scorename={"fourK"} />
        <TableCellMy scorename={"fullH"} />
        <TableCellMy scorename={"sStr"} />
        <TableCellMy scorename={"lStr"} />
        <TableCellMy scorename={"yacht"} />
        <TableCellMy scorename={"total"} />
      </div>
      <div className="flex flex-col justify-between items-center h-full">
        <Timer width={40} height={40} />
        <div className="flex flex-col items-center gap-y-5">
          <div className="text-3xl font-semibold text-secondary">Yacht!</div>
          <div className="flex flex-row justify-center">
            {gameData.dices.map((num) => (
              <CreateDice num={num} />
            ))}
          </div>
        </div>
        {gameData.turn === "host" ? (
          <button
            type="button"
            className="flex w-40 h-10 justify-center items-center rounded-full bg-secondary px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {
              onRoll();
            }}
          >
            ROLL
          </button>
        ) : (
          <div
            type="button"
            className="flex w-40 h-10 justify-center items-center rounded-full bg-gray-400 px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            WAIT
          </div>
        )}

        <button
          type="button"
          className="flex w-40 h-10 justify-center items-center rounded-full bg-secondary px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => {
            setGameData({
              ...gameData,
              turn: "host",
            });
          }}
        >
          turn over
        </button>
      </div>
      <div className="bg-secondary w-52 h-full rounded-2xl shadow-2xl text-xl font-semibold leading-6 text-white">
        <div className="flex flex-row justify-evenly items-center h-16 w-full">
          <div className="w-10 h-10 rounded-full bg-gray-400"></div>
          {gameData.oppName}
        </div>
        <TableCellOpp scorename={"aces"} />
        <TableCellOpp scorename={"twos"} />
        <TableCellOpp scorename={"threes"} />
        <TableCellOpp scorename={"fours"} />
        <TableCellOpp scorename={"fives"} />
        <TableCellOpp scorename={"sixes"} />
        <TableCellOpp scorename={"choice"} />
        <TableCellOpp scorename={"fourK"} />
        <TableCellOpp scorename={"fullH"} />
        <TableCellOpp scorename={"sStr"} />
        <TableCellOpp scorename={"lStr"} />
        <TableCellOpp scorename={"yacht"} />
        <TableCellOpp scorename={"total"} />
      </div>
      {result === 1 && <div>win</div>}
      {result === 0 && <div>lose</div>}
      {result === 2 && <div>draw</div>}
    </div>
  );
}

export default InGame;
