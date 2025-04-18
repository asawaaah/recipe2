import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoaderProps {
  size?: number
  className?: string
}

export function Loader({ size = 24, className }: LoaderProps) {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <Loader2 className="animate-spin" size={size} />
    </div>
  )
}