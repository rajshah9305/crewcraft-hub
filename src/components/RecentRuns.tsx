import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle, AlertCircle, Clock, ExternalLink, RotateCcw } from "lucide-react";

interface RunData {
  id: string;
  agentName: string;
  task: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  startTime: string;
  duration?: string;
  result?: string;
}

interface RecentRunsProps {
  runs?: RunData[];
}

export const RecentRuns = ({ runs = [] }: RecentRunsProps) => {
  // Mock data for demonstration
  const mockRuns: RunData[] = [
    {
      id: "run-001",
      agentName: "Content Writer Pro",
      task: "Generate blog post about AI trends",
      status: "completed",
      startTime: "2024-01-15 14:30",
      duration: "2m 34s",
      result: "Successfully generated 1,200 word article"
    },
    {
      id: "run-002", 
      agentName: "Data Analyst",
      task: "Analyze sales data Q4 2023",
      status: "running",
      startTime: "2024-01-15 15:15",
      duration: "1m 12s"
    },
    {
      id: "run-003",
      agentName: "Customer Support Bot",
      task: "Process customer inquiries batch",
      status: "completed",
      startTime: "2024-01-15 13:45",
      duration: "5m 18s",
      result: "Processed 47 inquiries with 95% satisfaction"
    },
    {
      id: "run-004",
      agentName: "Research Assistant",
      task: "Market research for new product",
      status: "failed",
      startTime: "2024-01-15 12:20",
      duration: "30s",
      result: "API rate limit exceeded"
    },
    {
      id: "run-005",
      agentName: "Project Manager AI",
      task: "Generate project timeline",
      status: "pending",
      startTime: "2024-01-15 15:30"
    }
  ];

  const displayRuns = runs.length > 0 ? runs : mockRuns;

  const getStatusConfig = (status: RunData['status']) => {
    switch (status) {
      case 'running':
        return {
          icon: PlayCircle,
          color: 'text-accent',
          bgColor: 'bg-accent/20',
          label: 'Running',
          variant: 'secondary' as const
        };
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'bg-success/20',
          label: 'Completed',
          variant: 'default' as const
        };
      case 'failed':
        return {
          icon: AlertCircle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/20',
          label: 'Failed',
          variant: 'destructive' as const
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-warning',
          bgColor: 'bg-warning/20',
          label: 'Pending',
          variant: 'outline' as const
        };
      default:
        return {
          icon: Clock,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/20',
          label: 'Unknown',
          variant: 'secondary' as const
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Recent Runs</h2>
        <Button variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        {displayRuns.map((run) => {
          const statusConfig = getStatusConfig(run.status);
          const StatusIcon = statusConfig.icon;

          return (
            <Card 
              key={run.id} 
              className="bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-card"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${statusConfig.bgColor}`}>
                        <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                      </div>
                      {run.agentName}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {run.task}
                    </CardDescription>
                  </div>
                  <Badge variant={statusConfig.variant} className="font-medium">
                    {statusConfig.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>Started: {run.startTime}</span>
                    {run.duration && (
                      <span>Duration: {run.duration}</span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>

                {run.result && (
                  <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-sm text-foreground">{run.result}</p>
                  </div>
                )}

                {run.status === 'running' && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div className="bg-gradient-primary h-2 rounded-full animate-pulse-glow" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {displayRuns.length === 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-muted/30 mb-4">
              <PlayCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Recent Runs</h3>
            <p className="text-muted-foreground mb-4">
              Start creating and running your AI agents to see activity here.
            </p>
            <Button variant="gradient">
              Create Your First Agent
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};