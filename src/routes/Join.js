import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

function Join() {
  const navigate = useHistory();
  useEffect(() => {
    setNickname(localStorage.getItem("nickname"));
  }, []);
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const handleInputChange = (event) => {
    setRoomCode(event.target.value);
  };

  const handleJoin = () => {
    localStorage.setItem("roomCode", roomCode);
    navigate.push("/MatchupGuest");
  };

  return (
    <div className="flex flex-col justify-evenly items-center w-80 h-160 p-5 bg-white rounded-3xl shadow-2xl">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 mb-3 rounded-full bg-gray-400"></div>
        <span className="text-2xl mb-20 text-secondary">{nickname}</span>
      </div>
      <div className="flex flex-col items-center">
        <button
          type="button"
          className="flex w-full h-10 mb-3 justify-center items-center rounded-full bg-primary px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleJoin}
        >
          Join
        </button>
        <input
          className="text-2xl text-secondary text-center border-b-2 border-secondary"
          type="text"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}

export default Join;
