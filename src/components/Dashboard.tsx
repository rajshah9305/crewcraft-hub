import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Users, Zap, TrendingUp, ArrowRight, Sparkles, Settings, Terminal } from "lucide-react";
import { RecentRuns } from "./RecentRuns";
import { CerebrasApiKeyDialog } from "./CerebrasApiKeyDialog";
import { ModelSelector } from "./ModelSelector";
import { ToolSelector } from "./ToolSelector";
import { LiveAgentConsole } from "./LiveAgentConsole";
import { useState, useEffect } from "react";
import { CerebrasService } from "@/services/cerebrasService";
import heroImage from "@/assets/hero-agents.jpg";

interface DashboardProps {
  agentCount: number;
  onNavigate: (view: string) => void;
}

export const Dashboard = ({ agentCount, onNavigate }: DashboardProps) => {
  const [selectedModel, setSelectedModel] = useState('llama3.1-8b');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [selectedDemoModel, setSelectedDemoModel] = useState<string>("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isConsoleRunning, setIsConsoleRunning] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      const storedKey = CerebrasService.getStoredApiKey();
      if (storedKey) {
        setApiKeyConfigured(true);
        try {
          const service = new CerebrasService(storedKey);
          const models = await service.getModels();
          setAvailableModels(models);
        } catch (error) {
          console.error('Failed to load models:', error);
        }
      }
    };
    checkApiKey();
  }, []);

  const handleApiKeySet = async (apiKey: string) => {
    setApiKeyConfigured(true);
    try {
      const service = new CerebrasService(apiKey);
      const models = await service.getModels();
      setAvailableModels(models);
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  };
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

      {/* AI Model Configuration */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">AI Model Configuration</h2>
        <Card className="bg-gradient-to-br from-card to-secondary/30 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Cerebras AI Configuration
            </CardTitle>
            <CardDescription>
              Configure your Cerebras AI settings and select the model for agent interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <CerebrasApiKeyDialog onApiKeySet={handleApiKeySet}>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Settings className="h-4 w-4 mr-2" />
                    {apiKeyConfigured ? 'Update API Key' : 'Configure API Key'}
                  </Button>
                </CerebrasApiKeyDialog>
              </div>
              
              {apiKeyConfigured && availableModels.length > 0 && (
                <div className="flex-1">
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select AI Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={apiKeyConfigured ? "default" : "secondary"}>
                {apiKeyConfigured ? "✓ API Key Configured" : "⚠ API Key Required"}
              </Badge>
              {selectedModel && (
                <Badge variant="outline">
                  Selected: {selectedModel}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
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

      {/* Premium Agent Builder Preview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Premium Agent Builder</h2>
        
        {/* Model Selector Demo */}
        <Card className="bg-gradient-to-br from-card to-secondary/30 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Advanced Model Selection
            </CardTitle>
            <CardDescription>
              Choose from leading AI models with detailed capabilities and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ModelSelector 
              selectedModel={selectedDemoModel}
              onModelChange={setSelectedDemoModel}
            />
          </CardContent>
        </Card>

        {/* Tool Selector Demo */}
        <Card className="bg-gradient-to-br from-card to-secondary/30 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Extensible Tools & Capabilities
            </CardTitle>
            <CardDescription>
              Select from pre-built tools or define custom capabilities for your agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ToolSelector 
              selectedTools={selectedTools}
              onToolsChange={setSelectedTools}
              maxSelections={5}
            />
          </CardContent>
        </Card>

        {/* Live Console Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LiveAgentConsole 
              isRunning={isConsoleRunning}
              onPause={() => setIsConsoleRunning(false)}
              onResume={() => setIsConsoleRunning(true)}
              onReset={() => setIsConsoleRunning(false)}
            />
          </div>
          <Card className="bg-gradient-to-br from-card to-secondary/30 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                Live Agent Console
              </CardTitle>
              <CardDescription>
                Real-time monitoring of agent execution with detailed progress tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• View live agent progress</p>
                <p>• Monitor tool usage</p>
                <p>• Track reasoning chains</p>
                <p>• Real-time output display</p>
                <p>• Timestamped execution logs</p>
              </div>
              <Button 
                variant={isConsoleRunning ? "destructive" : "default"}
                onClick={() => setIsConsoleRunning(!isConsoleRunning)}
                className="w-full"
              >
                {isConsoleRunning ? "Stop Demo" : "Start Demo"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Runs */}
      <RecentRuns />

      {/* Getting Started */}
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