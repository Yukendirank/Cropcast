import { Wheat } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Wheat className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">CropCast</h3>
              <p className="text-xs text-muted-foreground">Yield Prediction and Analytics</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">© 2024 CropCast. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
