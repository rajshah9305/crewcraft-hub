import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Plus, Home, Users, Settings, Menu, X } from "lucide-react";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  agentCount: number;
}

export const Navigation = ({ currentView, onViewChange, agentCount }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "templates", label: "Templates", icon: Bot },
    { id: "my-agents", label: "My Agents", icon: Users, badge: agentCount },
    { id: "create", label: "Create Agent", icon: Plus },
  ];

  const NavContent = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "ghost"}
            className={`justify-start gap-3 ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => {
              onViewChange(item.id);
              setIsMobileMenuOpen(false);
            }}
          >
            <Icon className="h-4 w-4" />
            {item.label}
            {item.badge !== undefined && item.badge > 0 && (
              <Badge variant="secondary" className="ml-auto bg-accent/20 text-accent">
                {item.badge}
              </Badge>
            )}
          </Button>
        );
      })}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border">
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CrewAI Hub
            </h1>
            <p className="text-xs text-muted-foreground">Agent Platform</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavContent />
        </nav>
        
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CrewAI Hub
            </h1>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-b border-border p-4 space-y-2">
          <NavContent />
        </div>
      )}
    </>
  );
};