"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Lock, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

const verifyOtpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
})

type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>

export function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const email = searchParams.get("email") || ""

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
  })

  const onSubmit = async (data: VerifyOtpFormData) => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email not found. Please try again.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await apiClient.request("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp: data.otp }),
      })

      const resetToken = (response as { token: string }).token

      toast({
        title: "OTP Verified",
        description: "You can now reset your password.",
      })

      router.push(`/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "OTP verification failed"
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify OTP</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Code expires in {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otp">OTP Code</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                maxLength={6}
                className="pl-10 text-center text-lg tracking-widest"
                {...register("otp")}
              />
            </div>
            {errors.otp && (
              <Alert variant="destructive" className="mt-2 p-2">
                <AlertCircle className="h-3 w-3" />
                <AlertDescription className="text-xs">{errors.otp.message}</AlertDescription>
              </Alert>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || timeLeft === 0}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          <button
            onClick={() => router.push("/forgot-password")}
            className="font-medium text-primary hover:underline"
          >
            Request new code
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
