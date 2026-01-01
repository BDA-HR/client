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
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm onSignIn={handleSignIn} />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 relative hidden lg:flex flex-col items-center justify-center p-10">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          <div className="bg-gray-300 border border-gray-400 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
            <img
              src="/bda-logo-1.png"
              alt="RST Logo"
              className="w-16 h-16 rounded-full object-contain"
            />
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
          Welcome back to RST ERP
        </h1>

        {/* Subtext */}
        <p className="text-gray-700 text-center max-w-md text-lg">
          Streamline your business processes online with our intuitive platform
        </p>

        {/* Decorative elements */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <div className="w-24 h-1 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;