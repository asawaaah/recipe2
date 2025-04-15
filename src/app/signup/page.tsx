import { SignUpForm } from "@/components/blocks/signup-form"

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6 md:max-w-3xl">
        <h1 className="text-center text-4xl font-bold tracking-tight">Join Recipe2</h1>
        <SignUpForm />
      </div>
    </div>
  )
} 