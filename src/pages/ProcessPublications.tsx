import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
export const ProcessPublications = () => {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{
    processed: number;
    errors: number;
    total: number;
  } | null>(null);
  const {
    toast
  } = useToast();
  const processData = async () => {
    setProcessing(true);
    setResult(null);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('process-publications');
      if (error) {
        toast({
          title: "Processing failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setResult(data);
        toast({
          title: "Processing complete",
          description: `Successfully processed ${data.processed} of ${data.total} publications`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Process Publications</h1>
        
      </div>

      <Card className="p-6 bg-gradient-card border-border">
        <div className="space-y-4">
          <div className="space-y-2">
            
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              
              <li>Uses Gemini AI to create concise summaries (2-3 sentences)</li>
              <li>Extracts individual author names from the authors field</li>
              
            </ul>
          </div>

          <Button onClick={processData} disabled={processing} size="lg" className="w-full">
            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {processing ? "Processing..." : "Start Processing"}
          </Button>

          {result && <div className="mt-6 p-4 bg-card border border-border rounded-lg space-y-2">
              <h4 className="font-semibold">Results:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Successfully processed: {result.processed}</span>
                </div>
                {result.errors > 0 && <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-destructive" />
                    <span>Errors: {result.errors}</span>
                  </div>}
                <div className="text-muted-foreground">
                  Total publications: {result.total}
                </div>
              </div>
            </div>}
        </div>
      </Card>
    </div>;
};