import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { over } from "stompjs";
import SockJS from "sockjs-client";

//svg 파일들 임포트
import { ReactComponent as Dice1 } from "../assets/Dice1.svg";
import { ReactComponent as Dice2 } from "../assets/Dice2.svg";
import { ReactComponent as Dice3 } from "../assets/Dice3.svg";
import { ReactComponent as Dice4 } from "../assets/Dice4.svg";
import { ReactComponent as Dice5 } from "../assets/Dice5.svg";
import { ReactComponent as Dice6 } from "../assets/Dice6.svg";
import { ReactComponent as Timer } from "../assets/Timer.svg";

import avatar1 from "../assets/Char1.png";
import avatar2 from "../assets/Char2.png";
import avatar3 from "../assets/Char3.png";
const avatarList = [avatar1, avatar2, avatar3];

let stompClient = null;
function InGame() {
  const navigate = useHistory();
  const [result, setResult] = useState(null);
  const [turn, setTurn] = useState("GUEST");
  const [myData, setMyData] = useState({
    userName: "",
    avatarNum: 0,
    connected: false,
    message: "",
  });
  const [oppData, setOppData] = useState({
    userName: "",
    avatarNum: 0,
    connected: false,
    message: "",
  });
  const [rollCount, setRollCount] = useState(3);
  const [dices, setDices] = useState([1, 1, 1, 1, 1]);
  const [tempTable, setTempTable] = useState({
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
  });
  const [myTable, setMyTable] = useState({
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
  });
  const [oppTable, setOppTable] = useState({
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
  });

  useEffect(() => {
    setupGame();
  }, []);

  useEffect(() => {
    setRollCount(3);
  }, [turn]);

  useEffect(() => {
    if (checkWin()) {
      if (myTable.total > oppTable.total) {
        setResult(1);
      } else if (myTable.total == oppTable.total) {
        setResult(2);
      } else if (myTable.total < oppTable.total) {
        setResult(0);
      }
    }
  }, [oppTable, myTable]);

  const setupGame = () => {
    connect();
  };

  // 소켓 연결 함수
  const connect = () => {
    let Sock = new SockJS("https://api.yachtdice.site/ws");
    stompClient = over(Sock);
    stompClient.connect(
      {
        Authorization: `${localStorage.getItem("accessToken")}`,
      },
      onConnected,
      onError
    );
  };

  const onConnected = () => {
    setMyData({
      ...myData,
      userName: localStorage.getItem("nickname"),
      avatarNum: localStorage.getItem("avatarNum"),
      connected: true,
    });
    stompClient.subscribe(
      `/sub/games/${localStorage.getItem("roomCode")}`,
      onMessageReceived
    );
    newJoin();
  };

  const onError = (err) => {
    console.log(err);
  };

  const newJoin = () => {
    let data = {
      status: "NEWJOIN",
      userName: localStorage.getItem("nickname"),
      avatarNum: localStorage.getItem("avatarNum"),
    };
    let message = {
      message: JSON.stringify(data),
    };

    stompClient.send(
      `/pub/games/${localStorage.getItem("roomCode")}`,
      {},
      JSON.stringify(message)
    );
  };

  const ecoJoin = () => {
    let data = {
      status: "ECOJOIN",
      userName: localStorage.getItem("nickname"),
      avatarNum: localStorage.getItem("avatarNum"),
    };
    let message = {
      message: JSON.stringify(data),
    };

    stompClient.send(
      `/pub/games/${localStorage.getItem("roomCode")}`,
      {},
      JSON.stringify(message)
    );
  };

  const updateDice = (newDices) => {
    let data = {
      status: "DICE",
      userName: localStorage.getItem("nickname"),
      dices: newDices,
    };
    let message = {
      message: JSON.stringify(data),
    };
    //(url, header, body(string))
    stompClient.send(
      `/pub/games/${localStorage.getItem("roomCode")}`,
      {},
      JSON.stringify(message)
    );
  };

  const updateTable = (newTable) => {
    let data = {
      status: "TABLE",
      userName: localStorage.getItem("nickname"),
      oppTable: newTable,
    };
    let message = {
      message: JSON.stringify(data),
    };
    //(url, header, body(string))
    stompClient.send(
      `/pub/games/${localStorage.getItem("roomCode")}`,
      {},
      JSON.stringify(message)
    );
  };

  //메세지 받았을 때 (payload 데이터가 들어옴)
  const onMessageReceived = (payload) => {
    let payloadMessage = JSON.parse(payload.body);
    let payloadData = JSON.parse(payloadMessage.message);
    if (payloadData.userName !== localStorage.getItem("nickname")) {
      switch (payloadData.status) {
        case "NEWJOIN":
          setOppData({
            ...oppData,
            userName: payloadData.userName,
            avatarNum: payloadData.avatarNum,
            connected: true,
          });
          ecoJoin();
          setTurn("HOST");
          break;
        case "ECOJOIN":
          setOppData({
            ...oppData,
            userName: payloadData.userName,
            avatarNum: payloadData.avatarNum,
            connected: true,
          });
          break;
        case "DICE":
          setDices(payloadData.dices);
          break;
        case "TABLE":
          setOppTable(payloadData.oppTable);
          setTurn("HOST");
          break;
      }
    }
  };

  const checkWin = () => {
    for (let key in myTable) {
      if (myTable[key] === null) {
        return false;
      }
    }
    for (let key in oppTable) {
      if (oppTable[key] === null) {
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

    //순서 주의
    updateDice([...newRandomDices]);
    //비동기 오류로 dice 값까지 한번에 state 변경함
    setDices([...newRandomDices]);
    setRollCount((prev) => {
      return prev - 1;
    });
    setTempTable(calcTempTable(newRandomDices));
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
    let newMyTable = {
      ...myTable,
      [scorename]: tempTable[scorename],
      total: myTable.total + tempTable[scorename],
    };
    updateTable(newMyTable);
    setMyTable(newMyTable);
    setTurn("GUEST");
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
          {myTable[scorename] === null && turn === "HOST" ? (
            <button
              type="button"
              className="flex flex-row justify-center items-center bg-gray-200 w-1/2 text-slate-300 hover:bg-primary hover:text-secondary"
              onClick={() => {
                setTable(scorename);
              }}
            >
              {tempTable[scorename]}
            </button>
          ) : (
            <div className="flex flex-row justify-center items-center bg-gray-200 w-1/2 text-secondary">
              {myTable[scorename]}
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
          {oppTable[scorename] === null ? (
            <div className="flex flex-row justify-center items-center bg-gray-200 w-1/2 text-secondary">
              {null}
            </div>
          ) : (
            <div className="flex flex-row justify-center items-center bg-gray-200 w-1/2 text-secondary">
              {oppTable[scorename]}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleEnd = () => {
    navigate.push("/Lobby");
  };

  return (
    <div className="flex flex-row justify-between items-center w-280 h-160 p-5 bg-white rounded-3xl shadow-2xl">
      <div className="bg-secondary w-52 h-full rounded-2xl shadow-2xl text-xl font-semibold leading-6 text-white">
        <div className="flex flex-row justify-evenly items-center h-16 w-full">
          {myData.connected && (
            <img
              className="w-10"
              src={avatarList[myData.avatarNum]}
              alt="avatar"
            />
          )}
          {myData.connected && myData.userName}
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
            <CreateDice num={dices[0]} />
            <CreateDice num={dices[1]} />
            <CreateDice num={dices[2]} />
            <CreateDice num={dices[3]} />
            <CreateDice num={dices[4]} />
          </div>
          {rollCount === 3 && (
            <div className="flex flex-row gap-x-3">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
            </div>
          )}
          {rollCount === 2 && (
            <div className="flex flex-row gap-x-3">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
            </div>
          )}
          {rollCount === 1 && (
            <div className="flex flex-row gap-x-3">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
              <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
            </div>
          )}
          {rollCount === 0 && (
            <div className="flex flex-row gap-x-3">
              <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
              <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
              <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
            </div>
          )}
        </div>

        {turn === "HOST" && rollCount !== 0 ? (
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
      </div>
      <div className="bg-secondary w-52 h-full rounded-2xl shadow-2xl text-xl font-semibold leading-6 text-white">
        <div className="flex flex-row justify-evenly items-center h-16 w-full">
          {oppData.connected && (
            <img
              className="w-10"
              src={avatarList[oppData.avatarNum]}
              alt="avatar"
            />
          )}
          {oppData.connected && oppData.userName}
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
      {result === 1 && (
        <div className="flex flex-col justify-center items-center fixed top-0 left-0 w-screen h-screen bg-white bg-opacity-50 backdrop-blur-lg">
          <span className="text-3xl font-semibold text-secondary mb-5">
            You Win
          </span>
          <button
            type="button"
            className="flex w-40 h-10 justify-center items-center rounded-full bg-secondary px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleEnd}
          >
            Back to Lobby
          </button>
        </div>
      )}
      {result === 0 && (
        <div className="flex flex-col justify-center items-center fixed top-0 left-0 w-screen h-screen bg-white bg-opacity-50 backdrop-blur-lg">
          <span className="text-3xl font-semibold text-secondary mb-5">
            You Lose
          </span>
          <button
            type="button"
            className="flex w-40 h-10 justify-center items-center rounded-full bg-secondary px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleEnd}
          >
            Back to Lobby
          </button>
        </div>
      )}
      {result === 2 && (
        <div className="flex flex-col justify-center items-center fixed top-0 left-0 w-screen h-screen bg-white bg-opacity-50 backdrop-blur-lg">
          <span className="text-3xl font-semibold text-secondary mb-5">
            You Draw
          </span>
          <button
            type="button"
            className="flex w-40 h-10 justify-center items-center rounded-full bg-secondary px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleEnd}
          >
            Back to Lobby
          </button>
        </div>
      )}
    </div>
  );
}

export default InGame;
