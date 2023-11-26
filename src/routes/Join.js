import { useState, useEffect } from "react";

function Join() {
  useEffect(() => {
    setMyData(localStorage.getItem("nickname"));
  }, []);
  const [myData, setMyData] = useState("");
  return (
    <div className="flex flex-col justify-evenly items-center w-80 h-160 p-5 bg-white rounded-3xl shadow-2xl">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 mb-3 rounded-full bg-gray-400"></div>
        <span className="mb-20 text-secondary">{myData}</span>
      </div>
      <div className="flex flex-col items-center">
        <button
          type="button"
          className="flex w-full h-10 mb-3 justify-center items-center rounded-full bg-primary px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Enter Room Code
        </button>
        <input type="text" placeholder="A12BE3" />
      </div>
    </div>
  );
}

export default Join;
