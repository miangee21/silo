//apps/silo-lite/src/App.tsx
import { Button } from "@silo/core/components/ui/button";

export default function App() {
  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-md space-y-6 text-center">
        <h1 className="text-primary text-4xl font-extrabold tracking-tight">
          Welcome to Silo Lite
        </h1>
        <p className="text-muted-foreground text-lg">
          If you can see this styled perfectly, it means Tailwind CSS and @silo/core
          (Shadcn UI) wiring is 100% successful!
        </p>
        <Button
          className="px-8 py-6 text-lg font-semibold"
          variant="default"
          onClick={() => alert("Wiring is perfect! 🚀")}
        >
          Get Started
        </Button>
      </div>
    </main>
  );
}
