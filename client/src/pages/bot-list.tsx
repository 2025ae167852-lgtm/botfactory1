import { AppLayout } from "@/components/layout/AppLayout";
import { useBots, useDeleteBot } from "@/hooks/use-bots";
import { GlassCard } from "@/components/ui/glass-card";
import { Bot, MoreVertical, Pencil, Trash2, Calendar, MessageSquare, PlayCircle } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function BotList() {
  const { data: bots, isLoading } = useBots();
  const deleteBot = useDeleteBot();
  const [botToDelete, setBotToDelete] = useState<number | null>(null);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">My Bots</h1>
            <p className="text-muted-foreground mt-1">Manage your active chatbots and flows.</p>
          </div>
          <Link href="/bots/new">
            <Button className="bg-primary text-white hover:bg-primary/90">
              Create New Bot
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-xl bg-muted/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots?.map((bot) => (
              <GlassCard key={bot.id} variant="hover" className="group relative flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${bot.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-muted text-muted-foreground border-transparent'}`}>
                      {bot.isActive ? 'Active' : 'Inactive'}
                    </span>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-muted rounded-md transition-colors">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/bots/${bot.id}/editor`}>
                          <DropdownMenuItem className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" /> Edit Flow
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => setBotToDelete(bot.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{bot.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{bot.description || "No description"}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{format(new Date(bot.createdAt || new Date()), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{bot.stats?.totalMessages || 0} msgs</span>
                  </div>
                </div>

                <Link href={`/bots/${bot.id}/editor`} className="absolute inset-0 z-0" />
              </GlassCard>
            ))}

            {/* Create New Card */}
            <Link href="/bots/new">
              <div className="h-full min-h-[250px] rounded-xl border-2 border-dashed border-muted bg-muted/5 hover:bg-muted/10 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer text-muted-foreground hover:text-primary group">
                <div className="w-16 h-16 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <PlayCircle className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-foreground">Create New Bot</h3>
                  <p className="text-sm mt-1">Start from scratch or template</p>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>

      <AlertDialog open={!!botToDelete} onOpenChange={(open) => !open && setBotToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your bot and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => botToDelete && deleteBot.mutate(botToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteBot.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
