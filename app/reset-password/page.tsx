import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata = {
  title: "Reset Password - CropCast",
  description: "Create your new password",
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Password</h1>
          <p className="text-muted-foreground">Enter a strong password to secure your account</p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
