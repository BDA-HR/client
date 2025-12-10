import { LoginForm } from "../components/login-form";
import { useNavigate } from "react-router-dom";
import React from "react";

type SignInPageProps = {
  onLogin: (code: string, password: string) => Promise<void> | void;
};

const SignInPage: React.FC<SignInPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleSignIn = async (code: string, password: string) => {
    console.log(`Attempting sign in with code: ${code}`);
    
    try {
      // Call the parent's onLogin function with credentials
      if (onLogin) {
        await onLogin(code, password);
      }
      
      // Navigate to /modules after successful login
      navigate('/modules');
    } catch (error) {
      console.error("Login failed:", error);
      // You might want to show an error message to the user here
      throw error; // Re-throw so LoginForm can handle it
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm onSignIn={handleSignIn} />
      </div>
    </div>
  );
};

export default SignInPage;