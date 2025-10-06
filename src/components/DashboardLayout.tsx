import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, MessageSquare, Network, Search, Database } from "lucide-react";
interface DashboardLayoutProps {
  children: ReactNode;
}
const navigation = [{
  name: "Dashboard",
  href: "/"
}, {
  name: "Publications",
  href: "/publications"
}, {
  name: "Process Data",
  href: "/process"
}, {
  name: "AI Assistant",
  href: "/ai-chat"
}];
export const DashboardLayout = ({
  children
}: DashboardLayoutProps) => {
  const location = useLocation();
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-stellar flex items-center justify-center">
                <Network className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Max Engine</h1>
                
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                
                
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card/30">
        <div className="container mx-auto px-6">
          <div className="flex gap-1">
            {navigation.map(item => {
            const isActive = location.pathname === item.href;
            return <Link key={item.name} to={item.href} className={cn("flex items-center gap-2 px-4 py-3 text-sm font-medium relative", isActive ? "text-primary" : "text-muted-foreground")}>
                  {item.name}
                  {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </Link>;
          })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>;
};