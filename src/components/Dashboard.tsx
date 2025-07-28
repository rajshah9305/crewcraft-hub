import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Users, Zap, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-agents.jpg";

interface DashboardProps {
  agentCount: number;
  onNavigate: (view: string) => void;
}

export const Dashboard = ({ agentCount, onNavigate }: DashboardProps) => {
  const stats = [
    {
      title: "Active Agents",
      value: agentCount.toString(),
      description: "AI agents in your workspace",
      icon: Bot,
      color: "text-primary"
    },
    {
      title: "Templates Available",
      value: "5",
      description: "Ready-to-use agent templates",
      icon: Zap,
      color: "text-accent"
    },
    {
      title: "Total Tasks",
      value: "24",
      description: "Completed by your agents",
      icon: TrendingUp,
      color: "text-green-400"
    }
  ];

  const quickActions = [
    {
      title: "Create New Agent",
      description: "Build a custom AI agent from scratch",
      action: () => onNavigate("create"),
      icon: Bot,
      variant: "gradient" as const
    },
    {
      title: "Browse Templates",
      description: "Start with pre-built agent templates",
      action: () => onNavigate("templates"),
      icon: Sparkles,
      variant: "outline" as const
    },
    {
      title: "Manage Agents",
      description: "View and edit your existing agents",
      action: () => onNavigate("my-agents"),
      icon: Users,
      variant: "outline" as const
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/10 border border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40" />
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <Badge className="w-fit bg-primary/20 text-primary border-primary/30">
                CrewAI Platform
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Build Powerful
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {" "}AI Agents{" "}
                </span>
                in Minutes
              </h1>
              <p className="text-lg text-muted-foreground">
                Create, customize, and deploy intelligent AI agents tailored to your specific needs. 
                Start with our templates or build from scratch.
              </p>
              <div className="flex gap-3">
                <Button variant="hero" size="lg" onClick={() => onNavigate("create")}>
                  Create Your First Agent
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => onNavigate("templates")}>
                  Explore Templates
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage}
                alt="AI Agents Platform"
                className="w-full max-w-md rounded-xl shadow-2xl border border-border/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gradient-to-br from-card to-secondary/30 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card 
                key={index} 
                className="bg-gradient-to-br from-card to-secondary/30 border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/10"
                onClick={action.action}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </div>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant={action.variant} className="w-full">
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Getting Started</h2>
        <Card className="bg-gradient-to-br from-card to-secondary/30 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Welcome to CrewAI Hub
            </CardTitle>
            <CardDescription>
              Your journey to building intelligent AI agents starts here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                🚀 <strong>Step 1:</strong> Browse our agent templates to get inspired
              </p>
              <p className="text-sm text-muted-foreground">
                🛠️ <strong>Step 2:</strong> Customize an agent or create one from scratch
              </p>
              <p className="text-sm text-muted-foreground">
                ⚡ <strong>Step 3:</strong> Deploy and start using your AI agent
              </p>
            </div>
            <Button variant="outline" onClick={() => onNavigate("templates")}>
              Start with Templates
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};