import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../components/ui/field";
import { Input } from "../components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { BorderBeam } from "../components/ui/border-beam";
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type LoginFormProps = {
  className?: string;
} & Omit<React.ComponentProps<"div">, "onSubmit">;

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const { login, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Auto-clear alert after 6 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || !password) {
      setAlertMessage("Please enter both your employee code and password.");
      return;
    }

    setIsLoading(true);
    setAlertMessage(null);

    try {
      await login(code, password);
      setIsAuthenticated(true);
      navigate("/modules", { replace: true });
    } catch (error: any) {
      console.error("Login failed:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid credentials. Please check your employee code and password.";

      setAlertMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-0 shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>
                <p className="text-muted-foreground text-balance text-gray-500">
                  Login to your RST ERP account
                </p>
              </div>

              {/* Alert placed here */}
              {alertMessage && (
                <Alert
                  variant="destructive"
                  className="mb-4 animate-in fade-in slide-in-from-top-5 duration-300"
                >
                  <AlertTitle>Login Error</AlertTitle>
                  <AlertDescription>{alertMessage}</AlertDescription>
                </Alert>
              )}

              <Field>
                <FieldLabel htmlFor="code" className="text-gray-700">Employee Code</FieldLabel>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter your employee code"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isLoading}
                  autoComplete="username"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-gray-700">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm text-blue-600 underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </Field>

              <Field>
                <div className="relative">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2 relative overflow-hidden"
                  >
                    {isLoading ? "Signing in..." : "Login"}
                  </Button>
                  {!isLoading && (
                    <BorderBeam 
                      duration={8} 
                      size={100} 
                      colorFrom="#3b82f6" 
                      colorTo="#60a5fa"
                      className="rounded-md"
                    />
                  )}
                </div>
              </Field>

              <FieldDescription className="text-center text-gray-600">
                Don't have an account? <a href="#" className="text-blue-600 hover:underline">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 relative hidden md:flex flex-col items-center justify-center p-10">
            {/* Logo */}
            <div className="mb-8 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                <img
                  src="/bda-logo-1.png"
                  alt="RST Logo"
                  className="w-16 h-16 rounded-full object-contain"
                />
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
              Welcome back to RST ERP
            </h1>

            {/* Subtext */}
            <p className="text-white/90 text-center max-w-md text-lg">
              Streamline your business processes online with our intuitive platform
            </p>

            {/* Decorative elements */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center">
              <div className="w-24 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-gray-500">
        By clicking continue, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
        and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}