import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import Spinner from "../assets/Spinner.gif";

const Kakao = () => {
  const code = new URL(document.location.toString()).searchParams.get("code");
  const navigate = useHistory();

  useEffect(() => {
    console.log(code);
    axios
      .post(
        "https://cors-anywhere.herokuapp.com/http://ec2-13-124-246-115.ap-northeast-2.compute.amazonaws.com/api/auth/kakao",

        {
          authorizationCode: code,
        }
      )
      .then((r) => {
        console.log(r.data); // 토큰과 함께 오는 정보들을 출력해보자
        localStorage.setItem("accessToken", r.data.accessToken);
        axios
          .get(
            "https://cors-anywhere.herokuapp.com/http://ec2-13-124-246-115.ap-northeast-2.compute.amazonaws.com/api/members/test",

            {
              headers: {
                Authorization: `Bearer ${r.data.accessToken}`,
              },
            }
          )
          .then((r) => {
            console.log(r);
            navigate.push("/Lobby");
          });
      });
  }, []);
  return (
    <div className="flex flex-col justify-evenly items-center w-80 h-52 p-5 bg-white rounded-3xl shadow-2xl">
      <img src={Spinner} alt="로딩중" width="30%" />
      <span className="text-3xl font-semibold text-secondary">
        로그인 중 입니다...
      </span>
    </div>
  );
};

export default Kakao;
