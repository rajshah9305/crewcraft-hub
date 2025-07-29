import React, { useState } from "react";
import { ChevronDown, Zap, Brain, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface AIModel {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  tier: "free" | "pro" | "enterprise";
  speed: "fast" | "balanced" | "slow";
  icon: React.ReactNode;
}

const AI_MODELS: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    capabilities: ["reasoning", "vision", "code"],
    tier: "pro",
    speed: "balanced",
    icon: <Brain className="w-4 h-4" />
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    capabilities: ["reasoning", "analysis", "writing"],
    tier: "enterprise",
    speed: "slow",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    capabilities: ["multimodal", "reasoning", "code"],
    tier: "pro",
    speed: "fast",
    icon: <Zap className="w-4 h-4" />
  },
  {
    id: "llama-3.1-70b",
    name: "Llama 3.1 70B",
    provider: "Meta",
    capabilities: ["reasoning", "code", "multilingual"],
    tier: "free",
    speed: "fast",
    icon: <Brain className="w-4 h-4" />
  }
];

interface ModelSelectorProps {
  selectedModel?: string;
  onModelChange?: (modelId: string) => void;
  className?: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  className = ""
}) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free": return "bg-success/10 text-success border-success/20";
      case "pro": return "bg-primary/10 text-primary border-primary/20";
      case "enterprise": return "bg-accent/10 text-accent border-accent/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case "fast": return "text-success";
      case "balanced": return "text-warning";
      case "slow": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">AI Model Selection</h3>
      </div>
      
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-full h-auto p-4 border-2 hover:border-primary/50 transition-all duration-200">
          <SelectValue placeholder="Choose an AI model for your agent">
            {selectedModel && (
              <div className="flex items-center gap-3">
                {AI_MODELS.find(m => m.id === selectedModel)?.icon}
                <div className="flex flex-col items-start">
                  <span className="font-medium">
                    {AI_MODELS.find(m => m.id === selectedModel)?.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {AI_MODELS.find(m => m.id === selectedModel)?.provider}
                  </span>
                </div>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent className="w-full">
          {AI_MODELS.map((model) => (
            <SelectItem key={model.id} value={model.id} className="p-4">
              <div className="flex items-start gap-3 w-full">
                <div className="mt-1">{model.icon}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{model.name}</p>
                      <p className="text-sm text-muted-foreground">{model.provider}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline" className={getTierColor(model.tier)}>
                        {model.tier}
                      </Badge>
                      <Badge variant="outline" className={getSpeedColor(model.speed)}>
                        {model.speed}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {model.capabilities.map((capability) => (
                      <Badge key={capability} variant="secondary" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};