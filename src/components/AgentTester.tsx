import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CerebrasApiKeyDialog } from "./CerebrasApiKeyDialog";
import { CerebrasService } from "@/services/cerebrasService";
import { Bot, Play, Settings, MessageSquare, Loader, Key } from "lucide-react";
import { toast } from "sonner";

interface Agent {
  id: string;
  name: string;
  description: string;
  role: string;
  goal: string;
  backstory: string;
}

interface AgentTesterProps {
  agent: Agent;
}

export const AgentTester = ({ agent }: AgentTesterProps) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState("llama3.1-8b");
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const storedApiKey = CerebrasService.getStoredApiKey();

  const loadModels = async (apiKey: string) => {
    try {
      const service = new CerebrasService(apiKey);
      const models = await service.getModels();
      setAvailableModels(models);
    } catch (error) {
      toast.error("Failed to load available models");
    }
  };

  const handleApiKeySet = (apiKey: string) => {
    loadModels(apiKey);
  };

  const generateSystemPrompt = () => {
    return `You are ${agent.name}, an AI agent with the following characteristics:

Role: ${agent.role}
Goal: ${agent.goal}
Backstory: ${agent.backstory}

Description: ${agent.description}

Please respond to user queries in character, maintaining your role and working towards your goal. Be helpful, professional, and stay true to your backstory.`;
  };

  const testAgent = async () => {
    if (!storedApiKey) {
      toast.error("Please configure your Cerebras API key first");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a prompt to test");
      return;
    }

    setIsGenerating(true);
    setResponse("");

    try {
      const service = new CerebrasService(storedApiKey);
      const systemPrompt = generateSystemPrompt();
      
      await service.streamCompletion(
        {
          model: selectedModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        },
        (chunk) => {
          setResponse(prev => prev + chunk);
        }
      );

      toast.success("Response generated successfully!");
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Failed to generate response. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Agent Info */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            {agent.name} - Agent Tester
          </CardTitle>
          <CardDescription>
            Test your agent with Cerebras AI models to see how it responds to different prompts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-foreground">Role:</span>
              <p className="text-muted-foreground">{agent.role}</p>
            </div>
            <div>
              <span className="font-medium text-foreground">Goal:</span>
              <p className="text-muted-foreground">{agent.goal}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-accent" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Cerebras API Key</label>
              <p className="text-xs text-muted-foreground">
                {storedApiKey ? "API key is configured" : "Configure your API key to test the agent"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {storedApiKey && (
                <Badge variant="default" className="bg-success/20 text-success">
                  <Key className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              )}
              <CerebrasApiKeyDialog onApiKeySet={handleApiKeySet}>
                <Button variant="outline" size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  {storedApiKey ? "Manage" : "Configure"}
                </Button>
              </CerebrasApiKeyDialog>
            </div>
          </div>

          {storedApiKey && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama3.1-8b">Llama 3.1 8B</SelectItem>
                  <SelectItem value="llama3.1-70b">Llama 3.1 70B</SelectItem>
                  <SelectItem value="llama3-8b">Llama 3 8B</SelectItem>
                  <SelectItem value="llama3-70b">Llama 3 70B</SelectItem>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Interface */}
      {storedApiKey && (
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Test Agent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Prompt</label>
              <Textarea
                placeholder="Enter a message or task for your agent..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <Button 
              onClick={testAgent}
              disabled={!prompt.trim() || isGenerating}
              className="w-full"
              variant="gradient"
            >
              {isGenerating ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Generating Response...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Test Agent
                </>
              )}
            </Button>

            {response && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Agent Response</label>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-sm whitespace-pre-wrap">{response}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};