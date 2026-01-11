import { AppLayout } from "@/components/layout/AppLayout";
import { useCreateBot } from "@/hooks/use-bots";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBotSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { useLocation } from "wouter";
import { Bot, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Only select the fields we want the user to fill out initially
const createFormSchema = insertBotSchema.pick({
  name: true,
  description: true,
  platform: true,
});

type FormData = z.infer<typeof createFormSchema>;

export default function BotCreate() {
  const [, setLocation] = useLocation();
  const createBot = useCreateBot();
  
  const form = useForm<FormData>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: "",
      description: "",
      platform: "web",
    },
  });

  const onSubmit = (data: FormData) => {
    createBot.mutate(
      { ...data, flow: { nodes: [], edges: [] } },
      {
        onSuccess: (bot) => {
          setLocation(`/bots/${bot.id}/editor`);
        },
      }
    );
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <Link href="/bots" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Bots
          </Link>
          <h1 className="text-3xl font-display font-bold">Create New Bot</h1>
          <p className="text-muted-foreground mt-1">Setup the basics before building the conversation flow.</p>
        </div>

        <GlassCard>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Bot Name</Label>
              <Input 
                id="name" 
                placeholder="e.g. Support Assistant" 
                {...form.register("name")}
                className="bg-background/50"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select 
                onValueChange={(val) => form.setValue("platform", val)} 
                defaultValue="web"
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web Widget</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="messenger">Facebook Messenger</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                placeholder="What does this bot do?" 
                {...form.register("description")}
                className="bg-background/50 min-h-[100px]"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Link href="/bots">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button 
                type="submit" 
                disabled={createBot.isPending}
                className="bg-primary hover:bg-primary/90 min-w-[120px]"
              >
                {createBot.isPending ? "Creating..." : "Create & Build"}
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
