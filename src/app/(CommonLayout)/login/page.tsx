import { LoginForm } from "@/src/components/login/loginForm";
import React from "react";

const Login = ({ searchParams }: { searchParams: { redirect?: string } }) => {
  return (
    <div className="mx-auto mt-10 w-full max-w-md rounded-lg bg-white p-6 shadow-md">
      <LoginForm redirectUrl={searchParams.redirect} />
    </div>
  );
};

export default Login;
