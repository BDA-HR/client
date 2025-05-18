import React from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";

type SignInPageProps = {
  onLogin: () => void;
};

const SignInPage: React.FC<SignInPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <Card className="w-full max-w-md mx-auto shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="space-y-1 p-6 sm:p-8">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-gray-600 text-sm sm:text-base">
            Sign in to your BDA Investment Group account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 text-sm sm:text-base">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="focus-visible:ring-gray-400 border-gray-300 hover:border-gray-400 transition-colors h-10 sm:h-12 text-sm sm:text-base"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 text-sm sm:text-base">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus-visible:ring-gray-400 border-gray-300 hover:border-gray-400 transition-colors h-10 sm:h-12 text-sm sm:text-base"
              />
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember-me" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-gray-300 data-[state=checked]:bg-gray-800 h-4 w-4 sm:h-5 sm:w-5"
                />
                <Label htmlFor="remember-me" className="text-gray-700 text-sm sm:text-base">
                  Remember me
                </Label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button 
              type="submit" 
              className="w-full bg-gray-800 hover:bg-gray-700 text-white transition-colors h-10 sm:h-12 text-sm sm:text-base"
            >
              Sign In
            </Button>
          </form>
        </CardContent>

        {/* Create Account Link */}
        <CardFooter className="p-6 sm:p-8 pt-0">
          <p className="text-center text-gray-600 text-sm sm:text-base w-full">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium text-gray-800 hover:text-gray-600 transition-colors"
            >
              Create account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;