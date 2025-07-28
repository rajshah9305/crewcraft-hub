import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { AgentCard } from "@/components/AgentCard";
import { AgentBuilder } from "@/components/AgentBuilder";
import { agentTemplates } from "@/data/agentTemplates";
import { useToast } from "@/hooks/use-toast";
import { Bot } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  role: string;
  goal: string;
  tools: string[];
  backstory: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [userAgents, setUserAgents] = useState<Agent[]>([]);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const { toast } = useToast();

  const handleCreateAgent = (agentData: Omit<Agent, 'id'>) => {
    const newAgent: Agent = {
      ...agentData,
      id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    setUserAgents(prev => [...prev, newAgent]);
    setCurrentView("my-agents");
    setEditingAgent(null);
  };

  const handleEditAgent = (agentData: Omit<Agent, 'id'>) => {
    if (editingAgent) {
      setUserAgents(prev => 
        prev.map(agent => 
          agent.id === editingAgent.id 
            ? { ...agentData, id: editingAgent.id }
            : agent
        )
      );
      setEditingAgent(null);
      setCurrentView("my-agents");
    }
  };

  const handleUseTemplate = (templateId: string) => {
    const template = agentTemplates.find(t => t.id === templateId);
    if (template) {
      const newAgent: Agent = {
        id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: template.name,
        description: template.description,
        role: template.role,
        goal: template.goal,
        tools: template.tools,
        backstory: template.backstory
      };
      
      setUserAgents(prev => [...prev, newAgent]);
      setCurrentView("my-agents");
      
      toast({
        title: "Template used successfully",
        description: `${template.name} has been added to your agents.`
      });
    }
  };

  const handleDeleteAgent = (agentId: string) => {
    setUserAgents(prev => prev.filter(agent => agent.id !== agentId));
    toast({
      title: "Agent deleted",
      description: "Agent has been removed from your workspace."
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard agentCount={userAgents.length} onNavigate={setCurrentView} />;
        
      case "templates":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Agent Templates</h1>
              <p className="text-muted-foreground">
                Choose from our curated collection of professional AI agent templates
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentTemplates.map((template) => (
                <AgentCard
                  key={template.id}
                  id={template.id}
                  name={template.name}
                  description={template.description}
                  role={template.role}
                  goal={template.goal}
                  tools={template.tools}
                  isTemplate={true}
                  onUse={handleUseTemplate}
                />
              ))}
            </div>
          </div>
        );
        
      case "my-agents":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">My Agents</h1>
                <p className="text-muted-foreground">
                  Manage your custom AI agents ({userAgents.length} total)
                </p>
              </div>
            </div>
            
            {userAgents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No agents yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first agent or use one of our templates to get started
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setCurrentView("create")}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Create Agent
                  </button>
                  <button
                    onClick={() => setCurrentView("templates")}
                    className="px-4 py-2 border border-border rounded-md hover:bg-accent"
                  >
                    Browse Templates
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userAgents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    id={agent.id}
                    name={agent.name}
                    description={agent.description}
                    role={agent.role}
                    goal={agent.goal}
                    tools={agent.tools}
                    onCustomize={(id) => {
                      const agent = userAgents.find(a => a.id === id);
                      if (agent) {
                        setEditingAgent(agent);
                        setCurrentView("create");
                      }
                    }}
                    onUse={(id) => {
                      const agent = userAgents.find(a => a.id === id);
                      if (agent) {
                        toast({
                          title: "Agent activated",
                          description: `${agent.name} is now running.`
                        });
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
        
      case "create":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {editingAgent ? 'Edit Agent' : 'Create New Agent'}
              </h1>
              <p className="text-muted-foreground">
                {editingAgent 
                  ? 'Modify your existing agent configuration'
                  : 'Build a custom AI agent tailored to your specific needs'
                }
              </p>
            </div>
            <AgentBuilder
              agent={editingAgent}
              onSave={editingAgent ? handleEditAgent : handleCreateAgent}
              onCancel={() => {
                setEditingAgent(null);
                setCurrentView(editingAgent ? "my-agents" : "dashboard");
              }}
            />
          </div>
        );
        
      default:
        return <Dashboard agentCount={userAgents.length} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView}
        agentCount={userAgents.length}
      />
      
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
