import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../components/ui/field"
import { Input } from "../components/ui/input"
import React, { useState } from "react"

type LoginFormProps = {
  onSignIn?: (email: string, password: string) => void
  className?: string
} & Omit<React.ComponentProps<"div">, "onSubmit">

export function LoginForm({
  onSignIn,
  className,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      console.error("Email and password are required")
      return
    }

    setIsLoading(true)
    
    try {
      if (onSignIn) {
        await onSignIn(email, password)
      }
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-blue-200">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">
                  Login to your <i className="text-blue-500 relative">BDA
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
                  </i> {" "}
                  account
                </h1>
                <p className="text-sm text-balance text-blue-600/70">
                  Enter your credentials below to login to your account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="code">Code</FieldLabel>
                <Input
                  id="code"
                  type="code"
                  placeholder="Enter your code"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className={cn(
                    "w-full py-4 text-base font-semibold",
                    "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500",
                    "hover:from-blue-600 hover:via-blue-500 hover:to-blue-600",
                    "active:from-blue-700 active:via-blue-600 active:to-blue-700",
                    "shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300",
                    "transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0",
                    "border border-blue-300/50",
                    "relative overflow-hidden group cursor-pointer"
                  )}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 relative hidden md:block">
            <img
              src="/wmremove-transformed.jpeg"
              alt="Login illustration"
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#" className="text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  )
}