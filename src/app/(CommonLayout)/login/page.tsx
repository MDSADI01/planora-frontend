import { LoginForm } from "@/src/components/login/loginForm";
import React from "react";

const Login = ({ searchParams }: { searchParams: { redirect?: string } }) => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <LoginForm redirectUrl={searchParams.redirect} />
    </div>
  );
};

export default Login;
