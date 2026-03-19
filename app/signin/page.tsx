import { LoginForm } from "@/components/auth/login-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Sign In - CropCast",
  description: "Sign in to your CropCast account",
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
