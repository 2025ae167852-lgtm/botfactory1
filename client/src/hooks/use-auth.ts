import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type LoginInput = z.infer<typeof api.auth.login.input>;
type RegisterInput = z.infer<typeof api.auth.register.input>;

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Invalid username or password");
        }
        throw new Error("Login failed");
      }

      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (user) => {
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.username}`,
      });
      // Store user in query cache or context if needed, usually backend session handles it
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await fetch(api.auth.register.path, {
        method: api.auth.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = api.auth.register.responses[400].parse(await res.json());
          throw new Error(err.message);
        }
        throw new Error("Registration failed");
      }

      return api.auth.register.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Account Created",
        description: "You can now log in.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    },
  });

  return {
    login: loginMutation,
    register: registerMutation,
  };
}
