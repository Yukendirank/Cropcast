import { VerifyOtpForm } from "@/components/auth/verify-otp-form"

export const metadata = {
  title: "Verify OTP - CropCast",
  description: "Verify your email with the OTP code",
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
          <p className="text-muted-foreground">Enter the code you received</p>
        </div>
        <VerifyOtpForm />
      </div>
    </div>
  )
}
