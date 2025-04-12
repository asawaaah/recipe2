import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Recipe App
        </h1>
        <p className="text-center text-lg mb-8">
          Share and discover amazing recipes from around the world
        </p>
        
        <div className="flex justify-center gap-4 mt-8">
          <Button asChild size="lg">
            <Link href="/example" className="flex items-center gap-2">
              View UI Components
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/my-cookbook" className="flex items-center gap-2">
              Cook Book with sidebar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
