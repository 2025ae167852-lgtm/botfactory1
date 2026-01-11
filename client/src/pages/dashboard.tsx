import { AppLayout } from "@/components/layout/AppLayout";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { useBots } from "@/hooks/use-bots";
import { GlassCard } from "@/components/ui/glass-card";
import { BarChart3, Bot, MessageSquare, Activity, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: bots, isLoading: botsLoading } = useBots();

  const isLoading = statsLoading || botsLoading;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  // Transform stats for chart
  const platformData = stats?.platformDistribution 
    ? Object.entries(stats.platformDistribution).map(([name, value]) => ({ name, value }))
    : [];
  
  const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#14b8a6'];

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your automated workforce.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                <h3 className="text-2xl font-bold mt-1">{stats?.totalMessages.toLocaleString() || 0}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-xs text-green-500 font-medium flex items-center gap-1">
              +12% <span className="text-muted-foreground">from last month</span>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                <h3 className="text-2xl font-bold mt-1">{stats?.activeBots || 0}</h3>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {stats?.totalBots || 0} total bots configured
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <h3 className="text-2xl font-bold mt-1">94.2%</h3>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="text-xs text-green-500 font-medium">
              +2.4% <span className="text-muted-foreground">improvement</span>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between h-32 bg-primary/5 border-primary/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-primary">Plan Usage</p>
                <h3 className="text-2xl font-bold mt-1 text-primary">Pro</h3>
              </div>
              <div className="p-2 bg-primary/20 rounded-lg">
                <Bot className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="w-full bg-background/50 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-primary h-full w-[65%]" />
            </div>
          </GlassCard>
        </div>

        {/* Charts & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <GlassCard className="col-span-1 lg:col-span-2 min-h-[400px]">
            <h3 className="text-lg font-semibold mb-6">Platform Distribution</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {platformData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Recent Bots */}
          <GlassCard className="col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Bots</h3>
              <Link href="/bots" className="text-xs text-primary hover:underline">View All</Link>
            </div>
            
            <div className="space-y-4">
              {bots?.slice(0, 4).map((bot) => (
                <Link key={bot.id} href={`/bots/${bot.id}/editor`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">{bot.name}</h4>
                      <p className="text-xs text-muted-foreground capitalize">{bot.platform}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                  </div>
                </Link>
              ))}
              
              {(!bots || bots.length === 0) && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No bots created yet.
                </div>
              )}
            </div>
            
            <Link href="/bots/new">
              <button className="w-full mt-6 py-2 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Bot
              </button>
            </Link>
          </GlassCard>
        </div>
      </div>
    </AppLayout>
  );
}

function Plus(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
