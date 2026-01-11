import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Bot, Settings, LogOut, BarChart3, Plus } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Bots", href: "/bots", icon: Bot },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Bot className="h-8 w-8 text-primary mr-2" />
        <span className="text-xl font-display font-bold text-foreground tracking-tight">
          BotFactory
        </span>
      </div>
      
      <div className="flex flex-1 flex-col gap-1 p-4 overflow-y-auto">
        <div className="mb-4 px-2">
          <Link href="/bots/new">
            <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              <span>New Bot</span>
            </button>
          </Link>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <Link href="/">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors">
            <LogOut className="h-5 w-5" />
            <span>Sign out</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
