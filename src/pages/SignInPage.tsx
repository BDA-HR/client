import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    navigate('/menu');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6">
      <Card className="w-full max-w-md mx-auto bg-white shadow-xl rounded-lg transition-all duration-300 hover:shadow-2xl" style={{ minHeight: '400px' }}>
        <CardHeader className="space-y-1 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-800">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-blue-600 text-sm sm:text-base font-medium">
            Sign in to your BDA Investment Group account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSignIn} className="space-y-3 sm:space-y-4">
            <div className="space-y-1">
              <Label htmlFor="username" className="text-gray-700 text-xs sm:text-sm">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="focus-visible:ring-blue-300 border-gray-200 hover:border-gray-300 transition-colors h-9 sm:h-10 text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-gray-700 text-xs sm:text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-visible:ring-blue-300 border-gray-200 hover:border-gray-300 transition-colors h-9 sm:h-10 text-xs sm:text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember-me" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-gray-300 data-[state=checked]:bg-blue-600 h-4 w-4 sm:h-4 sm:w-4"
                />
                <Label htmlFor="remember-me" className="text-gray-700 text-xs sm:text-sm">
                  Remember me
                </Label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 h-9 sm:h-10 text-xs sm:text-sm shadow-sm hover:shadow-md"
            >
              Sign In
            </Button>
          </form>
        </CardContent>

        <CardFooter className="p-4 sm:p-6 pt-0">
          <p className="text-center text-gray-600 text-xs sm:text-sm w-full">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
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