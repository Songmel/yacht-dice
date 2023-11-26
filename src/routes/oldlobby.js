import { useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";

import { Link } from "react-router-dom";

let stompClient = null;
function Lobby() {
  const [myData, setMyData] = useState({
    userName: "user1",
    wsURL: "http://localhost:8080/ws",
    wsConnected: false,
    subscribeURL: "/room/abc",
    message: "",
  });
  const [oppData, setOppData] = useState({
    userName: "",
    connected: false,
    message: "",
  });

  // 소켓 연결 함수
  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/ws");

    //웹소켓 객체를 받아온다
    stompClient = over(Sock);

    // (header,callback,error)
    stompClient.connect({}, onConnected, onError);
    console.log("connected");
  };

  const onConnected = () => {
    setMyData({ ...myData, connected: true });

    stompClient.subscribe("/room/abc", onMessageReceived);

    userJoin();
  };

  const onError = (err) => {
    console.log(err);
  };

  const userJoin = () => {
    //메세지 객체 생성
    let chatMessage = {
      senderName: myData.userName,
      status: "JOIN",
    };

    //(url, header, body(string))
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  //메세지 받았을 때 (payload 데이터가 들어옴)
  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    console.log(payloadData);

    switch (payloadData.status) {
      case "JOIN":
        setOppData({
          ...oppData,
          oppName: payloadData.senderName,
          connected: true,
        });
        break;
      case "MESSAGE":
        break;
    }
  };

  return (
    <div className="Lobby">
      <title>Lobby Test Page</title>
      <button
        type="button"
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={connect}
      >
        connect
      </button>
      <div className="bg-green-100 rounded-xl p-8 dark:bg-slate-800">
        <div>myName: {myData.userName}</div>
        <div>connected: {JSON.stringify(myData.wsConnected)}</div>
        <div>message: {myData.message}</div>
      </div>
      <div className="bg-red-100 rounded-xl p-8 dark:bg-slate-800">
        <div>oppName: {oppData.userName}</div>
        <div>connected: {JSON.stringify(oppData.wsConnected)}</div>
        <div>message: {oppData.message}</div>
      </div>
      <Link to="/InGame">
        <button
          type="button"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          play
        </button>
      </Link>
    </div>
  );
}

export default Lobby;
