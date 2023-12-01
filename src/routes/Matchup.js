import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import { over } from "stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
function Matchup() {
  useEffect(() => {
    connect();
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때만 실행
  const navigate = useHistory();
  const [myData, setMyData] = useState({
    userName: "",
    connected: false,
    message: "",
  });
  const [oppData, setOppData] = useState({
    userName: "",
    connected: false,
    message: "",
  });

  // 소켓 연결 함수
  const connect = () => {
    let Sock = new SockJS("https://api.yachtdice.site/ws");

    //웹소켓 객체를 받아온다
    stompClient = over(Sock);

    // (header,callback,error)
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
      connected: true,
    });
    stompClient.subscribe("/sub/games", onMessageReceived);
    newJoin();
  };

  const onError = (err) => {
    console.log(err);
  };

  const newJoin = () => {
    //메세지 객체 생성
    let data = {
      status: "NEWJOIN",
      userName: localStorage.getItem("nickname"),
    };

    let message = {
      message: JSON.stringify(data),
    };

    //(url, header, body(string))
    stompClient.send("/pub/games", {}, JSON.stringify(message));
  };

  const ecoJoin = () => {
    //메세지 객체 생성
    let data = {
      status: "ECOJOIN",
      userName: localStorage.getItem("nickname"),
    };
    let message = {
      message: JSON.stringify(data),
    };
    //(url, header, body(string))
    stompClient.send("/pub/games", {}, JSON.stringify(message));
  };

  const onPlay = () => {
    //메세지 객체 생성
    let data = {
      status: "PLAY",
    };
    let message = {
      message: JSON.stringify(data),
    };
    //(url, header, body(string))
    stompClient.send("/pub/games", {}, JSON.stringify(message));
    localStorage.setItem("isHost", true);
  };
  //메세지 받았을 때 (payload 데이터가 들어옴)
  const onMessageReceived = (payload) => {
    let payloadMessage = JSON.parse(payload.body);
    let payloadData = JSON.parse(payloadMessage.message);
    if (payloadData.userName !== localStorage.getItem("nickname")) {
      console.log(payloadData.status);
      switch (payloadData.status) {
        case "NEWJOIN":
          setOppData({
            ...oppData,
            userName: payloadData.userName,
            connected: true,
          });
          ecoJoin();
          break;
        case "ECOJOIN":
          setOppData({
            ...oppData,
            userName: payloadData.userName,
            connected: true,
          });
          break;
        case "PLAY":
          navigate.push("/InGame");
          localStorage.setItem("isHost", false);
      }
    }
  };
  return (
    <div className="flex flex-row justify-between items-center w-280 h-160 p-5 bg-white rounded-3xl shadow-2xl">
      <div className="flex flex-col items-center w-1/2 border-2 border-white border-r-gray-200">
        <div className="w-24 h-24 mb-3 rounded-full bg-gray-400"></div>
        <span className="mb-20 text-secondary">{myData.userName}</span>
        <button
          type="button"
          className="flex w-80 h-10 mb-3 justify-center items-center rounded-full bg-primary px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Room Code: A12BE3
        </button>
        <Link to="/InGame">
          <button
            type="button"
            className="flex w-40 h-10 mb-3 justify-center items-center rounded-full bg-secondary px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-secondarytHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onPlay}
          >
            Play!
          </button>
        </Link>
      </div>
      {oppData.connected === false ? (
        <div className="flex flex-col items-center w-1/2 text-2xl text-secondary">
          <span>Waiting for players...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center w-1/2">
          <div className="w-24 h-24 mb-3 rounded-full bg-gray-400"></div>
          <span className="mb-20 text-secondary">{oppData.userName}</span>
        </div>
      )}
    </div>
  );
}

export default Matchup;
