import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { CreateBotRequest, UpdateBotRequest } from "@shared/schema";

export function useBots() {
  return useQuery({
    queryKey: [api.bots.list.path],
    queryFn: async () => {
      const res = await fetch(api.bots.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bots");
      return api.bots.list.responses[200].parse(await res.json());
    },
  });
}

export function useBot(id: number | null) {
  return useQuery({
    queryKey: [api.bots.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.bots.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bot");
      return api.bots.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateBot() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateBotRequest) => {
      // Ensure defaults for required fields if missing
      const payload = {
        ...data,
        flow: data.flow || { nodes: [], edges: [] },
      };

      const res = await fetch(api.bots.create.path, {
        method: api.bots.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = api.bots.create.responses[400].parse(await res.json());
          throw new Error(err.message);
        }
        throw new Error("Failed to create bot");
      }
      return api.bots.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.bots.list.path] });
      toast({ title: "Success", description: "Bot created successfully" });
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    },
  });
}

export function useUpdateBot() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: UpdateBotRequest }) => {
      const url = buildUrl(api.bots.update.path, { id });
      const res = await fetch(url, {
        method: api.bots.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Bot not found");
        throw new Error("Failed to update bot");
      }
      return api.bots.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.bots.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.bots.get.path, data.id] });
      toast({ title: "Saved", description: "Bot updated successfully" });
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    },
  });
}

export function useDeleteBot() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.bots.delete.path, { id });
      const res = await fetch(url, {
        method: api.bots.delete.method,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete bot");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.bots.list.path] });
      toast({ title: "Deleted", description: "Bot removed successfully" });
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    },
  });
}
