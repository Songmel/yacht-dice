import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import { over } from "stompjs";
import SockJS from "sockjs-client";

import Spinner from "../assets/Spinner.gif";
import avatar1 from "../assets/Char1.png";
import avatar2 from "../assets/Char2.png";
import avatar3 from "../assets/Char3.png";

const avatarList = [avatar1, avatar2, avatar3];

let stompClient = null;
function MatchupGuest() {
  useEffect(() => {
    connect();
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때만 실행
  const navigate = useHistory();
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
      avatarNum: localStorage.getItem("avatarNum"),
      connected: true,
    });
    stompClient.subscribe(
      `/sub/games/${localStorage.getItem("roomCode")}/guest`,
      onMessageReceived
    );
    newJoin();
  };

  const onError = (err) => {
    console.log(err);
  };

  const newJoin = () => {
    //메세지 객체 생성
    let data = null;

    //(url, header, body(string))
    stompClient.send(
      `/pub/games/${localStorage.getItem("roomCode")}/guest`,
      {},
      data
    );
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
    stompClient.send(
      `/pub/games/${localStorage.getItem("roomCode")}/guest`,
      {},
      JSON.stringify(message)
    );
    localStorage.setItem("isHost", true);
  };
  //메세지 받았을 때 (payload 데이터가 들어옴)
  const onMessageReceived = (payload) => {
    let payloadData = JSON.parse(payload.body);
    console.log(payloadData);
    switch (payloadData.status) {
      case "HOST":
        setOppData({
          ...oppData,
          userName: payloadData.nickname,
          avatarNum: 0,
          connected: true,
        });
        break;
      case "PLAYING":
        navigate.push("/InGame");
        localStorage.setItem("isHost", false);
    }
  };
  return (
    <div className="flex flex-row justify-between items-center w-280 h-160 p-5 bg-white rounded-3xl shadow-2xl">
      <div className="flex flex-col items-center w-1/2 border-2 border-white border-r-gray-200">
        {myData.connected ? (
          <img
            className="w-20"
            src={avatarList[myData.avatarNum]}
            alt="avatar"
          />
        ) : (
          <img src={Spinner} alt="로딩중" width="20%" />
        )}
        <span className="text-2xl mb-20 text-secondary">
          {myData.connected ? myData.userName : "Connecting..."}
        </span>
      </div>
      {oppData.connected ? (
        <div className="flex flex-col items-center w-1/2">
          <img
            className="w-20"
            src={avatarList[oppData.avatarNum]}
            alt="avatar"
          />
          <span className="text-2xl mb-20 text-secondary">
            {oppData.userName}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center w-1/2 text-2xl text-secondary">
          <span>Waiting for players...</span>
        </div>
      )}
    </div>
  );
}

export default MatchupGuest;
