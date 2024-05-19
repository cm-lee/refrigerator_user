"use client";

import { useSession } from "next-auth/react";

export default function SignInButton() {
  const { data } = useSession();

  console.log("data==>", data);

  return <></>;
}
