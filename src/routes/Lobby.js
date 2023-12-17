import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import avatar1 from "../assets/Char1.png";
import avatar2 from "../assets/Char2.png";
import avatar3 from "../assets/Char3.png";

function Lobby() {
  const navigate = useHistory();
  useEffect(() => {
    setNickname(localStorage.getItem("nickname"));
  }, []);
  const [nickname, setNickname] = useState("");
  const [avatarNum, setAvatarNum] = useState(0);
  const [avatar, setAvatar] = useState(avatar1);
  const handleInputChange = (event) => {
    setNickname(event.target.value);
  };
  const handleAvatarChange = () => {
    if (avatar === avatar1) {
      setAvatar(avatar2);
      setAvatarNum(1);
    } else if (avatar === avatar2) {
      setAvatar(avatar3);
      setAvatarNum(2);
    } else if (avatar === avatar3) {
      setAvatar(avatar1);
      setAvatarNum(0);
    }
  };
  const handleHost = () => {
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("avatarNum", avatarNum);
    axios
      .post(
        "https://api.yachtdice.site/api/members/nickname",
        {
          nickname: nickname,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((r) => {
        console.log(r.data);
        localStorage.setItem("userId", r.data.userId);
        navigate.push("/Matchup");
      });
  };

  const handleJoin = () => {
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("avatarNum", avatarNum);
    axios
      .post(
        "https://api.yachtdice.site/api/members/nickname",
        {
          nickname: nickname,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((r) => {
        console.log(r.data);
        localStorage.setItem("userId", r.data.userId);
        navigate.push("/Join");
      });
  };

  return (
    <div className="flex flex-col justify-evenly items-center w-80 h-160 p-5 bg-white rounded-3xl shadow-2xl">
      <div className="flex flex-col items-center">
        <div
          className="flex flex-row justify-center items-center w-28 h-28 mb-3"
          onClick={handleAvatarChange}
        >
          <img className="w-20 animate-bounce" src={avatar} alt="avatar" />
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
          className="flex w-40 h-10 mb-3 justify-center items-center rounded-full bg-secondary px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-secondarytHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleJoin}
        >
          Join
        </button>
        <button
          type="button"
          className="flex w-40 h-10 mb-3 justify-center items-center rounded-full bg-secondary px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-secondarytHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleHost}
        >
          Host
        </button>
      </div>
    </div>
  );
}

export default Lobby;
