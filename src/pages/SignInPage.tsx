import { LoginForm } from "../components/login-form";
import { useNavigate } from "react-router-dom";
import React from "react";

const SignInPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignInSuccess = () => {
    // This is called after successful login (cookies are already set)
    // Just navigate to the main app
    navigate("/modules"); // or "/dashboard", whichever you prefer
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
};

export default SignInPage;