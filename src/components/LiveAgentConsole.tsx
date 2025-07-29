import React, { useState, useEffect, useRef } from "react";
import { Terminal, Play, Pause, RotateCcw, User, Cpu, Clock, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface LogEntry {
  id: string;
  timestamp: Date;
  agentName: string;
  action: string;
  tool?: string;
  reasoning?: string;
  output?: string;
  status: "thinking" | "executing" | "completed" | "error";
  duration?: number;
}

interface LiveAgentConsoleProps {
  isRunning?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onReset?: () => void;
  className?: string;
}

// Mock data for demonstration
const generateMockLog = (id: number): LogEntry => {
  const agents = ["Research Agent", "Analysis Agent", "Writer Agent", "Quality Agent"];
  const actions = [
    "Searching for market data",
    "Analyzing competitive landscape", 
    "Processing user requirements",
    "Generating content outline",
    "Fact-checking information",
    "Optimizing content structure"
  ];
  
  const tools = ["Web Search", "Data Analysis", "Content Generator", "Fact Checker"];
  const statuses: LogEntry["status"][] = ["thinking", "executing", "completed"];
  
  return {
    id: `log-${id}`,
    timestamp: new Date(Date.now() - Math.random() * 10000),
    agentName: agents[Math.floor(Math.random() * agents.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    tool: tools[Math.floor(Math.random() * tools.length)],
    reasoning: "Analyzing current task requirements and determining the best approach to gather comprehensive information...",
    output: id % 3 === 0 ? "Successfully retrieved 15 relevant data points from market research databases" : undefined,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    duration: Math.floor(Math.random() * 5000) + 1000
  };
};

export const LiveAgentConsole: React.FC<LiveAgentConsoleProps> = ({
  isRunning = false,
  onPause,
  onResume,
  onReset,
  className = ""
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentAgent, setCurrentAgent] = useState<string>("Research Agent");
  const scrollRef = useRef<HTMLDivElement>(null);
  const logIdCounter = useRef(1);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Simulate real-time log generation
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const newLog = generateMockLog(logIdCounter.current++);
      setCurrentAgent(newLog.agentName);
      setLogs(prev => [...prev, newLog]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const getStatusIcon = (status: LogEntry["status"]) => {
    switch (status) {
      case "thinking":
        return <Loader className="w-4 h-4 animate-spin text-yellow-500" />;
      case "executing":
        return <Play className="w-4 h-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Cpu className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: LogEntry["status"]) => {
    switch (status) {
      case "thinking": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "executing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "error": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return "";
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const handleClearLogs = () => {
    setLogs([]);
    logIdCounter.current = 1;
    onReset?.();
  };

  return (
    <Card className={`h-[600px] flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Live Agent Console</CardTitle>
            {isRunning && (
              <Badge className="bg-green-100 text-green-700 border-green-200 animate-pulse">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Running
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isRunning ? (
              <Button variant="outline" size="sm" onClick={onPause}>
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={onResume}>
                <Play className="w-4 h-4 mr-1" />
                Resume
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleClearLogs}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
        
        {isRunning && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-primary/5 rounded-lg border border-primary/10">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Current Agent:</span>
            <Badge variant="secondary">{currentAgent}</Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-6">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Terminal className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-center">
                {isRunning ? "Initializing agents..." : "No agent activity yet"}
              </p>
              <p className="text-sm text-center mt-1">
                Console will display real-time agent progress and outputs
              </p>
            </div>
          ) : (
            <div className="space-y-4 pb-6">
              {logs.map((log, index) => (
                <div key={log.id} className="space-y-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border">
                    <div className="mt-1">{getStatusIcon(log.status)}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {log.agentName}
                          </Badge>
                          {log.tool && (
                            <Badge variant="secondary" className="text-xs">
                              {log.tool}
                            </Badge>
                          )}
                          <Badge className={`text-xs ${getStatusColor(log.status)}`}>
                            {log.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(log.timestamp)}
                          {log.duration && (
                            <span className="ml-2">({formatDuration(log.duration)})</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{log.action}</p>
                        {log.reasoning && (
                          <p className="text-xs text-muted-foreground italic">
                            💭 {log.reasoning}
                          </p>
                        )}
                        {log.output && (
                          <div className="mt-2 p-2 bg-success/10 border border-success/20 rounded text-xs">
                            <strong>Output:</strong> {log.output}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < logs.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};