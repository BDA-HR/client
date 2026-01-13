import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Field, FieldLabel } from "../components/ui/field";
import { Input } from "../components/ui/input";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type LoginFormProps = {
  className?: string;
} & Omit<React.ComponentProps<"form">, "onSubmit">;

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || !password) {
      alert("Please enter both your employee code and password.");
      return;
    }

    setIsLoading(true);

    try {
      // This calls your loginApi, gets tokens, and sets them in cookies
      await login(code, password);

      // Update the context so ProtectedRoute knows user is authenticated
      setIsAuthenticated(true);

      // Redirect to the main app
      navigate("/modules", { replace: true }); // replace: true avoids back-button to login
    } catch (error: any) {
      console.error("Login failed:", error);

      // More user-friendly error message if possible
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid credentials. Please check your employee code and password.";

      alert(`Login failed: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={cn(
        "flex flex-col gap-6 p-8 bg-white rounded-2xl shadow-xl max-w-2xl mx-auto",
        className
      )}
      onSubmit={handleSubmit}
      {...props}
    >
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-700 dark:text-gray-200">
        Log In to Your Account
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        Enter your credentials to access your dashboard
      </p>

      {/* Employee Code Input */}
      <Field>
        <FieldLabel htmlFor="code">Employee Code</FieldLabel>
        <Input
          id="code"
          type="text"
          placeholder="Enter your employee code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={isLoading}
          autoComplete="username"
          className={cn(
            "border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200",
            "transition-all duration-300 hover:border-gray-400",
            "bg-white bg-opacity-80 backdrop-blur-sm py-4 px-6 text-lg rounded-xl shadow-md"
          )}
        />
      </Field>

      {/* Password Input */}
      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          autoComplete="current-password"
          className={cn(
            "border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200",
            "transition-all duration-300 hover:border-gray-400",
            "bg-white bg-opacity-80 backdrop-blur-sm py-4 px-6 text-lg rounded-xl shadow-md"
          )}
        />
      </Field>

      {/* Sign In Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full py-4 text-xl font-semibold rounded-2xl shadow-lg",
          "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500",
          "hover:from-blue-600 hover:via-blue-700 hover:to-blue-600",
          "active:from-blue-700 active:to-blue-700",
          "transition-all duration-300 ease-in-out mt-4"
        )}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
