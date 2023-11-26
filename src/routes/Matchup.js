import { Link } from "react-router-dom";

function Matchup() {
  return (
    <div className="flex flex-row justify-between items-center w-280 h-160 p-5 bg-white rounded-3xl shadow-2xl">
      <div className="flex flex-col items-center w-1/2 border-2 border-white border-r-gray-200">
        <div className="w-24 h-24 mb-3 rounded-full bg-gray-400"></div>
        <span className="mb-20 text-secondary">Nickname</span>
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
          >
            Play!
          </button>
        </Link>
      </div>
      <div className="flex flex-col items-center w-1/2 text-2xl text-secondary">
        <span>Waiting for players...</span>
      </div>
    </div>
  );
}

export default Matchup;
