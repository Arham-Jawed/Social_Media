import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthContextProvider from "./context/AuthContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <App />
        <Toaster position="bottom right" />
      </AuthContextProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
