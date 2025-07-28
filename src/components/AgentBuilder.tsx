import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Save, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Agent {
  id: string;
  name: string;
  description: string;
  role: string;
  goal: string;
  tools: string[];
  backstory: string;
}

interface AgentBuilderProps {
  agent?: Agent;
  onSave: (agent: Omit<Agent, 'id'>) => void;
  onCancel: () => void;
}

export const AgentBuilder = ({ agent, onSave, onCancel }: AgentBuilderProps) => {
  const [formData, setFormData] = useState({
    name: agent?.name || "",
    description: agent?.description || "",
    role: agent?.role || "",
    goal: agent?.goal || "",
    backstory: agent?.backstory || "",
    tools: agent?.tools || []
  });
  
  const [newTool, setNewTool] = useState("");
  const { toast } = useToast();

  const handleAddTool = () => {
    if (newTool.trim() && !formData.tools.includes(newTool.trim())) {
      setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, newTool.trim()]
      }));
      setNewTool("");
    }
  };

  const handleRemoveTool = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter(t => t !== tool)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role || !formData.goal) {
      toast({
        title: "Missing required fields",
        description: "Please fill in name, role, and goal fields.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Agent saved successfully",
      description: `${formData.name} has been ${agent ? 'updated' : 'created'}.`
    });
  };

  return (
    <Card className="max-w-2xl mx-auto bg-gradient-to-br from-card to-secondary/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-xl">
              {agent ? 'Edit Agent' : 'Create New Agent'}
            </CardTitle>
            <CardDescription>
              Configure your AI agent's role, goals, and capabilities
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Content Writer Agent"
                className="bg-background/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g., Senior Content Writer"
                className="bg-background/50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of what this agent does..."
              className="bg-background/50 min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goal">Goal *</Label>
            <Textarea
              id="goal"
              value={formData.goal}
              onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
              placeholder="What is the main objective of this agent?"
              className="bg-background/50 min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backstory">Backstory</Label>
            <Textarea
              id="backstory"
              value={formData.backstory}
              onChange={(e) => setFormData(prev => ({ ...prev, backstory: e.target.value }))}
              placeholder="Background information that helps shape the agent's behavior..."
              className="bg-background/50 min-h-[100px]"
            />
          </div>
          
          <div className="space-y-3">
            <Label>Tools & Capabilities</Label>
            <div className="flex gap-2">
              <Input
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                placeholder="Add a tool (e.g., web_search, calculator)"
                className="bg-background/50"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTool())}
              />
              <Button type="button" onClick={handleAddTool} size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.tools.map((tool, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-accent/20 text-accent border-accent/30 pr-1"
                >
                  {tool}
                  <button
                    type="button"
                    onClick={() => handleRemoveTool(tool)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {agent ? 'Update Agent' : 'Create Agent'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};