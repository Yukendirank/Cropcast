import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Register - CropCast",
  description: "Create your CropCast account",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/5 px-4">
      <div className="w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">CropCast</h1>
          <p className="text-muted-foreground">AI-Powered Crop Yield Prediction</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
