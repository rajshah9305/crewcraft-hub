import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Settings, Play, Eye } from "lucide-react";

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  role: string;
  goal: string;
  tools: string[];
  isTemplate?: boolean;
  onUse?: (id: string) => void;
  onCustomize?: (id: string) => void;
  onView?: (id: string) => void;
}

export const AgentCard = ({
  id,
  name,
  description,
  role,
  goal,
  tools,
  isTemplate = false,
  onUse,
  onCustomize,
  onView
}: AgentCardProps) => {
  return (
    <Card className="h-full bg-gradient-to-br from-card to-secondary/50 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">{name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{role}</CardDescription>
            </div>
          </div>
          {isTemplate && (
            <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
              Template
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="space-y-2">
          <div>
            <h4 className="text-xs font-medium text-foreground mb-1">Goal</h4>
            <p className="text-xs text-muted-foreground line-clamp-2">{goal}</p>
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-foreground mb-1">Tools</h4>
            <div className="flex flex-wrap gap-1">
              {tools.slice(0, 3).map((tool, index) => (
                <Badge key={index} variant="outline" className="text-xs py-0 px-2 h-5">
                  {tool}
                </Badge>
              ))}
              {tools.length > 3 && (
                <Badge variant="outline" className="text-xs py-0 px-2 h-5">
                  +{tools.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          {isTemplate ? (
            <>
              <Button 
                size="sm" 
                className="flex-1" 
                onClick={() => onUse?.(id)}
              >
                <Play className="h-3 w-3 mr-1" />
                Use Template
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onView?.(id)}
              >
                <Eye className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => onCustomize?.(id)}
              >
                <Settings className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                onClick={() => onUse?.(id)}
              >
                <Play className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};