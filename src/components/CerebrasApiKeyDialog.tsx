import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, ExternalLink, Shield, Database, CheckCircle, AlertTriangle } from "lucide-react";
import { CerebrasService } from "@/services/cerebrasService";
import { toast } from "sonner";

interface CerebrasApiKeyDialogProps {
  children: React.ReactNode;
  onApiKeySet?: (apiKey: string) => void;
}

export const CerebrasApiKeyDialog = ({ children, onApiKeySet }: CerebrasApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);

  const storedApiKey = CerebrasService.getStoredApiKey();

  const validateAndSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    setIsValidating(true);
    try {
      const service = new CerebrasService(apiKey);
      const isValidKey = await service.validateApiKey();
      
      if (isValidKey) {
        CerebrasService.setStoredApiKey(apiKey);
        setIsValid(true);
        toast.success("API key validated and saved!");
        onApiKeySet?.(apiKey);
        setOpen(false);
      } else {
        setIsValid(false);
        toast.error("Invalid API key. Please check and try again.");
      }
    } catch (error) {
      setIsValid(false);
      toast.error("Failed to validate API key");
    } finally {
      setIsValidating(false);
    }
  };

  const clearApiKey = () => {
    CerebrasService.clearStoredApiKey();
    setApiKey("");
    setIsValid(null);
    toast.success("API key removed");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Cerebras AI Configuration
          </DialogTitle>
          <DialogDescription>
            Configure your Cerebras AI API key to enable advanced AI capabilities for your agents.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Security Notice */}
          <Card className="border-warning/30 bg-warning/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-warning">
                <Shield className="h-4 w-4" />
                Security Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 text-sm">
              <p className="text-muted-foreground">
                Your API key will be stored locally in your browser. For production applications, we recommend using Supabase for secure secret management.
              </p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <a href="https://docs.lovable.dev/guides/supabase" target="_blank" rel="noopener noreferrer">
                  <Database className="h-3 w-3 mr-1" />
                  Connect to Supabase
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Current Status */}
          {storedApiKey && (
            <div className="flex items-center justify-between p-3 bg-success/10 border border-success/30 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">API Key Configured</span>
              </div>
              <Button variant="outline" size="sm" onClick={clearApiKey}>
                Remove
              </Button>
            </div>
          )}

          {/* API Key Input */}
          <div className="space-y-3">
            <Label htmlFor="apiKey">Cerebras API Key</Label>
            <div className="space-y-2">
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your Cerebras API key..."
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setIsValid(null);
                }}
                className={isValid === false ? "border-destructive" : ""}
              />
              {isValid === false && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Invalid API key. Please check and try again.
                </div>
              )}
            </div>
          </div>

          {/* Getting API Key Instructions */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">How to get your API key</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
              <ol className="list-decimal list-inside space-y-1">
                <li>Visit <a href="https://cloud.cerebras.ai" target="_blank" rel="noopener noreferrer" className="text-primary underline">cloud.cerebras.ai</a></li>
                <li>Sign up or log in to your account</li>
                <li>Navigate to the API Keys section</li>
                <li>Generate a new API key</li>
                <li>Copy and paste it above</li>
              </ol>
            </CardContent>
          </Card>

          {/* Available Models */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Available Models</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">llama3.1-8b</Badge>
              <Badge variant="secondary">llama3.1-70b</Badge>
              <Badge variant="secondary">llama3-8b</Badge>
              <Badge variant="secondary">llama3-70b</Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={validateAndSaveApiKey}
              disabled={!apiKey.trim() || isValidating}
              className="min-w-[120px]"
            >
              {isValidating ? "Validating..." : "Save & Validate"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};