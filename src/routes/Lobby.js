import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import avatar1 from "../assets/Char1.png";
import avatar2 from "../assets/Char2.png";
import avatar3 from "../assets/Char3.png";

function Lobby() {
  useEffect(() => {
    setNickname(localStorage.getItem("nickname"));
  }, []);
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(avatar1);
  const handleInputChange = (event) => {
    setNickname(event.target.value);
  };
  const handleAvatarChange = () => {
    if (avatar === avatar1) {
      setAvatar(avatar2);
    } else if (avatar === avatar2) {
      setAvatar(avatar3);
    } else if (avatar === avatar3) {
      setAvatar(avatar1);
    }
  };
  const getUserinfo = () => {
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("avatar", avatar);
  };
  return (
    <div className="flex flex-col justify-evenly items-center w-80 h-160 p-5 bg-white rounded-3xl shadow-2xl">
      <div className="flex flex-col items-center">
        <div
          className="w-24 h-24 mb-3 rounded-full border-4 border-secondary"
          onClick={handleAvatarChange}
        >
          <img className="-translate-y-12" src={avatar} alt="avatar" />
        </div>
        <input
          className="text-2xl text-secondary text-center border-b-2 border-secondary"
          type="text"
          placeholder="Enter your name"
          value={nickname}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col items-center">
        <button
          type="button"
          className="flex w-40 h-10 mb-3 justify-center items-center rounded-full bg-gray-400 px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={getUserinfo}
        >
          Join
        </button>

        <Link to="/Matchup">
          <button
            type="button"
            className="flex w-40 h-10 mb-3 justify-center items-center rounded-full bg-secondary px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-secondarytHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={getUserinfo}
          >
            Host
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Lobby;
