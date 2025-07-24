import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { UserProvider, useUser } from "./context/UserContext";
import { GoogleLogin } from "./components/GoogleLogin";
import React from "react";

const queryClient = new QueryClient();

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, logout } = useUser();
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="mb-4 text-2xl font-bold">Sign in to continue</h2>
        <GoogleLogin onSuccess={setUser} />
      </div>
    );
  }
  return (
    <>
      <div className="w-full flex justify-end items-center p-4 bg-transparent backdrop-blur-md shadow-none">
        <div className="flex items-center gap-2">
          <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
          <span className="font-medium text-sm text-foreground drop-shadow">{user.name}</span>
          <button onClick={logout} className="ml-2 px-3 py-1 rounded bg-destructive/80 text-white text-xs hover:bg-destructive transition">Logout</button>
        </div>
      </div>
      {children}
    </>
  );
};

const App = () => (
  <UserProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthGate>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
             
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthGate>
      </TooltipProvider>
    </QueryClientProvider>
  </UserProvider>
);

export default App;
