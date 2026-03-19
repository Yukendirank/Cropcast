import { RegisterForm } from "@/components/auth/register-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Get Started - CropCast",
  description: "Create your CropCast account",
}

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
