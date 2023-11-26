/*
import { useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
*/
import { Link } from "react-router-dom";

function Lobby() {
  return (
    <div className="flex flex-col justify-evenly items-center w-80 h-160 p-5 bg-white rounded-3xl shadow-2xl">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 mb-3 rounded-full bg-gray-400"></div>
        <input type="text" placeholder="Enter your name" />
      </div>
      <div className="flex flex-col items-center">
        <Link to="/Join">
          <button
            type="button"
            className="flex w-40 h-10 mb-3 justify-center items-center rounded-full bg-primary px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Join
          </button>
        </Link>

        <Link to="/Matchup">
          <button
            type="button"
            className="flex w-40 h-10 mb-3 justify-center items-center rounded-full bg-secondary px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-secondarytHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Host
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Lobby;
