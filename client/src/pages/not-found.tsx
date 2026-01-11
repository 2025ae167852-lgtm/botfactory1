import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <GlassCard className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link href="/dashboard">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
            Return to Dashboard
          </Button>
        </Link>
      </GlassCard>
    </div>
  );
}
