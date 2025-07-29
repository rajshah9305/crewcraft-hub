import React, { useState } from "react";
import { Search, Globe, FileText, Code, Database, Mail, CheckCircle2, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  tier: "free" | "pro" | "enterprise";
  complexity: "simple" | "medium" | "advanced";
}

const AVAILABLE_TOOLS: Tool[] = [
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the web for current information and data",
    category: "Research",
    icon: <Globe className="w-5 h-5" />,
    tier: "free",
    complexity: "simple"
  },
  {
    id: "file-operations",
    name: "File Operations",
    description: "Read, write, and manipulate files and documents",
    category: "Productivity",
    icon: <FileText className="w-5 h-5" />,
    tier: "free",
    complexity: "medium"
  },
  {
    id: "code-interpreter",
    name: "Code Interpreter",
    description: "Execute and analyze code in multiple programming languages",
    category: "Development",
    icon: <Code className="w-5 h-5" />,
    tier: "pro",
    complexity: "advanced"
  },
  {
    id: "database-query",
    name: "Database Query",
    description: "Connect to and query various database systems",
    category: "Data",
    icon: <Database className="w-5 h-5" />,
    tier: "pro",
    complexity: "advanced"
  },
  {
    id: "email-automation",
    name: "Email Automation",
    description: "Send and manage email communications",
    category: "Communication",
    icon: <Mail className="w-5 h-5" />,
    tier: "enterprise",
    complexity: "medium"
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    description: "Analyze datasets and generate insights",
    category: "Analytics",
    icon: <Search className="w-5 h-5" />,
    tier: "pro",
    complexity: "advanced"
  }
];

interface ToolSelectorProps {
  selectedTools?: string[];
  onToolsChange?: (toolIds: string[]) => void;
  maxSelections?: number;
  className?: string;
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  selectedTools = [],
  onToolsChange,
  maxSelections,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...new Set(AVAILABLE_TOOLS.map(tool => tool.category))];
  
  const filteredTools = AVAILABLE_TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleTool = (toolId: string) => {
    const newSelection = selectedTools.includes(toolId)
      ? selectedTools.filter(id => id !== toolId)
      : maxSelections && selectedTools.length >= maxSelections
        ? selectedTools
        : [...selectedTools, toolId];
    
    onToolsChange?.(newSelection);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free": return "bg-success/10 text-success border-success/20";
      case "pro": return "bg-primary/10 text-primary border-primary/20";
      case "enterprise": return "bg-accent/10 text-accent border-accent/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple": return "text-success";
      case "medium": return "text-warning";
      case "advanced": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Agent Tools & Capabilities</h3>
          {maxSelections && (
            <Badge variant="outline">
              {selectedTools.length}/{maxSelections} selected
            </Badge>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => {
          const isSelected = selectedTools.includes(tool.id);
          const isDisabled = maxSelections && selectedTools.length >= maxSelections && !isSelected;
          
          return (
            <Card
              key={tool.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? "ring-2 ring-primary bg-primary/5 border-primary" 
                  : isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-primary/50"
              }`}
              onClick={() => !isDisabled && toggleTool(tool.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {tool.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{tool.name}</CardTitle>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className={`text-xs ${getTierColor(tool.tier)}`}>
                          {tool.tier}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getComplexityColor(tool.complexity)}`}>
                          {tool.complexity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm">
                  {tool.description}
                </CardDescription>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {tool.category}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No tools found matching your criteria</p>
        </div>
      )}
    </div>
  );
};