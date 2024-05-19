"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// lib
import fetchGet from "@/lib/fetchGet";

interface formData {
  userId: string;
  password: string;
  userName: string;
  email: string;
}

export default function JoinForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, dirtyFields },
  } = useForm<formData>({ mode: "onChange" });
  const [idChecked, isIdChecked] = useState(false);
  const userIdValue = watch("userId");

  /** 아이디 중복 체크 */
  const onClickIdCheck = async () => {
    try {
      const res = await fetchGet("/user/id-check", {
        params: {
          userId: userIdValue,
        },
      });

      const { result = false, message = "" } = res || {};
      isIdChecked(result);
      alert(message);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  /** 회원가입 */
  const onClickSubmit = async (formData: formData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/join`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      console.log(res);

      alert(`${formData.userName}님, 회원 가입이 완료되었어요!\n 로그인하여 나만의 냉장고를 채워 보아요.`);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    isIdChecked(false);
  }, [userIdValue]);

  return (
    <form className="w-80" onSubmit={handleSubmit(onClickSubmit)}>
      <div className="space-y-4">
        <div>
          <label htmlFor="userId" className="block text-sm text-gray-500 font-medium">
            아이디
          </label>
          <div className="relative">
            <input
              type="text"
              id="userId"
              className="border-b border-gray-400 w-full pl-2 pr-20 py-2 focus:outline-none"
              {...register("userId", {
                required: "아이디를 입력해주세요!",
                minLength: {
                  value: 4,
                  message: "아이디는 4자리 이상 입력해주세요!",
                },
              })}
            />
            <button
              type="button"
              className="absolute top-0 right-0 h-full text-xs w-16 rounded-e-md text-indigo-500 disabled:text-gray-600"
              disabled={!userIdValue}
              onClick={onClickIdCheck}
            >
              중복 확인
            </button>
          </div>
          {errors.userId && <p className="text-indigo-500 text-xs mt-1">{errors.userId.message}</p>}
          {isValid && !idChecked && <p className="text-indigo-500 text-xs mt-1">아이디 중복 확인을 해주세요!</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm text-gray-500 font-medium">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            className="border-b border-gray-400 w-full p-2 focus:outline-none"
            {...register("password", {
              required: "비밀번호를 입력해주세요!",
              minLength: {
                value: 4,
                message: "비밀번호는 4자리 이상 입력해주세요!",
              },
            })}
          />
          {errors.password && <p className="text-indigo-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label htmlFor="userName" className="block text-sm text-gray-500 font-medium">
            닉네임
          </label>
          <input
            type="text"
            id="userName"
            className="border-b border-gray-400 w-full p-2 focus:outline-none"
            {...register("userName", {
              required: "닉네임을 입력해주세요!",
              minLength: {
                value: 4,
                message: "닉네임은 4자리 이상 입력해주세요!",
              },
            })}
          />
          {errors.userName && <p className="text-indigo-500 text-xs mt-1">{errors.userName.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-gray-500 font-medium">
            이메일
          </label>
          <input
            type="email"
            id="email"
            className="border-b border-gray-400 w-full p-2 focus:outline-none"
            {...register("email", {
              required: "이메일을 입력해주세요!",
              pattern: {
                value: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                message: "이메일 형식이 맞지 않아요!",
              },
            })}
          />
          {errors.email && <p className="text-indigo-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>
      <button
        type="submit"
        className="px-3 py-3 mt-4 text-white w-full text-sm rounded-md bg-indigo-600 disabled:bg-gray-100"
        disabled={!isValid || Object.keys(dirtyFields).length === 0 || !idChecked}
      >
        회원가입
      </button>
    </form>
  );
}
