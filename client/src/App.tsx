import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Order from "./pages/Order";
import Login from "./pages/Login";
import Otp from "./pages/Otp";
import Contact from "./pages/Contact";

function Router() {
  return <Switch><Route path="/" component={Home}/><Route path="/order" component={Order}/><Route path="/admin" component={Admin}/><Route path="/login" component={Login}/><Route path="/otp" component={Otp}/><Route path="/contact" component={Contact}/><Route path="/404" component={NotFound}/><Route component={NotFound}/></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster/><Router/></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
