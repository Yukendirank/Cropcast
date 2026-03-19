import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Forgot Password - CropCast",
  description: "Reset your password using email verification",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
            <p className="text-muted-foreground">We'll send you a code to verify your identity</p>
          </div>
          <ForgotPasswordForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
