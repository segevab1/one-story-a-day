
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Index from "./pages/Index";
import AddStory from "./pages/AddStory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ErrorFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
    <h2 className="text-2xl font-bold mb-4">משהו השתבש</h2>
    <p className="mb-4">אנא רענן את הדף או נסה שוב מאוחר יותר</p>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
    >
      רענן דף
    </button>
  </div>
);

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/add-story" element={<AddStory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
