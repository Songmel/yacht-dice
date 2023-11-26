import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="flex flex-col justify-between items-center w-80 h-52 p-5 bg-white rounded-3xl shadow-2xl">
      <span className="text-3xl font-semibold text-secondary">Login</span>
      <Link className="w-full" to="/lobby">
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-yellow-300 px-3 py-1.5 text-sm font-semibold leading-6 text-yellow-950 shadow-sm hover:bg-yellow-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Login with Kakao
        </button>
      </Link>

      <Link className="w-full" to="/lobby">
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Login with Google
        </button>
      </Link>

      <span className="text-xs font-semibold text-gray-400">
        ⓒ 2023. Rubicon Games all rights reserved.
      </span>
    </div>
  );
}

export default Login;
