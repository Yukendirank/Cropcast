"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const token = searchParams.get("token") || ""
  const email = searchParams.get("email") || ""

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const password = watch("password")

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token || !email) {
      toast({
        title: "Error",
        description: "Invalid reset link. Please try again.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await apiClient.request("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          token,
          newPassword: data.password,
        }),
      })

      toast({
        title: "Success",
        description: "Your password has been reset successfully.",
      })

      router.push("/login")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Password reset failed"
      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <Alert variant="destructive" className="mt-2 p-2">
                <AlertCircle className="h-3 w-3" />
                <AlertDescription className="text-xs">{errors.password.message}</AlertDescription>
              </Alert>
            )}

            {password && (
              <div className="text-xs space-y-1 mt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? "text-green-500" : "text-muted-foreground"}`}>
                  <div className={`h-3 w-3 rounded-full ${/[A-Z]/.test(password) ? "bg-green-500" : "bg-muted"}`} />
                  <span>One uppercase letter</span>
                </div>
                <div className={`flex items-center gap-2 ${/[a-z]/.test(password) ? "text-green-500" : "text-muted-foreground"}`}>
                  <div className={`h-3 w-3 rounded-full ${/[a-z]/.test(password) ? "bg-green-500" : "bg-muted"}`} />
                  <span>One lowercase letter</span>
                </div>
                <div className={`flex items-center gap-2 ${/[0-9]/.test(password) ? "text-green-500" : "text-muted-foreground"}`}>
                  <div className={`h-3 w-3 rounded-full ${/[0-9]/.test(password) ? "bg-green-500" : "bg-muted"}`} />
                  <span>One number</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <Alert variant="destructive" className="mt-2 p-2">
                <AlertCircle className="h-3 w-3" />
                <AlertDescription className="text-xs">{errors.confirmPassword.message}</AlertDescription>
              </Alert>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Ready to login?{" "}
          <button
            onClick={() => router.push("/login")}
            className="font-medium text-primary hover:underline"
          >
            Go to login
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
