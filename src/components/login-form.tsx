import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "../components/ui/field";
import { Input } from "../components/ui/input";
import React, { useState } from "react";

type LoginFormProps = {
  onSignIn: (code: string, password: string) => void;
  className?: string;
} & Omit<React.ComponentProps<"form">, "onSubmit">;

export function LoginForm({
  onSignIn,

  className,
  ...props
}: LoginFormProps) {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || !password) {
      console.error("Employee Code and password are required");
      return;
    }

    setIsLoading(true);
    
    try {
      await onSignIn(code, password);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your <i className="text-blue-500 relative">BDA
                                              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
          </i> {" "}
 account</h1>
          {/* <p className=" text-sm text-balance text-blue-600/70">
            Enter your code below to login to your account
          </p> */}
        </div>
        
        <Field>
          <FieldLabel htmlFor="code">Code</FieldLabel>
          <Input 
            id="code" 
            type="text" 
            placeholder="Enter your employee code" 
            required 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isLoading}
            className={cn(
                  "border-blue-200 focus:border-blue-400 focus:ring-blue-400/20",
                  "transition-all duration-300",
                  "hover:border-blue-300",
                  "bg-white/80 backdrop-blur-sm",
                  "py-3 text-base"
                )}
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Enter your password"
            className={cn(
                  "border-blue-200 focus:border-blue-400 focus:ring-blue-400/20",
                  "transition-all duration-300",
                  "hover:border-blue-300",
                  "bg-white/80 backdrop-blur-sm",
                  "py-3 text-base"
                )}
          />
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading} className={cn(
                  "w-full py-4 text-base font-semibold",
                  "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500",
                  "hover:from-blue-600 hover:via-blue-500 hover:to-blue-600",
                  "active:from-blue-700 active:via-blue-600 active:to-blue-700",
                  "shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300",
                  "transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0",
                  "border border-blue-300/50",
                  "relative overflow-hidden group cursor-pointer"
                )}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </Field>

      </FieldGroup>
    </form>
  );
}