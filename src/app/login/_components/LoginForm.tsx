"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface formData {
  userId: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>({ mode: "onChange" });

  const onClickSubmit = async (formData: formData) => {
    try {
      console.log("formData=>", formData);
      const res = await signIn("credentials", {
        userId: formData.userId,
        password: formData.password,
        redirect: false,
      });

      if (res?.status !== 200) {
        alert("아이디와 비밀번호를 확인해주세요!");
        return;
      }

      alert("로그인 되었습니다!");
      router.push("/main");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="w-80" onSubmit={handleSubmit(onClickSubmit)}>
      <div className="space-y-4">
        <div>
          <label htmlFor="userId" className="block text-sm text-gray-500 font-medium">
            아이디
          </label>
          <input
            type="text"
            id="userId"
            className="border-b border-gray-400 w-full p-2 focus:outline-none"
            {...register("userId", {
              required: "아이디를 입력해주세요!",
            })}
          />
          {errors.userId && <p className="text-indigo-500 text-xs mt-1">{errors.userId.message}</p>}
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
            })}
          />
          {errors.password && <p className="text-indigo-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
      </div>
      <button type="submit" className="px-3 py-3 mt-4 text-white w-full text-sm rounded-md bg-indigo-600">
        로그인
      </button>

      <p className="text-sm text-center border-t border-t-gray-200 mt-10 pt-6">
        <span className="text-gray-400 mr-1">아직 회원이 아니신가요?</span>
        <Link href="/join" className="text-gray-600">
          지금 <span className="text-indigo-500">회원가입</span>을 해보세요!
        </Link>
      </p>
    </form>
  );
}
