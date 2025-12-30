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
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/wmremove-transformed.jpeg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Strong blue overlay for better contrast */}
        <div className="absolute inset-0 bg-blue-900/70 mix-blend-multiply"></div>
        
        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-white z-10">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full w-24 h-24 flex items-center justify-center shadow-xl">
              <img 
                src="/bda-logo-1.png" 
                alt="RST Logo" 
                className="w-16 h-16 rounded-full object-contain"
              />
            </div>
          </div>
          
          {/* Main heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Welcome back to RST ERP
          </h1>
          
          {/* Subtext */}
          <p className="text-white/90 text-center max-w-md text-lg">
            Streamline your business processes online with our intuitive platform
          </p>
          
          {/* Decorative elements */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <div className="w-24 h-1 bg-white/40 rounded-full"></div>
          </div>
        </div>
        
        {/* Additional gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-800/40 to-transparent z-0"></div>
      </div>
    </div>
  );
};

export default SignInPage;