import { VerifyOtpForm } from "@/components/auth/verify-otp-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Verify OTP - CropCast",
  description: "Verify your email with the OTP code",
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-muted-foreground">Enter the code you received</p>
          </div>
          <VerifyOtpForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
