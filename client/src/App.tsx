import { Toaster } from "./components/ui/toaster";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@components/ui/tooltip";

import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import BotList from "@/pages/bot-list";
import BotCreate from "@/pages/bot-create";
import BotEditor from "@/pages/bot-editor";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/bots" component={BotList} />
      <Route path="/bots/new" component={BotCreate} />
      <Route path="/bots/:id/editor" component={BotEditor} />
      {/* Settings placeholder for now */}
      <Route path="/settings" component={Dashboard} /> 
      <Route path="/analytics" component={Dashboard} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
